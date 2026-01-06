import React from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/(home)/_layout')({
  component: HomeLayout,
})

function HomeLayout() {
  const constraintsRef = React.useRef<HTMLDivElement>(null!)

  return (
    <div
      ref={constraintsRef}
      className="relative min-h-dvh w-dvw cursor-default overflow-x-hidden overflow-y-visible select-none"
    >
      {/* Gradient Background */}
      <motion.div
        initial={{ scale: 0.6, y: '-100%', opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'top center' }}
        className="pointer-events-none absolute inset-0 z-0"
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

      <div className="mx-auto flex size-full max-w-xl flex-col p-4 pt-22">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
