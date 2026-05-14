-- Enable Row Level Security on every table in the public schema.
--
-- Why: Supabase exposes a REST API keyed by NEXT_PUBLIC_SUPABASE_ANON_KEY,
-- which is shipped in the client bundle and therefore world-readable. With
-- RLS disabled, anyone holding that key (i.e. anyone who opens the app in
-- a browser) can read and write any table directly, bypassing our API.
--
-- This app routes ALL database access through Next.js API routes using
-- SUPABASE_SERVICE_ROLE_KEY (see src/lib/supabase.ts: createServerClient).
-- The service role bypasses RLS, so our API routes are unaffected by
-- enabling it. Anon-key access from outside the app becomes denied-by-default.
--
-- We deliberately add no policies. If a future feature needs to query
-- Supabase directly from the browser (e.g. realtime subscriptions),
-- introduce a per-row policy at that point.
--
-- This block is idempotent: running it again is a no-op for tables that
-- already have RLS enabled. It also covers tables created outside our
-- migration history (e.g. Phase 1 tables created via the Supabase UI).

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END
$$;
