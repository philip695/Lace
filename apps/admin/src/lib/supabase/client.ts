import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@lace/db'

/**
 * Supabase client for Client Components.
 * Uses the anon key (respects RLS).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
