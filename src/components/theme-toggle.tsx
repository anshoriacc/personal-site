import { AnimatePresence, motion, type Variants } from 'motion/react'
import { IconMoon, IconSun } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { useSetTheme, useTheme } from '@/stores/theme.store'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
}

const ICON_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
}

const ICON_TRANSITION = {
  duration: 0.1,
  ease: [0.23, 1, 0.32, 1],
} as const

export const ThemeToggle = ({ className }: Props) => {
  const theme = useTheme()
  const setTheme = useSetTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={cn(
        'text-muted-foreground hover:text-foreground aspect-square size-7 h-fit rounded-md border-0 p-0 transition-[color,background-color,transform] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none',
        className,
      )}
    >
      <span className="inline-grid size-5 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            variants={ICON_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={ICON_TRANSITION}
            className="col-start-1 row-start-1 flex items-center justify-center"
          >
            <span className="flex items-center justify-center transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/button:rotate-6">
              {theme === 'dark' ? (
                <IconMoon aria-hidden="true" stroke={2} className="size-5" />
              ) : (
                <IconSun aria-hidden="true" stroke={2} className="size-5" />
              )}
            </span>
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
