import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

export default async function CitiesPage() {
  const supabase = createAdminClient()

  const { data: cities } = await supabase
    .from('city')
    .select('id, name, slug, country, status, instagram_handle, launch_date')
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink">Cities</h1>
        <Link
          href="/admin/cities/new"
          className="text-sm font-semibold bg-blue text-white px-4 py-2 rounded-card"
        >
          Add city
        </Link>
      </div>

      <div className="bg-bg rounded-card-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-medium text-ink2">City</th>
              <th className="px-4 py-3 font-medium text-ink2">Country</th>
              <th className="px-4 py-3 font-medium text-ink2">Status</th>
              <th className="px-4 py-3 font-medium text-ink2">Instagram</th>
              <th className="px-4 py-3 font-medium text-ink2">Launch date</th>
              <th className="px-4 py-3 font-medium text-ink2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!cities?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink2">
                  No cities yet.
                </td>
              </tr>
            )}
            {(cities ?? []).map((city) => (
              <tr key={city.id} className="hover:bg-bg2 transition-colors">
                <td className="px-4 py-3 font-medium text-ink">{city.name}</td>
                <td className="px-4 py-3 text-ink2">{city.country}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      city.status === 'active'
                        ? 'bg-green-s text-green'
                        : city.status === 'building'
                        ? 'bg-orange-s text-orange'
                        : 'bg-bg2 text-ink2'
                    }`}
                  >
                    {city.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink2">{city.instagram_handle ?? '—'}</td>
                <td className="px-4 py-3 text-ink2">{city.launch_date ?? '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/cities/${city.id}`}
                    className="text-xs font-medium text-blue"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
