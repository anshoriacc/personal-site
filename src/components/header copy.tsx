import React from 'react'
import { motion, MotionConfig } from 'motion/react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { ThemeToggle } from './theme-toggle'

export const Header = () => {
  const [isHovered, setIsHovered] = React.useState(false)
  const isMobile = useIsMobile()

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}>
      <div className="pointer-events-none fixed top-6 left-0 z-404 flex w-full dark">
        <motion.header
          layout
          onHoverStart={() => !isMobile && setIsHovered(true)}
          onHoverEnd={() => !isMobile && setIsHovered(false)}
          onClick={(e) => {
            if (isMobile && e.target === e.currentTarget) {
              setIsHovered(!isHovered)
            }
          }}
          style={{ borderRadius: 24 }}
          className={cn(
            'pointer-events-auto mx-auto flex min-h-9.5 w-fit gap-4 bg-black p-2.5 text-neutral-50 shadow-md',
            'border border-white/10 box-border bg-clip-padding backdrop-blur-md backdrop-saturate-100 backdrop-brightness-100',
          )}
        >
          <motion.div
            initial={false}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
            }}
            key={isHovered ? 'expanded' : 'collapsed'}
          >
            {!isHovered ? (
              <motion.div layoutId="logo">
                <svg className="pointer-events-auto h-5 w-20 fill-neutral-50">
                  <text
                    x={2}
                    y={17}
                    className={cn('stroke-2 text-xl font-black')}
                    paintOrder="stroke fill"
                  >
                    anshori
                    <tspan className="fill-red-500 stroke-none">.</tspan>
                  </text>
                </svg>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2.5 size-50">
                <div className="flex h-5 items-center justify-between gap-4">
                  <motion.div layoutId="logo">
                    <Link to="/" className="flex items-center overflow-hidden">
                      <svg className="pointer-events-none h-5 w-20 fill-neutral-50">
                        <text
                          x={2}
                          y={17}
                          className={cn('stroke-2 text-xl font-black')}
                          paintOrder="stroke fill"
                        >
                          anshori
                          <tspan className="fill-red-500 stroke-none">.</tspan>
                        </text>
                      </svg>
                    </Link>
                  </motion.div>

                  <ThemeToggle />
                </div>

                <div className="h-px w-full rounded-full bg-white/10" />
              </div>
            )}
          </motion.div>
        </motion.header>
      </div>
    </MotionConfig>
  )
}
