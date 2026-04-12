// Cities
export const CITIES = ['munich'] as const
export type CitySlug = typeof CITIES[number]

// Weekdays in display order (Mon → Sun)
export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type WeekdaySlug = typeof WEEKDAYS[number]

export const WEEKDAY_LABELS: Record<WeekdaySlug, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export const WEEKDAY_SHORT: Record<WeekdaySlug, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

// Run types
export const RUN_TYPES = ['easy', 'intervals', 'long_run', 'trail', 'night_run', 'social', 'tempo'] as const
export type RunTypeSlug = typeof RUN_TYPES[number]

export const RUN_TYPE_LABELS: Record<RunTypeSlug, string> = {
  easy: 'Easy Run',
  intervals: 'Intervals',
  long_run: 'Long Run',
  trail: 'Trail',
  night_run: 'Night Run',
  social: 'Social Run',
  tempo: 'Tempo',
}

// Vibe tags
export const VIBE_TAGS = [
  'social',
  'beginner_friendly',
  'competitive',
  'trail',
  'track',
  'interval_focused',
  'long_distance',
  'mixed_pace',
  'coffee_after',
  'beer_after',
  'dog_friendly',
  'women_only',
  'multilingual',
] as const
export type VibeTag = typeof VIBE_TAGS[number]

export const VIBE_TAG_LABELS: Record<VibeTag, string> = {
  social: 'Social',
  beginner_friendly: 'Beginner friendly',
  competitive: 'Competitive',
  trail: 'Trail',
  track: 'Track',
  interval_focused: 'Interval focused',
  long_distance: 'Long distance',
  mixed_pace: 'Mixed pace',
  coffee_after: 'Coffee after',
  beer_after: 'Beer after',
  dog_friendly: 'Dog friendly',
  women_only: 'Women only',
  multilingual: 'Multilingual',
}

// Location types
export const LOCATION_TYPES = ['cafe', 'store', 'restaurant', 'gym', 'park', 'public_space', 'other'] as const
export type LocationTypeSlug = typeof LOCATION_TYPES[number]

export const LOCATION_TYPE_LABELS: Record<LocationTypeSlug, string> = {
  cafe: 'Café',
  store: 'Store',
  restaurant: 'Restaurant',
  gym: 'Gym',
  park: 'Park',
  public_space: 'Public space',
  other: 'Other',
}

// Google Maps URL builder
export function mapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`
}

// Instagram URL builder
export function instagramUrl(handle: string): string {
  const clean = handle.replace('@', '')
  return `https://instagram.com/${clean}`
}

// Time helpers
export function isAM(time: string): boolean {
  const [hours] = time.split(':').map(Number)
  return hours < 12
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const h = hours % 12 || 12
  const m = minutes.toString().padStart(2, '0')
  const period = hours < 12 ? 'AM' : 'PM'
  return `${h}:${m} ${period}`
}

/**
 * Returns the current weekday slug based on the system clock.
 * e.g. "mon", "tue", etc.
 */
export function todayWeekday(): WeekdaySlug {
  const day = new Date().getDay() // 0 = Sunday
  const map: WeekdaySlug[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return map[day]
}
