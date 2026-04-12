# CLAUDE.md — lace. Project Context

This file is the single source of truth for the lace. project.
Read this before touching any code. Every decision made here has a reason.

-----

## What is lace.

**lace.** is the global infrastructure for running communities.

A curated, city-by-city directory that connects:

- **Running Clubs** — who want visibility and new members
- **Locations** — cafés, stores, gyms that want runners as guests
- **Runners** — who want to find the right run in any city in the world

Think European Coffee Trip — but for running clubs.

**Tagline:** lace up. run together.
**Domain:** lace.run
**Instagram:** @lace.munich (per city)

-----

## Status

- Phase 1 — MVP in progress
- City: Munich only
- Admin: curator only (Philip)
- Club self-service: not yet built
- Location self-service: not yet built

-----

## Tech Stack

|Layer    |Tool                   |Notes                                            |
|---------|-----------------------|-------------------------------------------------|
|Framework|Next.js 14 (App Router)|SSR for SEO, one codebase for all three frontends|
|Styling  |Tailwind CSS           |utility-first, no separate CSS files             |
|Database |Supabase (PostgreSQL)  |relational data, auth, storage, RLS              |
|Auth     |Supabase Auth          |email/password for admin + club owners           |
|Map      |Mapbox GL JS           |custom styled map matching lace. brand           |
|Email    |Resend                 |transactional emails only                        |
|Hosting  |Vercel                 |zero-config Next.js deployment                   |
|Storage  |Supabase Storage       |club photos, logos                               |

-----

## Project Structure

```
lace/
├── apps/
│   ├── web/          → lace.run (public app for runners)
│   ├── admin/        → admin.lace.run (curator dashboard)
│   └── club/         → club.lace.run (club owner dashboard — Phase 2)
├── packages/
│   ├── db/           → Supabase client, types, schema
│   ├── ui/           → shared components across all apps
│   └── config/       → shared Tailwind config, constants
└── CLAUDE.md
```

Monorepo using **pnpm workspaces**.

-----

## Design System

### Colors

```
--blue:      #2563EB   primary action, active states
--blue-s:    #EFF4FF   blue soft background
--green:     #16A34A   morning runs (AM), success, live status
--green-s:   #DCFCE7   green soft background
--orange:    #EA580C   evening runs (PM)
--orange-s:  #FFF1E8   orange soft background
--ink:       #0F1117   primary text
--ink2:      #6C7284   secondary text
--ink3:      #BCC0CB   tertiary text / placeholders
--bg:        #FFFFFF   page background
--bg2:       #F6F7F9   card / input background
--line:      #ECEEF1   borders / dividers
```

### Typography

```
Display / Headlines:  Instrument Serif (Google Fonts)
Body / UI:            DM Sans (Google Fonts)
```

### Key UI Rules

- AM time badges: green-s background, green text
- PM time badges: orange-s background, orange text
- Verified clubs: blue checkmark badge
- Active nav item: blue icon + blue label
- Cards: bg2 background, 12–14px border-radius, no border, no shadow
- Buttons: 11–14px border-radius, never full rounded except pills/badges
- No "Join" or membership buttons — lace. is a directory, not a club manager
- Meetpoint links open Google Maps directly — no in-app map navigation for individual runs

-----

## Data Model

### city

```sql
id            uuid primary key
name          text               -- "Munich"
slug          text unique        -- "munich"
country       text               -- "DE"
language_primary   text          -- "de"
language_secondary text          -- "en"
timezone      text               -- "Europe/Berlin"
lat           decimal
lng           decimal
status        enum(active, coming_soon, building)
curator_id    uuid references users
instagram_handle text            -- "@lace.munich"
launch_date   date
cover_image   text
created_at    timestamptz
updated_at    timestamptz
```

### club

