import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MapView } from './map-view'

type MapPageProps = {
  params: { city: string }
}

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1)
  return {
    title: `Map · ${city}`,
  }
}

export default async function MapPage({ params }: MapPageProps) {
  const supabase = createClient()

  const { data: city } = await supabase
    .from('city')
    .select('id, name, slug, lat, lng')
    .eq('slug', params.city)
    .single()

  if (!city) notFound()

  // Fetch runs with meetpoint coordinates for map pins
  const { data: clubs } = await supabase
    .from('club')
    .select('id')
    .eq('city_id', city.id)
    .eq('status', 'active')

  const clubIds = (clubs ?? []).map((c) => c.id)

  const { data: runs } = clubIds.length
    ? await supabase
        .from('run')
        .select(
          `id, weekday, time, type, meetpoint_name, meetpoint_lat, meetpoint_lng,
           club:club_id(id, name, slug, shortname, verified)`
        )
        .in('club_id', clubIds)
        .eq('status', 'active')
        .not('meetpoint_lat', 'is', null)
    : { data: [] }

  return (
    <MapView
      cityLat={Number(city.lat)}
      cityLng={Number(city.lng)}
      citySlug={params.city}
      runs={runs ?? []}
    />
  )
}
