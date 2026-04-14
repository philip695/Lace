import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from './sign-out-button'
import { AdminNav } from './admin-nav'

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
          <span className="font-sans text-sm font-bold tracking-widest text-ink uppercase">lace.</span>
          <span className="ml-2 text-xs text-ink3">admin</span>
        </div>

        <AdminNav />

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
