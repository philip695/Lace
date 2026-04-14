# design.md — lace. Visual Reference

This file describes the exact design of every component and screen.
Use this together with the mockup HTML files in docs/mockups/.
Do not deviate from this design without asking.

---

## Fonts

Load from Google Fonts in layout.tsx:

```
Instrument Serif  → headlines, wordmark, day names, club names on hero
DM Sans           → everything else (UI, body, labels, badges)
```

```tsx
// app/layout.tsx
import { Instrument_Serif, DM_Sans } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})
```

---

## Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue:     { DEFAULT: '#2563EB', soft: '#EFF4FF' },
        green:    { DEFAULT: '#16A34A', soft: '#DCFCE7' },
        orange:   { DEFAULT: '#EA580C', soft: '#FFF1E8' },
        ink:      { DEFAULT: '#0F1117', 2: '#6C7284', 3: '#BCC0CB' },
        bg:       { DEFAULT: '#FFFFFF', 2: '#F6F7F9' },
        line:     '#ECEEF1',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:   '12px',
        card-lg: '16px',
        pill:   '9999px',
      },
    },
  },
}
export default config
```

---

## Global Rules

- Background: always `bg-white`
- Cards: `bg-bg-2 rounded-card` — no border, no shadow
- Inputs: `bg-bg-2 border border-line rounded-[11px]`
- No inline styles — Tailwind only
- Mobile first — base styles for 375px, no desktop layout needed yet

---

## Component Library

---

### Wordmark

```tsx
// The lace. logo — used in top bar of every screen
<span className="font-serif text-[26px] text-ink leading-none tracking-tight">
  lace<span className="text-blue">.</span>
</span>
```

---

### CityPill

```tsx
// Tappable city switcher — top right of every screen
<button className="flex items-center gap-[5px] bg-bg-2 border-[1.5px] border-line rounded-full px-[10px] py-[5px] pl-[7px]">
  {/* Green pulse dot — signals live city */}
  <div className="w-[7px] h-[7px] rounded-full bg-green ring-[2.5px] ring-green-soft" />
  <span className="text-[13px] font-medium text-ink">{city.name}</span>
  <ChevronDownIcon className="w-[11px] h-[11px] text-ink-3" />
</button>
```

---

### TimeBadge

```tsx
// AM = green, PM = orange — used on every run card and run detail
// isAM determined by run time < 12:00

<span className={cn(
  'text-[12px] font-semibold px-[9px] py-[3px] rounded-full whitespace-nowrap',
  isAM
    ? 'bg-green-soft text-green'
    : 'bg-orange-soft text-orange'
)}>
  {formattedTime}
</span>
```

---

### RunCard

```tsx
// Used in Week View list — one card per run
// Shows: Club avatar · Club name · Location · Run type · Time badge
// Tap → Run Detail page

<div className="flex items-center gap-[11px] bg-bg-2 rounded-card px-[12px] py-[11px] cursor-pointer hover:bg-[#EBF0FA] transition-colors">

  {/* Club avatar — initials fallback until logo exists */}
  <div className="w-[40px] h-[40px] rounded-[10px] bg-white border border-line flex items-center justify-center font-serif text-[14px] text-ink-2 flex-shrink-0">
    {club.shortname?.slice(0, 2) ?? club.name.slice(0, 2)}
  </div>

  {/* Club info */}
  <div className="flex-1 min-w-0">
    <div className="text-[14px] font-semibold text-ink tracking-tight truncate">
      {club.name}
    </div>
    <div className="mt-[2px] text-[12px] text-ink-2 truncate">
      {run.meetpoint_name} · {formatRunType(run.type)}
    </div>
  </div>

  {/* Time badge */}
  <TimeBadge time={run.time} />

</div>
```

---

### DayStrip

```tsx
// Horizontal scrollable day selector — Week View
// Shows 7 days, active day highlighted in blue
// Dots below each day = number of runs that day (max 4 shown)

<div className="flex gap-[3px] overflow-x-auto scrollbar-none px-[22px]">
  {days.map((day) => (
    <button
      key={day.date}
      onClick={() => setActiveDay(day.date)}
      className={cn(
        'flex-shrink-0 w-[44px] flex flex-col items-center gap-[3px] py-[7px] rounded-[11px] transition-colors',
        isActive ? 'bg-blue' : 'bg-transparent hover:bg-bg-2'
      )}
    >
      <span className={cn('text-[10px] font-medium uppercase tracking-wide',
        isActive ? 'text-white/65' : 'text-ink-3'
      )}>
        {day.shortName}
      </span>
      <span className={cn('text-[17px] font-semibold tracking-tight leading-none',
        isActive ? 'text-white' : 'text-ink'
      )}>
        {day.dayNumber}
      </span>
      {/* Run count dots */}
      <div className="flex gap-[2px]">
        {Array.from({ length: Math.min(day.runCount, 4) }).map((_, i) => (
          <div key={i} className={cn('w-[4px] h-[4px] rounded-full',
            isActive ? 'bg-white/85' : 'bg-blue'
          )} />
        ))}
      </div>
    </button>
  ))}
