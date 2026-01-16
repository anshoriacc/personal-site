import React from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { experiences } from '@/data/experience'
import { useIsNightTime } from '@/stores/time.store'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

type Props = {
  simplified?: boolean
}

export const Experience = ({ simplified }: Props) => {
  const isNight = useIsNightTime()

  const displayedExperiences = simplified
    ? experiences.slice(0, 3)
    : experiences
  const hasMore = experiences.length > 3

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-medium">Experience</h2>
        {hasMore && simplified && (
          <div className="flex justify-center">
            <Button variant="link" size="xs" render={<Link to="/work" />}>
              Show More
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {displayedExperiences.map((exp, index) => (
          <React.Fragment key={index}>
            <div className="space-y-0.5">
              <h3 className="flex items-center gap-2">
                {exp.endDate === 'present' && (
                  <Tooltip disableHoverablePopup>
                    <TooltipTrigger
                      render={
                        <span className="relative flex size-3 overflow-visible">
                          <span
                            id="exp-indicator-ping"
                            className={cn(
                              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                              !isNight ? 'bg-amber-400' : 'bg-sky-400',
                            )}
                          />
                          <span
                            id="exp-indicator-dot"
                            className={cn(
                              'relative inline-flex size-3 rounded-full',
                              !isNight ? 'bg-amber-500' : 'bg-sky-500',
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

                <span className="font-medium">
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
                <span className="text-muted-foreground text-sm">
                  {exp.startDate} – {exp.endDate}
                </span>
              </h3>

              <p className="text-muted-foreground">
                <span>{exp.position}</span>
                {exp.type && <span> ⋅ {exp.type}</span>}
              </p>

              {exp.description && <p>{exp.description}</p>}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 select-none">
                  {exp.technologies.map((tech, techIndex) => (
                    <Badge
                      variant="outline"
                      key={techIndex}
                      className="rounded-sm px-2 py-1"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              {!simplified && exp.responsibilities && (
                <ul
                  role="list"
                  className={cn(
                    'text-muted-foreground mt-2 space-y-0.5 pl-4',
                    '*:relative *:before:absolute *:before:-left-4 *:before:content-["▪︎"]',
                  )}
                >
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="text-muted-foreground text-center select-none last:hidden">
              〰︎〰︎〰︎〰︎〰︎
            </div>
          </React.Fragment>
        ))}
      </div>

      <ExperienceIndicatorScript />
    </section>
  )
}

export const ExperienceIndicatorScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(${(() => {
        const t = new Date()
        const fullHours = t.getHours()
        const isNight = fullHours >= 18 || fullHours < 4

        const pingEl = document.getElementById('exp-indicator-ping')
        const dotEl = document.getElementById('exp-indicator-dot')

        if (pingEl) {
          const pingClass = isNight ? 'bg-sky-400' : 'bg-amber-400'
          pingEl.className = pingEl.className.replace(
            /bg-(sky|amber)-400/,
            pingClass,
          )
        }

        if (dotEl) {
          const dotClass = isNight ? 'bg-sky-500' : 'bg-amber-500'
          dotEl.className = dotEl.className.replace(
            /bg-(sky|amber)-500/,
            dotClass,
          )
        }
      }).toString()})()`,
    }}
  />
)
