-- ============================================================
-- lace. — Seed data: Munich running clubs
-- Run in Supabase SQL Editor after 001_initial.sql
-- ============================================================

DO $$
DECLARE
  munich_id   uuid;
  bold_id     uuid;
  milers_id   uuid;
  tribe_id    uuid;
  mafia_id    uuid;
  midnight_id uuid;
BEGIN

  SELECT id INTO munich_id FROM public.city WHERE slug = 'munich';

  -- ─── Clubs ────────────────────────────────────────────────────────────────

  INSERT INTO public.club (
    city_id, name, slug, shortname,
    description_short, description_long,
    founded_year, status, verified,
    instagram, website, strava_club_id,
    vibe, language, pace_min, pace_max, group_size,
    after_run, registration, cost
  ) VALUES (
    munich_id,
    'BOLD Running Club',
    'bold-running-club',
    'BOLD',
    'Munich''s most social running crew. We run hard, then grab coffee.',
    'BOLD Running Club started in 2019 as a small group of friends who wanted to make running more social in Munich. Today we are one of the city''s most active running communities — welcoming runners of all levels every week.',
    2019, 'active', true,
    '@bold.runningclub', 'https://bold-running.de', null,
    ARRAY['social', 'beginner_friendly', 'coffee_after', 'multilingual'],
    ARRAY['de', 'en'],
    '5:00', '6:30', 35,
    'coffee', 'none', 'free'
  ) RETURNING id INTO bold_id;

  INSERT INTO public.club (
    city_id, name, slug, shortname,
    description_short, description_long,
    founded_year, status, verified,
    instagram,
    vibe, language, pace_min, pace_max, group_size,
    after_run, registration, cost
  ) VALUES (
    munich_id,
    'Munich Milers',
    'munich-milers',
    'Milers',
    'Structured training for runners who want to get faster. Track sessions, tempo runs, long runs.',
    'Munich Milers is Munich''s go-to club for runners serious about improvement. We run structured workouts — intervals, tempo, and long runs — with pace groups so everyone is challenged.',
    2017, 'active', true,
    '@munich.milers',
    ARRAY['competitive', 'interval_focused', 'track', 'mixed_pace'],
    ARRAY['de', 'en'],
    '4:00', '5:30', 20,
    'nothing', 'none', 'free'
  ) RETURNING id INTO milers_id;

  INSERT INTO public.club (
    city_id, name, slug, shortname,
    description_short, description_long,
    founded_year, status, verified,
    instagram,
    vibe, language, pace_min, pace_max, group_size,
    after_run, registration, cost
  ) VALUES (
    munich_id,
    'Runners Tribe Munich',
    'runners-tribe-munich',
    'Tribe',
    'A welcoming crew for all paces. No runner left behind — we run as a group, finish as a group.',
    'Runners Tribe is for everyone. Whether you''re running your first 5k or training for a marathon, you''re welcome here. We run easy, we have fun, and we always finish together.',
    2020, 'active', false,
    '@runnerstribe.munich',
    ARRAY['social', 'mixed_pace', 'beginner_friendly'],
    ARRAY['en', 'de'],
    '5:30', '7:00', 28,
    'bar', 'none', 'free'
  ) RETURNING id INTO tribe_id;

  INSERT INTO public.club (
    city_id, name, slug, shortname,
    description_short, description_long,
    founded_year, status, verified,
    instagram,
    vibe, language, pace_min, pace_max, group_size,
    after_run, registration, cost
  ) VALUES (
    munich_id,
    'Track Mafia Munich',
    'track-mafia-munich',
    'Track Mafia',
    'We live on the track. Interval sessions that will make you faster — and suffer (in a good way).',
    'Track Mafia is Munich''s most dedicated track running crew. Every session is programmed, every rep counts. If you want to get fast, this is where you show up.',
    2021, 'active', true,
    '@trackmafia.munich',
    ARRAY['competitive', 'interval_focused', 'track'],
    ARRAY['de', 'en'],
    '3:45', '5:00', 15,
    'nothing', 'none', 'free'
  ) RETURNING id INTO mafia_id;

  INSERT INTO public.club (
    city_id, name, slug, shortname,
    description_short, description_long,
    founded_year, status, verified,
    instagram, website,
    vibe, language, pace_min, pace_max, group_size,
    after_run, registration, cost
  ) VALUES (
    munich_id,
    'Midnight Runners Munich',
    'midnight-runners-munich',
    'Midnight',
    'Night run through the city followed by a party. Running is just the warm-up.',
    'Midnight Runners is a global movement and Munich is one of its most active chapters. Every run is a party on legs — expect music, energy, and a proper after-run.',
    2018, 'active', true,
    '@midnightrunners', 'https://midnightrunners.com',
    ARRAY['social', 'mixed_pace', 'beer_after'],
    ARRAY['en', 'de'],
    '5:30', '7:00', 60,
    'bar', 'none', 'free'
  ) RETURNING id INTO midnight_id;

  -- ─── Runs ─────────────────────────────────────────────────────────────────

  -- BOLD
  INSERT INTO public.run (
    club_id, weekday, time, timezone, type,
    distances, status,
    meetpoint_name, meetpoint_address, meetpoint_lat, meetpoint_lng,
    duration_minutes
  ) VALUES
  (
    bold_id, 'tue', '19:00', 'Europe/Berlin', 'easy',
    ARRAY['5km', '10km'], 'active',
    'Wienerplatz', 'Wienerplatz, 81667 München', 48.12823, 11.59194,
    60
  ),
  (
    bold_id, 'sat', '09:00', 'Europe/Berlin', 'long_run',
    ARRAY['15km', '21km'], 'active',
    'Wienerplatz', 'Wienerplatz, 81667 München', 48.12823, 11.59194,
    120
  );

  -- Munich Milers
  INSERT INTO public.run (
    club_id, weekday, time, timezone, type,
    distances, pace_groups, pace_group_detail, status,
    meetpoint_name, meetpoint_address, meetpoint_lat, meetpoint_lng,
    duration_minutes
  ) VALUES
  (
    milers_id, 'mon', '18:30', 'Europe/Berlin', 'intervals',
    ARRAY['8×400m', '6×800m'], true, '3 Gruppen: sub-4:00, 4:00–5:00, 5:00+', 'active',
    'Olympiastadion Tartanbahn', 'Spiridon-Louis-Ring 21, 80809 München', 48.17361, 11.54658,
    75
  ),
  (
    milers_id, 'wed', '06:45', 'Europe/Berlin', 'tempo',
    ARRAY['8km', '10km'], false, null, 'active',
    'Eisbach / Prinzregentenbrücke', 'Prinzregentenstraße 1, 80538 München', 48.14350, 11.58820,
    60
  ),
  (
    milers_id, 'sun', '08:00', 'Europe/Berlin', 'long_run',
    ARRAY['18km', '25km'], true, '2 Gruppen: Marathon-Pace, Easy Pace', 'active',
    'Olympiastadion Tartanbahn', 'Spiridon-Louis-Ring 21, 80809 München', 48.17361, 11.54658,
    150
  );

  -- Runners Tribe
  INSERT INTO public.run (
    club_id, weekday, time, timezone, type,
    distances, status,
    meetpoint_name, meetpoint_address, meetpoint_lat, meetpoint_lng,
    duration_minutes
  ) VALUES
  (
    tribe_id, 'thu', '19:00', 'Europe/Berlin', 'social',
    ARRAY['5km', '8km'], 'active',
    'Marienplatz', 'Marienplatz 1, 80331 München', 48.13743, 11.57549,
    60
  ),
  (
    tribe_id, 'sat', '08:30', 'Europe/Berlin', 'easy',
    ARRAY['10km', '15km'], 'active',
    'Englischer Garten Süd', 'Veterinärstraße 9, 80539 München', 48.14967, 11.58047,
    90
  );

  -- Track Mafia
  INSERT INTO public.run (
    club_id, weekday, time, timezone, type,
    distances, pace_groups, pace_group_detail, status,
    meetpoint_name, meetpoint_address, meetpoint_lat, meetpoint_lng,
    duration_minutes
  ) VALUES
  (
    mafia_id, 'wed', '19:30', 'Europe/Berlin', 'intervals',
    ARRAY['10×400m', '5×1000m'], true, '2 Gruppen: sub-4:30, 4:30–5:30', 'active',
    'Dante-Stadion', 'Georg-Brauchle-Ring 25, 80992 München', 48.17360, 11.50650,
    90
  ),
  (
    mafia_id, 'sun', '09:00', 'Europe/Berlin', 'easy',
    ARRAY['10km', '12km'], false, null, 'active',
    'Olympiapark Eingang Süd', 'Olympiapark, 80809 München', 48.17570, 11.55190,
    75
  );

  -- Midnight Runners
  INSERT INTO public.run (
    club_id, weekday, time, timezone, type,
    distances, status,
    meetpoint_name, meetpoint_address, meetpoint_lat, meetpoint_lng,
    duration_minutes, notes
  ) VALUES
  (
    midnight_id, 'fri', '21:00', 'Europe/Berlin', 'social',
    ARRAY['5km', '7km'], 'active',
    'Sendlinger Tor', 'Sendlinger-Tor-Platz 1, 80336 München', 48.13404, 11.56729,
    45,
    'Bring your energy. After-run at a local bar TBA on Instagram.'
  ),
  (
    midnight_id, 'sat', '21:30', 'Europe/Berlin', 'social',
    ARRAY['6km', '8km'], 'active',
    'Odeonsplatz', 'Odeonsplatz, 80539 München', 48.14256, 11.57765,
    50,
    'The night is young. Check Instagram for the exact after-run spot.'
  );

END $$;
