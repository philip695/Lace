import { isAM, formatTime } from '@lace/config/constants'

type TimeBadgeProps = {
  time: string // "HH:MM"
}

export function TimeBadge({ time }: TimeBadgeProps) {
  const am = isAM(time)
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-[5px] text-[14px] font-bold tracking-[-0.1px] whitespace-nowrap ${
        am ? 'bg-am-bg text-am-fg' : 'bg-pm-bg text-pm-fg'
      }`}
    >
      {formatTime(time).toLowerCase()}
    </span>
  )
}
