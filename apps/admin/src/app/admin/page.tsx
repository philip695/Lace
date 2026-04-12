import { createAdminClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  // Fetch basic counts for dashboard overview
  const [
    { count: clubCount },
    { count: runCount },
    { count: locationCount },
    { count: matchCount },
  ] = await Promise.all([
    supabase.from('club').select('*', { count: 'exact', head: true }),
    supabase.from('run').select('*', { count: 'exact', head: true }),
    supabase.from('location').select('*', { count: 'exact', head: true }),
    supabase.from('match').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Clubs', value: clubCount ?? 0, href: '/admin/clubs' },
    { label: 'Runs', value: runCount ?? 0, href: '/admin/runs' },
    { label: 'Locations', value: locationCount ?? 0, href: '/admin/locations' },
    { label: 'Matches', value: matchCount ?? 0, href: '/admin/matches' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-ink mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-bg rounded-card-lg border border-line p-5 hover:border-blue transition-colors"
          >
            <p className="text-3xl font-bold text-ink">{stat.value}</p>
            <p className="text-sm text-ink2 mt-1">{stat.label}</p>
          </a>
        ))}
      </div>

      <div className="bg-bg rounded-card-lg border border-line p-5">
        <h2 className="text-sm font-semibold text-ink mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/clubs/new"
            className="text-sm font-medium bg-blue text-white px-4 py-2 rounded-card"
          >
            Add club
          </a>
          <a
            href="/admin/runs/new"
            className="text-sm font-medium bg-bg2 text-ink border border-line px-4 py-2 rounded-card"
          >
            Add run
          </a>
          <a
            href="/admin/locations/new"
            className="text-sm font-medium bg-bg2 text-ink border border-line px-4 py-2 rounded-card"
          >
            Add location
          </a>
        </div>
      </div>
    </div>
  )
}
