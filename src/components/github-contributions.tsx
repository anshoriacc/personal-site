import React from 'react'
import dayjs from 'dayjs'

import { cn } from '@/lib/utils'
import { useGetGithubContributionsQuery } from '@/hooks/api/github-contributions'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { GithubIcon } from './svg/github-icon'
import { Button } from './ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

// Memoized contribution cell to prevent unnecessary re-renders
const ContributionCell = React.memo(
  ({
    contribution,
  }: {
    contribution: {
      date: string
      count: number
      level: 0 | 1 | 2 | 3 | 4
    }
  }) => {
    const levelClasses = [
      'bg-muted',
      'bg-neutral-300 dark:bg-neutral-600',
      'bg-neutral-500 dark:bg-neutral-400',
      'bg-neutral-700 dark:bg-neutral-200',
      'bg-neutral-900 dark:bg-neutral-50',
    ]

    return (
      <Tooltip key={contribution.date} disableHoverablePopup withoutProviders>
        <TooltipTrigger
          render={
            <span
              className={cn(
                'size-2 rounded-xs',
                levelClasses[contribution.level],
              )}
            />
          }
        />

        <TooltipContent className="select-none">
          <p>
            {contribution.count} contribution
            {contribution.count !== 1 ? 's' : ''} on{' '}
            {dayjs(contribution.date).format('MMM D, YYYY')}
          </p>
        </TooltipContent>
      </Tooltip>
    )
  },
)

ContributionCell.displayName = 'ContributionCell'

export const GitHubContributions = () => {
  const githubContributionsQuery = useGetGithubContributionsQuery()

  const contributions = githubContributionsQuery.data?.contributions ?? []

  const monthLabels = React.useMemo(
    () =>
      contributions.reduce<Array<{ month: string; columnIndex: number }>>(
        (acc, contribution, index) => {
          if (contribution) {
            const date = dayjs(contribution.date)

            if (date.date() === 1) {
              const month = date.format('MMM')
              const columnIndex = Math.floor(index / 7)
              acc.push({ month, columnIndex })
            }
          }
          return acc
        },
        [],
      ),
    [contributions],
  )

  return (
    <section className="group relative flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="font-medium">GitHub Contributions</h2>
        <Button
          variant="secondary"
          size="xs"
          className="gap-1"
          render={
            <a
              href="https://github.com/anshoriacc"
              target="_blank"
              rel="noreferrer"
              className="cursor-external-link"
            />
          }
          nativeButton={false}
        >
          <GithubIcon className="size-3.5" />
          GitHub
        </Button>
      </div>

      {githubContributionsQuery.data ? (
        <div className="relative w-full">
          <ScrollArea className="w-full">
            <div className="flex min-w-max flex-col">
              <div
                className="text-muted-foreground mb-1 grid gap-0.5 text-xs"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(contributions.length / 7)}, 0.5rem)`,
                }}
              >
                {monthLabels.map(({ month, columnIndex }) => (
                  <div
                    key={`${month}-${columnIndex}`}
                    style={{ gridColumnStart: columnIndex + 1 }}
                    className="whitespace-nowrap"
                  >
                    {month}
                  </div>
                ))}
              </div>

              <TooltipProvider delay={100}>
                <div
                  className="grid grid-flow-col grid-rows-7 gap-0.5 pb-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.ceil(contributions.length / 7)}, 0.5rem)`,
                  }}
                >
                  {contributions.map((contribution, index) =>
                    contribution ? (
                      <ContributionCell
                        key={contribution.date}
                        contribution={contribution}
                      />
                    ) : (
                      <div key={`empty-${index}`} className="size-2" />
                    ),
                  )}
                </div>
              </TooltipProvider>
            </div>
            <ScrollBar
              orientation="horizontal"
              className="data-horizontal:h-2"
            />
          </ScrollArea>
        </div>
      ) : (
        <div
          className={cn(
            'w-full overflow-hidden',
            githubContributionsQuery.isLoading && 'animate-pulse blur-sm',
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="ml-1 flex gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 w-8 rounded-xs" />
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-0.5 pb-2">
              {Array.from({ length: 371 }).map((_, i) => (
                <div key={i} className="bg-muted size-2 rounded-xs" />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
