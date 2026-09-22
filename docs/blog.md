# Minimal blog

## Plan and design

The blog extends the existing portfolio: the same narrow column, Plus Jakarta Sans,
neutral theme tokens, quiet headings, generous spacing, and shared menu and footer.
The index is a chronological list. Posts have a title, date, summary, and readable
body. No CMS, database, tags, search, or extra navigation is needed for now.

The [TanStack Markdown guide](https://tanstack.com/start/latest/docs/framework/react/guide/rendering-markdown)
is a useful starting point for repository content. This implementation uses
[MDX's Vite integration](https://mdxjs.com/docs/getting-started/#vite) so posts can
import real React components directly, including stateful examples.

1. Compile local MDX at build time with Markdown tables, heading IDs, and syntax highlighting.
2. Generate validated metadata and lazy imports from published posts.
3. Render `/blog` and `/blog/$slug` in the existing site layout.
4. Add navigation, canonical URLs, article metadata, social previews, and sitemap entries.
5. Verify content validation, production rendering, navigation, themes, and interactive components.

## Write a post

Create `src/content/blog/my-first-post.mdx`. Its filename becomes `/blog/my-first-post`.
Use lowercase letters, numbers, and hyphens. Posts are discovered automatically;
there is no separate registry to update.

```mdx
---
title: My first post
description: A short summary for the list and social previews.
date: '2026-09-19'
draft: false
---

import { CounterDemo } from '@/components/blog/counter-demo'

Start with ordinary **Markdown**.

## Try it

<CounterDemo />
```

`title`, `description`, and a quoted `YYYY-MM-DD` date are required. `draft` is
optional and defaults to `false`. Invalid metadata fails the build with the filename.
Dates are displayed consistently across time zones. Dates are labels, not scheduled
publication: a future date does not hide a post.

Set `draft: true` to exclude a post from the index, routes, sitemap, and generated
MDX imports in both development and production. To preview, temporarily set it to
`false` locally. Publish by setting it to `false`, then build and deploy normally.
Draft status does not make files private in a public Git repository.

Run `pnpm dev` to preview. Adding, editing, renaming, or removing a post refreshes
the content. Run `pnpm build` before deploying. Remove or replace
`writing-with-components.mdx` when you have your own first post; it is a working example.

## Embed components and media

Import any component using `@/` aliases or relative paths, then use JSX in the post.
Keep hooks and TypeScript in `.tsx` components. Components should support server
rendering: access `window` and `document` in effects or event handlers. Browser-only
libraries can be loaded after mounting.

Markdown element styles are applied through `mdxComponents`, so embedded components
retain their own styles. Tailwind scans `src/content` as well as components and routes;
literal utility classes in MDX work normally. Images can live under `public/blog`
and use URLs such as `/blog/example.png`. Include descriptive alt text. For video,
use JSX such as `<video controls src="/blog/demo.mp4" />`.

Start body sections at `##`; the post title supplies the page's `h1`. Heading IDs
are generated automatically, so `/blog/my-first-post#try-it` links to a section.
Fenced code blocks are highlighted at build time and follow the active theme.

Only trusted, repository-authored MDX is compiled. The blog does not evaluate
remote or user-submitted content. Each published post gets its own lazy module;
the index does not load every post's components.

## Files

- `plugins/blog.ts`: metadata validation, discovery, draft filtering, and development refresh.
- `src/content/blog/*.mdx`: posts.
- `src/components/blog/mdx-components.tsx`: Markdown typography.
- `src/routes/(home)/_layout/blog/`: list, post, and missing-post UI.
- `vite.config.ts`: MDX and highlighting pipeline.

## Checks

Run `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm check`, and `pnpm build`.
In the browser, check the index, a direct post URL, the example counter, a missing
post, menu navigation, mobile widths, light/dark themes, and heading links.

The project keeps TypeScript 7 for `tsc` and aliases TypeScript 6 for tools that
still need the JavaScript compiler API, including ESLint. This follows the
[official compatibility setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

Implementation verification: all 22 tests, TypeScript, focused blog lint, and the
production build pass. Production HTTP checks cover SSR content, canonical and
article metadata, sitemap XML, and 404 status. Browser checks cover hydrated
components, mobile layout, themes, and draft publication refresh. A temporary
draft was confirmed absent from production bundles and then removed.

The repository-wide `pnpm check` still reports existing lint errors outside the
blog and attempts to lint generated `.output` files. Blog files pass a focused
ESLint run.
