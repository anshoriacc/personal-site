import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { AnimatePresence, motion } from 'motion/react'
import z from 'zod'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DocumentCodeIcon,
  RotateClockwiseIcon,
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
import { Switch } from '@/components/ui/switch'
import { TiptapEditor, type TiptapEditorHandle } from './tiptap-editor'
import { MarkdownOutput } from './markdown-output'

const writerFormSchemaWithFrontmatter = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string(),
  author: z.string(),
  publishedDate: z.string(),
  tags: z.string(),
})

const writerFormSchemaNoFrontmatter = z.object({
  title: z.string(),
  excerpt: z.string(),
  author: z.string(),
  publishedDate: z.string(),
  tags: z.string(),
})

type FrontMatter = {
  title: string
  excerpt: string
  author: string
  publishedDate: string
  tags: Array<string>
}

function generateFrontMatter(data: FrontMatter): string {
  const lines = ['---']
  if (data.title) lines.push(`title: "${data.title}"`)
  if (data.excerpt) lines.push(`excerpt: "${data.excerpt}"`)
  if (data.author) lines.push(`author: "${data.author}"`)
  if (data.publishedDate) lines.push(`date: "${data.publishedDate}"`)
  if (data.tags.length > 0) {
    lines.push('tags:')
    data.tags.forEach((tag) => lines.push(`  - ${tag}`))
  }
  lines.push('---')
  return lines.join('\n')
}

export function WriterForm() {
  const [showFrontmatter, setShowFrontmatter] = useState(true)
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(
    null,
  )
  const editorRef = useRef<TiptapEditorHandle | null>(null)
  const showFrontmatterRef = useRef(showFrontmatter)

  const form = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
      author: '',
      publishedDate: new Date().toISOString().split('T')[0],
      tags: '',
    },
    validators: {
      onChange: showFrontmatter
        ? writerFormSchemaWithFrontmatter
        : writerFormSchemaNoFrontmatter,
    },
    onSubmit: ({ value }) => {
      const editor = editorRef.current
      if (!editor) return

      const markdown = editor.getMarkdown()

      if (showFrontmatterRef.current) {
        const tags = value.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)

        const frontMatter = generateFrontMatter({
          title: value.title,
          excerpt: value.excerpt,
          author: value.author,
          publishedDate: value.publishedDate,
          tags,
        })

        setGeneratedMarkdown(`${frontMatter}\n\n${markdown}`)
      } else {
        setGeneratedMarkdown(markdown)
      }
    },
  })

  const handleToggleFrontmatter = (checked: boolean) => {
    showFrontmatterRef.current = checked
    setShowFrontmatter(checked)
  }

  const handleReset = () => {
    form.reset()
    editorRef.current?.clearContent()
    setGeneratedMarkdown(null)
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-semibold sm:text-lg">Markdown Generator</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Generate markdown files with optional front matter for your blog
          posts.
        </p>
      </div>

      <Field orientation="horizontal">
        <FieldLabel htmlFor="show-frontmatter">Include Front Matter</FieldLabel>
        <Switch
          id="show-frontmatter"
          checked={showFrontmatter}
          onCheckedChange={handleToggleFrontmatter}
        />
      </Field>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <AnimatePresence mode="wait">
            {showFrontmatter ? (
              <motion.div
                key="frontmatter-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
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
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Field>
                      )
                    }}
                  </form.Field>

                  <form.Field name="excerpt">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Excerpt</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Post excerpt"
                          autoComplete="off"
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <div className="grid grid-cols-2 gap-4">
                    <form.Field name="author">
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>Author</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Author name"
                            autoComplete="off"
                          />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="publishedDate">
                      {(field) => (
                        <Field>
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
                            autoComplete="off"
                          />
                        </Field>
                      )}
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
                        <FieldDescription>
                          Separate tags with commas
                        </FieldDescription>
                      </Field>
                    )}
                  </form.Field>
                </FieldSet>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <FieldSeparator />

          <div>
            <FieldLabel>Markdown Content</FieldLabel>
            <FieldDescription>
              The main content of the post in markdown format.
            </FieldDescription>
          </div>

          <div className="relative left-1/2 w-screen! max-w-5xl! -translate-x-1/2 px-4">
            <TiptapEditor ref={editorRef} />
          </div>

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
        {generatedMarkdown ? (
          <motion.div
            key="output"
            exit={{ height: 0 }}
            className="relative left-1/2 w-screen! max-w-5xl! -translate-x-1/2 px-4"
          >
            <MarkdownOutput
              markdown={generatedMarkdown}
              filename={`${(form.state.values.title || 'untitled').toLowerCase().replace(/\s+/g, '-')}.md`}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
