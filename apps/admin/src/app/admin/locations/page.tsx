import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { LOCATION_TYPE_LABELS } from '@lace/config/constants'

export default async function LocationsPage() {
  const supabase = createAdminClient()

  const { data: locations } = await supabase
    .from('location')
    .select(`id, name, slug, type, status, verified, city:city_id(name)`)
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink">Locations</h1>
        <Link
          href="/admin/locations/new"
          className="text-sm font-semibold bg-blue text-white px-4 py-2 rounded-card"
        >
          Add location
        </Link>
      </div>

      <div className="bg-bg rounded-card-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-medium text-ink2">Name</th>
              <th className="px-4 py-3 font-medium text-ink2">City</th>
              <th className="px-4 py-3 font-medium text-ink2">Type</th>
              <th className="px-4 py-3 font-medium text-ink2">Status</th>
              <th className="px-4 py-3 font-medium text-ink2">Verified</th>
              <th className="px-4 py-3 font-medium text-ink2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!locations?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink2">
                  No locations yet.
                </td>
              </tr>
            )}
            {(locations ?? []).map((loc) => {
              const city = loc.city as { name: string } | null
              return (
                <tr key={loc.id} className="hover:bg-bg2 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{loc.name}</td>
                  <td className="px-4 py-3 text-ink2">{city?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink2">
                    {LOCATION_TYPE_LABELS[loc.type as keyof typeof LOCATION_TYPE_LABELS] ?? loc.type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        loc.status === 'active'
                          ? 'bg-green-s text-green'
                          : 'bg-bg2 text-ink2'
                      }`}
                    >
                      {loc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {loc.verified ? (
                      <span className="text-blue font-semibold">✓</span>
                    ) : (
                      <span className="text-ink3">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/locations/${loc.id}`}
                      className="text-xs font-medium text-blue"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
