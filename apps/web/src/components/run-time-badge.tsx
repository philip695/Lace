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
      className={`inline-flex items-center rounded-full px-3 py-[5px] text-[13px] font-bold tracking-[-0.1px] whitespace-nowrap ${
        am ? 'bg-am-bg text-am-fg' : 'bg-pm-bg text-pm-fg'
      }`}
    >
      {formatTime(time).toLowerCase()}
    </span>
  )
}