</div>
```

---

### TimeDivider

```tsx
// Separates AM and PM runs in Week View

<div className="flex items-center gap-[8px] mx-[22px]">
  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3 whitespace-nowrap">
    {label} {/* "Morning" or "Evening" */}
  </span>
  <div className="flex-1 h-px bg-line" />
</div>
```

---

### SearchBar

```tsx
// Search + Filter — below wordmark on Week View and Clubs List

<div className="relative mx-[22px]">
  <MagnifyingGlassIcon className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-ink-3 pointer-events-none" />
  <input
    className="w-full h-[42px] bg-bg-2 border-[1.5px] border-line rounded-[11px] pl-[38px] pr-[90px] font-sans text-[14px] text-ink placeholder:text-ink-3 outline-none focus:border-blue focus:bg-white transition-colors"
    placeholder={placeholder}
  />
  <button className="absolute right-[6px] top-1/2 -translate-y-1/2 h-[30px] bg-blue rounded-[7px] px-[10px] flex items-center gap-[4px]">
    <AdjustmentsIcon className="w-[11px] h-[11px] text-white" />
    <span className="text-[11px] font-semibold text-white uppercase tracking-wide">Filter</span>
  </button>
</div>
```

---

### VibeChip

```tsx
// Filter chips — Clubs List screen
// active = blue-soft background + blue text

<button className={cn(
  'flex-shrink-0 rounded-full px-[12px] py-[6px] text-[12px] font-medium whitespace-nowrap transition-colors',
  isActive
    ? 'bg-blue-soft text-blue'
    : 'bg-bg-2 text-ink-2 hover:bg-line'
)}>
  {label}
</button>
```

---

### VerifiedBadge

```tsx
// Small blue checkmark — shown on verified clubs

<div className="w-[16px] h-[16px] bg-blue-soft rounded-full flex items-center justify-center">
  <CheckIcon className="w-[9px] h-[9px] text-blue stroke-[2.5px]" />
</div>
```

---

### ClubCard

```tsx
// Used in Clubs List — horizontal card with vibe + pace + next run
// Tap → Club Profile page

<div className="flex items-center gap-[12px] bg-bg-2 rounded-[14px] px-[14px] py-[12px] cursor-pointer hover:bg-[#EBF0FA] transition-colors">

  <div className="w-[46px] h-[46px] rounded-[12px] bg-white border border-line flex items-center justify-center font-serif text-[16px] text-ink-2 flex-shrink-0">
    {club.shortname?.slice(0, 2)}
  </div>

  <div className="flex-1 min-w-0">
    <div className="text-[14px] font-semibold text-ink tracking-tight truncate">
      {club.name}
    </div>
    <div className="mt-[3px] flex items-center gap-[5px] flex-wrap">
      <span className="text-[11px] text-ink-3">{club.vibe?.[0]}</span>
      <div className="w-[3px] h-[3px] rounded-full bg-ink-3" />
      <span className="text-[11px] text-ink-3">{club.pace_min}–{club.pace_max} /km</span>
      <div className="w-[3px] h-[3px] rounded-full bg-ink-3" />
      <span className="text-[11px] text-ink-3">{formatWeekdays(club.runs)}</span>
    </div>
  </div>

  <div className="flex flex-col items-end gap-[5px] flex-shrink-0">
    <span className="text-[11px] font-medium text-ink-2 whitespace-nowrap">
      {nextRun.weekday} {formatTime(nextRun.time)}
    </span>
    <VerifiedBadge />
  </div>

</div>
```

---

### RunInfoCard

```tsx
// Used in Run Detail — shows time + meetpoint in one card

