import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from './sign-out-button'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Clubs', href: '/admin/clubs' },
  { label: 'Runs', href: '/admin/runs' },
  { label: 'Locations', href: '/admin/locations' },
  { label: 'Cities', href: '/admin/cities' },
  { label: 'Matches', href: '/admin/matches' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-line bg-bg flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-line">
          <span className="font-display text-xl text-ink">lace.</span>
          <span className="ml-2 text-xs text-ink3">admin</span>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-card px-3 py-2 text-sm font-medium text-ink2 hover:bg-bg2 hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-line">
          <p className="text-xs text-ink3 truncate mb-2">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-bg2">
        {children}
      </main>
    </div>
  )
}
