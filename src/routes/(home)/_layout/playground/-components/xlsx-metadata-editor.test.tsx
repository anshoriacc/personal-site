import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { strToU8, zipSync } from 'fflate'
import { afterEach, describe, expect, it } from 'vitest'

import { XlsxMetadataEditor } from './xlsx-metadata-editor'

const CONTENT_TYPES_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/content-types'
const RELATIONSHIPS_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/relationships'

afterEach(cleanup)

function createWorkbookFile(name: string): File {
  const bytes = zipSync({
    '[Content_Types].xml': strToU8(
      `<?xml version="1.0"?><Types xmlns="${CONTENT_TYPES_NAMESPACE}"><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
    ),
    '_rels/.rels': strToU8(
      `<?xml version="1.0"?><Relationships xmlns="${RELATIONSHIPS_NAMESPACE}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
    ),
    'docProps/core.xml': strToU8(
      '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Loaded workbook</dc:title><dc:creator>Test author</dc:creator></cp:coreProperties>',
    ),
    'xl/workbook.xml': strToU8(
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"/>',
    ),
  })
  const file = new File([bytes], name, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    lastModified: Date.now(),
  })
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer

  Object.defineProperty(file, 'arrayBuffer', {
    value: async () => arrayBuffer,
  })

  return file
}

function selectFiles(container: HTMLElement, files: Array<File>): void {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input) throw new Error('File input not found.')

  fireEvent.change(input, { target: { files } })
}

describe('XlsxMetadataEditor', () => {
  it('loads existing metadata for a single workbook', async () => {
    const { container } = render(<XlsxMetadataEditor />)

    selectFiles(container, [createWorkbookFile('single.xlsx')])

    expect(await screen.findByText('Ready')).toBeTruthy()
    expect(screen.getByText('Single file')).toBeTruthy()
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveProperty(
        'value',
        'Loaded workbook',
      )
    })
    fireEvent.click(screen.getByText('People & organization'))
    expect(screen.getByLabelText('Author')).toHaveProperty(
      'value',
      'Test author',
    )
  })

  it('switches to blank, keep-safe bulk mode for multiple workbooks', async () => {
    const { container } = render(<XlsxMetadataEditor />)

    selectFiles(container, [
      createWorkbookFile('first.xlsx'),
      createWorkbookFile('second.xlsx'),
    ])

    await waitFor(() => {
      expect(screen.getAllByText('Ready')).toHaveLength(2)
    })
    expect(screen.getByText('Bulk · 2')).toBeTruthy()
    expect(screen.getByLabelText('Title')).toHaveProperty('value', '')
    expect(
      screen
        .getAllByLabelText(/update mode$/)
        .every((control) => control.textContent?.includes('Keep')),
    ).toBe(true)
  })

  it('rejects non-XLSX files before processing', async () => {
    const { container } = render(<XlsxMetadataEditor />)
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' })

    selectFiles(container, [file])

    expect(
      await screen.findByText('Only .xlsx files are supported.'),
    ).toBeTruthy()
    expect(screen.getByText('Error')).toBeTruthy()
    expect(
      screen.getByText('Metadata form appears after a workbook is ready.'),
    ).toBeTruthy()
  })
})
