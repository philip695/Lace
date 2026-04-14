type DayStripProps = {
  day: string        // "Wednesday"
  isToday?: boolean
}

/**
 * Day section header.
 * Display font (Instrument Serif), large — the editorial anchor of each weekday.
 */
export function DayStrip({ day, isToday = false }: DayStripProps) {
  return (
    <div className="flex items-baseline gap-2.5 mb-3">
      <h2
        className={`font-display text-2xl leading-none ${
          isToday ? 'text-blue' : 'text-ink'
        }`}
      >
        {day}
      </h2>
      {isToday && (
        <span className="text-2xs font-semibold bg-blue-s text-blue px-2 py-0.5 rounded-full">
          Today
        </span>
      )}
    </div>
  )
}
