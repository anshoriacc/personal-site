import { useCallback, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { AnimatePresence, motion } from 'motion/react'
import z from 'zod'
import {
  KitchenSinkToolbar,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Copy01Icon,
  DocumentCodeIcon,
  Download01Icon,
  RotateClockwiseIcon,
  Tick01Icon,
} from '@hugeicons/core-free-icons'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import '@mdxeditor/editor/style.css'

const writerFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  author: z.string().min(1, 'Author is required'),
  publishedDate: z.string().min(1, 'Date is required'),
  tags: z.string(),
  markdown: z.string().min(1, 'Content is required'),
})

type WriterFormData = z.infer<typeof writerFormSchema>

interface FrontMatter {
  title: string
  excerpt: string
  author: string
  publishedDate: string
  tags: Array<string>
}

function generateFrontMatter(data: FrontMatter): string {
  const tagsString =
    data.tags.length > 0
      ? `\ntags:\n${data.tags.map((tag) => `  - ${tag}`).join('\n')}`
      : ''

  return `---\ntitle: "${data.title}"\nexcerpt: "${data.excerpt}"\nauthor: "${data.author}"\ndate: "${data.publishedDate}"${tagsString}\n---`
}

function generateMarkdownFile(data: FrontMatter, content: string): string {
  const frontMatter = generateFrontMatter(data)
  return `${frontMatter}\n\n${content}`
}

function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const WriterForm = () => {
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(
    null,
  )
  const [copied, setCopied] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  const form = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
      author: '',
      publishedDate: new Date().toISOString().split('T')[0],
      tags: '',
      markdown: '',
    } as WriterFormData,
    validators: {
      onChange: writerFormSchema,
    },
    onSubmit: ({ value }) => {
      const tags = value.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const frontMatter: FrontMatter = {
        title: value.title,
        excerpt: value.excerpt,
        author: value.author,
        publishedDate: value.publishedDate,
        tags,
      }

      const markdown = generateMarkdownFile(frontMatter, value.markdown)
      setGeneratedMarkdown(markdown)
    },
  })

  const handleCopy = useCallback(async () => {
    if (!generatedMarkdown) return

    try {
      await navigator.clipboard.writeText(generatedMarkdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [generatedMarkdown])

  const handleDownload = useCallback(() => {
    if (!generatedMarkdown) return

    const title = form.getFieldValue('title') || 'untitled'
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`
    downloadMarkdownFile(filename, generatedMarkdown)
  }, [generatedMarkdown, form])

  const handleReset = () => {
    form.reset()
    setGeneratedMarkdown(null)
    setEditorKey((prev) => prev + 1)
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-semibold sm:text-lg">Markdown Generator</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Generate markdown files with front matter for your blog posts.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Front Matter</FieldLegend>
            <FieldDescription>
              The metadata information for the post.
            </FieldDescription>

            <form.Field name="title">
              {(field) => {
                const hasError =
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError}
                      placeholder="Post title"
                      autoComplete="off"
                    />
                    <AnimatePresence mode="wait">
                      {hasError && (
                        <motion.div exit={{ height: 0 }}>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FieldError errors={field.state.meta.errors} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="excerpt">
              {(field) => {
                const hasError =
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched

                return (
                  <Field data-invalid={hasError}>
                    <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={hasError}
                      placeholder="Post excerpt"
                      autoComplete="off"
                      className="resize-none"
                      rows={3}
                    />
                    <AnimatePresence mode="wait">
                      {hasError && (
                        <motion.div exit={{ height: 0 }}>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FieldError errors={field.state.meta.errors} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Field>
                )
              }}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="author">
                {(field) => {
                  const hasError =
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched

                  return (
                    <Field data-invalid={hasError}>
                      <FieldLabel htmlFor={field.name}>Author</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={hasError}
                        placeholder="Author name"
                        autoComplete="off"
                      />
                      <AnimatePresence mode="wait">
                        {hasError && (
                          <motion.div exit={{ height: 0 }}>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FieldError errors={field.state.meta.errors} />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="publishedDate">
                {(field) => {
                  const hasError =
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched

                  return (
                    <Field data-invalid={hasError}>
                      <FieldLabel htmlFor={field.name}>
                        Published Date
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="date"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={hasError}
                        autoComplete="off"
                      />
                      <AnimatePresence mode="wait">
                        {hasError && (
                          <motion.div exit={{ height: 0 }}>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FieldError errors={field.state.meta.errors} />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Field>
                  )
                }}
              </form.Field>
            </div>

            <form.Field name="tags">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    autoComplete="off"
                  />
                  <FieldDescription>Separate tags with commas</FieldDescription>
                </Field>
              )}
            </form.Field>
          </FieldSet>

          <FieldSeparator />
          <form.Field name="markdown">
            {(field) => {
              const hasError =
                field.state.meta.errors.length > 0 && field.state.meta.isTouched

              return (
                <Field data-invalid={hasError}>
                  <FieldLabel htmlFor={field.name}>Markdown Content</FieldLabel>
                  <FieldDescription>
                    The main content of the post in markdown format.
                  </FieldDescription>

                  <div className="relative left-1/2 w-screen! max-w-5xl! -translate-x-1/2 px-4">
                    <div className="rounded-lg border">
                      <MDXEditor
                        key={editorKey}
                        markdown={field.state.value}
                        onChange={(markdown) => field.handleChange(markdown)}
                        onBlur={field.handleBlur}
                        contentEditableClassName="prose prose-zinc dark:prose-invert min-h-[350px] p-4"
                        plugins={[
                          toolbarPlugin({
                            toolbarContents: () => <KitchenSinkToolbar />,
                          }),
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          linkPlugin(),
                          linkDialogPlugin(),
                          codeBlockPlugin({
                            defaultCodeBlockLanguage: 'typescript',
                          }),
                          codeMirrorPlugin({
                            codeBlockLanguages: {
                              js: 'JavaScript',
                              ts: 'TypeScript',
                              tsx: 'TSX',
                              jsx: 'JSX',
                              css: 'CSS',
                              html: 'HTML',
                              json: 'JSON',
                              markdown: 'Markdown',
                              bash: 'Bash',
                              python: 'Python',
                              sql: 'SQL',
                            },
                          }),
                        ]}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {hasError && (
                      <motion.div exit={{ height: 0 }}>
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FieldError errors={field.state.meta.errors} />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Field>
              )
            }}
          </form.Field>

          <Field orientation="horizontal" className="pt-4">
            <Button type="submit">
              <HugeiconsIcon icon={DocumentCodeIcon} />
              Generate Markdown
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              <HugeiconsIcon icon={RotateClockwiseIcon} />
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <AnimatePresence mode="wait">
        {generatedMarkdown && (
          <motion.div exit={{ height: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative left-1/2 w-screen max-w-5xl -translate-x-1/2 px-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Generated Markdown
                  </CardTitle>
                  <div className="flex gap-2">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="relative"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div exit={{ height: 0 }}>
                              <motion.span
                                key="check"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-1.5"
                              >
                                <HugeiconsIcon icon={Tick01Icon} />
                                Copied!
                              </motion.span>
                            </motion.div>
                          ) : (
                            <motion.div exit={{ height: 0 }}>
                              <motion.span
                                key="copy"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-1.5"
                              >
                                <HugeiconsIcon icon={Copy01Icon} />
                                Copy
                              </motion.span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <HugeiconsIcon icon={Download01Icon} />
                        Download .md
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <Textarea
                      readOnly
                      value={generatedMarkdown}
                      className="min-h-100 resize-none font-mono text-sm"
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
