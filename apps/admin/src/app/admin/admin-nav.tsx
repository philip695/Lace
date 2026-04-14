'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Clubs', href: '/admin/clubs' },
  { label: 'Runs', href: '/admin/runs' },
  { label: 'Locations', href: '/admin/locations' },
  { label: 'Cities', href: '/admin/cities' },
  { label: 'Matches', href: '/admin/matches' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex-1 py-3 px-2 space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-card px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-s text-blue'
                : 'text-ink2 hover:bg-bg2 hover:text-ink'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
