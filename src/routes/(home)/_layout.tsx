import React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/(home)/_layout')({
  component: HomeLayout,
})

function HomeLayout() {
  const constraintsRef = React.useRef<HTMLDivElement>(null!)

  return (
    <div ref={constraintsRef} className="relative cursor-default select-none">
      {/* Gradient Background */}
      <motion.div
        initial={{ scale: 0.6, y: '-100%', opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'top center' }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(50, 50, 50, 0.15), transparent 66%), transparent',
          }}
        />

        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(200, 200, 200, 0.05), transparent 66%), transparent',
          }}
        />
      </motion.div>

      <div className="mx-auto min-h-dvh w-full max-w-xl p-4 pt-22 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
