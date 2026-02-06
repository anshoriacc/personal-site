import type { Variants } from 'motion/react'
import { motion } from 'motion/react'

// Hoisted static variants object - defined once at module level
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

type Props = React.PropsWithChildren<{ className?: string }>

export const Section = ({ children, className }: Props) => {
  return (
    <motion.div variants={sectionVariants} className={className}>
      {children}
    </motion.div>
  )
}
