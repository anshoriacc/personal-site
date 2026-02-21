import { motion, useReducedMotion, type Variants } from 'motion/react'

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

type ContainerProps = React.PropsWithChildren<{
  className?: string
  as?: 'div' | 'main' | 'section'
  delay?: number
}>

export const MotionContainer = ({
  children,
  className,
  as = 'div',
  delay = 0,
}: ContainerProps) => {
  const shouldReduceMotion = useReducedMotion()

  const Component = motion[as]

  return (
    <Component
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      animate="show"
      className={className}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  )
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: 'blur(4px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'tween',
      duration: 0.2,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

type ItemProps = React.PropsWithChildren<{
  className?: string
  as?: 'div' | 'li' | 'article' | 'span' | 'section'
}>

export const MotionItem = ({ children, className, as = 'div' }: ItemProps) => {
  const shouldReduceMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      variants={shouldReduceMotion ? undefined : itemVariants}
      className={className}
    >
      {children}
    </Component>
  )
}
