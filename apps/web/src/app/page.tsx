import { redirect } from 'next/navigation'

// Root → redirect to Munich (the only active city in Phase 1)
export default function RootPage() {
  redirect('/munich')
}
