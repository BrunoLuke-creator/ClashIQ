/*
# Update leaderboard category constraint to include Visual IQ

The Visual IQ category was added to the question bank. The leaderboard
CHECK constraint `leaderboard_category_valid` must be updated so
submissions with category = 'visualiq' are not rejected.

## Approach
Drop and recreate the constraint with the expanded category list.
Existing data is not affected.
*/

ALTER TABLE leaderboard_entries DROP CONSTRAINT IF EXISTS leaderboard_category_valid;

ALTER TABLE leaderboard_entries
  ADD CONSTRAINT leaderboard_category_valid CHECK (
    category IN ('mixed','technology','medicine','football','music','movies','finance','geography','anime','popculture','visualiq')
  ) NOT VALID;

ALTER TABLE leaderboard_entries VALIDATE CONSTRAINT leaderboard_category_valid;
