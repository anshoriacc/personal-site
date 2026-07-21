import React from 'react'
import {
  Link,
  RouterState,
  useCanGoBack,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { IconChevronLeft, IconFolderCode, IconHome } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { useMounted } from '@/hooks/use-mounted'
import { ThemeToggle } from './theme-toggle'
import { Clock } from './clock'

type Props = {
  constraintsRef?: React.RefObject<HTMLDivElement | HTMLBodyElement>
}

type ViewState = 'idle' | 'expanded'

type IslandState = {
  view: ViewState
  instant: boolean
}

type RevealMotion = {
  instant: boolean
  reduced: boolean
}

const SITE_NAVIGATION_ID = 'site-navigation'
const HOVER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)'
const EASE_OUT = [0.23, 1, 0.32, 1] as const

const SHELL_TRANSITIONS = {
  expanded: { type: 'spring', duration: 0.32, bounce: 0.12 },
  idle: { type: 'spring', duration: 0.24, bounce: 0.04 },
} as const

const REVEAL_VARIANTS: Variants = {
  hidden: ({ instant, reduced }: RevealMotion) => ({
    opacity: 0,
    filter: reduced ? 'blur(0px)' : 'blur(2px)',
    transition: {
      duration: instant ? 0 : reduced ? 0.12 : 0.1,
      ease: EASE_OUT,
    },
  }),
  visible: ({ instant, reduced }: RevealMotion) => ({
    opacity: 1,
    filter: 'blur(0px)',
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

export const Header = ({ constraintsRef }: Props) => {
  const canGoBack = useCanGoBack()
  const router = useRouter()
  const routerStatus = useRouterState({
    select: (state: RouterState) => state.status,
  })

  const [islandState, setIslandState] = React.useState<IslandState>({
    view: 'idle',
    instant: true,
  })
  const isMounted = useMounted()
  const canHover = useCanHover()
  const shouldReduceMotion = useReducedMotion()

  const { view } = islandState
  const isExpanded = view === 'expanded'
  const revealMotion: RevealMotion = {
    instant: islandState.instant,
    reduced: Boolean(shouldReduceMotion),
  }
  const shellTransition =
    islandState.instant || shouldReduceMotion
      ? { duration: 0 }
      : SHELL_TRANSITIONS[view]

  const headerRef = React.useRef<HTMLElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const isHoveringRef = React.useRef(false)
  const preserveFocusOnLeaveRef = React.useRef(false)
  const pointerRef = React.useRef({ x: -Infinity, y: -Infinity })

  const handleViewChange = React.useCallback(
    (newView: ViewState, instant = false) => {
      setIslandState((current) => {
        if (current.view === newView) return current

        return { view: newView, instant }
      })
    },
    [],
  )

  const handlePointerEnter = React.useCallback(
    (event?: React.PointerEvent<HTMLElement>) => {
      if (!canHover || event?.pointerType === 'touch') return

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      isHoveringRef.current = true
      handleViewChange('expanded')
    },
    [canHover, handleViewChange],
  )

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!canHover || event.pointerType === 'touch') return

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      isHoveringRef.current = false

      hoverTimeoutRef.current = setTimeout(() => {
        const activeElement = document.activeElement
        const focusIsInside = headerRef.current?.contains(activeElement)
        const expandedControlHasFocus =
          focusIsInside && activeElement !== triggerRef.current

        if (
          !isHoveringRef.current &&
          !(
            focusIsInside &&
            (preserveFocusOnLeaveRef.current || expandedControlHasFocus)
          )
        ) {
          handleViewChange('idle')
        }
      }, 50)
    },
    [canHover, handleViewChange],
  )

  const handleTriggerClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const isKeyboardClick = event.detail === 0
      preserveFocusOnLeaveRef.current = isKeyboardClick

      handleViewChange(isExpanded ? 'idle' : 'expanded', isKeyboardClick)
    },
    [handleViewChange, isExpanded],
  )

  const handleTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      preserveFocusOnLeaveRef.current = true
      handleViewChange(isExpanded ? 'idle' : 'expanded', true)
    },
    [handleViewChange, isExpanded],
  )

  const handleBlurCapture = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget

      if (nextTarget && event.currentTarget.contains(nextTarget)) return

      preserveFocusOnLeaveRef.current = false

      if (!isHoveringRef.current) {
        handleViewChange('idle', true)
      }
    },
    [handleViewChange],
  )

  // When the back button finishes collapsing, the header slides under a
  // stationary cursor. Browsers don't fire pointerenter for layout shifts, so
  // re-check the click position and expand if it's now hovering the header.
  const handleBackExitComplete = React.useCallback(() => {
    if (!canHover) return

    const rect = headerRef.current?.getBoundingClientRect()
    if (!rect) return

    const { x, y } = pointerRef.current
    const isPointerOverHeader =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    if (isPointerOverHeader) {
      handlePointerEnter()
    }
  }, [canHover, handlePointerEnter])

  React.useEffect(() => {
    if (!isExpanded) return

    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        handleViewChange('idle')
      }
    }

    const handleScroll = () => {
      if (!canHover) {
        handleViewChange('idle')
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      const shouldRestoreFocus = headerRef.current?.contains(
        document.activeElement,
      )

      handleViewChange('idle', true)

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
  }, [canHover, handleViewChange, isExpanded])

  React.useEffect(
    () => () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    },
    [],
  )

  const handleBackClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      router.history.back()
    },
    [router],
  )

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        layoutRoot
        className="dark group pointer-events-none fixed top-6 left-0 z-10 flex w-full cursor-default select-none"
      >
        <div className="mx-auto flex">
          <AnimatePresence
            mode="popLayout"
            initial={false}
            onExitComplete={handleBackExitComplete}
          >
            {isMounted && canGoBack && !isExpanded ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 42, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: shouldReduceMotion ? 0 : 0.2,
                }}
                className="pointer-events-auto aspect-square p-1.25"
              >
                <motion.button
                  initial={{
                    scale: 0.96,
                    opacity: 0,
                    filter: 'blur(4px)',
                    x: -5,
                  }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', x: 0 }}
                  exit={{
                    scale: 0.96,
                    opacity: 0,
                    filter: 'blur(4px)',
                    x: -5,
                  }}
                  transition={{
                    type: 'spring',
                    bounce: 0,
                    duration: shouldReduceMotion ? 0 : 0.2,
                  }}
                  onClick={handleBackClick}
                  aria-label="Go Back"
                  style={{ borderRadius: 10 }}
                  className={cn(
                    'flex size-8 items-center justify-center bg-black text-neutral-50 shadow-md',
                    'box-border border border-white/5 bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
                    'touch-manipulation transition-colors hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:outline-none',
                  )}
                >
                  <IconChevronLeft aria-hidden="true" className="size-5" />
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.header
            ref={headerRef}
            // drag // for development purpose
            dragConstraints={constraintsRef}
            layout
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerDownCapture={() => {
              preserveFocusOnLeaveRef.current = false
            }}
            onBlurCapture={handleBlurCapture}
            transition={{ layout: shellTransition }}
            style={{ borderRadius: 14 }}
            className={cn(
              'pointer-events-auto flex min-h-10 w-fit gap-4 overflow-hidden bg-black text-neutral-50 shadow-md',
              'box-border border border-white/5 bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
            )}
          >
            <motion.div
              layout
              className={cn(
                'relative flex flex-col',
                isExpanded ? 'w-50' : 'w-auto',
              )}
            >
              <motion.div
                layout
                className="relative flex items-center justify-between"
              >
                <motion.button
                  ref={triggerRef}
                  layout="position"
                  type="button"
                  aria-label={isExpanded ? 'Close Site Menu' : 'Open Site Menu'}
                  aria-expanded={isExpanded}
                  aria-controls={SITE_NAVIGATION_ID}
                  onClick={handleTriggerClick}
                  onKeyDown={handleTriggerKeyDown}
                  style={{ borderRadius: 14 }}
                  className="flex h-10 shrink-0 touch-manipulation items-center py-1.5 pr-3 pl-1.5 text-left focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:outline-none focus-visible:ring-inset"
                >
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
                </motion.button>

                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={revealMotion}
                >
                  {isExpanded ? (
                    <motion.div
                      key="theme-toggle"
                      layout="position"
                      custom={revealMotion}
                      variants={REVEAL_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="mr-1.5 flex shrink-0"
                    >
                      <ThemeToggle />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={revealMotion}
              >
                {isExpanded ? (
                  <motion.nav
                    key={SITE_NAVIGATION_ID}
                    id={SITE_NAVIGATION_ID}
                    aria-label="Primary"
                    layout
                    custom={revealMotion}
                    variants={REVEAL_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={cn(
                      'relative flex flex-col gap-1 border-t border-t-white/20 p-1.5 text-sm',
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
                          handleViewChange('idle', event.detail === 0)
                        }}
                      >
                        <Icon aria-hidden="true" className="size-4" />
                        {label}
                      </Link>
                    ))}
                  </motion.nav>
                ) : null}
              </AnimatePresence>
            </motion.div>
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

const useCanHover = (): boolean => {
  const [canHover, setCanHover] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(HOVER_MEDIA_QUERY)
    const syncCanHover = () => setCanHover(mediaQuery.matches)

    syncCanHover()
    mediaQuery.addEventListener('change', syncCanHover)

    return () => mediaQuery.removeEventListener('change', syncCanHover)
  }, [])

  return canHover
}
