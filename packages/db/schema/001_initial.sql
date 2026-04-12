-- ============================================================
-- lace. — Initial Database Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Enum Types ──────────────────────────────────────────────────────────────

create type city_status as enum ('active', 'coming_soon', 'building');

create type club_status as enum ('active', 'paused', 'inactive');

create type after_run_type as enum ('coffee', 'bar', 'restaurant', 'nothing');

create type registration_type as enum ('none', 'dm', 'app', 'link');

create type run_registration_type as enum ('none', 'required');

create type cost_type as enum ('free', 'donation', 'membership');

create type weekday_type as enum ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

create type run_type as enum ('easy', 'intervals', 'long_run', 'trail', 'night_run', 'social', 'tempo');

create type run_status as enum ('active', 'paused', 'cancelled');

create type event_type as enum ('special_run', 'race', 'social', 'workshop', 'collaboration', 'other');

create type event_status as enum ('upcoming', 'live', 'past', 'cancelled');

create type event_cost_type as enum ('free', 'paid');

create type event_registration_type as enum ('none', 'required', 'waitlist');

create type location_type as enum ('cafe', 'store', 'restaurant', 'gym', 'park', 'public_space', 'other');

create type location_status as enum ('active', 'inactive');

create type match_type as enum ('meetpoint', 'after_run', 'both');

create type match_status as enum ('proposed', 'accepted', 'active', 'ended');

create type match_initiated_by as enum ('club', 'location', 'curator');

create type user_role as enum ('superadmin', 'curator', 'club_owner', 'location_owner', 'runner');

-- ─── Tables ───────────────────────────────────────────────────────────────────

-- User profiles (extends auth.users)
create table public."user" (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text unique not null,
  name          text,
  avatar_url    text,
  role          user_role not null default 'runner',
  city_ids      uuid[] not null default '{}',
  club_ids      uuid[] not null default '{}',
  location_ids  uuid[] not null default '{}',
  created_at    timestamptz not null default now(),
  last_login    timestamptz,
  onboarding_done boolean not null default false
);

