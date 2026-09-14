import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const Route = createFileRoute('/(home)/_layout')({
  component: HomeLayout,
})

function HomeLayout() {
  return (
    <div>
      <Header />

      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col p-4 pt-22">
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}
