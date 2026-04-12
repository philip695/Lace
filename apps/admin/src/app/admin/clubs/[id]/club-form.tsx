'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Club, City } from '@lace/db'

type ClubFormProps = {
  club: Club | null
  cities: Pick<City, 'id' | 'name' | 'slug'>[]
  isNew: boolean
}

export function ClubForm({ club, cities, isNew }: ClubFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      city_id: data.get('city_id') as string,
      name: data.get('name') as string,
      slug: data.get('slug') as string,
      shortname: (data.get('shortname') as string) || null,
      description_short: (data.get('description_short') as string) || null,
      description_long: (data.get('description_long') as string) || null,
      instagram: (data.get('instagram') as string) || null,
      website: (data.get('website') as string) || null,
      status: data.get('status') as Club['status'],
      verified: data.get('verified') === 'on',
      pace_min: (data.get('pace_min') as string) || null,
      pace_max: (data.get('pace_max') as string) || null,
      cost: (data.get('cost') as Club['cost']) || 'free',
    }

    // Use fetch to hit a server action / route handler
    // For now, use client supabase with anon key — replace with server action in production
    const supabase = createClient()

    if (isNew) {
      const { error } = await supabase.from('club').insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('club').update(payload).eq('id', club!.id)
      if (error) { setError(error.message); setSaving(false); return }
    }

    router.push('/admin/clubs')
    router.refresh()
  }

  const inputClass =
    'w-full bg-bg2 border border-line rounded-card px-3 py-2 text-sm text-ink placeholder:text-ink3 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent'

  const labelClass = 'block text-xs font-medium text-ink2 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* City */}
      <div>
        <label htmlFor="city_id" className={labelClass}>City *</label>
        <select
          id="city_id"
          name="city_id"
          required
          defaultValue={club?.city_id ?? ''}
          className={inputClass}
        >
          <option value="">Select city…</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </div>

      {/* Name + slug */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>Name *</label>
          <input id="name" name="name" required defaultValue={club?.name ?? ''} className={inputClass} />
        </div>
        <div>
          <label htmlFor="slug" className={labelClass}>Slug *</label>
          <input id="slug" name="slug" required defaultValue={club?.slug ?? ''} className={inputClass} placeholder="bold-running" />
        </div>
      </div>

      {/* Shortname */}
      <div>
        <label htmlFor="shortname" className={labelClass}>Short name</label>
        <input id="shortname" name="shortname" defaultValue={club?.shortname ?? ''} className={inputClass} placeholder="BOLD" />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description_short" className={labelClass}>Short description (max 160 chars)</label>
        <input
          id="description_short"
          name="description_short"
          maxLength={160}
          defaultValue={club?.description_short ?? ''}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description_long" className={labelClass}>Full description (markdown)</label>
        <textarea
          id="description_long"
          name="description_long"
          rows={5}
          defaultValue={club?.description_long ?? ''}
          className={inputClass}
        />
      </div>

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="instagram" className={labelClass}>Instagram</label>
          <input id="instagram" name="instagram" defaultValue={club?.instagram ?? ''} className={inputClass} placeholder="@bold.runningclub" />
        </div>
        <div>
          <label htmlFor="website" className={labelClass}>Website</label>
          <input id="website" name="website" type="url" defaultValue={club?.website ?? ''} className={inputClass} placeholder="https://…" />
        </div>
      </div>

      {/* Pace */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pace_min" className={labelClass}>Pace min (min/km)</label>
          <input id="pace_min" name="pace_min" defaultValue={club?.pace_min ?? ''} className={inputClass} placeholder="5:00" />
        </div>
        <div>
          <label htmlFor="pace_max" className={labelClass}>Pace max (min/km)</label>
          <input id="pace_max" name="pace_max" defaultValue={club?.pace_max ?? ''} className={inputClass} placeholder="6:30" />
        </div>
      </div>

      {/* Status + Cost */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" name="status" defaultValue={club?.status ?? 'active'} className={inputClass}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label htmlFor="cost" className={labelClass}>Cost</label>
          <select id="cost" name="cost" defaultValue={club?.cost ?? 'free'} className={inputClass}>
            <option value="free">Free</option>
            <option value="donation">Donation</option>
            <option value="membership">Membership</option>
          </select>
        </div>
      </div>

      {/* Verified */}
      <div className="flex items-center gap-2">
        <input
          id="verified"
          name="verified"
          type="checkbox"
          defaultChecked={club?.verified ?? false}
          className="w-4 h-4 accent-blue"
        />
        <label htmlFor="verified" className="text-sm text-ink">Verified club</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-card disabled:opacity-50"
        >
          {saving ? 'Saving…' : isNew ? 'Create club' : 'Save changes'}
        </button>
        <a href="/admin/clubs" className="text-sm font-medium text-ink2 px-5 py-2.5">
          Cancel
        </a>
      </div>
    </form>
  )
}