<div className="bg-bg-2 rounded-[16px] p-[18px] flex flex-col gap-[16px]">

  {/* Time row */}
  <div className="flex items-center gap-[14px]">
    <div className="w-[40px] h-[40px] rounded-[10px] bg-orange-soft flex items-center justify-center flex-shrink-0">
      <ClockIcon className="w-[18px] h-[18px] text-orange stroke-2" />
    </div>
    <div className="flex-1">
      <div className="text-[16px] font-bold text-ink tracking-tight">{formattedTime}</div>
      <div className="mt-[2px] text-[12px] text-ink-2">{formattedDate}</div>
    </div>
    <TimeBadge time={run.time} />
  </div>

  <div className="h-px bg-line" />

  {/* Location row */}
  <div className="flex items-center gap-[14px]">
    <div className="w-[40px] h-[40px] rounded-[10px] bg-blue-soft flex items-center justify-center flex-shrink-0">
      <MapPinIcon className="w-[18px] h-[18px] text-blue stroke-2" />
    </div>
    <div className="flex-1">
      <div className="text-[16px] font-bold text-ink tracking-tight">{run.meetpoint_name}</div>
      <div className="mt-[2px] text-[12px] text-ink-2">{run.meetpoint_address}</div>
    </div>
    {/* Opens Google Maps directly */}
    <a
      href={`https://maps.google.com/?q=${run.meetpoint_lat},${run.meetpoint_lng}`}
      target="_blank"
      className="text-[13px] font-medium text-blue whitespace-nowrap"
    >
      Maps →
    </a>
  </div>

</div>
```

---

### RunStatBar

```tsx
// Used in Run Detail — distance, pace, cost

<div className="flex gap-[8px]">
  {stats.map((stat) => (
    <div key={stat.label} className="flex-1 bg-bg-2 rounded-[12px] px-[10px] py-[12px] flex flex-col items-center gap-[3px]">
      <span className="text-[15px] font-bold text-ink tracking-tight">{stat.value}</span>
      <span className="text-[10px] font-semibold text-ink-3 uppercase tracking-wide">{stat.label}</span>
    </div>
  ))}
</div>
```

---

### ClubHero

```tsx
// Top of Club Profile — full-width image with overlay
// Back button top-left, Verified pill top-right
// Club name + subtitle bottom-left

<div className="relative w-full h-[210px]"
  style={{ background: 'linear-gradient(140deg, #1D3557 0%, #457B9D 100%)' }}
>
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45" />

  {/* Back button */}
  <button className="absolute top-[52px] left-[16px] w-[34px] h-[34px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
    <ChevronLeftIcon className="w-[16px] h-[16px] text-white stroke-2" />
  </button>

  {/* Verified pill */}
  <div className="absolute top-[52px] right-[16px] flex items-center gap-[4px] bg-white/20 backdrop-blur-sm rounded-full px-[10px] py-[5px]">
    <CheckIcon className="w-[12px] h-[12px] text-white stroke-[2.5px]" />
    <span className="text-[11px] font-semibold text-white tracking-wide">Verified</span>
  </div>

  {/* Club name */}
  <div className="absolute bottom-[16px] left-[20px] right-[20px]">
    <h1 className="font-serif text-[28px] text-white tracking-tight leading-tight">
      {club.name}
    </h1>
    <p className="mt-[4px] text-[13px] text-white/72">{city.name} · {club.description_short}</p>
  </div>
</div>
```

---

### QuickStats

```tsx
// Used in Club Profile — pace, group size, cost, founded

<div className="flex gap-[8px]">
  {[
    { value: `${club.pace_min}–${club.pace_max}`, label: 'Pace /km' },
    { value: `${club.group_size}`, label: 'Runners' },
    { value: club.cost === 'free' ? 'Free' : club.cost_detail, label: 'Cost' },
    { value: club.founded_year?.toString() ?? '—', label: 'Since' },
  ].map((s) => (
    <div key={s.label} className="flex-1 bg-bg-2 rounded-[12px] px-[8px] py-[12px] flex flex-col items-center gap-[3px]">
      <span className="text-[14px] font-bold text-ink tracking-tight text-center">{s.value}</span>
      <span className="text-[9px] font-semibold text-ink-3 uppercase tracking-wide text-center">{s.label}</span>
    </div>
  ))}
</div>
```

---

### VibeTags

```tsx
// Used in Club Profile — shows vibe, language, after-run etc.

<div className="flex flex-wrap gap-[6px]">
  {tags.map((tag) => (
    <span key={tag.label} className={cn(
      'rounded-full px-[11px] py-[5px] text-[12px] font-medium',
      tag.highlight
        ? 'bg-blue-soft text-blue'
        : 'bg-bg-2 text-ink-2'
    )}>
      {tag.label}
    </span>
  ))}
</div>
```

---

### RunRow

```tsx
// Used in Club Profile — one row per run, tappable to Run Detail

