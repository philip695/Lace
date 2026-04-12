import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { WEEKDAY_SHORT, RUN_TYPE_LABELS, formatTime } from '@lace/config/constants'

export default async function RunsPage() {
  const supabase = createAdminClient()

  const { data: runs } = await supabase
    .from('run')
    .select(`
      id, weekday, time, type, status,
      club:club_id(id, name, slug)
    `)
    .order('weekday')
    .order('time')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink">Runs</h1>
        <Link
          href="/admin/runs/new"
          className="text-sm font-semibold bg-blue text-white px-4 py-2 rounded-card"
        >
          Add run
        </Link>
      </div>

      <div className="bg-bg rounded-card-lg border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-medium text-ink2">Club</th>
              <th className="px-4 py-3 font-medium text-ink2">Day</th>
              <th className="px-4 py-3 font-medium text-ink2">Time</th>
              <th className="px-4 py-3 font-medium text-ink2">Type</th>
              <th className="px-4 py-3 font-medium text-ink2">Status</th>
              <th className="px-4 py-3 font-medium text-ink2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {!runs?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink2">
                  No runs yet.
                </td>
              </tr>
            )}
            {(runs ?? []).map((run) => {
              const club = run.club as { id: string; name: string; slug: string } | null
              return (
                <tr key={run.id} className="hover:bg-bg2 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{club?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink2">{WEEKDAY_SHORT[run.weekday]}</td>
                  <td className="px-4 py-3 text-ink2">{formatTime(run.time)}</td>
                  <td className="px-4 py-3 text-ink2">{RUN_TYPE_LABELS[run.type]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        run.status === 'active'
                          ? 'bg-green-s text-green'
                          : 'bg-bg2 text-ink2'
                      }`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/runs/${run.id}`}
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
