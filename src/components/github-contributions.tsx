import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { getGithubContributionsQueryOptions } from '@/hooks/api/github-contributions'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

export const GitHubContributions = () => {
  const githubContributionsQuery = useQuery(getGithubContributionsQueryOptions)

  const today = dayjs()
  const oneYearAgo = today.subtract(365, 'day')

  const contributions =
    githubContributionsQuery.data?.contributions
      ?.filter((contribution) => {
        const date = dayjs(contribution.date)
        return date.isAfter(oneYearAgo) && date.isBefore(today.add(1, 'day'))
      })
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date))) || []

  const firstDate = contributions[0]?.date
  const firstDayOfWeek = firstDate ? dayjs(firstDate).day() : 0 // 0 = Sunday
  const emptyDays = firstDayOfWeek

  const lastYearContributions = [
    ...Array(emptyDays).fill(null),
    ...contributions,
  ]

  return githubContributionsQuery.data ? (
    <div className="flex flex-col gap-2 overflow-scroll">
      <h2>GitHub Contributions</h2>

      <ScrollArea>
        <div className="grid grid-rows-7 grid-flow-col gap-0.5">
          {lastYearContributions.map((contribution, index) =>
            contribution ? (
              <span
                key={contribution.date}
                title={`${contribution.count} contributions on ${contribution.date}`}
                className={cn(
                  'size-2 rounded-xs',
                  contribution.level === 0 && 'bg-muted',
                  contribution.level === 1 &&
                    'bg-neutral-300 dark:bg-neutral-600',
                  contribution.level === 2 &&
                    'bg-neutral-500 dark:bg-neutral-400',
                  contribution.level === 3 &&
                    'bg-neutral-700 dark:bg-neutral-200',
                  contribution.level === 4 &&
                    'bg-neutral-900 dark:bg-neutral-50',
                )}
              />
            ) : (
              <div key={`empty-${index}`} className="size-2" />
            ),
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ) : null
}
