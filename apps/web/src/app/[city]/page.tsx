import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WeekViewClient, type DisplayRun } from './week-view-client'
import { RUN_TYPE_LABELS, todayWeekday } from '@lace/config/constants'
import type { RunWithClubAndLocation } from '@lace/db'

// ─── Seed data (shown when Supabase has no runs yet) ──────────────────────────
const SEED_RUNS: DisplayRun[] = [
  {
    id: 'seed-1',
    citySlug: 'munich',
    clubSlug: '5-am-run-club',
    clubName: '5 AM Run Club',
    time: '05:00',
    weekday: 'wed',
    meetpoint: 'Trudering',
    typeLabel: 'Easy Run',
    verified: false,
  },
  {
    id: 'seed-2',
    citySlug: 'munich',
    clubSlug: 'flow-munich',
    clubName: 'Flow',
    time: '06:00',
    weekday: 'wed',
    meetpoint: 'Gerner Brücke',
    typeLabel: 'Trail',
    verified: false,
  },
  {
    id: 'seed-3',
    citySlug: 'munich',
    clubSlug: 'early-bird-munich',
    clubName: 'Early Bird',
    time: '06:30',
    weekday: 'wed',
    meetpoint: 'Bavarian Statue',
    typeLabel: 'Easy Run',
    verified: false,
  },
  {
    id: 'seed-4',
    citySlug: 'munich',
    clubSlug: 'adidas-runners-munich',
    clubName: 'Adidas Runners',
    time: '18:30',
    weekday: 'wed',
    meetpoint: 'BMW Welt',
    typeLabel: 'Intervals',
    verified: true,
  },
  {
    id: 'seed-5',
    citySlug: 'munich',
    clubSlug: 'campus-runners-munich',
    clubName: 'Campus Runners',
    time: '18:30',
    weekday: 'wed',
    meetpoint: 'Universität',
    typeLabel: 'Social Run',
    verified: false,
  },
  {
    id: 'seed-6',
    citySlug: 'munich',
    clubSlug: 'runcult',
    clubName: 'RunCult',
    time: '19:00',
    weekday: 'wed',
    meetpoint: 'Frauenplatz',
    typeLabel: 'Social Run',
    verified: false,
  },
]

type WeekViewProps = {
  params: { city: string }
}

export async function generateMetadata({ params }: WeekViewProps): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1)
  return {
    title: `Running clubs in ${city}`,
    description: `Find running clubs and group runs in ${city}. Discover the best running community for you.`,
  }
}

export default async function WeekView({ params }: WeekViewProps) {
  const supabase = createClient()

  const { data: city } = await supabase
    .from('city')
    .select('id, name, slug')
    .eq('slug', params.city)
    .single()

  if (!city) notFound()

  // Fetch active runs with club info
  const { data: clubs } = await supabase
    .from('club')
    .select('id')
    .eq('city_id', city.id)
    .eq('status', 'active')

  const clubIds = (clubs ?? []).map((c) => c.id)

  const { data: rawRuns } = clubIds.length
    ? await supabase
        .from('run')
        .select(
          `*, club:club_id(id, name, slug, shortname, verified), location:location_id(id, name)`
        )
        .in('club_id', clubIds)
        .eq('status', 'active')
        .order('time')
    : { data: [] }

  // Map Supabase rows → DisplayRun
  const supabaseRuns: DisplayRun[] = ((rawRuns ?? []) as RunWithClubAndLocation[]).map((r) => ({
    id: r.id,
    citySlug: params.city,
    clubSlug: r.club.slug,
    clubName: r.club.shortname ?? r.club.name,
    time: r.time,
    weekday: r.weekday,
    meetpoint: r.meetpoint_name ?? r.location?.name ?? '—',
    typeLabel: RUN_TYPE_LABELS[r.type] ?? r.type,
    verified: r.club.verified,
  }))

  // Use real data if available, otherwise seed
  const runs = supabaseRuns.length > 0 ? supabaseRuns : SEED_RUNS

  return (
    <WeekViewClient
      cityName={city.name}
      citySlug={params.city}
      runs={runs}
      todayWeekday={todayWeekday()}
    />
  )
}
