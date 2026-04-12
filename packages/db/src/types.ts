// ─── Enums ────────────────────────────────────────────────────────────────────

export type CityStatus = 'active' | 'coming_soon' | 'building'

export type ClubStatus = 'active' | 'paused' | 'inactive'

export type AfterRunType = 'coffee' | 'bar' | 'restaurant' | 'nothing'

export type RegistrationType = 'none' | 'dm' | 'app' | 'link'

export type RunRegistrationType = 'none' | 'required'

export type CostType = 'free' | 'donation' | 'membership'

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type RunType = 'easy' | 'intervals' | 'long_run' | 'trail' | 'night_run' | 'social' | 'tempo'

export type RunStatus = 'active' | 'paused' | 'cancelled'

export type EventType = 'special_run' | 'race' | 'social' | 'workshop' | 'collaboration' | 'other'

export type EventStatus = 'upcoming' | 'live' | 'past' | 'cancelled'

export type EventCostType = 'free' | 'paid'

export type EventRegistrationType = 'none' | 'required' | 'waitlist'

export type LocationType = 'cafe' | 'store' | 'restaurant' | 'gym' | 'park' | 'public_space' | 'other'

export type LocationStatus = 'active' | 'inactive'

export type MatchType = 'meetpoint' | 'after_run' | 'both'

export type MatchStatus = 'proposed' | 'accepted' | 'active' | 'ended'

export type MatchInitiatedBy = 'club' | 'location' | 'curator'

export type UserRole = 'superadmin' | 'curator' | 'club_owner' | 'location_owner' | 'runner'

// ─── JSON shapes ──────────────────────────────────────────────────────────────

export type SeasonalVariant = {
  season: 'summer' | 'winter' | 'spring' | 'autumn'
  time: string // "HH:MM"
}

export type OpeningHours = {
  weekday: Weekday
  open: string  // "HH:MM"
  close: string // "HH:MM"
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export type City = {
  id: string
  name: string
  slug: string
  country: string
  language_primary: string
  language_secondary: string | null
  timezone: string
  lat: number | null
  lng: number | null
  status: CityStatus
  curator_id: string | null
  instagram_handle: string | null
  launch_date: string | null
  cover_image: string | null
  created_at: string
  updated_at: string
}

export type Club = {
  id: string
  city_id: string
  name: string
  slug: string
  shortname: string | null
  description_short: string | null
  description_long: string | null
  founded_year: number | null
  status: ClubStatus
  verified: boolean
  verified_at: string | null
  // identity
  logo_url: string | null
  cover_image_url: string | null
  photos: string[]
  // socials
  instagram: string | null
  tiktok: string | null
  strava_club_id: string | null
  website: string | null
  // character
  vibe: string[]
  language: string[]
  pace_min: string | null
  pace_max: string | null
  group_size: number | null
  after_run: AfterRunType | null
  // practical
  registration: RegistrationType
  registration_link: string | null
  cost: CostType
  cost_detail: string | null
  contact_email: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export type Run = {
  id: string
  club_id: string
  location_id: string | null
  // schedule
  weekday: Weekday
  time: string // "HH:MM"
  timezone: string
  seasonal_variants: SeasonalVariant[]
  // meetpoint
  meetpoint_name: string | null
  meetpoint_address: string | null
  meetpoint_lat: number | null
  meetpoint_lng: number | null
  // run details
  type: RunType
  distances: string[]
  pace_groups: boolean
  pace_group_detail: string | null
  duration_minutes: number | null
  // practical
  registration: RunRegistrationType
  registration_link: string | null
  max_participants: number | null
  notes: string | null
  status: RunStatus
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  city_id: string
  club_id: string | null
  title: string
  description: string | null
  cover_image_url: string | null
  event_type: EventType
  date: string // "YYYY-MM-DD"
  time_start: string | null
  time_end: string | null
  timezone: string
  // location
  location_id: string | null
  location_name: string | null
  location_address: string | null
  location_lat: number | null
  location_lng: number | null
  // practical
  registration: EventRegistrationType
  registration_link: string | null
  max_participants: number | null
  cost: EventCostType
  cost_amount: number | null
  // race link
  is_race_linked: boolean
  race_name: string | null
  race_link: string | null
  status: EventStatus
  created_at: string
  updated_at: string
  created_by: string | null
}

export type Location = {
  id: string
  city_id: string
  name: string
  slug: string
  type: LocationType
  description: string | null
  // address
  street: string | null
  city: string | null
  postal_code: string | null
  lat: number | null
  lng: number | null
  // opening hours
  opening_hours: OpeningHours[]
  // runner offering
  offers_coffee: boolean
  offers_water: boolean
  offers_lockers: boolean
  offers_shower: boolean
  offers_discount: boolean
  discount_detail: string | null
  custom_offering: string | null
  capacity_groups: number | null
  preferred_times: string[]
  // media
  cover_image_url: string | null
  photos: string[]
  // socials
  instagram: string | null
  website: string | null
  status: LocationStatus
  verified: boolean
  created_at: string
  updated_at: string
  submitted_by: string | null
  verified_by: string | null
}

export type Match = {
  id: string
  club_id: string
  location_id: string
  run_id: string | null
  match_type: MatchType
  status: MatchStatus
  initiated_by: MatchInitiatedBy
  initiated_at: string
  confirmed_by_club: boolean
  confirmed_by_location: boolean
  confirmed_at: string | null
  club_rating: number | null
  club_note: string | null
  location_rating: number | null
  location_note: string | null
  feedback_at: string | null
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: UserRole
  city_ids: string[]
  club_ids: string[]
  location_ids: string[]
  created_at: string
  last_login: string | null
  onboarding_done: boolean
}

// ─── Extended types (with relations) ─────────────────────────────────────────

export type ClubWithCity = Club & { city: City }

export type ClubWithRuns = Club & { runs: Run[] }

export type RunWithClub = Run & { club: Pick<Club, 'id' | 'name' | 'slug' | 'shortname' | 'verified' | 'logo_url'> }

export type RunWithClubAndLocation = Run & {
  club: Pick<Club, 'id' | 'name' | 'slug' | 'shortname' | 'verified' | 'logo_url'>
  location: Pick<Location, 'id' | 'name' | 'slug'> | null
}

// ─── Database schema type (for Supabase client) ───────────────────────────────

export type Database = {
  public: {
    Tables: {
      city: {
        Row: City
        Insert: Omit<City, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<City, 'id' | 'created_at'>>
      }
      club: {
        Row: Club
        Insert: Omit<Club, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Club, 'id' | 'created_at'>>
      }
      run: {
        Row: Run
        Insert: Omit<Run, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Run, 'id' | 'created_at'>>
      }
      event: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Event, 'id' | 'created_at'>>
      }
      location: {
        Row: Location
        Insert: Omit<Location, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Location, 'id' | 'created_at'>>
      }
      match: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Match, 'id' | 'created_at'>>
      }
      user: {
        Row: User
        Insert: Omit<User, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
    }
    Enums: {
      city_status: CityStatus
      club_status: ClubStatus
      after_run_type: AfterRunType
      registration_type: RegistrationType
      run_registration_type: RunRegistrationType
      cost_type: CostType
      weekday_type: Weekday
      run_type: RunType
      run_status: RunStatus
      event_type: EventType
      event_status: EventStatus
      event_cost_type: EventCostType
      event_registration_type: EventRegistrationType
      location_type: LocationType
      location_status: LocationStatus
      match_type: MatchType
      match_status: MatchStatus
      match_initiated_by: MatchInitiatedBy
      user_role: UserRole
    }
  }
}
