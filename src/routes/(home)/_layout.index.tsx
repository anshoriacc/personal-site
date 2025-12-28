import { motion } from 'motion/react'
import { createFileRoute } from '@tanstack/react-router'

import { getCurrentlyPlayingQueryOptions } from '@/hooks/api/spotify'
import { getGithubContributionsQueryOptions } from '@/hooks/api/github-contributions'
import { GitHubContributions } from '@/components/github-contributions'
import { Profile } from '@/components/profile'
import { Spotify } from '@/components/spotify'

export const Route = createFileRoute('/(home)/_layout/')({
  component: HomePage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getGithubContributionsQueryOptions,
    )
    await context.queryClient.ensureQueryData(getCurrentlyPlayingQueryOptions)
  },
})

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

function HomePage() {
  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col space-y-12"
    >
      <motion.div variants={item}>
        <Profile />
      </motion.div>

      <motion.div variants={item}>
        <GitHubContributions />
      </motion.div>

      <motion.div variants={item}>
        <Spotify />
      </motion.div>
    </motion.main>
  )
}
