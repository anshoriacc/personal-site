import React from 'react'
import { motion, MotionConfig } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { CodeFolderIcon, Home11Icon } from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { ThemeToggle } from './theme-toggle'
import { Clock } from './clock'

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

  const headerRef = React.useRef<HTMLElement>(null)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const isHoveringRef = React.useRef(false)

  const handleViewChange = React.useCallback(
    (newView: ViewState) => {
      if (newView === view) return
      setVariantKey(`${view}-${newView}`)
      setView(newView)
    },
    [view],
  )

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
    if (view !== 'expanded') return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        handleViewChange('idle')
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [view, handleViewChange])

  const renderContent = (viewState: ViewState) => {
    if (viewState === 'idle') {
      return (
        <div className="flex h-full items-center gap-2 p-1.5">
          <Clock />
          <span className="mr-1.5 font-semibold">anshori</span>
        </div>
      )
    }

    return (
      <div className="flex w-50 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-b-white/20 p-1.5">
          <div className="flex items-center gap-2">
            <Clock />
            <span className="font-semibold">anshori</span>
          </div>

          <ThemeToggle />
        </div>

        {/* below is for the menu */}
        <div
          className={cn(
            'space-y-1 p-1.5 text-sm',
            '*:flex *:items-center *:gap-2 *:rounded-md *:p-1.5',
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
            to="/work"
            activeProps={{ className: 'text-foreground bg-muted' }}
            inactiveProps={{
              className: 'hover:text-foreground text-muted-foreground',
            }}
          >
            <HugeiconsIcon icon={CodeFolderIcon} className="size-4" />
            Work
          </Link>
        </div>
      </div>
    )
  }

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}>
      <motion.div className="dark group pointer-events-none fixed top-6 left-0 z-1 flex w-full cursor-default select-none">
        <motion.header
          ref={headerRef}
          // drag // for development purpose
          dragConstraints={constraintsRef}
          layout
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (isMobile && view === 'idle') {
              handleViewChange('expanded')
            }
          }}
          transition={{
            type: 'spring',
            bounce: BOUNCE_VARIANTS[variantKey] ?? 0.35,
          }}
          style={{ borderRadius: 14 }}
          className={cn(
            'pointer-events-auto mx-auto flex min-h-10 w-fit gap-4 overflow-hidden bg-black text-neutral-50 shadow-md',
            'box-border border border-white/5 bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
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
