# Tiptap Writer Revamp

## Overview

Replace the existing MDXEditor-based writer at `/vault/writer` with a Tiptap-based WYSIWYG editor. Move the old writer to `/vault/writer/legacy`. Add optional frontmatter toggle, table support, image URL insertion, and markdown export via `@tiptap/markdown`.

## Route Structure

```
vault/writer/
  index.tsx                    # NEW: Tiptap-based writer (main page)
  -components/
    tiptap-editor.tsx          # Tiptap editor wrapper (useEditor + EditorContent)
    tiptap-toolbar.tsx         # Custom toolbar using existing shadcn components
    writer-form.tsx            # Form with frontmatter toggle + editor + export
    markdown-output.tsx        # Extracted output card (Copy/Download/Textarea)
  legacy/
    index.tsx                  # OLD writer page (moved here)
    -components/
      writer-form.tsx          # OLD writer-form (moved as-is)
```

## Dependencies

Install:

- `@tiptap/react` `@tiptap/starter-kit` `@tiptap/markdown`
- `@tiptap/extension-link` `@tiptap/extension-image` `@tiptap/extension-underline`
- `@tiptap/extension-placeholder`
- `@tiptap/extension-table` `@tiptap/extension-table-row` `@tiptap/extension-table-cell` `@tiptap/extension-table-header`
- `@tiptap/extension-code-block-lowlight` `lowlight`

Keep: `@mdxeditor/editor` (used by legacy writer)

## Integration Approach

Manual integration -- no tiptap CLI template. Build toolbar with existing shadcn/base-nova Button + Tooltip components. No SCSS, no parallel component system.

## Editor Configuration

Extensions: StarterKit, Markdown, Link, Image, Underline, Placeholder, Table, TableRow, TableCell, TableHeader, CodeBlockLowlight

Markdown export: `editor.getMarkdown()` via `@tiptap/markdown` serialization.

Theme: Use `prose dark:prose-invert` on editor content area. Toolbar buttons use existing shadcn Button (already theme-aware via CSS variables).

Layout: Same breakout pattern as existing editor -- `relative left-1/2 w-screen! max-w-5xl! -translate-x-1/2 px-4`

## Toolbar

Grouped sections:

1. Text formatting: Bold, Italic, Underline, Strike, Code
2. Block types: Headings dropdown, Blockquote, Code Block
3. Lists: Bullet, Ordered
4. Insert: Link (URL prompt), Image (URL prompt)
5. Table: Insert table, add/remove row/column
6. History: Undo, Redo

All built with shadcn Button (variant="outline", size="sm") + Tooltip.

## Frontmatter Toggle

- Switch component (new UI component) at top of form: "Include Front Matter"
- When ON: collapsible section with AnimatePresence animation reveals fields
- When OFF: fields hidden, export produces only markdown (no `---` block)

Fields (TanStack Form + Zod):

- Title (required when frontmatter is enabled)
- Excerpt (optional, textarea)
- Author (optional, text input)
- Published Date (optional, date input, defaults to today)
- Tags (optional, comma-separated)

Dynamic Zod schema changes based on `showFrontmatter` toggle.

## Image Handling

URL paste only. Button prompts for URL, inserts `![alt](url)` into editor. No upload UI, no storage backend.

## Component Architecture

```
WriterPage (index.tsx)
  WriterForm
    [Toggle: showFrontmatter] (Switch)
    [AnimatePresence]
      FrontmatterFields (TanStack Form)
        Title | Excerpt | Author + Date | Tags
    TiptapEditor (breakout width, lazy-loaded)
      TiptapToolbar (shadcn Buttons, memoized)
      EditorContent (prose dark:prose-invert)
    [Generate + Reset buttons]
    [AnimatePresence]
      MarkdownOutput (breakout width, same max-w-5xl)
        Copy | Download | Textarea (readonly)
```

Data flow on "Generate":

1. If showFrontmatter ON: validate form (title required), build frontmatter string
2. Get markdown: `editor.getMarkdown()`
3. Validate content non-empty
4. Combine: frontmatter (if any) + `\n\n` + markdown
5. Set generatedMarkdown state, show output card

Reset: `form.reset()` + `editor.commands.clearContent()` + hide output

## Performance

- `bundle-dynamic-imports`: Lazy-load TiptapEditor with React.lazy() + Suspense skeleton
- `rerender-memo`: Toolbar extracted as separate component to avoid re-render on keystroke
- `rendering-conditional-render`: Ternary for frontmatter section

## New UI Component

Switch component (`src/components/ui/switch.tsx`):

- Uses `@base-ui/react` Switch primitive
- Follows base-nova pattern: cn(), data-slot, CVA
- Accessible, theme-aware

## Implementation Phases

### Phase 1: Setup

1. Install tiptap dependencies

### Phase 2: Move Legacy Writer

2. Create `vault/writer/legacy/index.tsx`
3. Create `vault/writer/legacy/-components/writer-form.tsx` (copy existing)
4. Update route path

### Phase 3: Switch Component

5. Create `src/components/ui/switch.tsx`

### Phase 4: Tiptap Components

6. Create `tiptap-toolbar.tsx`
7. Create `tiptap-editor.tsx`

### Phase 5: New Writer Form

8. Create `markdown-output.tsx`
9. Create new `writer-form.tsx`
10. Update `vault/writer/index.tsx`

### Phase 6: Verification

11. Cleanup imports
12. `pnpm check` (format + lint)
13. `pnpm build` (verify no SSR/bundling issues)
14. Manual test: dark/light mode, frontmatter toggle, export flow
