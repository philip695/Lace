import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WeekViewClient, type DisplayRun } from './week-view-client'
import { RUN_TYPE_LABELS, todayWeekday, WEEKDAYS } from '@lace/config/constants'
import type { WeekdaySlug } from '@lace/config/constants'
import type { RunWithClubAndLocation } from '@lace/db'

// ─── Week dates: Mon–Sun date numbers for the current week ────────────────────
function getWeekDates(): Record<WeekdaySlug, number> {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon…6=Sat
  const daysFromMonday = (dayOfWeek + 6) % 7 // 0=Mon…6=Sun
  const monday = new Date(today)
  monday.setDate(today.getDate() - daysFromMonday)

  return WEEKDAYS.reduce<Record<WeekdaySlug, number>>((acc, day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    acc[day] = d.getDate()
    return acc
  }, {} as Record<WeekdaySlug, number>)
}

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
    clubSlug: 'freanks',
    clubName: 'Freanks',
    time: '07:00',
    weekday: 'wed',
    meetpoint: 'Café Chance',
    typeLabel: 'Easy Run',
    verified: false,
  },
  {
    id: 'seed-5',
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
    id: 'seed-6',
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
    id: 'seed-7',
    citySlug: 'munich',
    clubSlug: 'munich-track-team',
    clubName: 'Munich Track Team',
    time: '18:30',
    weekday: 'wed',
    meetpoint: 'Café Berta',
    typeLabel: 'Tempo',
    verified: false,
  },
  {
    id: 'seed-8',
    citySlug: 'munich',
    clubSlug: 'runcult',
    clubName: 'RunCult',
    time: '19:00',
    weekday: 'wed',
    meetpoint: 'Frauenplatz',
    typeLabel: 'Social Run',
    verified: false,
  },
  {
    id: 'seed-9',
    citySlug: 'munich',
    clubSlug: 'tribe-munich',
    clubName: 'Tribe',
    time: '19:00',
    weekday: 'wed',
    meetpoint: 'Pelkovenstr.',
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
      weekDates={getWeekDates()}
    />
  )
}
