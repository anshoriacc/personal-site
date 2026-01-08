import type { PropsWithChildren } from 'react'
import { motion } from 'motion/react'

const variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

type Props = PropsWithChildren<{}>

export const Section = ({ children }: Props) => {
  return <motion.div variants={variants}>{children}</motion.div>
}
