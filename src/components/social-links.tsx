import React from 'react'
import {
  useReducedMotion,
  AnimatePresence,
  Variants,
  motion,
} from 'motion/react'
import {
  IconAt,
  IconCheck,
  IconFileText,
  IconBrandGithub,
  IconBrandLinkedin,
} from '@tabler/icons-react'
import { PreviewCard } from '@base-ui/react/preview-card'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { GitHubContributions } from './github-contributions'
import { LinkedinPreview } from './linkedin-preview'
import { ResumePreview } from './resume-preview'
import { MailPreview } from './mail-preview'

type SocialLinkBase = {
  label: string
  content: React.ReactNode
  contentClassName?: string
  icon: typeof IconAt
}

type CopySocialLink = SocialLinkBase & {
  kind: 'copy'
  value: string
}

type AnchorSocialLink = SocialLinkBase & {
  kind: 'anchor'
  href: string
  external?: boolean
}

type SocialLink = CopySocialLink | AnchorSocialLink

const EMAIL = 'anshoriacc@gmail.com'
const COPY_RESET_DELAY = 2_000

const socialLinks = [
  {
    kind: 'copy',
    label: 'Copy my email',
    content: <MailPreview email={EMAIL} />,
    value: EMAIL,
    icon: IconAt,
  },
  {
    kind: 'anchor',
    label: 'Resume',
    content: <ResumePreview />,
    href: 'https://resume.anshori.com',
    icon: IconFileText,
    external: true,
  },
  {
    kind: 'anchor',
    label: 'GitHub',
    content: <GitHubContributions />,
    href: 'https://github.com/anshoriacc',
    icon: IconBrandGithub,
    external: true,
  },
  {
    kind: 'anchor',
    label: 'LinkedIn',
    content: <LinkedinPreview />,
    href: 'https://linkedin.com/in/achmad-anshori',
    icon: IconBrandLinkedin,
    external: true,
  },
] satisfies SocialLink[]

const socialLinksPreview = PreviewCard.createHandle<SocialLink>()

type SwapMotion = {
  direction: 1 | -1
  reduced: boolean
}

const swapVariants: Variants = {
  initial: ({ direction, reduced }: SwapMotion) => ({
    opacity: 0,
    transform: reduced ? 'translateY(0)' : `translateY(${direction * 4}px)`,
    filter: reduced ? 'blur(0px)' : 'blur(4px)',
  }),
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
    filter: 'blur(0px)',
  },
  exit: ({ direction, reduced }: SwapMotion) => ({
    opacity: 0,
    transform: reduced ? 'translateY(0)' : `translateY(${direction * -4}px)`,
    filter: reduced ? 'blur(0px)' : 'blur(4px)',
  }),
}

const swapTransition = {
  duration: 0.16,
  ease: [0.23, 1, 0.32, 1],
} as const

function CopyEmailTrigger({ link }: { link: CopySocialLink }) {
  const [copied, setCopied] = React.useState(false)
  const [labelWidths, setLabelWidths] = React.useState<{
    mail: number
    copied: number
  }>()
  const resetTimer = React.useRef<number | undefined>(undefined)
  const mailMeasureRef = React.useRef<HTMLSpanElement>(null)
  const copiedMeasureRef = React.useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false

  React.useEffect(() => {
    const updateWidths = () => {
      const mail = mailMeasureRef.current?.getBoundingClientRect().width
      const copiedWidth =
        copiedMeasureRef.current?.getBoundingClientRect().width

      if (
        mail === undefined ||
        copiedWidth === undefined ||
        mail <= 0 ||
        copiedWidth <= 0
      ) {
        return
      }

      setLabelWidths((current) => {
        if (current?.mail === mail && current.copied === copiedWidth) {
          return current
        }

        return { mail, copied: copiedWidth }
      })
    }

    updateWidths()

    const observer = new ResizeObserver(updateWidths)
    if (mailMeasureRef.current) observer.observe(mailMeasureRef.current)
    if (copiedMeasureRef.current) observer.observe(copiedMeasureRef.current)

    return () => observer.disconnect()
  }, [])

  React.useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current)
    },
    [],
  )

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(link.value)
    } catch {
      return
    }

    window.clearTimeout(resetTimer.current)
    setCopied(true)
    resetTimer.current = window.setTimeout(
      () => setCopied(false),
      COPY_RESET_DELAY,
    )
  }

  const direction = copied ? 1 : -1
  const custom: SwapMotion = { direction, reduced: shouldReduceMotion }

  return (
    <Button
      className="gap-1"
      type="button"
      onClick={copyEmail}
      aria-label={copied ? 'Email copied' : 'Copy email address'}
    >
      <span
        className="relative inline-flex h-5 items-center justify-center overflow-hidden align-middle transition-[width] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{
          width: labelWidths
            ? copied
              ? labelWidths.copied
              : labelWidths.mail
            : undefined,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          ref={mailMeasureRef}
          className="invisible absolute inline-flex w-max items-center gap-1 whitespace-nowrap"
          aria-hidden="true"
        >
          <IconAt className="size-4 shrink-0" />
          {link.label}
        </span>

        <span
          ref={copiedMeasureRef}
          className="invisible absolute inline-flex w-max items-center gap-1 whitespace-nowrap"
          aria-hidden="true"
        >
          <IconCheck className="size-4 shrink-0" />
          Copied
        </span>

        {!labelWidths ? (
          <span
            className="invisible inline-flex items-center gap-1 whitespace-nowrap"
            aria-hidden="true"
          >
            <IconAt className="size-4 shrink-0" />
            {link.label}
          </span>
        ) : null}

        <AnimatePresence initial={false} custom={custom}>
          <motion.span
            key={copied ? 'copied' : 'mail'}
            className="absolute inset-0 inline-flex items-center justify-center gap-1 whitespace-nowrap"
            custom={custom}
            variants={swapVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={swapTransition}
          >
            {copied ? (
              <IconCheck className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <IconAt className="size-4 shrink-0" aria-hidden="true" />
            )}
            {copied ? 'Copied' : link.label}
          </motion.span>
        </AnimatePresence>
      </span>
    </Button>
  )
}

function AnchorTrigger({ link }: { link: AnchorSocialLink }) {
  const Icon = link.icon

  return (
    <HoverCardTrigger
      handle={socialLinksPreview}
      payload={link}
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer' : undefined}
      className={cn(
        buttonVariants({ variant: 'secondary' }),
        'gap-1',
        link.external && 'cursor-alias',
      )}
      aria-label={
        link.external ? `${link.label} (opens in a new tab)` : link.label
      }
    >
      <Icon data-icon="inline-start" aria-hidden="true" />
      {link.label}
    </HoverCardTrigger>
  )
}

export const SocialLinks = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((link) =>
        link.kind === 'copy' ? (
          <CopyEmailTrigger key={link.label} link={link} />
        ) : (
          <AnchorTrigger key={link.label} link={link} />
        ),
      )}

      <HoverCard handle={socialLinksPreview}>
        {({ payload }) => (
          <HoverCardContent side="top" sideOffset={8} alignOffset={0}>
            {payload?.content}
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
  )
}
