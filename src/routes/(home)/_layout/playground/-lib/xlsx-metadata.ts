import { unzip, zip, type AsyncZippable, type Unzipped } from 'fflate'

import {
  METADATA_KEYS,
  createEmptyMetadataValues,
  type CustomPropertyEdit,
  type CustomPropertyType,
  type MetadataEdit,
  type MetadataEdits,
  type MetadataFormValues,
  type MetadataKey,
  type MetadataValues,
  type WorkbookMetadata,
  type WorkbookUpdateResult,
} from './xlsx-metadata.types'

const CORE_PATH = 'docProps/core.xml'
const EXTENDED_PATH = 'docProps/app.xml'
const CUSTOM_PATH = 'docProps/custom.xml'
const CONTENT_TYPES_PATH = '[Content_Types].xml'
const ROOT_RELATIONSHIPS_PATH = '_rels/.rels'
const WORKBOOK_PATH = 'xl/workbook.xml'

const CORE_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/metadata/core-properties'
const DC_NAMESPACE = 'http://purl.org/dc/elements/1.1/'
const DCTERMS_NAMESPACE = 'http://purl.org/dc/terms/'
const XSI_NAMESPACE = 'http://www.w3.org/2001/XMLSchema-instance'
const EXTENDED_NAMESPACE =
  'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties'
const CUSTOM_NAMESPACE =
  'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties'
const VT_NAMESPACE =
  'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes'
const CONTENT_TYPES_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/content-types'
const RELATIONSHIPS_NAMESPACE =
  'http://schemas.openxmlformats.org/package/2006/relationships'

const CORE_CONTENT_TYPE =
  'application/vnd.openxmlformats-package.core-properties+xml'
const EXTENDED_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.extended-properties+xml'
const CUSTOM_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.custom-properties+xml'

const CORE_RELATIONSHIP =
  'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties'
const EXTENDED_RELATIONSHIP =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties'
const CUSTOM_RELATIONSHIP =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties'

const CUSTOM_FORMAT_ID = '{D5CDD505-2E9C-101B-9397-08002B2CF9AE}'

const CORE_FIELD_MAP = {
  title: [DC_NAMESPACE, 'dc:title'],
  subject: [DC_NAMESPACE, 'dc:subject'],
  creator: [DC_NAMESPACE, 'dc:creator'],
  description: [DC_NAMESPACE, 'dc:description'],
  keywords: [CORE_NAMESPACE, 'cp:keywords'],
  category: [CORE_NAMESPACE, 'cp:category'],
  lastModifiedBy: [CORE_NAMESPACE, 'cp:lastModifiedBy'],
  created: [DCTERMS_NAMESPACE, 'dcterms:created'],
  modified: [DCTERMS_NAMESPACE, 'dcterms:modified'],
  lastPrinted: [CORE_NAMESPACE, 'cp:lastPrinted'],
  revision: [CORE_NAMESPACE, 'cp:revision'],
  contentStatus: [CORE_NAMESPACE, 'cp:contentStatus'],
  identifier: [DC_NAMESPACE, 'dc:identifier'],
  language: [DC_NAMESPACE, 'dc:language'],
  version: [CORE_NAMESPACE, 'cp:version'],
} as const satisfies Partial<
  Record<MetadataKey, readonly [namespace: string, qualifiedName: string]>
>

const EXTENDED_FIELD_MAP = {
  manager: 'Manager',
  company: 'Company',
  template: 'Template',
  hyperlinkBase: 'HyperlinkBase',
} as const satisfies Partial<Record<MetadataKey, string>>

const DATE_KEYS = new Set<MetadataKey>(['created', 'modified', 'lastPrinted'])

const TEXT_DECODER = new TextDecoder()
const TEXT_ENCODER = new TextEncoder()

type XmlRegistration = {
  path: string
  contentType: string
  relationshipType: string
}

type ParsedCustomProperty = {
  element: Element
  name: string
  type?: CustomPropertyType
  value?: string
}

const STANDARD_REGISTRATIONS = {
  core: {
    path: CORE_PATH,
    contentType: CORE_CONTENT_TYPE,
    relationshipType: CORE_RELATIONSHIP,
  },
  extended: {
    path: EXTENDED_PATH,
    contentType: EXTENDED_CONTENT_TYPE,
    relationshipType: EXTENDED_RELATIONSHIP,
  },
  custom: {
    path: CUSTOM_PATH,
    contentType: CUSTOM_CONTENT_TYPE,
    relationshipType: CUSTOM_RELATIONSHIP,
  },
} as const satisfies Record<string, XmlRegistration>

