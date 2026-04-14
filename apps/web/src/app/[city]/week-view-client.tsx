'use client'

import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/search-bar'
import { RunCard } from '@/components/run-card'
import { DayStrip } from '@/components/day-strip'
import { TimeDivider } from '@/components/time-divider'
import { isAM } from '@lace/config/constants'
import { WEEKDAYS, WEEKDAY_LABELS } from '@lace/config/constants'

export type DisplayRun = {
  id: string
  citySlug: string
  clubSlug: string
  clubName: string
  time: string
  weekday: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  meetpoint: string
  typeLabel: string
  verified: boolean
}

type WeekViewClientProps = {
  cityName: string
  citySlug: string
  runs: DisplayRun[]
  todayWeekday: string
}

export function WeekViewClient({
  citySlug,
  runs,
  todayWeekday,
}: WeekViewClientProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return runs
    const q = query.toLowerCase()
    return runs.filter(
      (r) =>
        r.clubName.toLowerCase().includes(q) ||
        r.meetpoint.toLowerCase().includes(q) ||
        r.typeLabel.toLowerCase().includes(q)
    )
  }, [runs, query])

  const runsByDay = useMemo(
    () =>
      WEEKDAYS.reduce<Record<string, DisplayRun[]>>((acc, day) => {
        acc[day] = filtered.filter((r) => r.weekday === day)
        return acc
      }, {}),
    [filtered]
  )

  const hasResults = filtered.length > 0

  return (
    <div className="px-4 py-6 space-y-8 max-w-lg mx-auto">
      {/* Search */}
      <SearchBar value={query} onChange={setQuery} />

      {!hasResults && (
        <p className="text-sm text-ink2 text-center pt-6">
          {query ? `No runs matching "${query}"` : 'No runs yet. Check back soon.'}
        </p>
      )}

      {WEEKDAYS.map((day) => {
        const dayRuns = runsByDay[day]
        if (!dayRuns.length) return null
        const isToday = day === todayWeekday

        return (
          <section key={day}>
            <DayStrip day={WEEKDAY_LABELS[day]} isToday={isToday} />

            <div className="space-y-2">
              {dayRuns.map((run, index) => {
                const prev = dayRuns[index - 1]
                // Insert divider when transitioning from AM to PM
                const showDivider =
                  index > 0 && isAM(prev.time) && !isAM(run.time)

                return (
                  <div key={run.id}>
                    {showDivider && <TimeDivider />}
                    <RunCard
                      id={run.id}
                      citySlug={citySlug}
                      clubSlug={run.clubSlug}
                      clubName={run.clubName}
                      time={run.time}
                      meetpoint={run.meetpoint}
                      typeLabel={run.typeLabel}
                      verified={run.verified}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
