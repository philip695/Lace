import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

export default async function MatchesPage() {
  const supabase = createAdminClient()

  const { data: matches } = await supabase
    .from('match')
    .select(`
      id, match_type, status, initiated_by, initiated_at,
      confirmed_by_club, confirmed_by_location,
      club:club_id(name),
      location:location_id(name)
    `)
    .order('initiated_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink">Matches</h1>
        <Link
          href="/admin/matches/new"
          className="text-sm font-semibold bg-blue text-white px-4 py-2 rounded-card"
        >
          Initiate match
        </Link>
      </div>

      <div className="bg-bg rounded-card-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-medium text-ink2">Club</th>
              <th className="px-4 py-3 font-medium text-ink2">Location</th>
              <th className="px-4 py-3 font-medium text-ink2">Type</th>
              <th className="px-4 py-3 font-medium text-ink2">Status</th>
              <th className="px-4 py-3 font-medium text-ink2">Club ✓</th>
              <th className="px-4 py-3 font-medium text-ink2">Location ✓</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!matches?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink2">
                  No matches yet.
                </td>
              </tr>
            )}
            {(matches ?? []).map((match) => {
              const club = match.club as { name: string } | null
              const location = match.location as { name: string } | null
              return (
                <tr key={match.id} className="hover:bg-bg2 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{club?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink2">{location?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink2">{match.match_type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        match.status === 'active'
                          ? 'bg-green-s text-green'
                          : match.status === 'proposed'
                          ? 'bg-blue-s text-blue'
                          : 'bg-bg2 text-ink2'
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {match.confirmed_by_club ? (
                      <span className="text-green font-semibold">✓</span>
                    ) : (
                      <span className="text-ink3">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {match.confirmed_by_location ? (
                      <span className="text-green font-semibold">✓</span>
                    ) : (
                      <span className="text-ink3">—</span>
                    )}
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