<div
  onClick={() => router.push(`/${city}/clubs/${club.slug}/runs/${run.id}`)}
  className="flex items-center bg-bg-2 rounded-[11px] px-[13px] py-[11px] gap-[10px] cursor-pointer hover:bg-[#EBF0FA] transition-colors"
>
  <span className="text-[12px] font-semibold text-ink-2 w-[26px] flex-shrink-0">
    {shortWeekday(run.weekday)}
  </span>
  <div className="flex-1 min-w-0">
    <div className="text-[14px] font-semibold text-ink tracking-tight">{formatTime(run.time)}</div>
    <div className="mt-[1px] text-[12px] text-ink-2 truncate">{run.meetpoint_name}</div>
  </div>
  <span className={cn(
    'text-[11px] font-semibold px-[9px] py-[3px] rounded-full flex-shrink-0',
    isAM(run.time) ? 'bg-green-soft text-green' : 'bg-orange-soft text-orange'
  )}>
    {formatRunType(run.type)}
  </span>
  <ChevronRightIcon className="w-[14px] h-[14px] text-ink-3 flex-shrink-0" />
</div>
```

---

### SocialButtons

```tsx
// Used in Club Profile — Instagram + Strava side by side

<div className="flex gap-[8px]">
  <a href={`https://instagram.com/${club.instagram?.replace('@','')}`}
     target="_blank"
     className="flex-1 h-[42px] rounded-[11px] border-[1.5px] border-line bg-white flex items-center justify-center gap-[6px] hover:bg-bg-2 transition-colors">
    <InstagramIcon className="w-[16px] h-[16px] text-ink-2" />
    <span className="text-[12px] font-medium text-ink-2">{club.instagram}</span>
  </a>
  {club.strava_club_id && (
    <a href={`https://strava.com/clubs/${club.strava_club_id}`}
       target="_blank"
       className="flex-1 h-[42px] rounded-[11px] border-[1.5px] border-line bg-white flex items-center justify-center gap-[6px] hover:bg-bg-2 transition-colors">
      <StravaIcon className="w-[16px] h-[16px] text-ink-2" />
      <span className="text-[12px] font-medium text-ink-2">Strava</span>
    </a>
  )}
</div>
```

---

### BottomNav

```tsx
// Fixed bottom navigation — all screens

const navItems = [
  { label: 'Week',  href: `/${city}`,        icon: CalendarIcon  },
  { label: 'Map',   href: `/${city}/map`,     icon: GlobeIcon     },
  { label: 'Clubs', href: `/${city}/clubs`,   icon: ListBulletIcon },
  { label: 'You',   href: `/cities`,          icon: UserIcon      },
]

<nav className="fixed bottom-0 left-0 w-full h-[80px] bg-white/95 backdrop-blur-xl border-t border-line flex items-center justify-around px-1 pb-[18px] z-50">
  {navItems.map((item) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <Link key={item.label} href={item.href}
        className="flex flex-col items-center gap-[3px] px-[16px] py-[6px]">
        <item.icon className={cn('w-[22px] h-[22px]',
          isActive ? 'stroke-blue' : 'stroke-ink-3'
        )} strokeWidth={1.8} />
        <span className={cn('text-[10px] font-medium uppercase tracking-wide',
          isActive ? 'text-blue' : 'text-ink-3'
        )}>
          {item.label}
        </span>
      </Link>
    )
  })}
</nav>
```

---

### CityRow

```tsx
// Used in City Selector — one row per city

<button
  onClick={() => router.push(`/${city.slug}`)}
  className="flex items-center gap-[12px] w-full px-[14px] py-[12px] rounded-[13px] hover:bg-bg-2 transition-colors"
>
  <div className="w-[40px] h-[40px] rounded-[10px] bg-bg-2 flex items-center justify-center text-[22px] flex-shrink-0">
    {city.flag}
  </div>
  <div className="flex-1 text-left">
    <div className="text-[14px] font-semibold text-ink tracking-tight">{city.name}</div>
    <div className="mt-[2px] text-[12px] text-ink-2">
      {city.status === 'active' ? `${city.club_count} clubs` : 'Coming soon'}
    </div>
  </div>
  <span className={cn(
    'text-[10px] font-semibold uppercase tracking-wide px-[8px] py-[3px] rounded-full',
    city.status === 'active'   ? 'bg-green-soft text-green'   :
    city.status === 'coming_soon' ? 'bg-orange-soft text-orange' :
    'bg-bg-2 text-ink-3'
  )}>
    {city.status === 'active' ? 'Live' : city.status === 'coming_soon' ? 'Soon' : 'Building'}
  </span>