function unzipArchive(data: Uint8Array): Promise<Unzipped> {
  return new Promise((resolve, reject) => {
    unzip(data, (error, archive) => {
      if (error) {
        reject(new Error('File is not a readable, unencrypted XLSX archive.'))
        return
      }

      resolve(archive)
    })
  })
}

function zipArchive(data: AsyncZippable): Promise<Uint8Array<ArrayBuffer>> {
  return new Promise((resolve, reject) => {
    zip(data, { level: 6 }, (error, archive) => {
      if (error) {
        reject(new Error('Could not create the updated XLSX archive.'))
        return
      }

      resolve(Uint8Array.from(archive))
    })
  })
}

function validateArchive(archive: Unzipped): void {
  const requiredPaths = [
    CONTENT_TYPES_PATH,
    ROOT_RELATIONSHIPS_PATH,
    WORKBOOK_PATH,
  ]
  const missingPath = requiredPaths.find((path) => !archive[path])

  if (missingPath) {
    throw new Error('File is not a valid XLSX workbook.')
  }
}

function parseXml(data: Uint8Array, label: string): XMLDocument {
  const document = new DOMParser().parseFromString(
    TEXT_DECODER.decode(data),
    'application/xml',
  )

  if (document.getElementsByTagName('parsererror').length > 0) {
    throw new Error(`${label} contains invalid XML.`)
  }

  return document
}

