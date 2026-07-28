import { createFileRoute } from '@tanstack/react-router'

import { createPageMeta } from '@/lib/seo'
import { Badge } from '@/components/ui/badge'

import { XlsxMetadataEditor } from './-components/xlsx-metadata-editor'

export const Route = createFileRoute('/(home)/_layout/playground/xlsx')({
  component: XlsxPlaygroundPage,
  head: () =>
    createPageMeta({
      title: 'XLSX Metadata Editor',
      description:
        'Inspect and update XLSX workbook metadata locally in your browser.',
      path: '/playground/xlsx',
      noindex: true,
    }),
})

function XlsxPlaygroundPage() {
  return (
    <main className="flex flex-col gap-8 pb-12">
      <header className="flex flex-col items-start gap-3">
        <Badge variant="secondary">Local tool</Badge>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            XLSX metadata editor
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm leading-relaxed text-pretty">
            Inspect one workbook or apply the same metadata changes to a batch.
            Processing happens entirely on your device.
          </p>
        </div>
      </header>

      <XlsxMetadataEditor />
    </main>
  )
}
