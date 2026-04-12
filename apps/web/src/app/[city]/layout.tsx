import { TopBar } from '@/components/top-bar'
import { BottomNav } from '@/components/bottom-nav'

type CityLayoutProps = {
  children: React.ReactNode
  params: { city: string }
}

export default function CityLayout({ children, params }: CityLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar city={params.city} />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav city={params.city} />
    </div>
  )
}
