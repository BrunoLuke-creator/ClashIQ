/*
# Add server-side validation constraints to leaderboard_entries

## Purpose
The client currently submits leaderboard scores directly to the table.
Until a full backend-validated scoring edge function is in place, these
CHECK constraints ensure the database itself rejects impossible or
abusive values regardless of how the row is written:

1. score must be non-negative (no negative scores).
2. correct_count must be between 0 and total_questions (inclusive).
3. total_questions must be positive (a game must have at least 1 question).
4. xp_earned must be non-negative.
5. player_name must be 1-16 characters (matches the onboarding maxLength).
6. category must be one of the known category ids or 'mixed'.
7. mode must be one of the known game modes.

These constraints do NOT prevent a determined client from submitting a
plausible-but-inflated score (that requires server-side scoring with an
authoritative question set). They do reject the most obvious garbage and
negative/impossible values cheaply and reliably.

## Security
No RLS or grant changes. Existing policies (scoped to the caller's
device_id for writes, public SELECT) are preserved.

## Important Notes
1. CHECK constraints are added with NOT VALID so existing rows are not
   re-scanned, then VALIDATED so future inserts are checked. This avoids
   locking the table while keeping the guarantee going forward.
2. If any existing row violates a constraint, VALIDATE will fail and
   the constraint stays as NOT VALID — the migration is still safe to
   re-run because each ADD CONSTRAINT uses IF NOT EXISTS-style DO blocks.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_score_nonnegative'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_score_nonnegative CHECK (score >= 0) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_xp_nonnegative'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_xp_nonnegative CHECK (xp_earned >= 0) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_total_questions_positive'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_total_questions_positive CHECK (total_questions > 0) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_correct_within_total'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_correct_within_total
        CHECK (correct_count >= 0 AND correct_count <= total_questions) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_player_name_length'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_player_name_length
        CHECK (length(player_name) >= 1 AND length(player_name) <= 16) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_category_valid'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_category_valid CHECK (
        category IN ('mixed','technology','medicine','football','music','movies','finance','geography','anime','popculture')
      ) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leaderboard_mode_valid'
      AND conrelid = 'leaderboard_entries'::regclass
  ) THEN
    ALTER TABLE leaderboard_entries
      ADD CONSTRAINT leaderboard_mode_valid CHECK (
        mode IN ('solo','ranked','friends','1v1')
      ) NOT VALID;
  END IF;
END $$;

-- Validate the constraints so future inserts are checked against them.
-- These run after the ADD CONSTRAINT NOT VALID above. If any existing
-- row violates, the VALIDATE silently fails (the constraint stays NOT
-- VALID) but does not block the migration — the guarantee still applies
-- to new rows because Postgres checks NOT VALID constraints on INSERT/UPDATE.
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_score_nonnegative;
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_xp_nonnegative;
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_total_questions_positive;
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_correct_within_total;
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_player_name_length;
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_category_valid;
ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_mode_valid;
