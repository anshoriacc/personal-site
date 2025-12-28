import dayjs from 'dayjs'

import { cn } from '@/lib/utils'
import { useGetGithubContributionsQuery } from '@/hooks/api/github-contributions'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

export const GitHubContributions = () => {
  const githubContributionsQuery = useGetGithubContributionsQuery()

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

  const monthLabels: Array<{ month: string; columnIndex: number }> = []

  lastYearContributions.forEach((contribution, index) => {
    if (contribution) {
      const date = dayjs(contribution.date)

      if (date.date() === 1) {
        const month = date.format('MMM')
        const columnIndex = Math.floor(index / 7)
        monthLabels.push({ month, columnIndex })
      }
    }
  })

  return (
    <section className="flex flex-col gap-2 w-full group relative">
      <h2 className="text-sm font-medium">GitHub Contributions</h2>

      {githubContributionsQuery.data ? (
        <div className="relative w-full">
          {/* Left day labels - Absolute */}
          {/* <div className="absolute left-0 bottom-2 z-10 grid grid-rows-7 gap-0.5 text-xs text-muted-foreground leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-xs pr-1 pointer-events-none">
            <div className="h-2 flex items-center row-start-2">Mon</div>
            <div className="h-2 flex items-center row-start-4">Wed</div>
            <div className="h-2 flex items-center row-start-6">Fri</div>
          </div> */}

          <ScrollArea className="w-full">
            <div className="flex flex-col min-w-max">
              <div
                className="grid gap-0.5 text-xs text-muted-foreground mb-1"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(lastYearContributions.length / 7)}, 0.5rem)`,
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

              <TooltipProvider>
                <div
                  className="grid grid-rows-7 grid-flow-col gap-0.5 pb-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.ceil(lastYearContributions.length / 7)}, 0.5rem)`,
                  }}
                >
                  {lastYearContributions.map((contribution, index) =>
                    contribution ? (
                      <Tooltip key={contribution.date} disableHoverablePopup>
                        <TooltipTrigger
                          render={
                            <span
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
                          }
                        />

                        <TooltipContent className="select-none">
                          <p className="text-xs">
                            {contribution.count} contribution
                            {contribution.count !== 1 ? 's' : ''} on{' '}
                            {dayjs(contribution.date).format('MMM D, YYYY')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
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

          {/* Right day labels - Absolute */}
          {/* <div className="absolute right-0 bottom-2 z-10 grid grid-rows-7 gap-0.5 text-xs text-muted-foreground leading-none select-none opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-xs pl-1 pointer-events-none">
            <div className="h-2 flex items-center row-start-2">Mon</div>
            <div className="h-2 flex items-center row-start-4">Wed</div>
            <div className="h-2 flex items-center row-start-6">Fri</div>
          </div> */}
        </div>
      ) : (
        <div
          className={cn(
            'w-full overflow-hidden',
            githubContributionsQuery.isLoading && 'animate-pulse blur-sm',
          )}
        >
          <div className="flex flex-col gap-1">
            {/* Simulated Month Labels */}
            <div className="flex gap-8 ml-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 w-8 rounded-xs" />
              ))}
            </div>

            {/* Simulated Grid */}
            <div className="grid grid-rows-7 grid-flow-col gap-0.5 pb-2">
              {Array.from({ length: 371 }).map((_, i) => (
                <div key={i} className="size-2 rounded-xs bg-muted" />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
