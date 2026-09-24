import { Link } from '@tanstack/react-router'
import { IconArrowUpRight } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { experiences } from '@/data/experience'
import { buttonVariants } from './ui/button'
import { Badge } from './ui/badge'

export const Experience = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">Experience</h2>

      <div className="space-y-10">
        {experiences.map((exp) => {
          const responsibilities = exp.roles.flatMap(
            (role) => role.responsibilities ?? [],
          )
          const technologies = [
            ...new Set(exp.roles.flatMap((role) => role.technologies ?? [])),
          ]

          return (
            <article key={exp.company} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-foreground min-w-0 text-base font-medium">
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-alias items-center gap-0.5 underline-offset-4 hover:underline"
                    >
                      {exp.company}
                      <IconArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    </a>
                  ) : (
                    exp.company
                  )}
                </h3>

                <span
                  aria-hidden="true"
                  className="min-w-4 flex-1 border-t border-dashed"
                />

                <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap tabular-nums">
                  {exp.roles.at(-1)?.startDate} –{' '}
                  <span
                    className={cn(exp.roles[0].endDate == 'Now' && 'shimmer')}
                  >
                    {exp.roles[0].endDate}
                  </span>
                </span>
              </div>

              <div className="space-y-3">
                <ul className="space-y-1">
                  {exp.roles.map((role) => (
                    <li
                      key={`${role.position}-${role.startDate}`}
                      className="flex flex-wrap items-baseline gap-x-2"
                    >
                      <h4 className="text-foreground text-sm font-medium">
                        {role.position}
                      </h4>

                      {role.type || exp.roles.length > 1 ? (
                        <span className="text-muted-foreground text-xs tabular-nums">
                          {role.type}
                          {role.type && exp.roles.length > 1 ? ' · ' : null}
                          {exp.roles.length > 1
                            ? `${role.startDate} – ${role.endDate}`
                            : null}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <p className="text-sm leading-relaxed text-pretty">
                  {exp.description}
                </p>

                {responsibilities.length > 0 ? (
                  <ul
                    role="list"
                    className={cn(
                      'text-muted-foreground space-y-1 ps-4 text-sm leading-relaxed',
                      '*:relative *:before:absolute *:before:-inset-s-4 *:before:content-["▪︎"]',
                    )}
                  >
                    {responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                ) : null}

                {technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {technologies.map((technology) => (
                      <Badge
                        variant="outline"
                        key={technology}
                        className="rounded-sm font-normal"
                      >
                        {technology}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export const SimplifiedExperience = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Experience</h2>

        <div className="flex justify-center">
          <Link
            to="/work"
            className={buttonVariants({ variant: 'link', size: 'xs' })}
          >
            Show More
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        {experiences.map((exp) => (
          <div key={exp.company} className="group flex items-center gap-3">
            <div className="min-w-0 space-y-1">
              <p className="text-muted-foreground text-xs">
                {exp.roles[0]?.position}
              </p>

              <h3 className="text-foreground text-base leading-tight font-medium">
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-alias items-center gap-0.5 underline-offset-4 hover:underline"
                  >
                    {exp.company}
                    <IconArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </a>
                ) : (
                  exp.company
                )}
              </h3>
            </div>

            <span
              aria-hidden="true"
              className="group-hover:border-ring min-w-4 flex-1 border-t border-dashed transition-colors"
            />

            <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap tabular-nums">
              {exp.roles.at(-1)?.startDate} –{' '}
              <span className={cn(exp.roles[0].endDate == 'Now' && 'shimmer')}>
                {exp.roles[0].endDate}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
