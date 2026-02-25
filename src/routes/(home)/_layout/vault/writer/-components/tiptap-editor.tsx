import { forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import { TiptapToolbar } from './tiptap-toolbar'

const lowlight = createLowlight(common)

// Hoisted static config to avoid recreation on every render (rerender-lazy-state-init, rendering-hoist-jsx)
const extensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  Markdown,
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  Image,
  Underline,
  Placeholder.configure({
    placeholder: 'Start writing your content...',
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
  CodeBlockLowlight.configure({
    lowlight,
  }),
]

const editorProps = {
  attributes: {
    class:
      'prose prose-zinc dark:prose-invert max-w-none min-h-[350px] p-4 focus:outline-none',
  },
}

const editorSkeleton = (
  <div className="rounded-lg border">
    <div className="bg-muted/30 border-b p-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-muted h-6 w-6 animate-pulse rounded" />
        ))}
      </div>
    </div>
    <div className="min-h-[350px] p-4">
      <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
    </div>
  </div>
)

export type TiptapEditorHandle = {
  getMarkdown: () => string
  clearContent: () => void
}

export const TiptapEditor = forwardRef<TiptapEditorHandle>(
  function TiptapEditor(_props, ref) {
    const editor = useEditor({
      extensions,
      content: '',
      editorProps,
    })

    useImperativeHandle(ref, () => ({
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      getMarkdown: () => editor?.getMarkdown() ?? '',
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      clearContent: () => editor?.commands.clearContent(),
    }))

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!editor) {
      return editorSkeleton
    }

    return (
      <div className="rounded-lg border">
        <TiptapToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    )
  },
)
