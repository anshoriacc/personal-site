import React from 'react'
import {
  motion,
  MotionConfig,
  // AnimatePresence
} from 'motion/react'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { ThemeToggle } from './theme-toggle'
import { Clock } from './clock'
import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { CodeFolderIcon, Home11Icon } from '@hugeicons/core-free-icons'

type Props = {
  constraintsRef?: React.RefObject<HTMLDivElement | HTMLBodyElement>
}

type ViewState = 'idle' | 'expanded'

// Animation variants for different transitions
// const ANIMATION_VARIANTS: Record<
//   string,
//   { scale?: number; scaleX?: number; y?: number }
// > = {
//   'expanded-idle': {
//     scale: 0.9,
//     scaleX: 0.9,
//   },
//   'idle-expanded': {
//     scale: 1.1,
//     y: 2,
//   },
// }

// Bounce values for different states
const BOUNCE_VARIANTS: Record<string, number> = {
  idle: 0.5,
  expanded: 0.35,
  'expanded-idle': 0.5,
  'idle-expanded': 0.35,
}

// Exit animation variants
// const exitVariants = {
//   exit: (transition: any) => {
//     return {
//       ...transition,
//       opacity: [1, 0],
//       filter: 'blur(5px)',
//     }
//   },
// }

export const Header = ({ constraintsRef }: Props) => {
  const [view, setView] = React.useState<ViewState>('idle')
  const [variantKey, setVariantKey] = React.useState<string>('idle')
  const isMobile = useIsMobile()

  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const isHoveringRef = React.useRef(false)

  const handleViewChange = (newView: ViewState) => {
    if (newView === view) return

    setView(newView)
    setVariantKey(`${view}-${newView}`)
  }

  const handleMouseEnter = () => {
    if (isMobile) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    isHoveringRef.current = true
    handleViewChange('expanded')
  }

  const handleMouseLeave = () => {
    if (isMobile) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    isHoveringRef.current = false

    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        handleViewChange('idle')
      }
    }, 50)
  }

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const renderContent = (viewState: ViewState) => {
    if (viewState === 'idle') {
      return (
        <div className="flex items-center gap-2 h-full p-1.5">
          <Clock />
          <span className="font-semibold mr-1.5">anshori</span>
        </div>
      )
    }

    return (
      <div className="flex flex-col w-50">
        <div className="flex items-center justify-between gap-4 p-3 border-b border-b-white/20">
          <div className="flex items-center gap-2">
            <Clock className="size-6" />
            <span className="font-semibold">anshori</span>
          </div>

          <ThemeToggle className="dark" />
        </div>

        {/* below is for the menu */}
        <div
          className={cn(
            'text-sm p-1.5  space-y-1 dark',
            '*:flex *:items-center *:gap-2 *:px-3 *:py-1.5 *:rounded-[18px]',
          )}
        >
          <Link
            to="/"
            activeProps={{ className: 'text-foreground bg-muted' }}
            inactiveProps={{
              className: 'hover:text-foreground text-muted-foreground',
            }}
          >
            <HugeiconsIcon icon={Home11Icon} className="size-4" />
            Home
          </Link>

          <Link
            to="/projects"
            activeProps={{ className: 'text-foreground bg-muted' }}
            inactiveProps={{
              className: 'hover:text-foreground text-muted-foreground',
            }}
          >
            <HugeiconsIcon icon={CodeFolderIcon} className="size-4" />
            Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}>
      <motion.div className="pointer-events-none select-none fixed top-6 left-0 z-1 flex w-full group cursor-default">
        <motion.header
          // drag // for development purpose
          dragConstraints={constraintsRef}
          layout
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => {
            if (isMobile && e.target === e.currentTarget) {
              handleViewChange(view === 'idle' ? 'expanded' : 'idle')
            }
          }}
          transition={{
            type: 'spring',
            bounce: BOUNCE_VARIANTS[variantKey] ?? 0.35,
          }}
          style={{ borderRadius: 21 }}
          className={cn(
            'pointer-events-auto mx-auto flex min-h-10 w-fit gap-4 bg-black text-neutral-50 shadow-md overflow-hidden',
            'border-white/5 border box-border bg-clip-padding backdrop-blur-md backdrop-saturate-100 backdrop-brightness-100',
          )}
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: 'blur(5px)',
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              originX: 0.5,
              originY: 0.5,
              transition: {
                delay: 0.05,
              },
            }}
            transition={{
              type: 'spring',
              bounce: BOUNCE_VARIANTS[view] ?? 0.35,
            }}
            key={view}
          >
            {renderContent(view)}
          </motion.div>
        </motion.header>

        {/* Absolute positioned wrapper for exit animations */}
        {/* <div className="pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[400px] -translate-x-1/2 items-start justify-center overflow-hidden pt-6">
          <AnimatePresence
            custom={ANIMATION_VARIANTS[variantKey]}
            mode="popLayout"
          >
            {lastView !== view && (
              <motion.div
                variants={exitVariants}
                initial={{
                  opacity: 0,
                }}
                exit="exit"
                custom={ANIMATION_VARIANTS[variantKey]}
                transition={{
                  type: 'spring',
                  bounce: BOUNCE_VARIANTS[variantKey] ?? 0.35,
                }}
                key={lastView}
                style={{ borderRadius: 24 }}
                className={cn(
                  'flex min-h-10 w-fit gap-4 bg-black p-1.5 text-neutral-50 shadow-md',
                  'border-white/5 border box-border bg-clip-padding backdrop-blur-md backdrop-saturate-100 backdrop-brightness-100',
                )}
              >
                {renderContent(lastView)}
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}
      </motion.div>
    </MotionConfig>
  )
}
