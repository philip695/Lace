import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Cities',
  description: 'Choose a city and find running clubs near you.',
}

export default async function CitiesPage() {
  const supabase = createClient()

  const { data: cities } = await supabase
    .from('city')
    .select('id, name, slug, country, status, instagram_handle')
    .order('name')

  const active = (cities ?? []).filter((c) => c.status === 'active')
  const comingSoon = (cities ?? []).filter((c) => c.status !== 'active')

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      <h1 className="font-display text-2xl text-ink mb-6">Choose a city</h1>

      {active.length > 0 && (
        <section className="mb-8">
          <div className="space-y-2">
            {active.map((city) => (
              <Link
                key={city.id}
                href={`/${city.slug}`}
                className="flex items-center justify-between bg-bg2 rounded-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{city.name}</p>
                  <p className="text-xs text-ink2">{city.country}</p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {comingSoon.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-ink3 uppercase tracking-wider mb-3">
            Coming soon
          </h2>
          <div className="space-y-2">
            {comingSoon.map((city) => (
              <div
                key={city.id}
                className="flex items-center justify-between px-4 py-3 rounded-card border border-line opacity-50"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{city.name}</p>
                  <p className="text-xs text-ink2">{city.country}</p>
                </div>
                <span className="text-xs text-ink3">Soon</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-ink3 text-center mt-10">
        Want lace. in your city?{' '}
        <a
          href="https://instagram.com/lace.munich"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink2 underline underline-offset-2"
        >
          Get in touch
        </a>
      </p>
    </div>
  )
}
