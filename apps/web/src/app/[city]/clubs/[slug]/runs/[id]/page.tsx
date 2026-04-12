import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RunTimeBadge } from '@/components/run-time-badge'
import { WEEKDAY_LABELS, RUN_TYPE_LABELS, mapsUrl, formatTime } from '@lace/config/constants'

type RunDetailProps = {
  params: { city: string; slug: string; id: string }
}

export async function generateMetadata({ params }: RunDetailProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: run } = await supabase
    .from('run')
    .select('type, weekday, time, club:club_id(name)')
    .eq('id', params.id)
    .single()

  if (!run) return { title: 'Run not found' }

  const club = run.club as { name: string }
  return {
    title: `${WEEKDAY_LABELS[run.weekday as keyof typeof WEEKDAY_LABELS]} ${formatTime(run.time)} — ${club.name}`,
  }
}

export default async function RunDetail({ params }: RunDetailProps) {
  const supabase = createClient()

  const { data: run } = await supabase
    .from('run')
    .select(`*, club:club_id(id, name, slug, shortname, verified, instagram, website)`)
    .eq('id', params.id)
    .single()

  if (!run || run.status !== 'active') notFound()

  const club = run.club as {
    id: string
    name: string
    slug: string
    shortname: string | null
    verified: boolean
    instagram: string | null
    website: string | null
  }

  const hasMeetpoint = run.meetpoint_lat && run.meetpoint_lng

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href={`/${params.city}/clubs/${params.slug}`}
        className="text-sm text-ink2 flex items-center gap-1 mb-5"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {club.shortname ?? club.name}
      </Link>

      {/* Time & day */}
      <div className="flex items-center gap-3 mb-2">
        <RunTimeBadge time={run.time} />
        <span className="text-sm text-ink2">{WEEKDAY_LABELS[run.weekday as keyof typeof WEEKDAY_LABELS]}</span>
      </div>

      <h1 className="font-display text-2xl text-ink mb-6">
        {RUN_TYPE_LABELS[run.type as keyof typeof RUN_TYPE_LABELS]}
      </h1>

      {/* Details grid */}
      <div className="space-y-4 mb-8">
        {/* Meetpoint */}
        {hasMeetpoint && (
          <div className="bg-bg2 rounded-card px-4 py-3">
            <p className="text-2xs text-ink3 uppercase tracking-wide font-medium mb-1">Meetpoint</p>
            <p className="text-sm font-semibold text-ink">{run.meetpoint_name}</p>
            {run.meetpoint_address && (
              <p className="text-xs text-ink2 mt-0.5">{run.meetpoint_address}</p>
            )}
            <a
              href={mapsUrl(run.meetpoint_lat!, run.meetpoint_lng!)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue"
            >
              Open in Google Maps ↗
            </a>
          </div>
        )}

        {/* Distances */}
        {run.distances.length > 0 && (
          <div className="bg-bg2 rounded-card px-4 py-3">
            <p className="text-2xs text-ink3 uppercase tracking-wide font-medium mb-1">Distance</p>
            <p className="text-sm font-semibold text-ink">{run.distances.join(', ')}</p>
          </div>
        )}

        {/* Pace groups */}
        {run.pace_groups && (
          <div className="bg-bg2 rounded-card px-4 py-3">
            <p className="text-2xs text-ink3 uppercase tracking-wide font-medium mb-1">Pace groups</p>
            <p className="text-sm font-semibold text-ink">Yes</p>
            {run.pace_group_detail && (
              <p className="text-xs text-ink2 mt-0.5">{run.pace_group_detail}</p>
            )}
          </div>
        )}

        {/* Duration */}
        {run.duration_minutes && (
          <div className="bg-bg2 rounded-card px-4 py-3">
            <p className="text-2xs text-ink3 uppercase tracking-wide font-medium mb-1">Duration</p>
            <p className="text-sm font-semibold text-ink">~{run.duration_minutes} min</p>
          </div>
        )}

        {/* Registration */}
        {run.registration === 'required' && (
          <div className="bg-bg2 rounded-card px-4 py-3">
            <p className="text-2xs text-ink3 uppercase tracking-wide font-medium mb-1">Registration</p>
            <p className="text-sm font-semibold text-ink">Required</p>
            {run.registration_link && (
              <a
                href={run.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue"
              >
                Register ↗
              </a>
            )}
          </div>
        )}

        {/* Notes */}
        {run.notes && (
          <div className="bg-bg2 rounded-card px-4 py-3">
            <p className="text-2xs text-ink3 uppercase tracking-wide font-medium mb-1">Notes</p>
            <p className="text-sm text-ink leading-relaxed">{run.notes}</p>
          </div>
        )}
      </div>

      {/* Club CTA */}
      <div className="border-t border-line pt-5">
        <p className="text-xs text-ink3 mb-3">Organised by</p>
        <Link
          href={`/${params.city}/clubs/${club.slug}`}
          className="flex items-center justify-between bg-bg2 rounded-card px-4 py-3"
        >
          <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
            {club.name}
            {club.verified && <span className="text-blue">✓</span>}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {club.instagram && (
          <a
            href={`https://instagram.com/${club.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between mt-2 px-4 py-3 rounded-card border border-line"
          >
            <span className="text-sm font-medium text-ink">View on Instagram</span>
            <span className="text-xs text-ink3">↗</span>
          </a>
        )}
      </div>
    </div>
  )
}
