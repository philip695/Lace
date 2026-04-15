'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function createLocation(payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('location').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function updateLocation(id: string, payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('location').update(payload).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function deleteLocation(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('location').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
