import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { parsePost, readPosts } from './blog'

const source = (fields = '') => `---
title: A post
description: A short description
date: '2026-09-19'
${fields}
---

Hello, world.
`

describe('blog content', () => {
  it('derives a stable URL from the filename', () => {
    expect(parsePost(source(), 'a-post.mdx')).toEqual({
      slug: 'a-post',
      title: 'A post',
      description: 'A short description',
      date: '2026-09-19',
    })
  })

  it('excludes drafts from metadata and generated imports', () => {
    expect(parsePost(source('draft: true'), 'draft.mdx')).toBeNull()
    expect(parsePost(source('draft: false'), 'published.mdx')).not.toBeNull()
  })

  it.each([
    source().replace("'2026-09-19'", "'2026-02-30'"),
    source().replace('title: A post', 'title: ""'),
    source().replace('description: A short description', ''),
    source('draft: "false"'),
  ])('rejects invalid metadata with the filename', (content) => {
    expect(() => parsePost(content, 'broken.mdx')).toThrow(
      'broken.mdx: invalid blog frontmatter',
    )
  })

  it('rejects filenames that are not URL-safe', () => {
    expect(() => parsePost(source(), 'Not a slug.mdx')).toThrow(
      'lowercase, hyphenated filename',
    )
  })

  it('discovers posts, sorts newest first, and excludes drafts', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'blog-test-'))
    try {
      await Promise.all([
        writeFile(
          path.join(directory, 'older.mdx'),
          source().replace('2026-09-19', '2025-01-01'),
        ),
        writeFile(path.join(directory, 'newer.mdx'), source()),
        writeFile(path.join(directory, 'draft.mdx'), source('draft: true')),
        writeFile(path.join(directory, 'README.md'), 'Not a post'),
      ])
      expect((await readPosts(directory)).map(({ slug }) => slug)).toEqual([
        'newer',
        'older',
      ])
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  })
})
