import React from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { experiences } from '@/data/experience'
import { useMounted } from '@/hooks/use-mounted'
import { useIsNightTime } from '@/stores/time.store'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

type Props = {
  simplified?: boolean
}

export const Experience = ({ simplified }: Props) => {
  const mounted = useMounted()
  const isNight = useIsNightTime()

  const displayedExperiences = simplified
    ? experiences.slice(0, 3)
    : experiences
  const hasMore = experiences.length > 3

  const pingClass = mounted
    ? cn(!isNight ? 'bg-amber-400' : 'bg-sky-400')
    : 'bg-neutral-400'
  const dotClass = mounted
    ? cn(!isNight ? 'bg-amber-500' : 'bg-sky-500')
    : 'bg-neutral-500'

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium">Experience</h2>
        {hasMore && simplified && (
          <div className="flex justify-center">
            <Button
              variant="link"
              size="xs"
              render={<Link to="/work" />}
              nativeButton={false}
            >
              Show More
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {displayedExperiences.map((exp) => (
          <React.Fragment key={exp.company}>
            <div className="space-y-0.5">
              <h3 className="flex items-center gap-2">
                {exp.roles.some((role) => role.endDate === 'present') && (
                  <Tooltip disableHoverablePopup>
                    <TooltipTrigger
                      render={
                        <span className="relative flex size-3 overflow-visible">
                          <span
                            id="exp-indicator-ping"
                            className={cn(
                              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                              pingClass,
                            )}
                          />
                          <span
                            id="exp-indicator-dot"
                            className={cn(
                              'relative inline-flex size-3 rounded-full',
                              dotClass,
                            )}
                          />
                        </span>
                      }
                    />

                    <TooltipContent className="select-none">
                      Currently working here
                    </TooltipContent>
                  </Tooltip>
                )}

                <span>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-external-link hover:underline"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                </span>
                {simplified && (
                  <span className="text-muted-foreground text-sm">
                    {exp.roles.at(-1)?.startDate} – {exp.roles[0].endDate}
                  </span>
                )}
              </h3>

              {!simplified ? (
                <div className="ml-4 space-y-5 pt-2">
                  {exp.roles.map((role) => (
                    <div key={`${role.position}-${role.startDate}`}>
                      <h4 className="font">{role.position}</h4>
                      <p className="text-muted-foreground text-sm">
                        {role.type ? <span>{role.type} ⋅ </span> : null}
                        <span>
                          {role.startDate} – {role.endDate}
                        </span>
                      </p>

                      {role.description ? (
                        <p className="mt-1">{role.description}</p>
                      ) : null}

                      {role.technologies && role.technologies.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2 select-none">
                          {role.technologies.map((tech) => (
                            <Badge
                              variant="outline"
                              key={tech}
                              className="rounded-sm px-2 py-1"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {role.responsibilities ? (
                        <ul
                          role="list"
                          className={cn(
                            'text-muted-foreground mt-2 space-y-0.5 pl-4',
                            '*:relative *:before:absolute *:before:-left-4 *:before:content-["▪︎"]',
                          )}
                        >
                          {role.responsibilities.map((responsibility) => (
                            <li key={responsibility}>{responsibility}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {!simplified && (
              <div className="text-muted-foreground text-center select-none last:hidden">
                〰︎〰︎〰︎〰︎〰︎
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {mounted ? <ExperienceIndicatorScript /> : null}
    </section>
  )
}

// Module-level cached script content - created once
const EXPERIENCE_INDICATOR_SCRIPT = `(${(() => {
  const t = new Date()
  const fullHours = t.getHours()
  const isNight = fullHours >= 18 || fullHours < 4

  const pingEl = document.getElementById('exp-indicator-ping')
  const dotEl = document.getElementById('exp-indicator-dot')

  if (pingEl) {
    const pingClass = isNight ? 'bg-sky-400' : 'bg-amber-400'
    pingEl.className = pingEl.className.replace(/bg-(sky|amber)-400/, pingClass)
  }

  if (dotEl) {
    const dotClass = isNight ? 'bg-sky-500' : 'bg-amber-500'
    dotEl.className = dotEl.className.replace(/bg-(sky|amber)-500/, dotClass)
  }
}).toString()})()`

const experienceScriptProps = {
  dangerouslySetInnerHTML: { __html: EXPERIENCE_INDICATOR_SCRIPT },
}

export const ExperienceIndicatorScript = (): React.ReactNode => (
  <script {...experienceScriptProps} />
)
