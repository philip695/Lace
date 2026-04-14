import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RunTimeBadge } from '@/components/run-time-badge'
import { VerifiedBadge } from '@/components/verified-badge'
import { WEEKDAYS, WEEKDAY_LABELS, RUN_TYPE_LABELS, todayWeekday } from '@lace/config/constants'
import type { RunWithClubAndLocation } from '@lace/db'

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

  const { data: clubs } = await supabase
    .from('club')
    .select('id')
    .eq('city_id', city.id)
    .eq('status', 'active')

  const clubIds = (clubs ?? []).map((c) => c.id)

  const { data: runs } = clubIds.length
    ? await supabase
        .from('run')
        .select(
          `*, club:club_id(id, name, slug, shortname, verified, logo_url), location:location_id(id, name, slug)`
        )
        .in('club_id', clubIds)
        .eq('status', 'active')
        .order('time')
    : { data: [] }

  const typedRuns = (runs ?? []) as RunWithClubAndLocation[]
  const today = todayWeekday()

  const runsByDay = WEEKDAYS.reduce<Record<string, RunWithClubAndLocation[]>>((acc, day) => {
    acc[day] = typedRuns.filter((r) => r.weekday === day)
    return acc
  }, {})

  const hasAnyRuns = typedRuns.length > 0

  return (
    <div className="px-4 py-5 space-y-7 max-w-lg mx-auto">
      {!hasAnyRuns && (
        <p className="text-ink2 text-sm text-center pt-10">
          No runs yet in {city.name}. Check back soon.
        </p>
      )}

      {WEEKDAYS.map((day) => {
        const dayRuns = runsByDay[day]
        if (!dayRuns.length) return null
        const isToday = day === today

        return (
          <section key={day}>
            {/* Day header */}
            <div className="flex items-center gap-2 mb-3">
              <h2 className={`text-sm font-semibold ${isToday ? 'text-blue' : 'text-ink2'}`}>
                {WEEKDAY_LABELS[day]}
              </h2>
              {isToday && (
                <span className="text-2xs font-semibold bg-blue-s text-blue px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>

            {/* Run cards */}
            <div className="space-y-2">
              {dayRuns.map((run) => (
                <Link
                  key={run.id}
                  href={`/${params.city}/clubs/${run.club.slug}/runs/${run.id}`}
                  className="flex items-center justify-between bg-bg2 rounded-card px-4 py-3 gap-3 active:opacity-70 transition-opacity"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-ink truncate">
                        {run.club.shortname ?? run.club.name}
                      </p>
                      {run.club.verified && <VerifiedBadge />}
                    </div>
                    <p className="text-xs text-ink2 truncate mt-0.5">
                      {run.meetpoint_name
                        ? `${run.meetpoint_name} · ${RUN_TYPE_LABELS[run.type]}`
                        : RUN_TYPE_LABELS[run.type]}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <RunTimeBadge time={run.time} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
