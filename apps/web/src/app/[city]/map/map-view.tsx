'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

type MapRun = {
  id: string
  weekday: string
  time: string
  type: string
  meetpoint_name: string | null
  meetpoint_lat: number | null
  meetpoint_lng: number | null
  club: {
    id: string
    name: string
    slug: string
    shortname: string | null
    verified: boolean
  }
}

type MapViewProps = {
  cityLat: number
  cityLng: number
  citySlug: string
  runs: MapRun[]
}

export function MapView({ cityLat, cityLng, citySlug, runs }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [cityLng, cityLat],
      zoom: 12,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      // Add a pin for each run meetpoint
      runs.forEach((run) => {
        if (!run.meetpoint_lat || !run.meetpoint_lng) return

        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
          .setHTML(
            `<div style="font-family:sans-serif;font-size:13px;line-height:1.4">
              <strong>${run.club.shortname ?? run.club.name}</strong><br>
              ${run.meetpoint_name ?? ''}
            </div>`
          )

        new mapboxgl.Marker({ color: '#2563EB' })
          .setLngLat([run.meetpoint_lng, run.meetpoint_lat])
          .setPopup(popup)
          .addTo(map.current!)
      })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={mapContainer} className="w-full h-[calc(100vh-7rem)]" />
  )
}
