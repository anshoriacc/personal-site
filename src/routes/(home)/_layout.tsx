import React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/_layout')({
  component: HomeLayout,
})

function HomeLayout() {
  const constraintsRef = React.useRef<HTMLDivElement>(null!)

  return (
    <div ref={constraintsRef} className="relative cursor-default select-none">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(50, 50, 50, 0.10), transparent 66%), transparent',
        }}
      />

      <div
        className="absolute inset-0 z-0 pointer-events-none hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(200, 200, 200, 0.10), transparent 66%), transparent',
        }}
      />
      <div className="mx-auto min-h-dvh w-full max-w-xl p-4 pt-22 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
