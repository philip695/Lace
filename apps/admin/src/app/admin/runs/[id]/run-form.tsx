'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRun, updateRun, deleteRun } from '../actions'
import type { Run, Club } from '@lace/db'

type RunFormProps = {
  run: Run | null
  clubs: Pick<Club, 'id' | 'name' | 'shortname'>[]
  isNew: boolean
}

export function RunForm({ run, clubs, isNew }: RunFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paceGroups, setPaceGroups] = useState(run?.pace_groups ?? false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = new FormData(e.currentTarget)

    // distances: "5km, 10km" → ["5km", "10km"]
    const distancesRaw = (data.get('distances') as string) || ''
    const distances = distancesRaw
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)

    const payload = {
      club_id: data.get('club_id') as string,
      weekday: data.get('weekday') as Run['weekday'],
      time: data.get('time') as string,
      timezone: 'Europe/Berlin',
      type: data.get('type') as Run['type'],
      status: (data.get('status') as Run['status']) || 'active',
      meetpoint_name: (data.get('meetpoint_name') as string) || null,
      meetpoint_address: (data.get('meetpoint_address') as string) || null,
      meetpoint_lat: data.get('meetpoint_lat') ? Number(data.get('meetpoint_lat')) : null,
      meetpoint_lng: data.get('meetpoint_lng') ? Number(data.get('meetpoint_lng')) : null,
      distances,
      duration_minutes: data.get('duration_minutes') ? Number(data.get('duration_minutes')) : null,
      pace_groups: data.get('pace_groups') === 'on',
      pace_group_detail: (data.get('pace_group_detail') as string) || null,
      notes: (data.get('notes') as string) || null,
    }

    const result = isNew
      ? await createRun(payload)
      : await updateRun(run!.id, payload)

    if (result.error) { setError(result.error); setSaving(false); return }

    router.push('/admin/runs')
    router.refresh()
  }

  async function handleDelete() {
    if (!run || !confirm('Delete this run?')) return
    const result = await deleteRun(run.id)
    if (result.error) { setError(result.error); return }
    router.push('/admin/runs')
    router.refresh()
  }

  const input =
    'w-full bg-bg2 border border-line rounded-card px-3 py-2 text-sm text-ink placeholder:text-ink3 focus:outline-none focus:ring-2 focus:ring-blue'
  const label = 'block text-xs font-medium text-ink2 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Club */}
      <div>
        <label htmlFor="club_id" className={label}>Club *</label>
        <select id="club_id" name="club_id" required defaultValue={run?.club_id ?? ''} className={input}>
          <option value="">Select club…</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortname ? `${c.name} (${c.shortname})` : c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Weekday + Time + Type */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="weekday" className={label}>Day *</label>
          <select id="weekday" name="weekday" required defaultValue={run?.weekday ?? ''} className={input}>
            <option value="">Day…</option>
            <option value="mon">Monday</option>
            <option value="tue">Tuesday</option>
            <option value="wed">Wednesday</option>
            <option value="thu">Thursday</option>
            <option value="fri">Friday</option>
            <option value="sat">Saturday</option>
            <option value="sun">Sunday</option>
          </select>
        </div>
        <div>
          <label htmlFor="time" className={label}>Time *</label>
          <input
            id="time"
            name="time"
            type="time"
            required
            defaultValue={run?.time?.slice(0, 5) ?? ''}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="type" className={label}>Type *</label>
          <select id="type" name="type" required defaultValue={run?.type ?? ''} className={input}>
            <option value="">Type…</option>
            <option value="easy">Easy Run</option>
            <option value="intervals">Intervals</option>
            <option value="long_run">Long Run</option>
            <option value="trail">Trail</option>
            <option value="tempo">Tempo</option>
            <option value="social">Social Run</option>
            <option value="night_run">Night Run</option>
          </select>
        </div>
      </div>

      {/* Meetpoint */}
      <div className="border border-line rounded-card p-4 space-y-4">
        <p className="text-xs font-semibold text-ink2 uppercase tracking-wide">Meetpoint</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="meetpoint_name" className={label}>Name</label>
            <input id="meetpoint_name" name="meetpoint_name" defaultValue={run?.meetpoint_name ?? ''} className={input} placeholder="Wienerplatz" />
          </div>
          <div>
            <label htmlFor="meetpoint_address" className={label}>Address</label>
            <input id="meetpoint_address" name="meetpoint_address" defaultValue={run?.meetpoint_address ?? ''} className={input} placeholder="Wienerplatz, 81667 München" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="meetpoint_lat" className={label}>Latitude</label>
            <input id="meetpoint_lat" name="meetpoint_lat" type="number" step="0.00001" defaultValue={run?.meetpoint_lat ?? ''} className={input} placeholder="48.12823" />
          </div>
          <div>
            <label htmlFor="meetpoint_lng" className={label}>Longitude</label>
            <input id="meetpoint_lng" name="meetpoint_lng" type="number" step="0.00001" defaultValue={run?.meetpoint_lng ?? ''} className={input} placeholder="11.59194" />
          </div>
        </div>
      </div>

      {/* Distances + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="distances" className={label}>Distances (comma-separated)</label>
          <input
            id="distances"
            name="distances"
            defaultValue={run?.distances?.join(', ') ?? ''}
            className={input}
            placeholder="5km, 10km"
          />
        </div>
        <div>
          <label htmlFor="duration_minutes" className={label}>Duration (minutes)</label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min="1"
            defaultValue={run?.duration_minutes ?? ''}
            className={input}
            placeholder="60"
          />
        </div>
      </div>

      {/* Pace groups */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            id="pace_groups"
            name="pace_groups"
            type="checkbox"
            defaultChecked={run?.pace_groups ?? false}
            onChange={(e) => setPaceGroups(e.target.checked)}
            className="w-4 h-4 accent-blue"
          />
          <label htmlFor="pace_groups" className="text-sm text-ink">Pace groups</label>
        </div>
        {paceGroups && (
          <div>
            <label htmlFor="pace_group_detail" className={label}>Pace group details</label>
            <input
              id="pace_group_detail"
              name="pace_group_detail"
              defaultValue={run?.pace_group_detail ?? ''}
              className={input}
              placeholder="3 groups: sub-4:00, 4:00–5:00, 5:00+"
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={label}>Notes</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={run?.notes ?? ''} className={input} placeholder="Any additional info…" />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className={label}>Status</label>
        <select id="status" name="status" defaultValue={run?.status ?? 'active'} className={input}>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-card disabled:opacity-50"
          >
            {saving ? 'Saving…' : isNew ? 'Create run' : 'Save changes'}
          </button>
          <a href="/admin/runs" className="text-sm font-medium text-ink2 px-5 py-2.5">
            Cancel
          </a>
        </div>
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm font-medium text-red-500 px-3 py-2.5"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
