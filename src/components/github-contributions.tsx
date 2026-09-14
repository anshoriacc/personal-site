import dayjs from 'dayjs'

import { cn } from '@/lib/utils'
import { useGetGithubContributionsQuery } from '@/hooks/api/github-contributions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

const levelClasses = [
  'bg-muted',
  'bg-neutral-300 dark:bg-neutral-600',
  'bg-neutral-500 dark:bg-neutral-400',
  'bg-neutral-700 dark:bg-neutral-200',
  'bg-neutral-900 dark:bg-neutral-50',
]

const formatContributionDate = (date: string): string => {
  const parsedDate = dayjs(date)

  if (!parsedDate.isValid()) {
    return date
  }

  return parsedDate.format('MMM D, YYYY')
}

function ContributionCell({
  contribution,
}: {
  contribution: {
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }
}) {
  return (
    <Tooltip disableHoverablePopup withoutProviders>
      <TooltipTrigger
        render={
          <span
            className={cn(
              'aspect-square size-1.5 w-full min-w-0 rounded-xs',
              levelClasses[contribution.level],
            )}
            aria-hidden="true"
          />
        }
      />

      <TooltipContent className="select-none">
        <p>
          {contribution.count} contribution
          {contribution.count !== 1 ? 's' : ''} on{' '}
          {formatContributionDate(contribution.date)}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export const GitHubContributions = () => {
  const githubContributionsQuery = useGetGithubContributionsQuery()

  const contributions = githubContributionsQuery.data?.contributions ?? []

  return (
    <div className="flex flex-col gap-1 select-none">
      <div className="ring-foreground/10 bg-background rounded-md p-1 ring-1">
        {githubContributionsQuery.data ? (
          <div
            className="w-full"
            role="img"
            aria-label={`${githubContributionsQuery.data.total.lastYear ?? 0} GitHub contributions in the last year`}
          >
            <TooltipProvider delay={0}>
              <div
                className="grid w-full grid-flow-col grid-rows-7 gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(contributions.length / 7)}, minmax(0, 1fr))`,
                }}
              >
                {contributions.map((contribution) => (
                  <ContributionCell
                    key={contribution.date}
                    contribution={contribution}
                  />
                ))}
              </div>
            </TooltipProvider>
          </div>
        ) : githubContributionsQuery.isLoading ? (
          <div
            className="grid w-full grid-flow-col grid-rows-7 gap-0.5 blur-sm motion-safe:**:animate-pulse"
            style={{
              gridTemplateColumns: 'repeat(53, minmax(0, 1fr))',
            }}
            aria-hidden="true"
          >
            {Array.from({ length: 371 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted aspect-square w-full min-w-0 rounded-xs"
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground px-2 py-3 text-xs">
            GitHub activity unavailable. Open the profile to try again.
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.25">
        <img
          src="https://avatars.githubusercontent.com/u/50905938"
          alt=""
          draggable={false}
          className="ring-foreground/10 size-10 rounded-full ring-1"
        />

        <div className="flex flex-col">
          <a
            href="https://github.com/anshoriacc"
            target="_blank"
            rel="noreferrer"
            className="w-fit cursor-alias text-base font-semibold underline-offset-4 hover:underline"
          >
            anshoriacc
          </a>
          {githubContributionsQuery.data && (
            <span className="text-muted-foreground tabular-nums">
              {githubContributionsQuery.data.total.lastYear ?? 0} contributions
              in the last year
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
