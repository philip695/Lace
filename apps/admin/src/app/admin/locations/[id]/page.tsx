import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { LocationForm } from './location-form'

type Props = { params: { id: string } }

export default async function LocationEditPage({ params }: Props) {
  const isNew = params.id === 'new'
  const supabase = createAdminClient()

  const [{ data: location }, { data: cities }] = await Promise.all([
    isNew
      ? { data: null }
      : supabase.from('location').select('*').eq('id', params.id).single(),
    supabase.from('city').select('id, name').order('name'),
  ])

  if (!isNew && !location) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/locations" className="text-sm text-ink2">
          ← Locations
        </Link>
        <span className="text-ink3">/</span>
        <h1 className="text-xl font-semibold text-ink">
          {isNew ? 'New location' : (location as { name: string })!.name}
        </h1>
      </div>

      <LocationForm location={location} cities={cities ?? []} isNew={isNew} />
    </div>
  )
}
