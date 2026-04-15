'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLocation, updateLocation } from '../actions'
import type { Location, City } from '@lace/db'

type LocationFormProps = {
  location: Location | null
  cities: Pick<City, 'id' | 'name'>[]
  isNew: boolean
}

export function LocationForm({ location, cities, isNew }: LocationFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = new FormData(e.currentTarget)

    const payload = {
      city_id: data.get('city_id') as string,
      name: data.get('name') as string,
      slug: data.get('slug') as string,
      type: (data.get('type') as Location['type']) || 'other',
      description: (data.get('description') as string) || null,
      street: (data.get('street') as string) || null,
      city: (data.get('city_name') as string) || null,
      postal_code: (data.get('postal_code') as string) || null,
      lat: data.get('lat') ? Number(data.get('lat')) : null,
      lng: data.get('lng') ? Number(data.get('lng')) : null,
      offers_coffee: data.get('offers_coffee') === 'on',
      offers_water: data.get('offers_water') === 'on',
      offers_lockers: data.get('offers_lockers') === 'on',
      offers_shower: data.get('offers_shower') === 'on',
      offers_discount: data.get('offers_discount') === 'on',
      discount_detail: (data.get('discount_detail') as string) || null,
      instagram: (data.get('instagram') as string) || null,
      website: (data.get('website') as string) || null,
      status: (data.get('status') as Location['status']) || 'active',
      verified: data.get('verified') === 'on',
    }

    const result = isNew
      ? await createLocation(payload)
      : await updateLocation(location!.id, payload)

    if (result.error) { setError(result.error); setSaving(false); return }

    router.push('/admin/locations')
    router.refresh()
  }

  const input =
    'w-full bg-bg2 border border-line rounded-card px-3 py-2 text-sm text-ink placeholder:text-ink3 focus:outline-none focus:ring-2 focus:ring-blue'
  const label = 'block text-xs font-medium text-ink2 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* City */}
      <div>
        <label htmlFor="city_id" className={label}>City *</label>
        <select id="city_id" name="city_id" required defaultValue={location?.city_id ?? ''} className={input}>
          <option value="">Select city…</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Name + Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={label}>Name *</label>
          <input id="name" name="name" required defaultValue={location?.name ?? ''} className={input} placeholder="Zeit für Brot" />
        </div>
        <div>
          <label htmlFor="slug" className={label}>Slug *</label>
          <input id="slug" name="slug" required defaultValue={location?.slug ?? ''} className={input} placeholder="zeit-fuer-brot" />
        </div>
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className={label}>Type</label>
        <select id="type" name="type" defaultValue={location?.type ?? 'other'} className={input}>
          <option value="cafe">Café</option>
          <option value="store">Store</option>
          <option value="restaurant">Restaurant</option>
          <option value="gym">Gym</option>
          <option value="park">Park</option>
          <option value="public_space">Public space</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={location?.description ?? ''} className={input} />
      </div>

      {/* Address */}
      <div className="border border-line rounded-card p-4 space-y-4">
        <p className="text-xs font-semibold text-ink2 uppercase tracking-wide">Address</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="street" className={label}>Street</label>
            <input id="street" name="street" defaultValue={location?.street ?? ''} className={input} placeholder="Wienerplatz 1" />
          </div>
          <div>
            <label htmlFor="postal_code" className={label}>Postal code</label>
            <input id="postal_code" name="postal_code" defaultValue={location?.postal_code ?? ''} className={input} placeholder="81667" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className={label}>Latitude</label>
            <input id="lat" name="lat" type="number" step="0.00001" defaultValue={location?.lat ?? ''} className={input} placeholder="48.12823" />
          </div>
          <div>
            <label htmlFor="lng" className={label}>Longitude</label>
            <input id="lng" name="lng" type="number" step="0.00001" defaultValue={location?.lng ?? ''} className={input} placeholder="11.59194" />
          </div>
        </div>
      </div>

      {/* Runner offerings */}
      <div className="border border-line rounded-card p-4 space-y-3">
        <p className="text-xs font-semibold text-ink2 uppercase tracking-wide">Runner offerings</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'offers_coffee', label: 'Coffee' },
            { name: 'offers_water', label: 'Water' },
            { name: 'offers_lockers', label: 'Lockers' },
            { name: 'offers_shower', label: 'Shower' },
            { name: 'offers_discount', label: 'Runner discount' },
          ].map((offer) => (
            <label key={offer.name} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name={offer.name}
                defaultChecked={(location as Record<string, unknown>)?.[offer.name] === true}
                className="w-4 h-4 accent-blue"
              />
              {offer.label}
            </label>
          ))}
        </div>
        <div>
          <label htmlFor="discount_detail" className={label}>Discount details</label>
          <input id="discount_detail" name="discount_detail" defaultValue={location?.discount_detail ?? ''} className={input} placeholder="10% off for runners" />
        </div>
      </div>

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="instagram" className={label}>Instagram</label>
          <input id="instagram" name="instagram" defaultValue={location?.instagram ?? ''} className={input} placeholder="@zeitfuerbrot" />
        </div>
        <div>
          <label htmlFor="website" className={label}>Website</label>
          <input id="website" name="website" type="url" defaultValue={location?.website ?? ''} className={input} placeholder="https://…" />
        </div>
      </div>

      {/* Status + Verified */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className={label}>Status</label>
          <select id="status" name="status" defaultValue={location?.status ?? 'active'} className={input}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="verified" name="verified" type="checkbox" defaultChecked={location?.verified ?? false} className="w-4 h-4 accent-blue" />
        <label htmlFor="verified" className="text-sm text-ink">Verified location</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-card disabled:opacity-50"
        >
          {saving ? 'Saving…' : isNew ? 'Create location' : 'Save changes'}
        </button>
        <a href="/admin/locations" className="text-sm font-medium text-ink2 px-5 py-2.5">
          Cancel
        </a>
      </div>
    </form>
  )
}
