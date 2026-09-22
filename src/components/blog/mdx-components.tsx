import type { MDXComponents } from 'mdx/types'

import { cn } from '@/lib/utils'

// Style Markdown elements directly so embedded React components keep their own styles.
export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h2
      {...props}
      className="mt-12 mb-4 scroll-mt-24 text-xl font-medium tracking-tight text-balance"
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className="mt-12 mb-4 scroll-mt-24 text-lg font-medium tracking-tight text-balance"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-10 mb-3 scroll-mt-24 font-medium tracking-tight text-balance"
    />
  ),
  h4: (props) => (
    <h4 {...props} className="mt-6 mb-3 scroll-mt-24 font-medium" />
  ),
  p: (props) => (
    <p {...props} className="text-foreground/80 my-5 leading-7 text-pretty" />
  ),
  a: (props) => (
    <a
      {...props}
      className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground focus-visible:outline-ring underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none"
    />
  ),
  ul: (props) => (
    <ul
      {...props}
      className="marker:text-muted-foreground my-5 flex list-disc flex-col gap-1 pl-5"
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="marker:text-muted-foreground my-5 flex list-decimal flex-col gap-1 pl-5"
    />
  ),
  li: (props) => (
    <li {...props} className="text-foreground/80 pl-1 leading-7" />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-border text-muted-foreground my-8 border-l pl-5 [&>p]:text-inherit"
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      {...props}
      tabIndex={0}
      className={cn(
        'border-border focus-visible:outline-ring my-6 overflow-x-auto rounded-lg border p-4 text-[0.8125rem] leading-6 focus-visible:outline-2 sm:p-5',
        className,
      )}
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.875em] in-[pre]:bg-transparent in-[pre]:p-0 in-[pre]:text-[1em]"
    />
  ),
  strong: (props) => (
    <strong {...props} className="text-foreground font-medium" />
  ),
  hr: (props) => <hr {...props} className="border-border my-10" />,
  img: ({ alt, ...props }) => (
    <img
      {...props}
      alt={alt ?? ''}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto max-w-full rounded-lg"
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-left text-sm" />
    </div>
  ),
  th: (props) => (
    <th {...props} className="border-border border-b px-3 py-2 font-medium" />
  ),
  td: (props) => <td {...props} className="border-border border-b px-3 py-2" />,
}
