'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function createClub(payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('club').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function updateClub(id: string, payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('club').update(payload).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function deleteClub(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('club').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
