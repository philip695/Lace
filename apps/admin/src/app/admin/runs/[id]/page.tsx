import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { RunForm } from './run-form'

type Props = { params: { id: string } }

export default async function RunEditPage({ params }: Props) {
  const isNew = params.id === 'new'
  const supabase = createAdminClient()

  const [{ data: run }, { data: clubs }] = await Promise.all([
    isNew
      ? { data: null }
      : supabase.from('run').select('*').eq('id', params.id).single(),
    supabase
      .from('club')
      .select('id, name, shortname')
      .eq('status', 'active')
      .order('name'),
  ])

  if (!isNew && !run) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/runs" className="text-sm text-ink2">
          ← Runs
        </Link>
        <span className="text-ink3">/</span>
        <h1 className="text-xl font-semibold text-ink">
          {isNew ? 'New run' : 'Edit run'}
        </h1>
      </div>

      <RunForm run={run} clubs={clubs ?? []} isNew={isNew} />
    </div>
  )
}
