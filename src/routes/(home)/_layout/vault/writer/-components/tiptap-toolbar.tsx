import { memo } from 'react'
import { type Editor } from '@tiptap/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  CodeIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightBlockQuoteIcon,
  SourceCodeIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  Link01Icon,
  Image01Icon,
  Table01Icon,
  UndoIcon,
  RedoIcon,
} from '@hugeicons/core-free-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  tooltip: string
  icon: Parameters<typeof HugeiconsIcon>[0]['icon']
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  tooltip,
  icon,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            className={cn(isActive && 'bg-muted text-foreground')}
          >
            <HugeiconsIcon icon={icon} />
          </Button>
        }
      />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

function handleLinkInsert(editor: Editor) {
  const previousUrl = editor.getAttributes('link').href
  const url = window.prompt('Enter URL', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function handleImageInsert(editor: Editor) {
  const url = window.prompt('Enter image URL')

  if (!url) return

  const alt = window.prompt('Enter alt text (optional)') || ''

  editor.chain().focus().setImage({ src: url, alt }).run()
}

function handleTableInsert(editor: Editor) {
  editor
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}

export const TiptapToolbar = memo(function TiptapToolbar({
  editor,
}: {
  editor: Editor
}) {
  return (
    <div
      data-slot="tiptap-toolbar"
      className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b p-1"
    >
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        tooltip="Bold"
        icon={TextBoldIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        tooltip="Italic"
        icon={TextItalicIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        tooltip="Underline"
        icon={TextUnderlineIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        tooltip="Strikethrough"
        icon={TextStrikethroughIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        tooltip="Inline Code"
        icon={CodeIcon}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        tooltip="Heading 1"
        icon={Heading01Icon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        tooltip="Heading 2"
        icon={Heading02Icon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        tooltip="Heading 3"
        icon={Heading03Icon}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Block types */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        tooltip="Blockquote"
        icon={LeftToRightBlockQuoteIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        tooltip="Code Block"
        icon={SourceCodeIcon}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        tooltip="Bullet List"
        icon={LeftToRightListBulletIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        tooltip="Ordered List"
        icon={LeftToRightListNumberIcon}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Insert */}
      <ToolbarButton
        onClick={() => handleLinkInsert(editor)}
        isActive={editor.isActive('link')}
        tooltip="Link"
        icon={Link01Icon}
      />
      <ToolbarButton
        onClick={() => handleImageInsert(editor)}
        tooltip="Image"
        icon={Image01Icon}
      />
      <ToolbarButton
        onClick={() => handleTableInsert(editor)}
        tooltip="Insert Table"
        icon={Table01Icon}
      />

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        tooltip="Undo"
        icon={UndoIcon}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        tooltip="Redo"
        icon={RedoIcon}
      />
    </div>
  )
})
