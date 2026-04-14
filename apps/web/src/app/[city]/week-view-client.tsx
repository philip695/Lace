'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { isAM, formatTime, WEEKDAYS, WEEKDAY_SHORT, WEEKDAY_LABELS } from '@lace/config/constants'
import type { WeekdaySlug } from '@lace/config/constants'

export type DisplayRun = {
  id: string
  citySlug: string
  clubSlug: string
  clubName: string
  time: string
  weekday: WeekdaySlug
  meetpoint: string
  typeLabel: string
  verified: boolean
}

type WeekViewClientProps = {
  cityName: string
  citySlug: string
  runs: DisplayRun[]
  todayWeekday: WeekdaySlug
  weekDates: Record<WeekdaySlug, number>
}

export function WeekViewClient({
  cityName,
  citySlug,
  runs,
  todayWeekday,
  weekDates,
}: WeekViewClientProps) {
  const [selectedDay, setSelectedDay] = useState<WeekdaySlug>(todayWeekday)

  const runsByDay = useMemo(
    () =>
      WEEKDAYS.reduce<Record<WeekdaySlug, DisplayRun[]>>((acc, day) => {
        acc[day] = runs
          .filter((r) => r.weekday === day)
          .sort((a, b) => a.time.localeCompare(b.time))
        return acc
      }, {} as Record<WeekdaySlug, DisplayRun[]>),
    [runs]
  )

  const dayRuns = runsByDay[selectedDay] ?? []
  const amRuns = dayRuns.filter((r) => isAM(r.time))
  const pmRuns = dayRuns.filter((r) => !isAM(r.time))

  return (
    <div className="pb-[74px]">
      {/* ── Dark header ── */}
      <div className="bg-header relative overflow-hidden px-7 pt-5 pb-7">
        {/* Decorative circles */}
        <div
          className="absolute pointer-events-none rounded-full bg-accent opacity-[0.12]"
          style={{ top: '-100px', right: '-100px', width: '320px', height: '320px' }}
          aria-hidden="true"
        />
        <div
          className="absolute pointer-events-none rounded-full bg-white opacity-[0.04]"
          style={{ bottom: '-60px', left: '40px', width: '180px', height: '180px' }}
          aria-hidden="true"
        />

        {/* Wordmark + city pill */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="font-display text-[56px] leading-[0.95] text-white tracking-[-0.02em]">
            lace<span className="text-accent">.</span>
          </div>
          <Link
            href="/cities"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 mt-2"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: '7px',
                height: '7px',
                background: '#4ade80',
                boxShadow: '0 0 0 2px rgba(74,222,128,0.3)',
              }}
            />
            <span className="text-[13px] font-medium text-white">{cityName}</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Link>
        </div>

        {/* Subtitle */}
        <p className="relative z-10 mt-2.5 text-[11px] font-normal uppercase tracking-[0.2em] text-white/40">
          München läuft — jeden Tag
        </p>

        {/* Day strip */}
        <div className="relative z-10 flex gap-1 mt-[18px] overflow-x-auto scrollbar-hide pb-0.5">
          {WEEKDAYS.map((day) => {
            const active = day === selectedDay
            const count = runsByDay[day]?.length ?? 0
            const date = weekDates[day]
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 flex flex-col items-center gap-[3px] w-[46px] py-[7px] rounded-[12px] border-none transition-colors cursor-pointer ${
                  active ? 'bg-white/[0.15]' : 'hover:bg-white/[0.08]'
                }`}
              >
                <span
                  className={`text-[10px] font-medium tracking-[0.1em] uppercase ${
                    active ? 'text-white/70' : 'text-white/45'
                  }`}
                >
                  {WEEKDAY_SHORT[day]}
                </span>
                <span
                  className={`text-[18px] font-bold leading-none tracking-[-0.3px] ${
                    active ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {date}
                </span>
                <div className="flex gap-0.5 h-[4px] items-center">
                  {count > 0
                    ? Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            active ? 'bg-white/85' : 'bg-accent/80'
                          }`}
                        />
                      ))
                    : <div className="w-1 h-1 rounded-full bg-white/20" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-bg px-6">
        {/* Section header: day name + run count */}
        <div className="flex items-baseline justify-between pt-5">
          <span className="font-display text-2xl text-ink tracking-[-0.3px]">
            {WEEKDAY_LABELS[selectedDay]}
          </span>
          <span className="text-[13px] text-ink3">{dayRuns.length} runs</span>
        </div>

        {/* Morning runs */}
        {amRuns.length > 0 && (
          <>
            <TimeDivider label="Morning" />
            <div>
              {amRuns.map((run) => (
                <RunRow key={run.id} run={run} citySlug={citySlug} />
              ))}
            </div>
          </>
        )}

        {/* Evening runs */}
        {pmRuns.length > 0 && (
          <>
            <TimeDivider label="Evening" />
            <div>
              {pmRuns.map((run) => (
                <RunRow key={run.id} run={run} citySlug={citySlug} />
              ))}
            </div>
          </>
        )}

        {dayRuns.length === 0 && (
          <p className="text-sm text-ink3 pt-10 text-center">No runs this day.</p>
        )}

        <div className="h-5" />
      </div>
    </div>
  )
}

function TimeDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 pt-4">
      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ink3 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-line" />
    </div>
  )
}

function RunRow({ run, citySlug }: { run: DisplayRun; citySlug: string }) {
  const am = isAM(run.time)
  return (
    <Link
      href={`/${citySlug}/clubs/${run.clubSlug}/runs/${run.id}`}
      className="flex items-center gap-3.5 py-4 border-b border-line last:border-b-0 hover:opacity-75 active:opacity-60 transition-opacity"
    >
      {/* Accent dot */}
      <div className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />

      {/* Club name + meetpoint · type */}
      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-bold text-ink tracking-[-0.2px] leading-tight">
          {run.clubName}
        </div>
        <div className="text-[13px] text-ink2 mt-0.5 truncate">
          {run.meetpoint} · {run.typeLabel}
        </div>
      </div>

      {/* Time badge */}
      <span
        className={`text-[14px] font-bold px-3.5 py-[5px] rounded-full whitespace-nowrap tracking-[-0.1px] flex-shrink-0 ${
          am ? 'bg-am-bg text-am-fg' : 'bg-pm-bg text-pm-fg'
        }`}
      >
        {formatTime(run.time).toLowerCase()}
      </span>
    </Link>
  )
}
