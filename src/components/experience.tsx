import React from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { experiences } from '@/data/experience'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

type Props = {
  simplified?: boolean
}

export const Experience = ({ simplified }: Props) => {
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
                <span>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-alias hover:underline"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                </span>
                {simplified && (
                  <span className="text-muted-foreground text-sm">
                    {exp.roles.at(-1)?.startDate} –{' '}
                    <span
                      className={cn(
                        exp.roles[0].endDate == 'present' && 'shimmer',
                      )}
                    >
                      {exp.roles[0].endDate}
                    </span>
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
                          {role.startDate} –{' '}
                          <span
                            className={cn(
                              role.endDate == 'present' && 'shimmer',
                            )}
                          >
                            {role.endDate}
                          </span>
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
    </section>
  )
}
