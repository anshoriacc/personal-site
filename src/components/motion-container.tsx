import type { Variants } from 'motion/react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

// Hoisted static variants object - defined once at module level
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

type Props = React.PropsWithChildren<{
  className?: string
}>

export const Container = ({ children, className }: Props) => {
  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn('space-y-12', className)}
    >
      {children}
    </motion.main>
  )
}
