'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type BottomNavProps = {
  city: string
}

export function BottomNav({ city }: BottomNavProps) {
  const pathname = usePathname()

  const items = [
    {
      label: 'Week',
      href: `/${city}`,
      exact: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 2v3M13 2v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Map',
      href: `/${city}/map`,
      exact: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      label: 'Clubs',
      href: `/${city}/clubs`,
      exact: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 17c0-3.31 2.24-6 5-6s5 2.69 5 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M14 11.5c1.66.5 3 2.07 3 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: 'You',
      href: '/cities',
      exact: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M4 17c0-3.31 2.69-6 6-6s6 2.69 6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ]

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-line safe-area-pb">
      <div className="flex">
        {items.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                active ? 'text-blue' : 'text-ink3'
              }`}
            >
              {item.icon}
              <span className="text-2xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
