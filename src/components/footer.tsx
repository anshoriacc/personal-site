import type { CSSProperties } from 'react'

import { useGetGithubContributionsQuery } from '@/hooks/api/github-contributions'

import { cn } from '@/lib/utils'

const ROW_COUNT = 7
const PLACEHOLDER_COUNT = 371

const getGridStyle = (itemCount: number): CSSProperties => {
  const columnCount = Math.max(1, Math.ceil(itemCount / ROW_COUNT))
  const ratioUnitCount = columnCount * 4 - 1

  return {
    gridTemplateColumns: `repeat(${columnCount}, calc(300cqw / ${ratioUnitCount}))`,
    gap: `calc(100cqw / ${ratioUnitCount})`,
  }
}

export const Footer = () => {
  const githubContributionsQuery = useGetGithubContributionsQuery()

  const contributions = githubContributionsQuery.data?.contributions ?? []

  const levelClasses = [
    'bg-background',
    'bg-neutral-100 dark:bg-neutral-900',
    'bg-neutral-200 dark:bg-neutral-800',
    'bg-neutral-300 dark:bg-neutral-700',
    'bg-neutral-400 dark:bg-neutral-600',
  ]

  return (
    <footer className="w-full p-4">
      <div>
        {githubContributionsQuery.data ? (
          <div className="@container w-full">
            <div
              className="grid grid-flow-col grid-rows-7"
              style={getGridStyle(contributions.length)}
            >
              {contributions.map((contribution) => (
                <span
                  key={contribution.date}
                  className={cn(
                    'ring-muted aspect-square w-full rounded-[18%] transition-all duration-100 hover:ring-2',
                    levelClasses[contribution.level],
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              '@container w-full overflow-hidden',
              githubContributionsQuery.isLoading && '**:animate-pulse',
            )}
          >
            <div
              className="grid grid-flow-col grid-rows-7"
              style={getGridStyle(PLACEHOLDER_COUNT)}
            >
              {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted aspect-square w-full rounded-[18%]"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
