import { motion } from 'motion/react'
import { Moon02Icon, SunIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import { useTheme, useSetTheme } from '@/stores/theme.store'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

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
      render={
        <motion.div
          className={cn(
            'p-0 aspect-square rounded-full! size-6 h-fit border-0 text-muted-foreground hover:text-foreground',
            className,
          )}
        />
      }
    >
      <motion.span
        key={theme}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.3 }}
        whileHover={{ rotate: [0, -15, 6, -1, 0] }}
        className="flex items-center justify-center"
      >
        <HugeiconsIcon
          icon={theme === 'dark' ? Moon02Icon : SunIcon}
          strokeWidth={2}
          className="size-6"
        />
      </motion.span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
