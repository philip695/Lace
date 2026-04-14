'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { VIBE_TAGS, VIBE_TAG_LABELS } from '@lace/config/constants'
import type { Club, City } from '@lace/db'

type ClubFormProps = {
  club: Club | null
  cities: Pick<City, 'id' | 'name' | 'slug'>[]
  isNew: boolean
}

const LANGUAGES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
]

export function ClubForm({ club, cities, isNew }: ClubFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vibe, setVibe] = useState<string[]>(club?.vibe ?? [])
  const [language, setLanguage] = useState<string[]>(club?.language ?? [])

  function toggleVibe(tag: string) {
    setVibe((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function toggleLanguage(code: string) {
    setLanguage((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = new FormData(e.currentTarget)

    const foundedRaw = data.get('founded_year') as string
    const groupSizeRaw = data.get('group_size') as string

    const payload = {
      city_id: data.get('city_id') as string,
      name: data.get('name') as string,
      slug: data.get('slug') as string,
      shortname: (data.get('shortname') as string) || null,
      description_short: (data.get('description_short') as string) || null,
      description_long: (data.get('description_long') as string) || null,
      founded_year: foundedRaw ? Number(foundedRaw) : null,
      // character
      vibe,
      language,
      after_run: (data.get('after_run') as Club['after_run']) || null,
      group_size: groupSizeRaw ? Number(groupSizeRaw) : null,
      pace_min: (data.get('pace_min') as string) || null,
      pace_max: (data.get('pace_max') as string) || null,
      // socials
      instagram: (data.get('instagram') as string) || null,
      tiktok: (data.get('tiktok') as string) || null,
      website: (data.get('website') as string) || null,
      strava_club_id: (data.get('strava_club_id') as string) || null,
      // practical
      registration: (data.get('registration') as Club['registration']) || 'none',
      registration_link: (data.get('registration_link') as string) || null,
      cost: (data.get('cost') as Club['cost']) || 'free',
      cost_detail: (data.get('cost_detail') as string) || null,
      contact_email: (data.get('contact_email') as string) || null,
      // status
      status: data.get('status') as Club['status'],
      verified: data.get('verified') === 'on',
    }

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

  async function handleDelete() {
    if (!club || !confirm(`Delete "${club.name}"? This cannot be undone.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('club').delete().eq('id', club.id)
    if (error) { setError(error.message); return }
    router.push('/admin/clubs')
    router.refresh()
  }

  const input =
    'w-full bg-bg border border-line rounded-card px-3 py-2 text-sm text-ink placeholder:text-ink3 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent'
  const label = 'block text-xs font-medium text-ink2 mb-1'
  const sectionTitle = 'text-xs font-semibold text-ink2 uppercase tracking-wide mb-3 mt-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basics ── */}
      <div className="bg-bg rounded-card-lg border border-line p-5 space-y-4">
        <p className={sectionTitle}>Basics</p>

        <div>
          <label htmlFor="city_id" className={label}>City *</label>
          <select id="city_id" name="city_id" required defaultValue={club?.city_id ?? ''} className={input}>
            <option value="">Select city…</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={label}>Name *</label>
            <input id="name" name="name" required defaultValue={club?.name ?? ''} className={input} placeholder="BOLD Running" />
          </div>
          <div>
            <label htmlFor="slug" className={label}>Slug *</label>
            <input id="slug" name="slug" required defaultValue={club?.slug ?? ''} className={input} placeholder="bold-running" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="shortname" className={label}>Short name</label>
            <input id="shortname" name="shortname" defaultValue={club?.shortname ?? ''} className={input} placeholder="BOLD" />
          </div>
          <div>
            <label htmlFor="founded_year" className={label}>Founded</label>
            <input id="founded_year" name="founded_year" type="number" min="1900" max="2099" defaultValue={club?.founded_year ?? ''} className={input} placeholder="2019" />
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="bg-bg rounded-card-lg border border-line p-5 space-y-4">
        <p className={sectionTitle}>Description</p>

        <div>
          <label htmlFor="description_short" className={label}>Short description (max 160 chars)</label>
          <input
            id="description_short"
            name="description_short"
            maxLength={160}
            defaultValue={club?.description_short ?? ''}
            className={input}
            placeholder="Munich's most social running crew. All paces welcome."
          />
        </div>

        <div>
          <label htmlFor="description_long" className={label}>Full description (markdown)</label>
          <textarea
            id="description_long"
            name="description_long"
            rows={5}
            defaultValue={club?.description_long ?? ''}
            className={input}
            placeholder="We run every Wednesday at 6:30 pm…"
          />
        </div>
      </div>

      {/* ── Character ── */}
      <div className="bg-bg rounded-card-lg border border-line p-5 space-y-4">
        <p className={sectionTitle}>Character</p>

        {/* Vibe tags */}
        <div>
          <p className={label}>Vibe</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {VIBE_TAGS.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={vibe.includes(tag)}
                  onChange={() => toggleVibe(tag)}
                  className="w-4 h-4 accent-blue"
                />
                {VIBE_TAG_LABELS[tag]}
              </label>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <p className={label}>Languages</p>
          <div className="flex flex-wrap gap-3 mt-1">
            {LANGUAGES.map((lang) => (
              <label key={lang.code} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={language.includes(lang.code)}
                  onChange={() => toggleLanguage(lang.code)}
                  className="w-4 h-4 accent-blue"
                />
                {lang.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="after_run" className={label}>After run</label>
            <select id="after_run" name="after_run" defaultValue={club?.after_run ?? ''} className={input}>
              <option value="">—</option>
              <option value="coffee">Coffee</option>
              <option value="bar">Bar</option>
              <option value="restaurant">Restaurant</option>
              <option value="nothing">Nothing</option>
            </select>
          </div>
          <div>
            <label htmlFor="group_size" className={label}>Typical group size</label>
            <input id="group_size" name="group_size" type="number" min="1" defaultValue={club?.group_size ?? ''} className={input} placeholder="30" />
          </div>
          <div>
            {/* spacer */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pace_min" className={label}>Pace min (min/km)</label>
            <input id="pace_min" name="pace_min" defaultValue={club?.pace_min ?? ''} className={input} placeholder="5:00" />
          </div>
          <div>
            <label htmlFor="pace_max" className={label}>Pace max (min/km)</label>
            <input id="pace_max" name="pace_max" defaultValue={club?.pace_max ?? ''} className={input} placeholder="6:30" />
          </div>
        </div>
      </div>

      {/* ── Socials ── */}
      <div className="bg-bg rounded-card-lg border border-line p-5 space-y-4">
        <p className={sectionTitle}>Socials</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="instagram" className={label}>Instagram</label>
            <input id="instagram" name="instagram" defaultValue={club?.instagram ?? ''} className={input} placeholder="@bold.runningclub" />
          </div>
          <div>
            <label htmlFor="tiktok" className={label}>TikTok</label>
            <input id="tiktok" name="tiktok" defaultValue={club?.tiktok ?? ''} className={input} placeholder="@bold.runningclub" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className={label}>Website</label>
            <input id="website" name="website" type="url" defaultValue={club?.website ?? ''} className={input} placeholder="https://…" />
          </div>
          <div>
            <label htmlFor="strava_club_id" className={label}>Strava club ID</label>
            <input id="strava_club_id" name="strava_club_id" defaultValue={club?.strava_club_id ?? ''} className={input} placeholder="12345678" />
          </div>
        </div>
      </div>

      {/* ── Practical ── */}
      <div className="bg-bg rounded-card-lg border border-line p-5 space-y-4">
        <p className={sectionTitle}>Practical</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="registration" className={label}>Registration</label>
            <select id="registration" name="registration" defaultValue={club?.registration ?? 'none'} className={input}>
              <option value="none">No registration</option>
              <option value="dm">DM on Instagram</option>
              <option value="app">Via app</option>
              <option value="link">External link</option>
            </select>
          </div>
          <div>
            <label htmlFor="registration_link" className={label}>Registration link</label>
            <input id="registration_link" name="registration_link" type="url" defaultValue={club?.registration_link ?? ''} className={input} placeholder="https://…" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cost" className={label}>Cost</label>
            <select id="cost" name="cost" defaultValue={club?.cost ?? 'free'} className={input}>
              <option value="free">Free</option>
              <option value="donation">Donation</option>
              <option value="membership">Membership fee</option>
            </select>
          </div>
          <div>
            <label htmlFor="cost_detail" className={label}>Cost details</label>
            <input id="cost_detail" name="cost_detail" defaultValue={club?.cost_detail ?? ''} className={input} placeholder="€5/month" />
          </div>
        </div>

        <div>
          <label htmlFor="contact_email" className={label}>Contact email</label>
          <input id="contact_email" name="contact_email" type="email" defaultValue={club?.contact_email ?? ''} className={input} placeholder="hello@boldrunning.de" />
        </div>
      </div>

      {/* ── Status ── */}
      <div className="bg-bg rounded-card-lg border border-line p-5 space-y-4">
        <p className={sectionTitle}>Status</p>

        <div>
          <label htmlFor="status" className={label}>Status</label>
          <select id="status" name="status" defaultValue={club?.status ?? 'active'} className={input}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="verified"
            name="verified"
            type="checkbox"
            defaultChecked={club?.verified ?? false}
            className="w-4 h-4 accent-blue"
          />
          <label htmlFor="verified" className="text-sm text-ink">
            Verified club
            <span className="ml-1.5 text-xs text-ink3">(blue checkmark visible to runners)</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 px-1">{error}</p>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-1 pb-8">
        <div className="flex gap-3">
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
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm font-medium text-red-500 px-3 py-2.5 hover:text-red-700 transition-colors"
          >
            Delete club
          </button>
        )}
      </div>
    </form>
  )
}
