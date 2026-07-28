export type PropertyMode = 'keep' | 'set' | 'clear'

export type MetadataInput = 'text' | 'textarea' | 'datetime-local'

export type MetadataFieldDefinition = {
  key: MetadataKey
  label: string
  description: string
  input: MetadataInput
  placeholder?: string
}

export type MetadataGroupDefinition = {
  id: string
  label: string
  description: string
  fields: ReadonlyArray<MetadataFieldDefinition>
}

export const METADATA_GROUPS = [
  {
    id: 'document',
    label: 'Document',
    description: 'Descriptive details shown in Excel file properties.',
    fields: [
      {
        key: 'title',
        label: 'Title',
        description: 'Display title for this workbook.',
        input: 'text',
        placeholder: 'Quarterly planning',
      },
      {
        key: 'subject',
        label: 'Subject',
        description: 'Short summary of the workbook topic.',
        input: 'text',
        placeholder: 'Operations and revenue',
      },
      {
        key: 'description',
        label: 'Comments',
        description: 'Long-form description stored as document comments.',
        input: 'textarea',
        placeholder: 'Context, ownership, or handling notes',
      },
      {
        key: 'keywords',
        label: 'Keywords',
        description: 'Search terms, usually separated by commas.',
        input: 'text',
        placeholder: 'finance, planning, 2026',
      },
      {
        key: 'category',
        label: 'Category',
        description: 'Classification used by document libraries.',
        input: 'text',
        placeholder: 'Internal report',
      },
    ],
  },
  {
    id: 'people',
    label: 'People & organization',
    description: 'Authorship and business ownership.',
    fields: [
      {
        key: 'creator',
        label: 'Author',
        description: 'Original author or creator.',
        input: 'text',
        placeholder: 'Jane Doe',
      },
      {
        key: 'lastModifiedBy',
        label: 'Last modified by',
        description: 'Person recorded as the latest editor.',
        input: 'text',
        placeholder: 'John Doe',
      },
      {
        key: 'manager',
        label: 'Manager',
        description: 'Manager associated with this workbook.',
        input: 'text',
        placeholder: 'Alex Smith',
      },
      {
        key: 'company',
        label: 'Company',
        description: 'Organization associated with this workbook.',
        input: 'text',
        placeholder: 'Acme, Inc.',
      },
    ],
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle',
    description: 'Dates, revision, and publication state.',
    fields: [
      {
        key: 'created',
        label: 'Created',
        description: 'Workbook creation date and time.',
        input: 'datetime-local',
      },
      {
        key: 'modified',
        label: 'Modified',
        description: 'Most recent modification date and time.',
        input: 'datetime-local',
      },
      {
        key: 'lastPrinted',
        label: 'Last printed',
        description: 'Most recent print date and time.',
        input: 'datetime-local',
      },
      {
        key: 'revision',
        label: 'Revision',
        description: 'Free-form document revision value.',
        input: 'text',
        placeholder: '12',
      },
      {
        key: 'contentStatus',
        label: 'Content status',
        description: 'Publication state such as Draft or Final.',
        input: 'text',
        placeholder: 'Draft',
      },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Less common standard OOXML document properties.',
    fields: [
      {
        key: 'identifier',
        label: 'Identifier',
        description: 'External document or record identifier.',
        input: 'text',
        placeholder: 'DOC-2026-001',
      },
      {
        key: 'language',
        label: 'Language',
        description: 'Language tag, commonly BCP 47.',
        input: 'text',
        placeholder: 'en-US',
      },
      {
        key: 'version',
        label: 'Version',
        description: 'Free-form document version.',
        input: 'text',
        placeholder: '2.1',
      },
      {
        key: 'template',
        label: 'Template',
        description: 'Template name recorded by Office.',
        input: 'text',
        placeholder: 'Normal',
      },
      {
        key: 'hyperlinkBase',
        label: 'Hyperlink base',
        description: 'Base path used to resolve relative hyperlinks.',
        input: 'text',
        placeholder: 'https://example.com/documents/',
      },
    ],
  },
] as const satisfies ReadonlyArray<{
  id: string
  label: string
  description: string
  fields: ReadonlyArray<{
    key: string
    label: string
    description: string
    input: MetadataInput
    placeholder?: string
  }>
}>

export type MetadataKey =
  (typeof METADATA_GROUPS)[number]['fields'][number]['key']

export const METADATA_KEYS = METADATA_GROUPS.flatMap((group) =>
  group.fields.map((field) => field.key),
) as Array<MetadataKey>

export type MetadataValues = Record<MetadataKey, string>

export type MetadataEdit = {
  mode: PropertyMode
  value: string
}

export type MetadataEdits = Record<MetadataKey, MetadataEdit>

export type CustomPropertyType = 'text' | 'number' | 'boolean' | 'date'

export type CustomPropertyValue = {
  name: string
  type: CustomPropertyType
  value: string
}

export type CustomPropertyEdit = CustomPropertyValue & {
  id: string
  originalName?: string
  mode: PropertyMode
}

export type MetadataFormValues = {
  standard: MetadataEdits
  customProperties: Array<CustomPropertyEdit>
}

export type WorkbookMetadata = {
  standard: MetadataValues
  customProperties: Array<CustomPropertyValue>
  hasDigitalSignatures: boolean
  unsupportedCustomPropertyCount: number
}

export type WorkbookUpdateResult = {
  data: Uint8Array
  fileName: string
}

export function createEmptyMetadataValues(): MetadataValues {
  return Object.fromEntries(
    METADATA_KEYS.map((key) => [key, '']),
  ) as MetadataValues
}

export function createMetadataFormValues(
  metadata?: WorkbookMetadata,
): MetadataFormValues {
  const standard = Object.fromEntries(
    METADATA_KEYS.map((key) => [
      key,
      {
        mode: 'keep',
        value: metadata?.standard[key] ?? '',
      } satisfies MetadataEdit,
    ]),
  ) as MetadataEdits

  return {
    standard,
    customProperties:
      metadata?.customProperties.map((property, index) => ({
        ...property,
        id: `existing-${index}-${property.name}`,
        originalName: property.name,
        mode: 'keep' as const,
      })) ?? [],
  }
}
