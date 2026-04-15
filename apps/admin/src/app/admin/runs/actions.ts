'use server'

import { createAdminClient } from '@/lib/supabase/server'

export async function createRun(payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('run').insert(payload)
  if (error) return { error: error.message }
  return { error: null }
}

export async function updateRun(id: string, payload: Record<string, unknown>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('run').update(payload).eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}

export async function deleteRun(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('run').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