```sql
id            uuid primary key
city_id       uuid references city
name          text
slug          text unique
shortname     text
description_short  text          -- max 160 chars
description_long   text          -- markdown
founded_year  int
status        enum(active, paused, inactive)
verified      boolean default false
verified_at   timestamptz

-- identity
logo_url      text
cover_image_url text
photos        text[]             -- array of urls

-- socials
instagram     text               -- "@bold.runningclub"
tiktok        text
strava_club_id text
website       text

-- character
vibe          text[]             -- ["social", "beginner_friendly"]
language      text[]             -- ["de", "en"]
pace_min      text               -- "5:00" min/km
pace_max      text               -- "6:30" min/km
group_size    int                -- typical
after_run     enum(coffee, bar, restaurant, nothing)

-- practical
registration  enum(none, dm, app, link)
registration_link text
cost          enum(free, donation, membership)
cost_detail   text
contact_email text

created_at    timestamptz
updated_at    timestamptz
created_by    uuid references users
```

### run

```sql
id            uuid primary key
club_id       uuid references club
location_id   uuid references location  -- nullable

-- schedule
weekday       enum(mon, tue, wed, thu, fri, sat, sun)
time          time                       -- "07:00"
timezone      text                       -- inherited from city

-- seasonal variants
seasonal_variants jsonb
-- [{season: "summer", time: "06:30"}, {season: "winter", time: "07:00"}]

-- meetpoint
meetpoint_name    text              -- "Wienerplatz"
meetpoint_address text              -- "Wienerplatz 8, 80999 München"
meetpoint_lat     decimal
meetpoint_lng     decimal

-- run details
type          enum(easy, intervals, long_run, trail, night_run, social, tempo)
distances     text[]             -- ["5km", "10km"]
pace_groups   boolean
pace_group_detail text
duration_minutes int

-- practical
registration  enum(none, required)
registration_link text
max_participants int
notes         text

status        enum(active, paused, cancelled)
created_at    timestamptz
updated_at    timestamptz
```

### event

```sql
id            uuid primary key
city_id       uuid references city
club_id       uuid references club    -- nullable (citywide events)
title         text
description   text                    -- markdown
cover_image_url text
event_type    enum(special_run, race, social, workshop, collaboration, other)

date          date
time_start    time
time_end      time
timezone      text

-- location
location_id   uuid references location  -- nullable
location_name text
location_address text
location_lat  decimal
location_lng  decimal

-- practical
registration  enum(none, required, waitlist)
registration_link text
max_participants int
cost          enum(free, paid)
cost_amount   decimal

-- race link
is_race_linked boolean default false
race_name     text
race_link     text

status        enum(upcoming, live, past, cancelled)
created_at    timestamptz
updated_at    timestamptz
created_by    uuid references users
```

### location

```sql
id            uuid primary key
city_id       uuid references city
name          text               -- "Zeit für Brot"
slug          text unique
type          enum(cafe, store, restaurant, gym, park, public_space, other)
description   text

-- address
street        text
city          text
postal_code   text
lat           decimal
lng           decimal

-- opening hours
opening_hours jsonb
-- [{weekday: "mon", open: "07:00", close: "19:00"}, ...]

-- runner offering
offers_coffee   boolean default false
offers_water    boolean default false
offers_lockers  boolean default false
offers_shower   boolean default false
offers_discount boolean default false
discount_detail text
custom_offering text

capacity_groups  int              -- approx group size
preferred_times  text[]           -- ["morning", "evening"]

-- media
cover_image_url text
photos          text[]

-- socials
instagram       text
website         text

status        enum(active, inactive)
verified      boolean default false
created_at    timestamptz
updated_at    timestamptz
submitted_by  uuid references users
verified_by   uuid references users
```

### match

```sql
id            uuid primary key
club_id       uuid references club
location_id   uuid references location
run_id        uuid references run     -- nullable

match_type    enum(meetpoint, after_run, both)
status        enum(proposed, accepted, active, ended)

initiated_by  enum(club, location, curator)
initiated_at  timestamptz

confirmed_by_club     boolean default false
confirmed_by_location boolean default false
confirmed_at          timestamptz

-- feedback
club_rating    int                    -- 1-5
club_note      text
location_rating int                   -- 1-5
location_note   text
feedback_at     timestamptz

created_at    timestamptz
updated_at    timestamptz
```

### user

```sql
id            uuid primary key        -- matches Supabase auth.users.id
email         text unique
name          text
avatar_url    text
role          enum(superadmin, curator, club_owner, location_owner, runner)

-- permissions
city_ids      uuid[]                  -- cities this user can manage
club_ids      uuid[]                  -- clubs this user can manage
location_ids  uuid[]                  -- locations this user can manage

created_at    timestamptz
last_login    timestamptz
onboarding_done boolean default false
```

