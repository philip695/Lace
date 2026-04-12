import { isAM, formatTime } from '@lace/config/constants'

type RunTimeBadgeProps = {
  time: string // "HH:MM"
}

/**
 * Displays a run time with AM/PM colour coding.
 * AM = green, PM = orange (per design system rules).
 */
export function RunTimeBadge({ time }: RunTimeBadgeProps) {
  const am = isAM(time)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        am
          ? 'bg-green-s text-green'
          : 'bg-orange-s text-orange'
      }`}
    >
      {formatTime(time)}
    </span>
  )
}