</button>
```

---

### CurrentCityHero

```tsx
// Used in City Selector — highlighted card for active city

<div className="mx-[22px] bg-blue rounded-[16px] p-[16px] flex items-center gap-[12px]">
  <div className="w-[44px] h-[44px] rounded-[12px] bg-white/20 flex items-center justify-center text-[20px]">
    {city.flag}
  </div>
  <div className="flex-1">
    <div className="text-[16px] font-bold text-white tracking-tight">{city.name}</div>
    <div className="mt-[2px] text-[12px] text-white/70">
      {city.club_count} clubs · {todayRunCount} runs today
    </div>
  </div>
  <span className="bg-white/20 rounded-full px-[10px] py-[4px] text-[11px] font-semibold text-white whitespace-nowrap">
    Your city
  </span>
</div>
```

---

## Screen Layouts

---

### Week View `/[city]`

```
StatusBar
─────────────────────────
Wordmark + CityPill        ← topbar
SearchBar
DayStrip
─────────────────────────
SectionHeader "Wednesday · 11 runs"
TimeDivider "Morning"
RunCard × n (AM runs)
TimeDivider "Evening"
RunCard × n (PM runs)
─────────────────────────
BottomNav (fixed)
```

---

### Run Detail `/[city]/clubs/[slug]/runs/[id]`

```
Hero (gradient bg, club name, run type badge, back button)
─────────────────────────
RunInfoCard (time + meetpoint + Maps link)
RunStatBar (distance · pace · cost)
SectionLabel "Organised by"
ClubLinkRow (avatar + name + chevron → Club Profile)
─────────────────────────
```

---

### Club Profile `/[city]/clubs/[slug]`

```
ClubHero (image/gradient, verified pill, back button)
─────────────────────────
QuickStats (pace · runners · cost · since)
SectionLabel "Vibe"
VibeTags
SectionLabel "All runs — tap for details"
RunRow × n (each → Run Detail)
SectionLabel "Questions?"
SocialButtons (Instagram + Strava)
─────────────────────────
```

---

### Map View `/[city]/map`

```
Map (Mapbox fullscreen)
─────────────────────────
TopBar (floating, blurred) — wordmark + city + search
FilterChips (floating) — Today · Morning · Evening · Social · Performance
Pins on map — blue bubble with club name
  → tap pin → MiniCard appears bottom
MiniCard (floating bottom sheet)
  → club name + next run row + "View club profile" button
RunCountBubble (floating bottom right) — "11 runs today"
─────────────────────────
BottomNav (fixed)
```

---

### Clubs List `/[city]/clubs`

```
StatusBar
─────────────────────────
SectionTitle "All Clubs" + CityPill
SearchBar (no filter button — just search)
VibeChips — All · Social · Performance · Beginner ✓ · Trail
SectionLabel "Munich · 43 clubs"
ClubCard × n
─────────────────────────
BottomNav (fixed)
```

---

### City Selector `/cities`

```
StatusBar
─────────────────────────
Title "Where are you?"
Subtitle "Select a city to find runs near you"
CurrentCityHero (blue card)
SearchBar
RegionLabel "Germany"
CityRow × n (Live cities)
Divider
RegionLabel "Europe"
CityRow × n (Soon + Building cities)
─────────────────────────
```

---

## Spacing Reference

```
Page horizontal padding:   px-[22px]  (22px each side)
Between sections:          mt-[16px] to mt-[22px]
Card gap in lists:         gap-[7px] to gap-[8px]
Card internal padding:     px-[12px] py-[11px]
Section labels:            font-size 10px, tracking 0.12em, uppercase
Bottom nav height:         h-[80px] with pb-[18px]
Scroll padding bottom:     pb-[88px] (clears bottom nav)
```

---

## Utility Functions

These should exist in `packages/db/src/utils.ts`:

```ts
// Format run time: "07:00" → "7:00 am" or "6:30 pm"
export function formatRunTime(time: string): string

// Is this time AM?
export function isAM(time: string): boolean

// Short weekday: "mon" → "Mon"
export function shortWeekday(day: string): string

// Format run type for display: "long_run" → "Long run"
export function formatRunType(type: string): string

// Next run for a club: returns the soonest upcoming run
export function getNextRun(runs: Run[]): Run | null

// Format weekdays list: ["mon","wed","thu"] → "Mon · Wed · Thu"
export function formatWeekdays(runs: Run[]): string

// Google Maps URL from coordinates
export function mapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`
}
```

---

*Reference the HTML mockups in docs/mockups/ for visual verification.*
*Last updated: April 2026*