-----

## Screen Structure (web app)

```
/                       → redirect to /munich
/[city]                 → Week View (default screen)
/[city]/map             → Map View
/[city]/clubs           → Clubs List
/[city]/clubs/[slug]    → Club Profile
/[city]/clubs/[slug]/runs/[id]  → Run Detail
/[city]/events          → Events (Phase 2)
/cities                 → City Selector

/admin                  → Admin Dashboard
/admin/clubs            → Manage Clubs
/admin/clubs/[id]       → Edit Club
/admin/runs             → Manage Runs
/admin/locations        → Manage Locations
/admin/cities           → Manage Cities
/admin/matches          → Manage Matches
```

-----

## Navigation (Bottom Nav — Mobile)

```
Week    →  /[city]
Map     →  /[city]/map
Clubs   →  /[city]/clubs
You     →  /profile (Phase 2 — for now shows city selector)
```

-----

## Key Product Rules

1. **lace. is a directory** — never imply lace. manages club membership
1. **Meetpoints open Google Maps** — `https://maps.google.com/?q=lat,lng`
1. **No "Join" buttons** — CTAs are "View on Instagram", "Open in Maps", "Visit website"
1. **Verified badge** — only curator can set verified=true
1. **AM = green, PM = orange** — consistent across all screens
1. **City selector** is triggered from the city pill in top bar
1. **Run cards** show: Club name · Location · Run type · Time badge — nothing else
1. **Club profile** shows: Stats · Vibe tags · All runs (tappable) · Contact — no fixed meetpoint
1. **Run detail** shows: Time · Exact meetpoint + Maps link · Distance/Pace · Club link

-----

## Phase 1 Scope — Build This Now

```
✅ Public web app (lace.run)
   → Week View
   → Map View (Mapbox)
   → Clubs List
   → Club Profile
   → Run Detail
   → City Selector

✅ Admin panel (admin.lace.run)
   → Auth (email/password, superadmin only)
   → Club management (create, edit, verify, pause)
   → Run management (create, edit, delete)
   → Location management (create, edit, verify)
   → City management (create, set status)
   → Match initiation

✅ Supabase schema
   → All tables above
   → RLS policies
   → Seed data (Munich clubs)
```

-----

## Phase 2 — Do Not Build Yet

```
❌ Club owner dashboard (club.lace.run)
❌ Location owner dashboard
❌ User accounts / profiles
❌ Run Passport feature
❌ Events module (data model ready, UI not needed yet)
❌ Push notifications
❌ Newsletter automation
❌ City license system
❌ Analytics dashboard
❌ Instagram Story auto-export (exists as separate tool)
```

-----

## Naming Conventions

```
Components:   PascalCase         ClubCard, RunBadge, CitySelector
Functions:    camelCase          getClubsByCity, formatRunTime
Files:        kebab-case         club-card.tsx, run-badge.tsx
DB tables:    snake_case         club, run, city, location
DB columns:   snake_case         club_id, created_at, cover_image_url
CSS classes:  Tailwind only      no custom CSS files unless absolutely necessary
Constants:    UPPER_SNAKE        CITIES, RUN_TYPES, VIBE_TAGS
Types:        PascalCase         Club, Run, City, Location, Match
```

-----

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       -- admin only, never expose to client
NEXT_PUBLIC_MAPBOX_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=             -- https://lace.run
NEXT_PUBLIC_ADMIN_URL=           -- https://admin.lace.run
```

-----

## What I Care About

- **Speed** — page load under 2s, interactions feel instant
- **Mobile first** — everything designed for 375px width first
- **SEO** — every city/club page server-rendered with proper meta tags
- **Simplicity** — if something can be removed, remove it
- **No premature abstraction** — build what's needed, not what might be needed

-----

## What To Avoid

- Don't add libraries without asking
- Don't build Phase 2 features
- Don't add "Join", "Sign up", or membership flows to the public app
- Don't use inline styles — Tailwind only
- Don't create custom CSS unless Tailwind genuinely can't do it
- Don't over-engineer the admin — it just needs to work
- Don't forget RLS policies on every Supabase table

-----

*Last updated: April 2026*
*Curator: Philip*
