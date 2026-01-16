import React from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Link, useCanGoBack, useRouter } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CodeFolderIcon,
  Home11Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { ThemeToggle } from './theme-toggle'
import { Clock } from './clock'

type Props = {
  constraintsRef?: React.RefObject<HTMLDivElement | HTMLBodyElement>
}

type ViewState = 'idle' | 'expanded'

const BOUNCE_VARIANTS: Record<string, number> = {
  idle: 0.5,
  expanded: 0.3,
  'expanded-idle': 0.5,
  'idle-expanded': 0.3,
}

const MENU_ITEMS = [
  { to: '/', label: 'Home', icon: Home11Icon },
  { to: '/work', label: 'Work', icon: CodeFolderIcon },
] as const

export const Header = ({ constraintsRef }: Props) => {
  const canGoBack = useCanGoBack()
  const router = useRouter()

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

  const handleMouseEnter = React.useCallback(() => {
    if (isMobile) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    isHoveringRef.current = true
    handleViewChange('expanded')
  }, [isMobile, handleViewChange])

  const handleMouseLeave = React.useCallback(() => {
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
  }, [isMobile, handleViewChange])

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

    const handleScroll = () => {
      if (isMobile) {
        handleViewChange('idle')
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      window.removeEventListener('scroll', handleScroll)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [view, handleViewChange, isMobile])

  const renderContent = React.useCallback((viewState: ViewState) => {
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

        <nav
          className={cn(
            'space-y-1 p-1.5 text-sm',
            '*:flex *:items-center *:gap-2 *:rounded-md *:p-1.5',
          )}
        >
          {MENU_ITEMS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: 'text-foreground bg-muted' }}
              inactiveProps={{
                className: 'hover:text-foreground text-muted-foreground',
              }}
            >
              <HugeiconsIcon icon={icon} className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    )
  }, [])

  const handleBackClick = React.useCallback(() => {
    router.history.back()
  }, [router])

  const handleHeaderClick = React.useCallback(() => {
    if (isMobile && view === 'idle') {
      handleViewChange('expanded')
    }
  }, [isMobile, view, handleViewChange])

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2, duration: 0.2 }}>
      <motion.div className="dark group pointer-events-none fixed top-6 left-0 z-10 flex w-full cursor-default select-none">
        <div className="mx-auto flex">
          <AnimatePresence mode="popLayout" initial={false}>
            {canGoBack && view ==='idle'  && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 42, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.35, duration: 0.2 }}
                className="pointer-events-auto aspect-square p-1.25"
              >
                <motion.button
                  initial={{
                    scale: 0.9,
                    opacity: 0,
                    filter: 'blur(4px)',
                    x: -5,
                  }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', x: 0 }}
                  exit={{ scale: 0.9, opacity: 0, filter: 'blur(4px)', x: -5 }}
                  transition={{ type: 'spring', bounce: 0.35, duration: 0.2 }}
                  onClick={handleBackClick}
                  style={{ borderRadius: 10 }}
                  className={cn(
                    'flex size-8 items-center justify-center bg-black text-neutral-50 shadow-md',
                    'box-border border border-white/5 bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
                    'transition-colors hover:bg-neutral-900',
                  )}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.header
            ref={headerRef}
            // drag // for development purpose
            dragConstraints={constraintsRef}
            layout
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleHeaderClick}
            transition={{
              type: 'spring',
              bounce: BOUNCE_VARIANTS[variantKey] ?? 0.3,
            }}
            style={{ borderRadius: 14 }}
            className={cn(
              'pointer-events-auto flex min-h-10 w-fit gap-4 overflow-hidden bg-black text-neutral-50 shadow-md',
              'box-border border border-white/5 bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
            )}
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
                filter: 'blur(4px)',
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
                bounce: BOUNCE_VARIANTS[view] ?? 0.3,
              }}
              key={view}
            >
              {renderContent(view)}
            </motion.div>
          </motion.header>
        </div>
      </motion.div>
    </MotionConfig>
  )
}
