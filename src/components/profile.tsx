import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { MailIcon } from './svg/mail-icon'
import { GithubIcon } from './svg/github-icon'
import { LinkedInIcon } from './svg/linkedin-icon'

export const Profile = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="sm:text-lg font-semibold">Achmad Anshori</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Software Engineer
        </p>
      </div>

      <p
        className={cn(
          'z-1 text-muted-foreground',
          '[&_span:hover]:text-foreground',
        )}
      >
        I'm a <span>software engineer</span> with more than 3 years of
        experience. I craft delightful user experiences with <span>React</span>{' '}
        and modern <span>JavaScript</span>. Currently based in{' '}
        <span>Jakarta, Indonesia</span>.
      </p>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="secondary"
          className="gap-1"
          render={<a href="mailto:anshoriacc@gmail.com" />}
        >
          <MailIcon className="size-4" />
          Mail
        </Button>
        <Button
          variant="secondary"
          className="gap-1"
          render={
            <a
              href="https://github.com/anshoriacc"
              target="_blank"
              rel="noreferrer"
              className="cursor-external-link"
            />
          }
        >
          <GithubIcon className="size-4" />
          GitHub
        </Button>
        <Button
          variant="secondary"
          className="gap-1"
          render={
            <a
              href="https://www.linkedin.com/in/achmad-anshori"
              target="_blank"
              rel="noreferrer"
              className="cursor-external-link"
            />
          }
        >
          <LinkedInIcon className="size-4" />
          LinkedIn
        </Button>
      </div>
    </section>
  )
}
