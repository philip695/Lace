'use client'

import Link from 'next/link'

type TopBarProps = {
  city: string
}

export function TopBar({ city }: TopBarProps) {
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1)

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-line px-4 h-14 flex items-center justify-between">
      <span className="font-display text-xl text-ink">lace.</span>
      <Link
        href="/cities"
        className="flex items-center gap-1.5 bg-bg2 rounded-full px-3 py-1.5 text-sm font-medium text-ink"
      >
        {cityLabel}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </header>
  )
}
