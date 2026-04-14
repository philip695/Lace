# lace. — UI Design Spec

This file defines the exact visual design for the lace. web app.
Reference this alongside CLAUDE.md for all UI work.

---

## Design Principles

- **Mobile first** — designed for 375px, max-width 512px content area
- **Content over chrome** — no decorative elements, no shadows, no gradients
- **Whitespace is structure** — spacing does the work, not borders
- **Typography is hierarchy** — weight and size carry meaning

---

## Tokens (already in tailwind preset)

```
Colors
  --blue:      #2563EB   primary action, active state
  --blue-s:    #EFF4FF   blue soft background (badges, highlights)
  --green:     #16A34A   AM runs
  --green-s:   #DCFCE7   AM badge background
  --orange:    #EA580C   PM runs
  --orange-s:  #FFF1E8   PM badge background
  --ink:       #0F1117   primary text
  --ink2:      #6C7284   secondary text
  --ink3:      #BCC0CB   tertiary / placeholders / labels
  --bg:        #FFFFFF   page background
  --bg2:       #F6F7F9   card / input background
  --line:      #ECEEF1   borders / dividers

Typography
  font-display  Instrument Serif   headings, logo
  font-sans     DM Sans            all body and UI text

Border radius
  rounded-card    12px   small cards, chips
  rounded-card-lg 14px   club cards, larger surfaces
  rounded-full         pills, badges, avatars
```

---

## Layout Shell

```
┌────────────────────────────────┐  h-14, sticky, z-40
│  lace.          Munich ˅       │  TopBar
├────────────────────────────────┤  border-b border-line
│                                │
│        <page content>          │  flex-1, pb-20
│                                │
├────────────────────────────────┤  border-t border-line
│  ◻ Week  📍 Map  👥 Clubs  👤  │  BottomNav, fixed, h-16
└────────────────────────────────┘  z-50
```

**TopBar**
- Left: `lace.` in `font-display text-xl text-ink`
- Right: city pill — `bg-bg2 rounded-full px-3 py-1.5 text-sm font-medium text-ink` + chevron-down SVG 12px
- Links to `/cities`

**BottomNav**
- 4 equal columns: Week / Map / Clubs / You
- Icon 20×20 SVG + label `text-2xs font-medium`
- Active: `text-blue`, Inactive: `text-ink3`
- Tap area: full column, `py-3`

---

## Week View  `/[city]`

The default screen. Shows all runs grouped by weekday, sorted by time.

```
px-4 py-5  max-w-lg mx-auto  space-y-7
│
├── [Monday]  ← Day section
│   ├── Day header
│   └── Run cards (space-y-2)
│
├── [Tuesday]
│   └── ...
```

### Day Header

```
flex items-center gap-2  mb-3

"Monday"        text-sm font-semibold
                → today: text-blue
                → other: text-ink2

"Today"         text-2xs font-semibold bg-blue-s text-blue
                px-2 py-0.5 rounded-full
                → only shown on current day
```

### Run Card

Tappable. Links to `/[city]/clubs/[slug]/runs/[id]`.

```
bg-bg2  rounded-card  px-4 py-3
flex items-center justify-between  gap-3
active:opacity-70 transition-opacity

LEFT
  row 1: Club name (text-sm font-semibold text-ink truncate)
         + VerifiedBadge (if verified)
  row 2: meetpoint_name · RunTypeLabel
         text-xs text-ink2 truncate

RIGHT
  RunTimeBadge (AM: green, PM: orange)
```

**VerifiedBadge** — `w-4 h-4 rounded-full bg-blue` + white checkmark SVG inside. Never use ✓ text.

**RunTimeBadge**
- AM (before 12:00): `bg-green-s text-green rounded-full px-2 py-0.5 text-xs font-semibold`
- PM: `bg-orange-s text-orange` same shape
- Shows formatted time: `6:45 am`, `7:00 pm`

---

## Clubs List  `/[city]/clubs`

```
px-4 py-5  max-w-lg mx-auto

h1: "Clubs in Munich"
    font-display text-2xl text-ink  mb-5

Club cards: space-y-3
```

### Club Card

```
bg-bg2  rounded-card-lg  overflow-hidden
active:opacity-70 transition-opacity

[Cover image if available: h-32, object-cover]

BODY  p-4
  row: Club name (font-semibold text-ink) + VerifiedBadge
       + logo (w-10 h-10 rounded-full, right-aligned, if available)

  description_short  text-xs text-ink2 mt-1 line-clamp-2

  Vibe tags (first 3): mt-3
    text-2xs font-medium  bg-bg  text-ink2
    border border-line  rounded-full  px-2 py-0.5

  Pace: text-xs text-ink3 mt-2
    "5:00 – 6:30 min/km"
```

