import { cn } from '@/lib/utils'
import { SocialLinks } from './social-links'

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

      <SocialLinks />
    </section>
  )
}
