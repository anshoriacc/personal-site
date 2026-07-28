// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'

import {
  createBulkArchive,
  readWorkbookMetadata,
  updateWorkbookMetadata,
} from './xlsx-metadata'
import {
  METADATA_KEYS,
  createMetadataFormValues,
  type MetadataKey,
} from './xlsx-metadata.types'

const CONTENT_TYPES_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/content-types'
const RELATIONSHIPS_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/relationships'

function createWorkbook({
  custom = true,
  unsupportedCustom = false,
  signed = false,
}: {
  custom?: boolean
  unsupportedCustom?: boolean
  signed?: boolean
} = {}): Uint8Array {
  const customOverride = custom
    ? '<Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/>'
    : ''
  const customRelationship = custom
    ? '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties" Target="docProps/custom.xml"/>'
    : ''
  const unknownProperty = unsupportedCustom
    ? '<property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="3" name="Uncommon"><vt:vector size="1" baseType="lpwstr"><vt:lpwstr>Preserve me</vt:lpwstr></vt:vector></property>'
    : ''

  const archive: Record<string, Uint8Array> = {
    '[Content_Types].xml': strToU8(
      `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="${CONTENT_TYPES_NAMESPACE}"><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>${customOverride}</Types>`,
    ),
    '_rels/.rels': strToU8(
      `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="${RELATIONSHIPS_NAMESPACE}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>${customRelationship}</Relationships>`,
    ),
    'docProps/core.xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Original title</dc:title><dc:subject>Original subject</dc:subject><dc:creator>Original author</dc:creator><cp:lastModifiedBy>Original editor</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2024-01-02T03:04:05Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2024-02-03T04:05:06Z</dcterms:modified><cp:lastPrinted>2024-03-04T05:06:07Z</cp:lastPrinted><cp:category>Report</cp:category></cp:coreProperties>',
    ),
    'docProps/app.xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><Company>Original company</Company><Manager>Original manager</Manager></Properties>',
    ),
    'xl/workbook.xml': strToU8(
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheets><sheet name="Sheet1" sheetId="1"/></sheets></workbook>',
    ),
    'xl/worksheets/sheet1.xml': strToU8(
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Untouched</t></is></c></row></sheetData></worksheet>',
    ),
  }

  if (custom) {
    archive['docProps/custom.xml'] = strToU8(
      `<?xml version="1.0" encoding="UTF-8"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="2" name="Department"><vt:lpwstr>Finance</vt:lpwstr></property>${unknownProperty}</Properties>`,
    )
  }

  if (signed) {
    archive['_xmlsignatures/sig1.xml'] = strToU8('<Signature/>')
  }

  return zipSync(archive)
}