function serializeXml(document: XMLDocument): Uint8Array<ArrayBuffer> {
  const xml = new XMLSerializer().serializeToString(document.documentElement)
  return TEXT_ENCODER.encode(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${xml}`,
  ) as Uint8Array<ArrayBuffer>
}

function createXmlDocument(xml: string, label: string): XMLDocument {
  return parseXml(TEXT_ENCODER.encode(xml), label)
}

function createCoreDocument(): XMLDocument {
  return createXmlDocument(
    `<cp:coreProperties xmlns:cp="${CORE_NAMESPACE}" xmlns:dc="${DC_NAMESPACE}" xmlns:dcterms="${DCTERMS_NAMESPACE}" xmlns:xsi="${XSI_NAMESPACE}"></cp:coreProperties>`,
    'Core properties',
  )
}

function createExtendedDocument(): XMLDocument {
  return createXmlDocument(
    `<Properties xmlns="${EXTENDED_NAMESPACE}" xmlns:vt="${VT_NAMESPACE}"></Properties>`,
    'Extended properties',
  )
}

function createCustomDocument(): XMLDocument {
  return createXmlDocument(
    `<Properties xmlns="${CUSTOM_NAMESPACE}" xmlns:vt="${VT_NAMESPACE}"></Properties>`,
    'Custom properties',
  )
}

function getElement(
  document: XMLDocument,
  namespace: string,
  localName: string,
): Element | undefined {
  return (
    document.getElementsByTagNameNS(namespace, localName).item(0) ?? undefined
  )
}

function readElementText(
  document: XMLDocument | undefined,
  namespace: string,
  localName: string,
): string {
  return document
    ? (getElement(document, namespace, localName)?.textContent ?? '')
    : ''
}

function toLocalDateTime(value: string): string {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 16)
}

function toIsoDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`"${value}" is not a valid date and time.`)
  }

  return date.toISOString()
}

function getCoreValues(document?: XMLDocument): Partial<MetadataValues> {
  return Object.fromEntries(
    Object.entries(CORE_FIELD_MAP).map(([key, [namespace, qualifiedName]]) => {
      const value = readElementText(
        document,
        namespace,
        qualifiedName.split(':').at(-1) ?? qualifiedName,
      )

      return [
        key,
        DATE_KEYS.has(key as MetadataKey) ? toLocalDateTime(value) : value,
      ]
    }),
  )
}

function getExtendedValues(document?: XMLDocument): Partial<MetadataValues> {
  return Object.fromEntries(
    Object.entries(EXTENDED_FIELD_MAP).map(([key, localName]) => [
      key,
      readElementText(document, EXTENDED_NAMESPACE, localName),
    ]),
  )
}

function parseCustomProperty(element: Element): ParsedCustomProperty {
  const valueElement = Array.from(element.children).at(0)
  const localName = valueElement?.localName
  const rawValue = valueElement?.textContent ?? ''

  if (!valueElement || !localName) {
    return { element, name: element.getAttribute('name') ?? '' }
  }

  if (['lpwstr', 'lpstr', 'bstr'].includes(localName)) {
    return {
      element,
      name: element.getAttribute('name') ?? '',
      type: 'text',
      value: rawValue,
    }
  }

  if (
    [
      'i1',
      'i2',
      'i4',
      'i8',
      'int',
      'ui1',
      'ui2',
      'ui4',
      'ui8',
      'uint',
      'r4',
      'r8',
      'decimal',
    ].includes(localName)
  ) {
    return {
      element,
      name: element.getAttribute('name') ?? '',
      type: 'number',
      value: rawValue,
    }
  }

  if (localName === 'bool') {
    return {
      element,
      name: element.getAttribute('name') ?? '',
      type: 'boolean',
      value: rawValue.toLowerCase() === 'true' ? 'true' : 'false',
    }
  }

  if (localName === 'filetime' || localName === 'date') {
    return {
      element,
      name: element.getAttribute('name') ?? '',
      type: 'date',
      value: toLocalDateTime(rawValue),
    }
  }

  return { element, name: element.getAttribute('name') ?? '' }
}

function getCustomProperties(document?: XMLDocument): {
  properties: WorkbookMetadata['customProperties']
  unsupportedCount: number
} {
  if (!document) return { properties: [], unsupportedCount: 0 }

  const parsed = Array.from(
    document.getElementsByTagNameNS(CUSTOM_NAMESPACE, 'property'),
  ).map(parseCustomProperty)

  return {
    properties: parsed.flatMap((property) =>
      property.type && property.name
        ? [
            {
              name: property.name,
              type: property.type,
              value: property.value ?? '',
            },
          ]
        : [],
    ),
    unsupportedCount: parsed.filter((property) => !property.type).length,
  }
}

function getDocuments(archive: Unzipped): {
  core?: XMLDocument
  extended?: XMLDocument
  custom?: XMLDocument
} {
  return {
    core: archive[CORE_PATH]
      ? parseXml(archive[CORE_PATH], 'Core properties')
      : undefined,
    extended: archive[EXTENDED_PATH]
      ? parseXml(archive[EXTENDED_PATH], 'Extended properties')
      : undefined,
    custom: archive[CUSTOM_PATH]
      ? parseXml(archive[CUSTOM_PATH], 'Custom properties')
      : undefined,
  }
}

function hasEdits(
  edits: MetadataEdits,
  keys: ReadonlyArray<MetadataKey>,
): boolean {
  return keys.some((key) => edits[key].mode !== 'keep')
}

function applyXmlEdit(
  document: XMLDocument,
  namespace: string,
  qualifiedName: string,
  edit: MetadataEdit,
  isDate = false,
): void {
  if (edit.mode === 'keep') return

  const localName = qualifiedName.split(':').at(-1) ?? qualifiedName
  const existing = getElement(document, namespace, localName)

  if (edit.mode === 'clear') {
    existing?.remove()
    return
  }

  const element =
    existing ??
    document.createElementNS(
      namespace,
      qualifiedName.includes(':') ? qualifiedName : localName,
    )

  if (!existing) document.documentElement.append(element)

  element.textContent = isDate ? toIsoDateTime(edit.value) : edit.value

  if (
    isDate &&
    (qualifiedName === 'dcterms:created' ||
      qualifiedName === 'dcterms:modified')
  ) {
    element.setAttributeNS(XSI_NAMESPACE, 'xsi:type', 'dcterms:W3CDTF')
  }
}

function applyCoreEdits(document: XMLDocument, edits: MetadataEdits): void {
  Object.entries(CORE_FIELD_MAP).forEach(
    ([key, [namespace, qualifiedName]]) => {
      applyXmlEdit(
        document,
        namespace,
        qualifiedName,
        edits[key as MetadataKey],
        DATE_KEYS.has(key as MetadataKey),
      )
    },
  )
}

function applyExtendedEdits(document: XMLDocument, edits: MetadataEdits): void {
  Object.entries(EXTENDED_FIELD_MAP).forEach(([key, localName]) => {
    applyXmlEdit(
      document,
      EXTENDED_NAMESPACE,
      localName,
      edits[key as MetadataKey],
    )
  })
}

function createCustomValueElement(
  document: XMLDocument,
  edit: CustomPropertyEdit,
): Element {
  const localNameByType = {
    text: 'lpwstr',
    number: 'r8',
    boolean: 'bool',
    date: 'filetime',
  } as const
  const element = document.createElementNS(
    VT_NAMESPACE,
    `vt:${localNameByType[edit.type]}`,
  )

  element.textContent =
    edit.type === 'date'
      ? toIsoDateTime(edit.value)
      : edit.type === 'boolean'
        ? edit.value === 'true'
          ? 'true'
          : 'false'
        : edit.value

  return element
}

function nextCustomPropertyId(document: XMLDocument): number {
  return (
    Math.max(
      1,
      ...Array.from(
        document.getElementsByTagNameNS(CUSTOM_NAMESPACE, 'property'),
      ).map((element) => Number(element.getAttribute('pid')) || 1),
    ) + 1
  )
}

function findCustomProperty(
  document: XMLDocument,
  name: string,
): Element | undefined {
  return Array.from(
    document.getElementsByTagNameNS(CUSTOM_NAMESPACE, 'property'),
  ).find((element) => element.getAttribute('name') === name)
}

function applyCustomEdits(
  document: XMLDocument,
  edits: Array<CustomPropertyEdit>,
): void {
  edits.forEach((edit) => {
    if (edit.mode === 'keep') return

    const sourceName = edit.originalName ?? edit.name

    if (edit.mode === 'clear') {
      findCustomProperty(document, sourceName)?.remove()
      return
    }

    if (edit.originalName && edit.originalName !== edit.name) {
      findCustomProperty(document, edit.originalName)?.remove()
    }

    const existing = findCustomProperty(document, edit.name)
    const property =
      existing ?? document.createElementNS(CUSTOM_NAMESPACE, 'property')

    if (!existing) {
      property.setAttribute('fmtid', CUSTOM_FORMAT_ID)
      property.setAttribute('pid', String(nextCustomPropertyId(document)))
      document.documentElement.append(property)
    }

    property.setAttribute('name', edit.name)
    property.replaceChildren(createCustomValueElement(document, edit))
  })
}

function ensurePartRegistration(
  archive: Unzipped,
  registration: XmlRegistration,
): void {
  const contentTypes = parseXml(archive[CONTENT_TYPES_PATH], 'Content types')
  const partName = `/${registration.path}`
  const hasOverride = Array.from(
    contentTypes.getElementsByTagNameNS(CONTENT_TYPES_NAMESPACE, 'Override'),
  ).some((element) => element.getAttribute('PartName') === partName)

  if (!hasOverride) {
    const override = contentTypes.createElementNS(
      CONTENT_TYPES_NAMESPACE,
      'Override',
    )
    override.setAttribute('PartName', partName)
    override.setAttribute('ContentType', registration.contentType)
    contentTypes.documentElement.append(override)
    archive[CONTENT_TYPES_PATH] = serializeXml(contentTypes)
  }

  const relationships = parseXml(
    archive[ROOT_RELATIONSHIPS_PATH],
    'Package relationships',
  )
  const relationshipElements = Array.from(
    relationships.getElementsByTagNameNS(
      RELATIONSHIPS_NAMESPACE,
      'Relationship',
    ),
  )
  const hasRelationship = relationshipElements.some(
    (element) => element.getAttribute('Type') === registration.relationshipType,
  )

  if (!hasRelationship) {
    const ids = new Set(
      relationshipElements.map((element) => element.getAttribute('Id')),
    )
    let idNumber = 1
    while (ids.has(`rId${idNumber}`)) idNumber += 1

    const relationship = relationships.createElementNS(
      RELATIONSHIPS_NAMESPACE,
      'Relationship',
    )
    relationship.setAttribute('Id', `rId${idNumber}`)
    relationship.setAttribute('Type', registration.relationshipType)
    relationship.setAttribute('Target', registration.path)
    relationships.documentElement.append(relationship)
    archive[ROOT_RELATIONSHIPS_PATH] = serializeXml(relationships)
  }
}

function removePartRegistration(
  archive: Unzipped,
  registration: XmlRegistration,
): void {
  const contentTypes = parseXml(archive[CONTENT_TYPES_PATH], 'Content types')
  const partName = `/${registration.path}`
  Array.from(
    contentTypes.getElementsByTagNameNS(CONTENT_TYPES_NAMESPACE, 'Override'),
  )
    .filter((element) => element.getAttribute('PartName') === partName)
    .forEach((element) => element.remove())
  archive[CONTENT_TYPES_PATH] = serializeXml(contentTypes)

  const relationships = parseXml(
    archive[ROOT_RELATIONSHIPS_PATH],
    'Package relationships',
  )
  Array.from(
    relationships.getElementsByTagNameNS(
      RELATIONSHIPS_NAMESPACE,
      'Relationship',
    ),
  )
    .filter(
      (element) =>
        element.getAttribute('Type') === registration.relationshipType,
    )
    .forEach((element) => element.remove())
  archive[ROOT_RELATIONSHIPS_PATH] = serializeXml(relationships)
}

function hasCustomPropertyElements(document: XMLDocument): boolean {
  return (
    document.getElementsByTagNameNS(CUSTOM_NAMESPACE, 'property').length > 0
  )
}

function updatedFileName(fileName: string): string {
  const baseName = fileName.replace(/\.xlsx$/i, '')
  return `${baseName}-metadata-updated.xlsx`
}

export async function readWorkbookMetadata(
  data: ArrayBuffer | Uint8Array,
): Promise<WorkbookMetadata> {
  const archive = await unzipArchive(
    data instanceof Uint8Array ? data : new Uint8Array(data),
  )
  validateArchive(archive)

  const { core, extended, custom } = getDocuments(archive)
  const customProperties = getCustomProperties(custom)
  const standard = {
    ...createEmptyMetadataValues(),
    ...getCoreValues(core),
    ...getExtendedValues(extended),
  }

  return {
    standard,
    customProperties: customProperties.properties,
    hasDigitalSignatures: Object.keys(archive).some((path) =>
      path.toLowerCase().startsWith('_xmlsignatures/'),
    ),
    unsupportedCustomPropertyCount: customProperties.unsupportedCount,
  }
}

export async function updateWorkbookMetadata(
  fileName: string,
  data: ArrayBuffer | Uint8Array,
  values: MetadataFormValues,
): Promise<WorkbookUpdateResult> {
  const archive = await unzipArchive(
    data instanceof Uint8Array ? data : new Uint8Array(data),
  )
  validateArchive(archive)

  const coreKeys = Object.keys(CORE_FIELD_MAP) as Array<MetadataKey>
  if (hasEdits(values.standard, coreKeys)) {
    const core = archive[CORE_PATH]
      ? parseXml(archive[CORE_PATH], 'Core properties')
      : createCoreDocument()
    applyCoreEdits(core, values.standard)
    archive[CORE_PATH] = serializeXml(core)
    ensurePartRegistration(archive, STANDARD_REGISTRATIONS.core)
  }

  const extendedKeys = Object.keys(EXTENDED_FIELD_MAP) as Array<MetadataKey>
  if (hasEdits(values.standard, extendedKeys)) {
    const extended = archive[EXTENDED_PATH]
      ? parseXml(archive[EXTENDED_PATH], 'Extended properties')
      : createExtendedDocument()
    applyExtendedEdits(extended, values.standard)
    archive[EXTENDED_PATH] = serializeXml(extended)
    ensurePartRegistration(archive, STANDARD_REGISTRATIONS.extended)
  }

  if (values.customProperties.some((edit) => edit.mode !== 'keep')) {
    const custom = archive[CUSTOM_PATH]
      ? parseXml(archive[CUSTOM_PATH], 'Custom properties')
      : createCustomDocument()
    applyCustomEdits(custom, values.customProperties)

    if (hasCustomPropertyElements(custom)) {
      archive[CUSTOM_PATH] = serializeXml(custom)
      ensurePartRegistration(archive, STANDARD_REGISTRATIONS.custom)
    } else {
      delete archive[CUSTOM_PATH]
      removePartRegistration(archive, STANDARD_REGISTRATIONS.custom)
    }
  }

  return {
    data: await zipArchive(archive),
    fileName: updatedFileName(fileName),
  }
}

export async function createBulkArchive(
  results: Array<WorkbookUpdateResult>,
): Promise<Uint8Array> {
  const entries: AsyncZippable = {}
  const usedNames = new Set<string>()

  results.forEach((result) => {
    let name = result.fileName
    let suffix = 2

    while (usedNames.has(name.toLowerCase())) {
      name = result.fileName.replace(/\.xlsx$/i, `-${suffix}.xlsx`)
      suffix += 1
    }

    usedNames.add(name.toLowerCase())
    entries[name] = result.data
  })

  return zipArchive(entries)
}

export function hasMetadataChanges(values: MetadataFormValues): boolean {
  return (
    METADATA_KEYS.some((key) => values.standard[key].mode !== 'keep') ||
    values.customProperties.some((property) => property.mode !== 'keep')
  )
}
