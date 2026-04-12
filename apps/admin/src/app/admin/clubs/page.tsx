import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

export default async function ClubsPage() {
  const supabase = createAdminClient()

  const { data: clubs } = await supabase
    .from('club')
    .select('id, name, slug, status, verified, city_id, city:city_id(name), instagram')
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink">Clubs</h1>
        <Link
          href="/admin/clubs/new"
          className="text-sm font-semibold bg-blue text-white px-4 py-2 rounded-card"
        >
          Add club
        </Link>
      </div>

      <div className="bg-bg rounded-card-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-medium text-ink2">Name</th>
              <th className="px-4 py-3 font-medium text-ink2">City</th>
              <th className="px-4 py-3 font-medium text-ink2">Status</th>
              <th className="px-4 py-3 font-medium text-ink2">Verified</th>
              <th className="px-4 py-3 font-medium text-ink2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!clubs?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink2">
                  No clubs yet.
                </td>
              </tr>
            )}
            {(clubs ?? []).map((club) => {
              const city = club.city as { name: string } | null
              return (
                <tr key={club.id} className="hover:bg-bg2 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{club.name}</td>
                  <td className="px-4 py-3 text-ink2">{city?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        club.status === 'active'
                          ? 'bg-green-s text-green'
                          : 'bg-bg2 text-ink2'
                      }`}
                    >
                      {club.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {club.verified ? (
                      <span className="text-blue font-semibold">✓</span>
                    ) : (
                      <span className="text-ink3">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/clubs/${club.id}`}
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
