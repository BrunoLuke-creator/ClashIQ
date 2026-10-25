/*
# Create leaderboard table for ClashIQ

1. New Tables
- `leaderboard_entries`
- `id` (uuid, primary key)
- `player_name` (text, the display name chosen during onboarding)
- `avatar` (text, the avatar style key, e.g. "fox")
- `avatar_color` (text, the avatar color key, e.g. "cyan")
- `category` (text, the trivia category played, e.g. "technology")
- `mode` (text, the game mode, e.g. "solo", "ranked", "1v1")
- `score` (integer, the score achieved)
- `xp_earned` (integer, XP earned in the match)
- `correct_count` (integer, number of correct answers)
- `total_questions` (integer, total questions in the match)
- `device_id` (text, a locally-generated anonymous id so a player can update their own row without auth)
- `created_at` (timestamptz, when the entry was submitted)

2. Security
- Enable RLS on `leaderboard_entries`.
- Allow anon + authenticated CRUD because the leaderboard is intentionally public/shared
  (no sign-in screen in this build; players submit scores anonymously via a device id).

3. Important Notes
- This is a single-tenant, no-auth build: the leaderboard is shared public data.
  The `device_id` column lets the client filter/identify its own submissions client-side;
  it is NOT a security boundary (any client can read all rows), which is acceptable for
  a public leaderboard.
- Index on (category, mode, created_at) supports filtered leaderboard queries.
- Index on score supports all-time top scores.
*/

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  avatar text NOT NULL DEFAULT 'fox',
  avatar_color text NOT NULL DEFAULT 'cyan',
  category text NOT NULL DEFAULT 'mixed',
  mode text NOT NULL DEFAULT 'solo',
  score integer NOT NULL DEFAULT 0,
  xp_earned integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  device_id text NOT NULL DEFAULT 'unknown',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_select_leaderboard"
ON leaderboard_entries FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_insert_leaderboard"
ON leaderboard_entries FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_update_leaderboard"
ON leaderboard_entries FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_delete_leaderboard"
ON leaderboard_entries FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_leaderboard_category_mode_created
ON leaderboard_entries (category, mode, created_at);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score
ON leaderboard_entries (score DESC);
