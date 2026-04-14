import { BottomNav } from '@/components/bottom-nav'

type CityLayoutProps = {
  children: React.ReactNode
  params: { city: string }
}

export default function CityLayout({ children, params }: CityLayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <main>{children}</main>
      <BottomNav city={params.city} />
    </div>
  )
}
