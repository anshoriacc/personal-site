import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { MailIcon } from './svg/mail-icon'
import { GithubIcon } from './svg/github-icon'
import { LinkedInIcon } from './svg/linkedin-icon'
import { FileTextIcon } from './svg/file-text-icon'

export const Profile = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-semibold sm:text-lg">Achmad Anshori</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Software Engineer
        </p>
      </div>

      <p
        className={cn(
          'text-muted-foreground z-1',
          '[&_span:hover]:text-foreground',
        )}
      >
        I'm a <span>software engineer</span> with over 4 years in software
        engineering. I develop intuitive, user-friendly experiences with{' '}
        <span>React</span> and modern <span>JavaScript</span>. Currently based
        in <span>Jakarta, Indonesia</span>.
      </p>

      <div className="flex flex-wrap gap-2">
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
              href="https://resume.anshori.com"
              target="_blank"
              rel="noreferrer"
              className="cursor-external-link"
            />
          }
        >
          <FileTextIcon className="size-4" />
          Resume
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
