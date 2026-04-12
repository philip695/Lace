import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { ClubForm } from './club-form'

type Props = { params: { id: string } }

export default async function ClubEditPage({ params }: Props) {
  const isNew = params.id === 'new'
  const supabase = createAdminClient()

  const [{ data: club }, { data: cities }] = await Promise.all([
    isNew
      ? { data: null }
      : supabase.from('club').select('*').eq('id', params.id).single(),
    supabase.from('city').select('id, name, slug').order('name'),
  ])

  if (!isNew && !club) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/clubs" className="text-sm text-ink2">
          ← Clubs
        </Link>
        <span className="text-ink3">/</span>
        <h1 className="text-xl font-semibold text-ink">
          {isNew ? 'New club' : club!.name}
        </h1>
      </div>

      <ClubForm club={club} cities={cities ?? []} isNew={isNew} />
    </div>
  )
}