-- City
create table public.city (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text unique not null,
  country             text not null,
  language_primary    text not null,
  language_secondary  text,
  timezone            text not null,
  lat                 decimal(9, 6),
  lng                 decimal(9, 6),
  status              city_status not null default 'coming_soon',
  curator_id          uuid references public."user"(id) on delete set null,
  instagram_handle    text,
  launch_date         date,
  cover_image         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Club
create table public.club (
  id                  uuid primary key default uuid_generate_v4(),
  city_id             uuid not null references public.city(id) on delete cascade,
  name                text not null,
  slug                text unique not null,
  shortname           text,
  description_short   text check (char_length(description_short) <= 160),
  description_long    text,
  founded_year        int check (founded_year > 1900 and founded_year <= extract(year from now())),
  status              club_status not null default 'active',
  verified            boolean not null default false,
  verified_at         timestamptz,
  -- identity
  logo_url            text,
  cover_image_url     text,
  photos              text[] not null default '{}',
  -- socials
  instagram           text,
  tiktok              text,
  strava_club_id      text,
  website             text,
  -- character
  vibe                text[] not null default '{}',
  language            text[] not null default '{}',
  pace_min            text,
  pace_max            text,
  group_size          int check (group_size > 0),
  after_run           after_run_type,
  -- practical
  registration        registration_type not null default 'none',
  registration_link   text,
  cost                cost_type not null default 'free',
  cost_detail         text,
  contact_email       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references public."user"(id) on delete set null
);

-- Location
create table public.location (
  id                  uuid primary key default uuid_generate_v4(),
  city_id             uuid not null references public.city(id) on delete cascade,
  name                text not null,
  slug                text unique not null,
  type                location_type not null,
  description         text,
  -- address
  street              text,
  city                text,
  postal_code         text,
  lat                 decimal(9, 6),
  lng                 decimal(9, 6),
  -- opening hours
  opening_hours       jsonb not null default '[]',
  -- runner offering
  offers_coffee       boolean not null default false,
  offers_water        boolean not null default false,
  offers_lockers      boolean not null default false,
  offers_shower       boolean not null default false,
  offers_discount     boolean not null default false,
  discount_detail     text,
  custom_offering     text,
  capacity_groups     int check (capacity_groups > 0),
  preferred_times     text[] not null default '{}',
  -- media
  cover_image_url     text,
  photos              text[] not null default '{}',
  -- socials
  instagram           text,
  website             text,
  status              location_status not null default 'active',
  verified            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  submitted_by        uuid references public."user"(id) on delete set null,
  verified_by         uuid references public."user"(id) on delete set null
);

-- Run
create table public.run (
  id                  uuid primary key default uuid_generate_v4(),
  club_id             uuid not null references public.club(id) on delete cascade,
  location_id         uuid references public.location(id) on delete set null,
  -- schedule
  weekday             weekday_type not null,
  time                time not null,
  timezone            text not null,
  seasonal_variants   jsonb not null default '[]',
  -- meetpoint
  meetpoint_name      text,
  meetpoint_address   text,
  meetpoint_lat       decimal(9, 6),
  meetpoint_lng       decimal(9, 6),
  -- run details
  type                run_type not null default 'easy',
  distances           text[] not null default '{}',
  pace_groups         boolean not null default false,
  pace_group_detail   text,
  duration_minutes    int check (duration_minutes > 0),
  -- practical
  registration        run_registration_type not null default 'none',
  registration_link   text,
  max_participants    int check (max_participants > 0),
  notes               text,
  status              run_status not null default 'active',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Event
create table public.event (
  id                  uuid primary key default uuid_generate_v4(),
  city_id             uuid not null references public.city(id) on delete cascade,
  club_id             uuid references public.club(id) on delete set null,
  title               text not null,
  description         text,
  cover_image_url     text,
  event_type          event_type not null default 'other',
  date                date not null,
  time_start          time,
  time_end            time,
  timezone            text not null,
  -- location
  location_id         uuid references public.location(id) on delete set null,
  location_name       text,
  location_address    text,
  location_lat        decimal(9, 6),
  location_lng        decimal(9, 6),
  -- practical
  registration        event_registration_type not null default 'none',
  registration_link   text,
  max_participants    int check (max_participants > 0),
  cost                event_cost_type not null default 'free',
  cost_amount         decimal(10, 2) check (cost_amount >= 0),
  -- race link
  is_race_linked      boolean not null default false,
  race_name           text,
  race_link           text,
  status              event_status not null default 'upcoming',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references public."user"(id) on delete set null
);

-- Match
create table public.match (
  id                    uuid primary key default uuid_generate_v4(),
  club_id               uuid not null references public.club(id) on delete cascade,
  location_id           uuid not null references public.location(id) on delete cascade,
  run_id                uuid references public.run(id) on delete set null,
  match_type            match_type not null,
  status                match_status not null default 'proposed',
  initiated_by          match_initiated_by not null,
  initiated_at          timestamptz not null default now(),
  confirmed_by_club     boolean not null default false,
  confirmed_by_location boolean not null default false,
  confirmed_at          timestamptz,
  -- feedback
  club_rating           int check (club_rating between 1 and 5),
  club_note             text,
  location_rating       int check (location_rating between 1 and 5),
  location_note         text,
  feedback_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index idx_club_city_id     on public.club(city_id);
create index idx_club_slug        on public.club(slug);
create index idx_club_status      on public.club(status);
create index idx_club_verified    on public.club(verified);

create index idx_run_club_id      on public.run(club_id);
create index idx_run_weekday      on public.run(weekday);
create index idx_run_status       on public.run(status);

create index idx_location_city_id on public.location(city_id);
create index idx_location_slug    on public.location(slug);
create index idx_location_status  on public.location(status);

create index idx_event_city_id    on public.event(city_id);
create index idx_event_date       on public.event(date);
create index idx_event_status     on public.event(status);

create index idx_match_club_id      on public.match(club_id);
create index idx_match_location_id  on public.match(location_id);
create index idx_match_status       on public.match(status);

-- ─── Updated-at Trigger ───────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger city_updated_at
  before update on public.city
  for each row execute function public.handle_updated_at();

create trigger club_updated_at
  before update on public.club
  for each row execute function public.handle_updated_at();

create trigger run_updated_at
  before update on public.run
  for each row execute function public.handle_updated_at();

create trigger location_updated_at
  before update on public.location
  for each row execute function public.handle_updated_at();

create trigger event_updated_at
  before update on public.event
  for each row execute function public.handle_updated_at();

create trigger match_updated_at
  before update on public.match
  for each row execute function public.handle_updated_at();

-- ─── Auto-create user profile on signup ──────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."user" (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public."user"   enable row level security;
alter table public.city     enable row level security;
alter table public.club     enable row level security;
alter table public.run      enable row level security;
alter table public.location enable row level security;
alter table public.event    enable row level security;
alter table public.match    enable row level security;

-- ─── RLS Policies ─────────────────────────────────────────────────────────────
-- The admin app uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS entirely.
-- These policies govern the public web app (anon key) and any future club dashboards.

-- City: anyone can read all cities (needed for city selector)
create policy "Public read cities"
  on public.city for select
  using (true);

-- Club: anyone can read active clubs
create policy "Public read active clubs"
  on public.club for select
  using (status = 'active');

-- Run: anyone can read active runs
create policy "Public read active runs"
  on public.run for select
  using (status = 'active');

-- Location: anyone can read active locations
create policy "Public read active locations"
  on public.location for select
  using (status = 'active');

-- Event: anyone can read upcoming and live events
create policy "Public read upcoming events"
  on public.event for select
  using (status in ('upcoming', 'live'));

-- Match: not public (admin-only via service role)
-- No public read policy on match table.

-- User: users can read and update their own profile
create policy "Users read own profile"
  on public."user" for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public."user" for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── Seed: Munich ─────────────────────────────────────────────────────────────

insert into public.city (
  name, slug, country, language_primary, language_secondary,
  timezone, lat, lng, status, instagram_handle
) values (
  'Munich', 'munich', 'DE', 'de', 'en',
  'Europe/Berlin', 48.137154, 11.576124, 'active', '@lace.munich'
);
