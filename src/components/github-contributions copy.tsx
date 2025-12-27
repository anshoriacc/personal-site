import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Contribution {
  date: string
  count: number
  level: number
}

interface ContributionData {
  total: {
    [year: string]: number
  }
  contributions: Contribution[]
}

export const GitHubContributions = () => {
  const [data, setData] = useState<ContributionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/anshoriacc')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data) return null

  const currentYear = new Date().getFullYear().toString()
  const totalContributions = data.total[currentYear] || 0

  // Get last 52 weeks of contributions
  const recentContributions = data.contributions.slice(-364)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">{totalContributions}</span>
        <span className="text-xs text-muted-foreground">
          contributions this year
        </span>
      </div>

      <div className="grid grid-cols-52 gap-0.5">
        {recentContributions.map((contribution) => (
          <div
            key={contribution.date}
            title={`${contribution.count} contributions on ${contribution.date}`}
            className={cn(
              'size-2 rounded-[1px]',
              contribution.level === 0 && 'bg-muted',
              contribution.level === 1 && 'bg-green-300 dark:bg-green-900',
              contribution.level === 2 && 'bg-green-400 dark:bg-green-700',
              contribution.level === 3 && 'bg-green-500 dark:bg-green-600',
              contribution.level === 4 && 'bg-green-600 dark:bg-green-500',
            )}
          />
        ))}
      </div>
    </div>
  )
}
