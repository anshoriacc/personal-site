import React from 'react'
import { Link, RouterState, useRouterState } from '@tanstack/react-router'
import { IconFolderCode, IconHome } from '@tabler/icons-react'
import {
  useReducedMotion,
  AnimatePresence,
  type Variants,
  MotionConfig,
  motion,
} from 'motion/react'

import { cn } from '@/lib/utils'
import { useMounted } from '@/hooks/use-mounted'
import { ThemeToggle } from './theme-toggle'
import { Clock } from './clock'

type IslandState = {
  expanded: boolean
  instant: boolean
}

type RevealMotion = {
  instant: boolean
  reduced: boolean
}

const SITE_NAVIGATION_ID = 'site-navigation'
const HOVER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)'
const HOVER_CLOSE_DELAY_MS = 80
const EASE_OUT = [0.23, 1, 0.32, 1] as const

const ISLAND_TRANSITION = {
  type: 'spring',
  duration: 0.5,
  bounce: 0.2,
} as const

const REVEAL_VARIANTS: Variants = {
  hidden: ({ instant, reduced }: RevealMotion) => ({
    opacity: 0,
    transition: {
      duration: instant ? 0 : reduced ? 0.12 : 0.1,
      ease: EASE_OUT,
    },
  }),
  visible: ({ instant, reduced }: RevealMotion) => ({
    opacity: 1,
    transition: {
      delay: instant || reduced ? 0 : 0.04,
      duration: instant ? 0 : reduced ? 0.12 : 0.16,
      ease: EASE_OUT,
    },
  }),
}

const MENU_ITEMS = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/work', label: 'Work', icon: IconFolderCode },
] as const

const canUseHover = () => window.matchMedia(HOVER_MEDIA_QUERY).matches