describe('XLSX metadata', () => {
  it('reads standard, custom, unsupported, and signature metadata', async () => {
    const metadata = await readWorkbookMetadata(
      createWorkbook({ unsupportedCustom: true, signed: true }),
    )

    expect(metadata.standard.title).toBe('Original title')
    expect(metadata.standard.creator).toBe('Original author')
    expect(metadata.standard.company).toBe('Original company')
    expect(metadata.standard.manager).toBe('Original manager')
    expect(metadata.standard.created).toMatch(/^2024-01-02T/)
    expect(metadata.customProperties).toEqual([
      { name: 'Department', type: 'text', value: 'Finance' },
    ])
    expect(metadata.unsupportedCustomPropertyCount).toBe(1)
    expect(metadata.hasDigitalSignatures).toBe(true)
  })

  it('updates every exposed standard property and preserves sheet XML', async () => {
    const original = createWorkbook()
    const values = createMetadataFormValues()
    const expected = {
      title: 'Updated title',
      subject: 'Updated subject',
      description: 'Updated comments',
      keywords: 'alpha, beta',
      category: 'Planning',
      creator: 'New author',
      lastModifiedBy: 'New editor',
      manager: 'New manager',
      company: 'New company',
      created: '2025-01-02T03:04',
      modified: '2025-02-03T04:05',
      lastPrinted: '2025-03-04T05:06',
      revision: '42',
      contentStatus: 'Final',
      identifier: 'DOC-42',
      language: 'en-US',
      version: '2.0',
      template: 'Metadata template',
      hyperlinkBase: 'https://example.com/files/',
    } satisfies Record<MetadataKey, string>

    METADATA_KEYS.forEach((key) => {
      values.standard[key] = { mode: 'set', value: expected[key] }
    })

    const result = await updateWorkbookMetadata('sample.xlsx', original, values)
    const metadata = await readWorkbookMetadata(result.data)
    const originalArchive = unzipSync(original)
    const updatedArchive = unzipSync(result.data)

    METADATA_KEYS.filter(
      (key) => key !== 'created' && key !== 'modified' && key !== 'lastPrinted',
    ).forEach((key) => {
      expect(metadata.standard[key]).toBe(expected[key])
    })

    expect(new Date(metadata.standard.created).getTime()).toBe(
      new Date(expected.created).getTime(),
    )
    expect(new Date(metadata.standard.modified).getTime()).toBe(
      new Date(expected.modified).getTime(),
    )
    expect(new Date(metadata.standard.lastPrinted).getTime()).toBe(
      new Date(expected.lastPrinted).getTime(),
    )
    expect(result.fileName).toBe('sample-metadata-updated.xlsx')
    expect(strFromU8(updatedArchive['xl/workbook.xml'])).toBe(
      strFromU8(originalArchive['xl/workbook.xml']),
    )
    expect(strFromU8(updatedArchive['xl/worksheets/sheet1.xml'])).toBe(
      strFromU8(originalArchive['xl/worksheets/sheet1.xml']),
    )
  })

  it('clears properties without replacing unrelated metadata', async () => {
    const values = createMetadataFormValues()
    values.standard.title = { mode: 'clear', value: 'Ignored' }
    values.standard.company = { mode: 'set', value: 'Changed company' }

    const result = await updateWorkbookMetadata(
      'sample.xlsx',
      createWorkbook(),
      values,
    )
    const metadata = await readWorkbookMetadata(result.data)

    expect(metadata.standard.title).toBe('')
    expect(metadata.standard.subject).toBe('Original subject')
    expect(metadata.standard.company).toBe('Changed company')
    expect(metadata.standard.manager).toBe('Original manager')
  })

  it('creates custom metadata registrations and typed values', async () => {
    const values = createMetadataFormValues()
    values.customProperties = [
      {
        id: 'new-score',
        mode: 'set',
        name: 'Score',
        type: 'number',
        value: '98.5',
      },
      {
        id: 'new-approved',
        mode: 'set',
        name: 'Approved',
        type: 'boolean',
        value: 'true',
      },
    ]

    const result = await updateWorkbookMetadata(
      'sample.xlsx',
      createWorkbook({ custom: false }),
      values,
    )
    const archive = unzipSync(result.data)
    const metadata = await readWorkbookMetadata(result.data)

    expect(archive['docProps/custom.xml']).toBeDefined()
    expect(strFromU8(archive['[Content_Types].xml'])).toContain(
      '/docProps/custom.xml',
    )
    expect(strFromU8(archive['_rels/.rels'])).toContain('custom-properties')
    expect(metadata.customProperties).toEqual([
      { name: 'Score', type: 'number', value: '98.5' },
      { name: 'Approved', type: 'boolean', value: 'true' },
    ])
  })

  it('preserves unsupported custom properties while updating supported ones', async () => {
    const metadata = await readWorkbookMetadata(
      createWorkbook({ unsupportedCustom: true }),
    )
    const values = createMetadataFormValues(metadata)
    values.customProperties[0] = {
      ...values.customProperties[0],
      mode: 'set',
      value: 'Operations',
    }

    const result = await updateWorkbookMetadata(
      'sample.xlsx',
      createWorkbook({ unsupportedCustom: true }),
      values,
    )
    const updatedMetadata = await readWorkbookMetadata(result.data)
    const archive = unzipSync(result.data)

    expect(updatedMetadata.customProperties[0]?.value).toBe('Operations')
    expect(updatedMetadata.unsupportedCustomPropertyCount).toBe(1)
    expect(strFromU8(archive['docProps/custom.xml'])).toContain('Preserve me')
  })

  it('removes an empty custom metadata part and its registrations', async () => {
    const metadata = await readWorkbookMetadata(createWorkbook())
    const values = createMetadataFormValues(metadata)
    values.customProperties[0] = {
      ...values.customProperties[0],
      mode: 'clear',
    }

    const result = await updateWorkbookMetadata(
      'sample.xlsx',
      createWorkbook(),
      values,
    )
    const archive = unzipSync(result.data)

    expect(archive['docProps/custom.xml']).toBeUndefined()
    expect(strFromU8(archive['[Content_Types].xml'])).not.toContain(
      '/docProps/custom.xml',
    )
    expect(strFromU8(archive['_rels/.rels'])).not.toContain('custom-properties')
  })

  it('deduplicates file names inside a bulk archive', async () => {
    const archive = unzipSync(
      await createBulkArchive([
        { fileName: 'report.xlsx', data: strToU8('one') },
        { fileName: 'report.xlsx', data: strToU8('two') },
      ]),
    )

    expect(Object.keys(archive).sort()).toEqual([
      'report-2.xlsx',
      'report.xlsx',
    ])
  })

  it('rejects files that are not XLSX ZIP archives', async () => {
    await expect(readWorkbookMetadata(strToU8('not an xlsx'))).rejects.toThrow(
      'readable, unencrypted XLSX',
    )
  })
})
