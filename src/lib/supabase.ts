import { createClient } from '@supabase/supabase-js'

// Client-side client (lazy initialization)
let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

// For backwards compatibility
export const supabase = {
  get from() { return getSupabase().from.bind(getSupabase()) },
  get auth() { return getSupabase().auth },
  get storage() { return getSupabase().storage },
}

// Server-side client with service role for admin operations
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
