-- Tighten RLS on leaderboard_entries so INSERT/UPDATE/DELETE are scoped
-- to the caller's own device_id (passed via the x-device-id request header),
-- while SELECT stays open to everyone (public shared leaderboard).

-- Helper: safely read the device_id passed by the client in a custom header.
-- current_setting(..., true) returns NULL when the setting is missing,
-- so policies degrade to "no rows match" instead of throwing.
CREATE OR REPLACE FUNCTION public.get_request_device_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT nullif(current_setting('request.header.x-device-id', true), '')::text;
$$;

-- SELECT: public (anyone can read the full leaderboard)
DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_select_leaderboard"
ON leaderboard_entries FOR SELECT
TO anon, authenticated USING (true);

-- INSERT: caller must include their device_id and it must match the row
DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_insert_leaderboard"
ON leaderboard_entries FOR INSERT
TO anon, authenticated
WITH CHECK (device_id = public.get_request_device_id());

-- UPDATE: only the caller's own rows, and the device_id cannot be changed
DROP POLICY IF EXISTS "anon_update_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_update_leaderboard"
ON leaderboard_entries FOR UPDATE
TO anon, authenticated
USING (device_id = public.get_request_device_id())
WITH CHECK (device_id = public.get_request_device_id());

-- DELETE: only the caller's own rows
DROP POLICY IF EXISTS "anon_delete_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_delete_leaderboard"
ON leaderboard_entries FOR DELETE
TO anon, authenticated
USING (device_id = public.get_request_device_id());