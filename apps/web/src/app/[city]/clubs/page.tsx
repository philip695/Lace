import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { VerifiedBadge } from '@/components/verified-badge'
import { VIBE_TAG_LABELS } from '@lace/config/constants'

type ClubsPageProps = {
  params: { city: string }
}

export async function generateMetadata({ params }: ClubsPageProps): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1)
  return {
    title: `Running clubs in ${city}`,
    description: `Browse all running clubs in ${city}. Find your perfect running community.`,
  }
}

export default async function ClubsPage({ params }: ClubsPageProps) {
  const supabase = createClient()

  const { data: city } = await supabase
    .from('city')
    .select('id, name, slug')
    .eq('slug', params.city)
    .single()

  if (!city) notFound()

  const { data: clubs } = await supabase
    .from('club')
    .select('id, name, slug, shortname, description_short, logo_url, cover_image_url, verified, vibe, pace_min, pace_max, language')
    .eq('city_id', city.id)
    .eq('status', 'active')
    .order('name')

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="font-display text-2xl text-ink mb-5">
        Clubs in {city.name}
      </h1>

      {!clubs?.length && (
        <p className="text-ink2 text-sm">No clubs listed yet.</p>
      )}

      <div className="space-y-3">
        {(clubs ?? []).map((club) => (
          <Link
            key={club.id}
            href={`/${params.city}/clubs/${club.slug}`}
            className="block bg-bg2 rounded-card-lg overflow-hidden active:opacity-70 transition-opacity"
          >
            {club.cover_image_url ? (
              <div className="relative h-32 w-full">
                <Image
                  src={club.cover_image_url}
                  alt={club.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                />
              </div>
            ) : null}

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-ink leading-tight flex items-center gap-1.5">
                    {club.name}
                    {club.verified && <VerifiedBadge />}
                  </h2>
                  {club.description_short && (
                    <p className="text-xs text-ink2 mt-1 line-clamp-2">
                      {club.description_short}
                    </p>
                  )}
                </div>
                {club.logo_url && (
                  <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden bg-line">
                    <Image
                      src={club.logo_url}
                      alt={`${club.name} logo`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
              </div>

              {club.vibe.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {club.vibe.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-2xs font-medium bg-bg text-ink2 border border-line rounded-full px-2 py-0.5"
                    >
                      {VIBE_TAG_LABELS[tag as keyof typeof VIBE_TAG_LABELS] ?? tag}
                    </span>
                  ))}
                </div>
              )}

              {(club.pace_min || club.pace_max) && (
                <p className="text-xs text-ink3 mt-2">
                  {[club.pace_min, club.pace_max].filter(Boolean).join(' – ')} min/km
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
