import { cn } from '@/lib/utils'
import { experiences } from '@/data/experience'
import { useIsNightTime } from '@/stores/time.store'
import { Badge } from './ui/badge'

type Props = {
  simplified?: boolean
}

export const Experience = ({ simplified }: Props) => {
  const isNight = useIsNightTime()

  return (
    <section className="space-y-6">
      <h2 className="font-medium">Experience</h2>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <>
            <div key={index} className="space-y-0.5">
              <h3 className="flex items-center gap-2">
                {exp.endDate === 'Present' && (
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
                  </span>
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
                    'text-muted-foreground mt-2 list-disc space-y-0.5 pl-5',
                    !isNight
                      ? 'marker:text-amber-200 dark:marker:text-amber-900'
                      : 'marker:text-sky-200 dark:marker:text-sky-900',
                  )}
                >
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* <div className="border-b last:hidden" /> */}
            <div className="text-muted-foreground text-center last:hidden">
              〰︎〰︎〰︎〰︎〰︎
            </div>
          </>
        ))}
      </div>
    </section>
  )
}
