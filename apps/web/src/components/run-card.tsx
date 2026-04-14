import Link from 'next/link'
import { isAM } from '@lace/config/constants'
import { TimeBadge } from '@/components/time-badge'
import { VerifiedBadge } from '@/components/verified-badge'

type RunCardProps = {
  id: string
  citySlug: string
  clubSlug: string
  clubName: string
  time: string        // "HH:MM"
  meetpoint: string   // "Wienerplatz"
  typeLabel: string   // "Easy Run"
  verified?: boolean
}

/**
 * Single run entry card.
 * 3px left accent bar: green = AM, orange = PM.
 * Links to the run detail page.
 */
export function RunCard({
  id,
  citySlug,
  clubSlug,
  clubName,
  time,
  meetpoint,
  typeLabel,
  verified = false,
}: RunCardProps) {
  const am = isAM(time)

  return (
    <Link
      href={`/${citySlug}/clubs/${clubSlug}/runs/${id}`}
      className="relative overflow-hidden flex items-center justify-between bg-bg2 rounded-card px-4 py-3.5 gap-3 active:opacity-70 transition-opacity"
    >
      {/* AM/PM accent bar */}
      <div
        className={`absolute left-0 inset-y-0 w-[3px] ${am ? 'bg-green' : 'bg-orange'}`}
        aria-hidden="true"
      />

      {/* Left: club + context */}
      <div className="min-w-0 pl-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-ink truncate">{clubName}</p>
          {verified && <VerifiedBadge />}
        </div>
        <p className="text-xs text-ink2 truncate mt-0.5">
          {meetpoint} · {typeLabel}
        </p>
      </div>

      {/* Right: time */}
      <div className="flex-shrink-0">
        <TimeBadge time={time} />
      </div>
    </Link>
  )
}
