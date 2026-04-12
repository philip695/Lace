import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { RunTimeBadge } from '@/components/run-time-badge'
import { WEEKDAY_SHORT, RUN_TYPE_LABELS, VIBE_TAG_LABELS, instagramUrl } from '@lace/config/constants'
import type { Run } from '@lace/db'

type ClubProfileProps = {
  params: { city: string; slug: string }
}

export async function generateMetadata({ params }: ClubProfileProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: club } = await supabase
    .from('club')
    .select('name, description_short')
    .eq('slug', params.slug)
    .single()

  if (!club) return { title: 'Club not found' }

  return {
    title: club.name,
    description: club.description_short ?? undefined,
  }
}

export default async function ClubProfile({ params }: ClubProfileProps) {
  const supabase = createClient()

  const { data: club } = await supabase
    .from('club')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!club || club.status !== 'active') notFound()

  const { data: runs } = await supabase
    .from('run')
    .select('*')
    .eq('club_id', club.id)
    .eq('status', 'active')
    .order('weekday')
    .order('time')

  return (
    <div className="max-w-lg mx-auto">
      {/* Cover image */}
      {club.cover_image_url ? (
        <div className="relative h-52 w-full">
          <Image
            src={club.cover_image_url}
            alt={club.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
      ) : (
        <div className="h-28 bg-bg2" />
      )}

      <div className="px-4 pt-4 pb-24">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h1 className="font-display text-2xl text-ink flex items-center gap-2">
              {club.name}
              {club.verified && (
                <span className="text-blue text-lg" title="Verified club">✓</span>
              )}
            </h1>
            {club.founded_year && (
              <p className="text-xs text-ink3 mt-0.5">Est. {club.founded_year}</p>
            )}
          </div>
          {club.logo_url && (
            <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-bg bg-bg2 -mt-8 shadow-sm">
              <Image
                src={club.logo_url}
                alt={`${club.name} logo`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          )}
        </div>

        {/* Description */}
        {club.description_short && (
          <p className="text-sm text-ink leading-relaxed mb-4">{club.description_short}</p>
        )}

        {/* Vibe tags */}
        {club.vibe.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {club.vibe.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-bg2 text-ink2 border border-line rounded-full px-3 py-1"
              >
                {VIBE_TAG_LABELS[tag as keyof typeof VIBE_TAG_LABELS] ?? tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          {(club.pace_min || club.pace_max) && (
            <div>
              <p className="text-2xs text-ink3 uppercase tracking-wide font-medium">Pace</p>
              <p className="text-sm font-semibold text-ink mt-0.5">
                {[club.pace_min, club.pace_max].filter(Boolean).join('–')} /km
              </p>
            </div>
          )}
          {club.group_size && (
            <div>
              <p className="text-2xs text-ink3 uppercase tracking-wide font-medium">Group size</p>
              <p className="text-sm font-semibold text-ink mt-0.5">~{club.group_size}</p>
            </div>
          )}
          {club.language.length > 0 && (
            <div>
              <p className="text-2xs text-ink3 uppercase tracking-wide font-medium">Language</p>
              <p className="text-sm font-semibold text-ink mt-0.5 uppercase">
                {club.language.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Runs */}
        <h2 className="font-semibold text-ink mb-3">Runs</h2>
        {!runs?.length ? (
          <p className="text-sm text-ink2">No runs listed yet.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {(runs as Run[]).map((run) => (
              <Link
                key={run.id}
                href={`/${params.city}/clubs/${params.slug}/runs/${run.id}`}
                className="flex items-center justify-between bg-bg2 rounded-card px-4 py-3 gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {WEEKDAY_SHORT[run.weekday]} · {RUN_TYPE_LABELS[run.type]}
                  </p>
                  {run.distances.length > 0 && (
                    <p className="text-xs text-ink2 mt-0.5">{run.distances.join(', ')}</p>
                  )}
                </div>
                <RunTimeBadge time={run.time} />
              </Link>
            ))}
          </div>
        )}

        {/* Contact / socials */}
        <div className="border-t border-line pt-5 space-y-3">
          {club.instagram && (
            <a
              href={instagramUrl(club.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ink font-medium"
            >
              <span className="text-ink3">@</span>
              {club.instagram.replace('@', '')}
              <span className="ml-auto text-xs text-ink3">Instagram ↗</span>
            </a>
          )}
          {club.website && (
            <a
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ink font-medium"
            >
              {club.website.replace(/^https?:\/\//, '')}
              <span className="ml-auto text-xs text-ink3">Website ↗</span>
            </a>
          )}
          {club.strava_club_id && (
            <a
              href={`https://www.strava.com/clubs/${club.strava_club_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ink font-medium"
            >
              Strava club
              <span className="ml-auto text-xs text-ink3">Open ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
