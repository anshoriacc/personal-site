import { IconArrowUpRight } from '@tabler/icons-react'

export const ResumePreview = () => {
  return (
    <div className="grid gap-1 select-none">
      <div className="ring-foreground/10 bg-background grid gap-2 rounded-md p-1 font-mono ring-1">
        <div className="grid">
          <span className="text-base">Achmad Anshori</span>
          <span className="text-muted-foreground">Software Engineer</span>
        </div>

        <div className="*:bg-muted grid gap-1 *:h-5 *:rounded">
          <span />
          <span className="w-2/5" />
        </div>
      </div>

      <div className="px-1">
        <a
          href="https://resume.anshori.com"
          target="_blank"
          rel="noreferrer"
          className="flex w-fit cursor-alias items-center gap-0.5 underline-offset-4 hover:underline"
        >
          minimal resume page <IconArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  )
}
