import type { PropsWithChildren } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

const variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

type Props = PropsWithChildren<{
  className?: string
}>

export const Container = ({ children, className }: Props) => {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="show"
      className={cn('space-y-12', className)}
    >
      {children}
    </motion.main>
  )
}