---

## Club Profile  `/[city]/clubs/[slug]`

```
max-w-lg mx-auto

[Cover image h-52, or h-36 bg-bg2 placeholder]

CONTENT  px-4 pt-4 pb-24
  ├── Header
  ├── Description
  ├── Vibe tags
  ├── Stats card
  ├── Runs section
  └── Social links
```

### Header

```
flex items-start justify-between gap-3  mb-4

LEFT
  h1: club name  font-display text-2xl text-ink
      + VerifiedBadge inline
  Est. year: text-xs text-ink3 mt-1  (if available)

RIGHT (if logo_url)
  w-14 h-14 rounded-full overflow-hidden
  border-2 border-bg  bg-bg2  -mt-10 shadow-sm
  (floats up over cover image)
```

### Stats Card

```
bg-bg2  rounded-card  px-4 py-3
flex gap-6  mb-6

Each stat:
  label: text-2xs text-ink3 uppercase tracking-wide font-medium
  value: text-sm font-semibold text-ink  mt-0.5

Stats: Pace ("5:00–6:30 /km"), Group ("~30"), Language ("DE, EN")
Only render if at least one value exists.
```

### Runs Section

```
Section label: text-xs font-semibold text-ink3 uppercase tracking-wide  mb-3

Run row (same card style as Week View):
  LEFT: "Mon · Easy"  text-sm font-medium text-ink
        meetpoint_name  text-xs text-ink2 mt-0.5
  RIGHT: RunTimeBadge
```

### Social Links

```
border-t border-line  pt-5  space-y-2

Each link: bg-bg2 rounded-card px-4 py-3
  flex items-center gap-2
  PREFIX label (text-ink3 text-xs): "IG" / "Web" / "Strava"
  value: text-sm text-ink font-medium
  ↗: ml-auto text-xs text-ink3
```

---

## Run Detail  `/[city]/clubs/[slug]/runs/[id]`

```
max-w-lg mx-auto  px-4 py-6

Back link: text-sm text-ink2 flex items-center gap-1  mb-6
           ← ChevronLeft SVG 16×16

RunTimeBadge + weekday label  mb-2
h1: run type  font-display text-2xl text-ink  mb-6

Details: space-y-2

Detail card:
  bg-bg2  rounded-card  px-4 py-3
  label: text-2xs text-ink3 uppercase tracking-wide font-medium  mb-1
  value: text-sm font-semibold text-ink

Detail cards in order:
  1. Meetpoint  (name + address + "Open in Google Maps ↗" text-xs font-semibold text-blue)
  2. Distance   ("5km · 10km")
  3. Duration   ("~60 min")
  4. Pace groups (detail text if available)
  5. Registration (if required)
  6. Notes      (text-sm text-ink leading-relaxed, no font-semibold)

Organised by (border-t border-line pt-5 space-y-2):
  label: text-2xs text-ink3 uppercase tracking-wide font-medium  mb-3

  Club card:
    bg-bg2 rounded-card px-4 py-3
    flex items-center justify-between
    name font-semibold + VerifiedBadge  |  ChevronRight SVG

  Instagram link (if available):
    bg-bg2 rounded-card px-4 py-3
    "View on Instagram"  |  ↗
```

---

## City Selector  `/cities`

```
max-w-sm mx-auto  px-6 py-8

h1: "Where are you running?"
    font-display text-2xl text-ink  mb-6

Active cities: space-y-2
  bg-bg2 rounded-card px-4 py-3
  flex items-center justify-between
  city name: text-sm font-semibold text-ink
  ChevronRight SVG: text-ink3

Coming soon: mt-6  space-y-2
  label: text-xs text-ink3 uppercase tracking-wide font-medium mb-2
  same card  opacity-50  cursor-default
  badge: text-2xs bg-bg2 text-ink3 border border-line rounded-full px-2 py-0.5
```

---

## Component Checklist

| Component | File | Status |
|---|---|---|
| TopBar | `components/top-bar.tsx` | ✓ |
| BottomNav | `components/bottom-nav.tsx` | ✓ |
| RunTimeBadge | `components/run-time-badge.tsx` | ✓ |
| VerifiedBadge | `components/verified-badge.tsx` | ✓ |
| Week View | `app/[city]/page.tsx` | ✓ |
| Clubs List | `app/[city]/clubs/page.tsx` | ✓ |
| Club Profile | `app/[city]/clubs/[slug]/page.tsx` | ✓ |
| Run Detail | `app/[city]/clubs/[slug]/runs/[id]/page.tsx` | ✓ |
| City Selector | `app/cities/page.tsx` | ✓ |
| Map View | `app/[city]/map/page.tsx` | needs Mapbox token |
