import { isAM, formatTime } from '@lace/config/constants'

type TimeBadgeProps = {
  time: string // "HH:MM"
}

/**
 * AM = green, PM = orange — per lace. design system.
 * Shows "6:45 am" / "7:00 pm" in lowercase.
 */
export function TimeBadge({ time }: TimeBadgeProps) {
  const am = isAM(time)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
        am ? 'bg-green-s text-green' : 'bg-orange-s text-orange'
      }`}
    >
      {formatTime(time).toLowerCase()}
    </span>
  )
}
