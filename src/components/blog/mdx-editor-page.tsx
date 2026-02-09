import { useRef, useState } from 'react'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar01Icon } from '@hugeicons/core-free-icons'

export default function MDXEditorPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [markdownOutput, setMarkdownOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)
  const editorRef = useRef<MDXEditorMethods>(null)

  const generateMarkdown = () => {
    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const frontmatter = `---
title: "${title}"
date: "${date}"
slug: "${slug || title.toLowerCase().replace(/\s+/g, '-')}"
excerpt: "${excerpt}"
tags: [${tagArray.map((t) => `"${t}"`).join(', ')}]
published: true
---

`

    const content = editorRef.current?.getMarkdown() || ''
    const fullMarkdown = frontmatter + content

    setMarkdownOutput(fullMarkdown)
    setShowOutput(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownOutput)
    alert('Markdown copied to clipboard!')
  }

  const downloadMarkdown = () => {
    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-')
    const blob = new Blob([markdownOutput], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${finalSlug}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground text-sm">
          Development mode only. Use this editor to create blog posts, then copy
          the markdown to <code>content/blog/</code> directory.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-slug (auto-generated from title if empty)"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <HugeiconsIcon
                    icon={Calendar01Icon}
                    className="mr-2 h-4 w-4"
                  />
                  {date ? (
                    format(new Date(date), 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(format(newDate, 'yyyy-MM-dd'))
                    setDatePopoverOpen(false)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Tags (comma-separated)</Label>
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, typescript, webdev"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Excerpt</Label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Brief description of the post"
            autoComplete="off"
            className="resize-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <div className="overflow-hidden rounded-lg border">
          <MDXEditor
            ref={editorRef}
            markdown={''}
            plugins={[
              frontmatterPlugin(),
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              linkPlugin(),
              imagePlugin(),
              tablePlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'typescript' }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  typescript: 'TypeScript',
                  javascript: 'JavaScript',
                  python: 'Python',
                  css: 'CSS',
                  html: 'HTML',
                  json: 'JSON',
                  markdown: 'Markdown',
                  bash: 'Bash',
                  sql: 'SQL',
                },
              }),
              diffSourcePlugin({ viewMode: 'rich-text' }),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <ListsToggle />
                    <CreateLink />
                    <InsertImage />
                    <InsertTable />
                    <InsertThematicBreak />
                    <InsertCodeBlock />
                  </>
                ),
              }),
              markdownShortcutPlugin(),
            ]}
            contentEditableClassName="min-h-[400px] p-4"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={generateMarkdown}>Generate Markdown</Button>
      </div>

      {showOutput && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Markdown</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={downloadMarkdown}>
                Download .md file
              </Button>
            </div>
          </div>
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
            <code>{markdownOutput}</code>
          </pre>
          <p className="text-muted-foreground text-sm">
            Save this file to{' '}
            <code>
              content/blog/{slug || title.toLowerCase().replace(/\s+/g, '-')}.md
            </code>
          </p>
        </div>
      )}
    </div>
  )
}