export const Header = () => {
  const routerStatus = useRouterState({
    select: (state: RouterState) => state.status,
  })

  const [islandState, setIslandState] = React.useState<IslandState>({
    expanded: false,
    instant: true,
  })
  const isMounted = useMounted()
  const shouldReduceMotion = useReducedMotion()

  const { expanded: isExpanded, instant } = islandState
  const revealMotion: RevealMotion = {
    instant,
    reduced: Boolean(shouldReduceMotion),
  }
  const shellTransition =
    instant || shouldReduceMotion ? { duration: 0 } : ISLAND_TRANSITION

  const headerRef = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const openedWithKeyboardRef = React.useRef(false)

  const setExpanded = React.useCallback(
    (expanded: boolean, nextInstant = false) => {
      setIslandState((current) => {
        if (current.expanded === expanded) return current

        return { expanded, instant: nextInstant }
      })
    },
    [],
  )

  const clearHoverTimeout = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  const handlePointerEnter = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch' || !canUseHover()) return

      clearHoverTimeout()
      openedWithKeyboardRef.current = false
      setExpanded(true)
    },
    [clearHoverTimeout, setExpanded],
  )

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch' || !canUseHover()) return

      clearHoverTimeout()
      hoverTimeoutRef.current = setTimeout(() => {
        hoverTimeoutRef.current = null

        const header = headerRef.current
        const keyboardFocusIsInside =
          openedWithKeyboardRef.current &&
          Boolean(header?.contains(document.activeElement))

        if (!header?.matches(':hover') && !keyboardFocusIsInside) {
          setExpanded(false)
        }
      }, HOVER_CLOSE_DELAY_MS)
    },
    [clearHoverTimeout, setExpanded],
  )

  const handleTriggerClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const isKeyboardClick = event.detail === 0
      openedWithKeyboardRef.current = isKeyboardClick
      clearHoverTimeout()
      setExpanded(!isExpanded, isKeyboardClick)
    },
    [clearHoverTimeout, isExpanded, setExpanded],
  )

  const handleBlurCapture = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget

      if (nextTarget && event.currentTarget.contains(nextTarget)) return

      openedWithKeyboardRef.current = false

      if (!event.currentTarget.matches(':hover')) {
        setExpanded(false, true)
      }
    },
    [setExpanded],
  )

  React.useEffect(() => {
    if (!isExpanded) return

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        clearHoverTimeout()
        openedWithKeyboardRef.current = false
        setExpanded(false)
      }
    }

    const handleScroll = () => {
      if (!canUseHover()) {
        clearHoverTimeout()
        openedWithKeyboardRef.current = false
        setExpanded(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      const shouldRestoreFocus = headerRef.current?.contains(
        document.activeElement,
      )

      clearHoverTimeout()
      openedWithKeyboardRef.current = false
      setExpanded(false, true)

      if (shouldRestoreFocus) {
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }

    document.addEventListener('pointerdown', handlePointerDownOutside, true)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDownOutside,
        true,
      )
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [clearHoverTimeout, isExpanded, setExpanded])

  React.useEffect(() => clearHoverTimeout, [clearHoverTimeout])

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        layoutRoot
        className="dark group pointer-events-none fixed top-6 left-0 z-10 flex w-full cursor-default select-none"
      >
        <div className="mx-auto flex">
          <motion.header
            ref={headerRef}
            layout
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerDownCapture={() => {
              openedWithKeyboardRef.current = false
            }}
            onBlurCapture={handleBlurCapture}
            transition={{ layout: shellTransition }}
            style={{ borderRadius: 14 }}
            className={cn(
              'pointer-events-auto flex min-h-10 w-fit gap-4 overflow-hidden bg-black text-neutral-50 shadow-md',
              'box-border border border-white/5 bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
            )}
          >
            <div
              className={cn('relative grid', isExpanded ? 'w-50' : 'w-auto')}
            >
              <motion.button
                ref={triggerRef}
                layout="position"
                type="button"
                aria-label={isExpanded ? 'Close Site Menu' : 'Open Site Menu'}
                aria-expanded={isExpanded}
                aria-controls={SITE_NAVIGATION_ID}
                onClick={handleTriggerClick}
                style={{ borderRadius: 14 }}
                className={cn(
                  'group/header-trigger z-10 col-start-1 row-start-1 flex h-10 shrink-0 touch-manipulation items-center py-1.5 pr-3 pl-1.5 text-left focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:outline-none focus-visible:ring-inset',
                  isExpanded ? 'w-full' : 'w-fit',
                )}
              >
                <span className="transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] group-active/header-trigger:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none">
                  <motion.span
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                      filter: 'blur(4px)',
                    }}
                    animate={
                      isMounted
                        ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                        : {
                            opacity: 0,
                            scale: 0.96,
                            filter: 'blur(4px)',
                          }
                    }
                    transition={{
                      type: 'spring',
                      duration: shouldReduceMotion ? 0 : 0.24,
                      bounce: 0,
                      delay: shouldReduceMotion ? 0 : 0.05,
                    }}
                    className="flex items-center gap-2"
                  >
                    <Clock />
                    <LoadingText isPending={routerStatus === 'pending'} />
                  </motion.span>
                </span>
              </motion.button>

              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={revealMotion}
              >
                {isExpanded ? (
                  <motion.div
                    key="expanded-content"
                    custom={revealMotion}
                    variants={REVEAL_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="pointer-events-none relative z-20 col-start-1 row-start-1 flex w-50 flex-col"
                  >
                    <div className="flex h-10 items-center justify-end pr-1.5">
                      <div className="pointer-events-auto flex shrink-0">
                        <ThemeToggle />
                      </div>
                    </div>

                    <nav
                      id={SITE_NAVIGATION_ID}
                      aria-label="Primary"
                      className={cn(
                        'pointer-events-auto relative flex flex-col gap-1 border-t border-t-white/20 p-1.5 text-sm',
                        '*:flex *:items-center *:gap-2 *:rounded-md *:p-1.5',
                      )}
                    >
                      {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          activeProps={{
                            className: 'text-foreground bg-muted',
                          }}
                          inactiveProps={{
                            className:
                              'hover:text-foreground text-muted-foreground',
                          }}
                          onClick={(event) => {
                            setExpanded(false, event.detail === 0)
                          }}
                        >
                          <Icon aria-hidden="true" className="size-4" />
                          {label}
                        </Link>
                      ))}
                    </nav>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.header>
        </div>
      </motion.div>
    </MotionConfig>
  )
}

const LoadingText = ({ isPending }: { isPending: boolean }) => {
  const mounted = useMounted()

  return (
    <span className="inline-grid font-semibold">
      <span
        className="text-muted-foreground col-start-1 row-start-1 select-none"
        aria-hidden="true"
      >
        anshori
      </span>

      {mounted ? (
        <motion.span
          initial={false}
          className="text-foreground col-start-1 row-start-1"
          animate={{
            clipPath: isPending ? 'inset(0 80% 0 0)' : 'inset(0 0% 0 0)',
          }}
          transition={{
            duration: isPending ? 0 : 0.2,
            ease: EASE_OUT,
          }}
        >
          anshori
        </motion.span>
      ) : null}
    </span>
  )
}
