import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconDownload,
  IconFileSpreadsheet,
  IconFileZip,
  IconPlus,
  IconShieldLock,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import {
  METADATA_GROUPS,
  METADATA_KEYS,
  createEmptyMetadataValues,
  createMetadataFormValues,
  type CustomPropertyEdit,
  type CustomPropertyType,
  type MetadataEdit,
  type MetadataFieldDefinition,
  type MetadataFormValues,
  type MetadataGroupDefinition,
  type MetadataKey,
  type WorkbookMetadata,
} from '../-lib/xlsx-metadata.types'

const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const XLSM_MIME_TYPE = 'application/vnd.ms-excel.sheet.macroEnabled.12'
const ZIP_MIME_TYPE = 'application/zip'
const WORKBOOK_EXTENSION_PATTERN = /\.(xlsx|xlsm)$/i
const MAX_FILE_COUNT = 20
const MAX_TOTAL_BYTES = 250 * 1024 * 1024

const PROPERTY_MODES = ['keep', 'set', 'clear'] as const
const CUSTOM_PROPERTY_TYPES = ['text', 'number', 'boolean', 'date'] as const

const CUSTOM_TYPE_LABELS = {
  text: 'Text',
  number: 'Number',
  boolean: 'Boolean',
  date: 'Date',
} as const satisfies Record<CustomPropertyType, string>

const BOOLEAN_LABELS = {
  true: 'True',
  false: 'False',
} as const

const COMMON_METADATA_KEYS = [
  'title',
  'creator',
  'company',
  'created',
] as const satisfies ReadonlyArray<MetadataKey>

const DESCRIBED_METADATA_KEYS = new Set<MetadataKey>([
  'contentStatus',
  'identifier',
  'language',
  'template',
  'hyperlinkBase',
])

const commonMetadataKeySet = new Set<MetadataKey>(COMMON_METADATA_KEYS)

const ADDITIONAL_GROUP_COPY = {
  document: {
    label: 'Document details',
    description: 'Topic, search, and document-library details.',
  },
  people: {
    label: 'Ownership',
    description: 'Editors and business ownership.',
  },
  lifecycle: {
    label: 'Dates & status',
    description: 'Timestamps and publication state.',
  },
  advanced: {
    label: 'Technical details',
    description: 'Identifiers and Office-specific settings.',
  },
} as const

function getMetadataFieldDefinition(key: MetadataKey): MetadataFieldDefinition {
  for (const group of METADATA_GROUPS) {
    const definition = (
      group.fields as ReadonlyArray<MetadataFieldDefinition>
    ).find((field) => field.key === key)

    if (definition) return definition
  }

  throw new Error(`Missing metadata definition for ${key}.`)
}

const COMMON_METADATA_FIELDS = COMMON_METADATA_KEYS.map(
  getMetadataFieldDefinition,
)

const ADDITIONAL_METADATA_GROUPS: ReadonlyArray<MetadataGroupDefinition> =
  METADATA_GROUPS.map((group) => ({
    id: group.id,
    label: ADDITIONAL_GROUP_COPY[group.id].label,
    description: ADDITIONAL_GROUP_COPY[group.id].description,
    fields: (group.fields as ReadonlyArray<MetadataFieldDefinition>).filter(
      (definition) => !commonMetadataKeySet.has(definition.key),
    ),
  })).filter((group) => group.fields.length > 0)

const EMPTY_METADATA_VALUES = createEmptyMetadataValues()

const metadataEditSchema = z.object({
  mode: z.enum(PROPERTY_MODES),
  value: z.string().max(32_767, 'Property value is too long.'),
})

const customPropertySchema = z.object({
  id: z.string(),
  originalName: z.string().optional(),
  mode: z.enum(PROPERTY_MODES),
  name: z.string().max(255, 'Custom property name is too long.'),
  type: z.enum(CUSTOM_PROPERTY_TYPES),
  value: z.string().max(32_767, 'Custom property value is too long.'),
})

const metadataFormSchema = z
  .object({
    standard: z.record(
      z.enum(METADATA_KEYS as [MetadataKey, ...Array<MetadataKey>]),
      metadataEditSchema,
    ),
    customProperties: z.array(customPropertySchema),
  })
  .superRefine((values, context) => {
    let hasChange = false

    METADATA_KEYS.forEach((key) => {
      const edit = values.standard[key]
      if (edit.mode === 'keep') return

      hasChange = true
      if (edit.mode === 'set' && !edit.value.trim()) {
        context.addIssue({
          code: 'custom',
          message: `${fieldLabel(key)} needs a value or Clear mode.`,
          path: ['standard', key, 'value'],
        })
      }

      if (
        edit.mode === 'set' &&
        isDateKey(key) &&
        Number.isNaN(new Date(edit.value).getTime())
      ) {
        context.addIssue({
          code: 'custom',
          message: `${fieldLabel(key)} is not a valid date and time.`,
          path: ['standard', key, 'value'],
        })
      }
    })

    const activeNames = new Set<string>()
    values.customProperties.forEach((property, index) => {
      if (property.mode === 'clear') return

      const name = property.name.trim()
      const normalizedName = name.toLocaleLowerCase()

      if (!name) {
        context.addIssue({
          code: 'custom',
          message: 'Custom property name is required.',
          path: ['customProperties', index, 'name'],
        })
      } else if (activeNames.has(normalizedName)) {
        context.addIssue({
          code: 'custom',
          message: `"${name}" appears more than once.`,
          path: ['customProperties', index, 'name'],
        })
      }

      activeNames.add(normalizedName)

      if (property.mode === 'keep') return

      hasChange = true

      if (!property.value.trim()) {
        context.addIssue({
          code: 'custom',
          message: `"${name || 'Custom property'}" needs a value.`,
          path: ['customProperties', index, 'value'],
        })
      }

      if (
        property.type === 'number' &&
        (!property.value.trim() ||
          !Number.isFinite(Number(property.value.trim())))
      ) {
        context.addIssue({
          code: 'custom',
          message: `"${name || 'Custom property'}" needs a valid number.`,
          path: ['customProperties', index, 'value'],
        })
      }

      if (
        property.type === 'date' &&
        Number.isNaN(new Date(property.value).getTime())
      ) {
        context.addIssue({
          code: 'custom',
          message: `"${name || 'Custom property'}" needs a valid date.`,
          path: ['customProperties', index, 'value'],
        })
      }
    })

    if (!hasChange) {
      context.addIssue({
        code: 'custom',
        message: 'Choose at least one property to set or clear.',
      })
    }
  })

type FileStatus = 'reading' | 'ready' | 'processing' | 'done' | 'error'

type QueuedFile = {
  id: string
  file: File
  status: FileStatus
  metadata?: WorkbookMetadata
  error?: string
}

type StatusNotice = {
  kind: 'success' | 'error'
  title: string
  description: string
}

function StatusNoticeAlert({ notice }: { notice: StatusNotice }) {
  return (
    <Alert variant={notice.kind === 'error' ? 'destructive' : 'default'}>
      {notice.kind === 'error' ? <IconAlertTriangle /> : <IconCheck />}
      <AlertTitle>{notice.title}</AlertTitle>
      <AlertDescription>{notice.description}</AlertDescription>
    </Alert>
  )
}

function fieldLabel(key: MetadataKey): string {
  for (const group of METADATA_GROUPS) {
    const definition = group.fields.find((field) => field.key === key)
    if (definition) return definition.label
  }

  return key
}

function isDateKey(key: MetadataKey): boolean {
  return key === 'created' || key === 'modified' || key === 'lastPrinted'
}

function validateForm(values: MetadataFormValues): string | undefined {
  const result = metadataFormSchema.safeParse(values)
  return result.success ? undefined : result.error.issues[0]?.message
}

function countMetadataChanges(values: MetadataFormValues): number {
  return (
    METADATA_KEYS.filter((key) => values.standard[key].mode !== 'keep').length +
    values.customProperties.filter((property) => property.mode !== 'keep')
      .length
  )
}

function countStandardChanges(
  values: MetadataFormValues['standard'],
  keys: ReadonlyArray<MetadataKey>,
): number {
  return keys.filter((key) => values[key].mode !== 'keep').length
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}

function getFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected processing error.'
}

function workbookMimeType(fileName: string): string {
  return /\.xlsm$/i.test(fileName) ? XLSM_MIME_TYPE : XLSX_MIME_TYPE
}

function downloadData(data: Uint8Array, fileName: string, type: string): void {
  const bytes = data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  ) as ArrayBuffer
  const url = URL.createObjectURL(new Blob([bytes], { type }))
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

function CustomTypeSelect({
  value,
  onValueChange,
}: {
  value: CustomPropertyType
  onValueChange: (value: CustomPropertyType) => void
}) {
  return (
    <Select
      items={CUSTOM_TYPE_LABELS}
      value={value}
      onValueChange={(nextValue) =>
        onValueChange(nextValue as CustomPropertyType)
      }
    >
      <SelectTrigger
        size="sm"
        aria-label="Custom property type"
        className="w-full"
      >
        <SelectValue>{CUSTOM_TYPE_LABELS[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {CUSTOM_PROPERTY_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {CUSTOM_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function MetadataField({
  definition,
  edit,
  baselineValue,
  canRemove,
  onChange,
}: {
  definition: MetadataFieldDefinition
  edit: MetadataEdit
  baselineValue: string
  canRemove: boolean
  onChange: (edit: MetadataEdit) => void
}) {
  const inputId = `xlsx-metadata-${definition.key}`
  const updateValue = (value: string) => onChange({ mode: 'set', value })
  const restoreValue = () => onChange({ mode: 'keep', value: baselineValue })
  const controlProps = {
    id: inputId,
    value: edit.value,
    placeholder: definition.placeholder,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => updateValue(event.target.value),
  }

  return (
    <Field>
      <div className="flex min-h-10 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <FieldLabel htmlFor={inputId}>{definition.label}</FieldLabel>
          {edit.mode === 'set' ? (
            <Badge variant="secondary">Changed</Badge>
          ) : null}
        </div>
        {edit.mode === 'set' ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 transition-transform duration-150 active:scale-[0.96]"
            onClick={restoreValue}
          >
            Undo
          </Button>
        ) : edit.mode === 'keep' && canRemove ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 transition-transform duration-150 active:scale-[0.96]"
            onClick={() => onChange({ ...edit, mode: 'clear' })}
          >
            Remove
          </Button>
        ) : null}
      </div>

      {DESCRIBED_METADATA_KEYS.has(definition.key) && edit.mode !== 'clear' ? (
        <FieldDescription className="-mt-1 text-pretty">
          {definition.description}
        </FieldDescription>
      ) : null}

      {edit.mode === 'clear' ? (
        <div className="bg-muted/50 flex min-h-12 items-center gap-3 rounded-xl px-3 py-2">
          <IconTrash aria-hidden="true" className="text-muted-foreground" />
          <span className="min-w-0 flex-1 text-sm text-pretty">
            This value will be removed.
          </span>
          <Button
            type="button"
            variant="ghost"
            className="h-10 transition-transform duration-150 active:scale-[0.96]"
            onClick={restoreValue}
          >
            Undo
          </Button>
        </div>
      ) : definition.input === 'textarea' ? (
        <Textarea {...controlProps} rows={3} />
      ) : (
        <Input type={definition.input} {...controlProps} />
      )}
    </Field>
  )
}

function MetadataGroup({
  group,
  values,
  baselineValues,
  allowRemoveEmpty,
  onChange,
}: {
  group: MetadataGroupDefinition
  values: MetadataFormValues['standard']
  baselineValues: WorkbookMetadata['standard']
  allowRemoveEmpty: boolean
  onChange: (key: MetadataKey, edit: MetadataEdit) => void
}) {
  const editedCount = group.fields.filter(
    (field) => values[field.key].mode !== 'keep',
  ).length

  return (
    <section
      aria-labelledby={`xlsx-group-${group.id}`}
      className="flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3
            id={`xlsx-group-${group.id}`}
            className="font-medium text-balance"
          >
            {group.label}
          </h3>
          <p className="text-muted-foreground text-sm text-pretty">
            {group.description}
          </p>
        </div>
        {editedCount > 0 ? (
          <Badge variant="secondary" className="tabular-nums">
            {editedCount} changed
          </Badge>
        ) : null}
      </div>
      <FieldGroup>
        {group.fields.map((definition) => (
          <MetadataField
            key={definition.key}
            definition={definition}
            edit={values[definition.key]}
            baselineValue={baselineValues[definition.key]}
            canRemove={
              allowRemoveEmpty || Boolean(baselineValues[definition.key])
            }
            onChange={(edit) => onChange(definition.key, edit)}
          />
        ))}
      </FieldGroup>
    </section>
  )
}

function MetadataDisclosure({
  title,
  description,
  summary,
  editedCount,
  children,
}: {
  title: string
  description: string
  summary: string
  editedCount: number
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="focus-visible:ring-ring/50 bg-muted/40 hover:bg-muted/60 flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-[background-color] duration-150 outline-none focus-visible:ring-[3px]">
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-medium text-balance">{title}</span>
          <span className="text-muted-foreground text-xs text-pretty">
            {open ? description : summary}
          </span>
        </span>
        {editedCount > 0 ? (
          <Badge variant="secondary" className="tabular-nums">
            {editedCount}
          </Badge>
        ) : (
          <Badge variant="outline">Optional</Badge>
        )}
        <IconChevronDown
          aria-hidden="true"
          className={cn(open ? 'rotate-180' : undefined)}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-6">{children}</CollapsibleContent>
    </Collapsible>
  )
}

function CustomPropertyValueInput({
  property,
  onChange,
}: {
  property: CustomPropertyEdit
  onChange: (property: CustomPropertyEdit) => void
}) {
  if (property.type === 'boolean') {
    return (
      <Select
        items={BOOLEAN_LABELS}
        value={property.value || 'false'}
        onValueChange={(value) =>
          onChange({ ...property, mode: 'set', value: String(value) })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {property.value === 'true' ? 'True' : 'False'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      value={property.value}
      type={
        property.type === 'date'
          ? 'datetime-local'
          : property.type === 'number'
            ? 'number'
            : 'text'
      }
      step={property.type === 'number' ? 'any' : undefined}
      placeholder={property.type === 'number' ? '42' : 'Custom property value'}
      onChange={(event) =>
        onChange({ ...property, mode: 'set', value: event.target.value })
      }
    />
  )
}

function CustomPropertyRow({
  property,
  onChange,
  onRemove,
}: {
  property: CustomPropertyEdit
  onChange: (property: CustomPropertyEdit) => void
  onRemove: () => void
}) {
  const restoreProperty = () =>
    onChange({
      ...property,
      mode: 'keep',
      name: property.originalName ?? property.name,
      type: property.originalType ?? property.type,
      value: property.originalValue ?? property.value,
    })

  if (property.mode === 'clear') {
    return (
      <div className="bg-muted/50 flex min-h-14 items-center gap-3 rounded-xl px-3 py-2">
        <IconTrash aria-hidden="true" className="text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-sm">
          Remove “{property.originalName ?? property.name}”
        </span>
        <Button
          type="button"
          variant="ghost"
          className="h-10 transition-transform duration-150 active:scale-[0.96]"
          onClick={restoreProperty}
        >
          Undo
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-muted/40 flex flex-col gap-3 rounded-4xl p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_7rem_auto] gap-2">
        <Field>
          <FieldLabel className="sr-only">Custom property name</FieldLabel>
          <Input
            aria-label="Custom property name"
            value={property.name}
            placeholder="Property name"
            onChange={(event) =>
              onChange({
                ...property,
                mode: 'set',
                name: event.target.value,
              })
            }
          />
        </Field>
        <Field>
          <FieldLabel className="sr-only">Custom property type</FieldLabel>
          <CustomTypeSelect
            value={property.type}
            onValueChange={(type) =>
              onChange({
                ...property,
                mode: 'set',
                type,
                value: type === 'boolean' ? 'false' : '',
              })
            }
          />
        </Field>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Remove ${property.name || 'custom property'}`}
          className="size-10 transition-transform duration-150 active:scale-[0.96]"
          onClick={onRemove}
        >
          <IconX />
        </Button>
      </div>
      <Field>
        <FieldLabel className="sr-only">Custom property value</FieldLabel>
        <CustomPropertyValueInput property={property} onChange={onChange} />
      </Field>
      {property.originalName ? (
        <div className="flex items-center justify-between gap-3">
          <Badge variant={property.mode === 'set' ? 'secondary' : 'outline'}>
            {property.mode === 'set' ? 'Changed' : 'Existing property'}
          </Badge>
          {property.mode === 'set' ? (
            <Button
              type="button"
              variant="ghost"
              className="h-10 transition-transform duration-150 active:scale-[0.96]"
              onClick={restoreProperty}
            >
              Undo changes
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function CustomProperties({
  properties,
  onChange,
}: {
  properties: Array<CustomPropertyEdit>
  onChange: (properties: Array<CustomPropertyEdit>) => void
}) {
  const activeCount = properties.filter(
    (property) => property.mode !== 'clear',
  ).length

  const addProperty = () => {
    onChange([
      ...properties,
      {
        id: crypto.randomUUID(),
        mode: 'set',
        name: '',
        type: 'text',
        value: '',
      },
    ])
  }

  return (
    <FieldSet>
      <FieldLegend className="sr-only">Custom properties</FieldLegend>
      <div className="flex items-start justify-between gap-3">
        <FieldDescription className="max-w-sm text-pretty">
          Add typed values used by Office workflows and document libraries.
        </FieldDescription>
        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0 transition-transform duration-150 active:scale-[0.96]"
          onClick={addProperty}
        >
          <IconPlus data-icon="inline-start" />
          Add
        </Button>
      </div>

      {activeCount === 0 && properties.length === 0 ? (
        <p className="text-muted-foreground py-2 text-sm text-pretty">
          No custom property changes.
        </p>
      ) : (
        <FieldGroup className="gap-3">
          {properties.map((property, index) => (
            <CustomPropertyRow
              key={property.id}
              property={property}
              onChange={(nextProperty) =>
                onChange(
                  properties.map((item, itemIndex) =>
                    itemIndex === index ? nextProperty : item,
                  ),
                )
              }
              onRemove={() => {
                if (property.originalName) {
                  onChange(
                    properties.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, mode: 'clear' } : item,
                    ),
                  )
                  return
                }

                onChange(
                  properties.filter((_, itemIndex) => itemIndex !== index),
                )
              }}
            />
          ))}
        </FieldGroup>
      )}
    </FieldSet>
  )
}

function FileStatusBadge({ status }: { status: FileStatus }) {
  const config = {
    reading: {
      label: 'Reading',
      variant: 'secondary' as const,
      icon: IconClock,
    },
    ready: {
      label: 'Ready',
      variant: 'outline' as const,
      icon: IconCheck,
    },
    processing: {
      label: 'Processing',
      variant: 'secondary' as const,
      icon: IconClock,
    },
    done: {
      label: 'Downloaded',
      variant: 'secondary' as const,
      icon: IconDownload,
    },
    error: {
      label: 'Error',
      variant: 'destructive' as const,
      icon: IconAlertTriangle,
    },
  }[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant}>
      <Icon data-icon="inline-start" />
      {config.label}
    </Badge>
  )
}

function FileQueue({
  files,
  onRemove,
  onClear,
}: {
  files: Array<QueuedFile>
  onRemove: (id: string) => void
  onClear: () => void
}) {
  if (files.length === 0) return null

  return (
    <>
      <Separator />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </p>
        <Button
          type="button"
          variant="ghost"
          className="h-10 transition-transform duration-150 active:scale-[0.96]"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {files.map((queuedFile) => (
          <li
            key={queuedFile.id}
            className="bg-muted/50 flex min-h-14 items-center gap-3 rounded-xl px-3 py-2"
          >
            <IconFileSpreadsheet
              aria-hidden="true"
              className="text-muted-foreground shrink-0"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">
                {queuedFile.file.name}
              </span>
              <span className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
                <span className="tabular-nums">
                  {formatFileSize(queuedFile.file.size)}
                </span>
                {queuedFile.error ? (
                  <span className="text-destructive text-pretty">
                    {queuedFile.error}
                  </span>
                ) : null}
              </span>
            </span>
            <FileStatusBadge status={queuedFile.status} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${queuedFile.file.name}`}
              className="size-10 transition-transform duration-150 active:scale-[0.96]"
              disabled={queuedFile.status === 'processing'}
              onClick={() => onRemove(queuedFile.id)}
            >
              <IconX />
            </Button>
          </li>
        ))}
      </ul>
    </>
  )
}

export function XlsxMetadataEditor() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const initializedSelectionRef = React.useRef('')
  const [files, setFiles] = React.useState<Array<QueuedFile>>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [notice, setNotice] = React.useState<StatusNotice | null>(null)

  const usableFiles = files.filter(
    (queuedFile) =>
      queuedFile.metadata &&
      queuedFile.status !== 'error' &&
      queuedFile.status !== 'reading',
  )
  const hasSignatures = files.some(
    (queuedFile) => queuedFile.metadata?.hasDigitalSignatures,
  )
  const hasMacros = files.some((queuedFile) => queuedFile.metadata?.hasMacros)
  const unsupportedCustomPropertyCount = files.reduce(
    (total, queuedFile) =>
      total + (queuedFile.metadata?.unsupportedCustomPropertyCount ?? 0),
    0,
  )
  const baselineValues =
    usableFiles.length === 1
      ? (usableFiles[0].metadata?.standard ?? EMPTY_METADATA_VALUES)
      : EMPTY_METADATA_VALUES

  const processFiles = async (values: MetadataFormValues) => {
    const candidates = files.filter(
      (queuedFile) =>
        queuedFile.metadata &&
        queuedFile.status !== 'error' &&
        queuedFile.status !== 'reading',
    )

    if (candidates.length === 0) {
      setNotice({
        kind: 'error',
        title: 'No ready files',
        description: 'Add at least one readable XLSX or XLSM workbook.',
      })
      return
    }

    setNotice(null)
    setFiles((current) =>
      current.map((queuedFile) =>
        candidates.some((candidate) => candidate.id === queuedFile.id)
          ? { ...queuedFile, status: 'processing', error: undefined }
          : queuedFile,
      ),
    )

    const { createBulkArchive, updateWorkbookMetadata } =
      await import('../-lib/xlsx-metadata')
    const results = []

    for (const queuedFile of candidates) {
      try {
        const result = await updateWorkbookMetadata(
          queuedFile.file.name,
          await queuedFile.file.arrayBuffer(),
          values,
        )
        results.push(result)
        setFiles((current) =>
          current.map((item) =>
            item.id === queuedFile.id ? { ...item, status: 'done' } : item,
          ),
        )
      } catch (error) {
        setFiles((current) =>
          current.map((item) =>
            item.id === queuedFile.id
              ? { ...item, status: 'error', error: getErrorMessage(error) }
              : item,
          ),
        )
      }
    }

    if (results.length === 0) {
      setNotice({
        kind: 'error',
        title: 'Nothing downloaded',
        description: 'Every workbook failed during processing.',
      })
      return
    }

    if (results.length === 1) {
      downloadData(
        results[0].data,
        results[0].fileName,
        workbookMimeType(results[0].fileName),
      )
    } else {
      downloadData(
        await createBulkArchive(results),
        'excel-metadata-updated.zip',
        ZIP_MIME_TYPE,
      )
    }

    const failedCount = candidates.length - results.length
    setNotice({
      kind: failedCount > 0 ? 'error' : 'success',
      title:
        failedCount > 0
          ? `${results.length} downloaded, ${failedCount} failed`
          : `${results.length} ${results.length === 1 ? 'file' : 'files'} downloaded`,
      description:
        results.length === 1
          ? 'Original workbook remains unchanged.'
          : 'Updated workbooks are packaged in one ZIP. Originals remain unchanged.',
    })
  }

  const form = useForm({
    defaultValues: createMetadataFormValues(),
    validators: {
      onSubmit: ({ value }) => validateForm(value),
    },
    onSubmit: async ({ value }) => processFiles(value),
  })

  const selectionKey = files
    .filter((queuedFile) => queuedFile.metadata)
    .map((queuedFile) => queuedFile.id)
    .sort()
    .join('|')

  React.useEffect(() => {
    if (selectionKey === initializedSelectionRef.current) return

    initializedSelectionRef.current = selectionKey
    const selectedFiles = files.filter((queuedFile) => queuedFile.metadata)

    if (selectedFiles.length === 0) {
      form.reset(createMetadataFormValues())
      return
    }

    if (selectedFiles.length === 1) {
      form.reset(createMetadataFormValues(selectedFiles[0].metadata))
      return
    }

    form.reset(createMetadataFormValues())
    setNotice({
      kind: 'success',
      title: 'Bulk mode ready',
      description:
        'Fields reset to Keep. Only explicit Set or Clear changes apply to every workbook.',
    })
  }, [files, form, selectionKey])

  const addFiles = async (incomingFiles: Array<File>) => {
    setNotice(null)

    const existingIds = new Set(files.map((queuedFile) => queuedFile.id))
    const uniqueFiles = incomingFiles.filter(
      (file) => !existingIds.has(getFileId(file)),
    )
    const remainingSlots = Math.max(0, MAX_FILE_COUNT - files.length)
    const selectedFiles = uniqueFiles.slice(0, remainingSlots)
    const totalBytes =
      files.reduce((total, queuedFile) => total + queuedFile.file.size, 0) +
      selectedFiles.reduce((total, file) => total + file.size, 0)

    if (selectedFiles.length === 0) {
      setNotice({
        kind: 'error',
        title: 'No files added',
        description:
          files.length >= MAX_FILE_COUNT
            ? `Bulk processing is limited to ${MAX_FILE_COUNT} files.`
            : 'Those files are already in the queue.',
      })
      return
    }

    if (totalBytes > MAX_TOTAL_BYTES) {
      setNotice({
        kind: 'error',
        title: 'Selection too large',
        description: 'Keep combined file size under 250 MB.',
      })
      return
    }

    const queuedFiles = selectedFiles.map((file): QueuedFile => ({
      id: getFileId(file),
      file,
      status:
        WORKBOOK_EXTENSION_PATTERN.test(file.name) && file.size > 0
          ? 'reading'
          : 'error',
      error: !WORKBOOK_EXTENSION_PATTERN.test(file.name)
        ? 'Only .xlsx and .xlsm files are supported.'
        : file.size === 0
          ? 'File is empty.'
          : undefined,
    }))

    setFiles((current) => [...current, ...queuedFiles])

    const readableFiles = queuedFiles.filter(
      (queuedFile) => queuedFile.status === 'reading',
    )
    if (readableFiles.length === 0) return

    const { readWorkbookMetadata } = await import('../-lib/xlsx-metadata')
    const loadedFiles = await Promise.all(
      readableFiles.map(async (queuedFile): Promise<QueuedFile> => {
        try {
          const metadata = await readWorkbookMetadata(
            await queuedFile.file.arrayBuffer(),
          )
          return { ...queuedFile, status: 'ready', metadata }
        } catch (error) {
          return {
            ...queuedFile,
            status: 'error',
            error: getErrorMessage(error),
          }
        }
      }),
    )
    const loadedById = new Map(loadedFiles.map((item) => [item.id, item]))

    setFiles((current) =>
      current.map((item) => loadedById.get(item.id) ?? item),
    )
  }

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((queuedFile) => queuedFile.id !== id))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const clearFiles = () => {
    setFiles([])
    setNotice(null)
    form.reset(createMetadataFormValues())
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetForm = () => {
    form.reset(
      usableFiles.length === 1
        ? createMetadataFormValues(usableFiles[0].metadata)
        : createMetadataFormValues(),
    )
    setNotice(null)
  }

  return (
    <div className="flex flex-col gap-6 antialiased">
      <Alert>
        <IconShieldLock />
        <AlertTitle>Private by design</AlertTitle>
        <AlertDescription>
          Files stay in this browser. Nothing is uploaded, stored, or sent to an
          API.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>
            {files.length > 0 ? 'Workbooks' : 'Choose workbooks'}
          </CardTitle>
          <CardDescription>
            {files.length === 0
              ? `Drop up to ${MAX_FILE_COUNT} XLSX or XLSM files. One file loads its current metadata; multiple files use safe bulk mode.`
              : usableFiles.length === 1
                ? 'Current metadata is loaded into the editor below.'
                : 'Only the changes you choose will apply across ready files.'}
          </CardDescription>
          {files.length > 0 ? (
            <CardAction>
              <Badge variant="secondary" className="tabular-nums">
                {files.length}/{MAX_FILE_COUNT}
              </Badge>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
            multiple
            className="sr-only"
            onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
          />
          <button
            type="button"
            className={cn(
              'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center gap-3 rounded-xl border border-dashed outline-none focus-visible:ring-[3px]',
              'transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96]',
              files.length > 0
                ? 'min-h-16 flex-row justify-start px-3 py-3 text-left'
                : 'min-h-40 flex-col justify-center px-6 py-8 text-center',
              isDragging
                ? 'border-foreground bg-muted'
                : 'border-input bg-background',
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsDragging(false)
              }
            }}
            onDrop={(event) => {
              event.preventDefault()
              setIsDragging(false)
              addFiles(Array.from(event.dataTransfer.files))
            }}
          >
            <span
              className={cn(
                'bg-muted flex items-center justify-center',
                files.length > 0 ? 'size-10 rounded-lg' : 'size-11 rounded-xl',
              )}
            >
              <IconUpload aria-hidden="true" />
            </span>
            <span className="flex max-w-sm flex-col gap-1">
              <span className="font-medium">
                {files.length > 0
                  ? 'Add more workbooks'
                  : 'Drop XLSX or XLSM files here'}
              </span>
              <span className="text-muted-foreground text-sm text-pretty">
                {files.length > 0
                  ? 'Drop here or click to browse.'
                  : 'or click to browse. Combined size limit: 250 MB.'}
              </span>
            </span>
          </button>

          <FileQueue files={files} onRemove={removeFile} onClear={clearFiles} />
        </CardContent>
      </Card>

      {hasSignatures ? (
        <Alert variant="destructive">
          <IconAlertTriangle />
          <AlertTitle>Digital signature warning</AlertTitle>
          <AlertDescription>
            Editing metadata invalidates existing digital signatures. Updated
            copies will need to be signed again.
          </AlertDescription>
        </Alert>
      ) : null}

      {hasMacros ? (
        <Alert>
          <IconShieldLock />
          <AlertTitle>Macros preserved</AlertTitle>
          <AlertDescription>
            The VBA project is copied unchanged into the updated XLSM file.
          </AlertDescription>
        </Alert>
      ) : null}

      {unsupportedCustomPropertyCount > 0 ? (
        <Alert>
          <IconShieldLock />
          <AlertTitle>Unsupported custom values preserved</AlertTitle>
          <AlertDescription>
            {unsupportedCustomPropertyCount} custom{' '}
            {unsupportedCustomPropertyCount === 1
              ? 'property uses'
              : 'properties use'}{' '}
            an uncommon Office type.{' '}
            {unsupportedCustomPropertyCount === 1 ? 'It is' : 'They are'}{' '}
            preserved but not shown in the form.
          </AlertDescription>
        </Alert>
      ) : null}

      {notice ? <StatusNoticeAlert notice={notice} /> : null}

      {usableFiles.length > 0 ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Choose what to change</CardTitle>
              <CardDescription>
                {usableFiles.length === 1
                  ? 'Existing values stay untouched until you edit or remove them.'
                  : 'Enter only the values you want applied to every workbook.'}
              </CardDescription>
              <CardAction>
                <form.Subscribe selector={(state) => state.values}>
                  {(values) => {
                    const changeCount = countMetadataChanges(values)

                    return (
                      <Badge
                        variant={changeCount > 0 ? 'secondary' : 'outline'}
                        className="tabular-nums"
                      >
                        {changeCount === 0
                          ? 'No changes'
                          : `${changeCount} ${changeCount === 1 ? 'change' : 'changes'}`}
                      </Badge>
                    )
                  }}
                </form.Subscribe>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <form.Field name="standard">
                {(field) => {
                  const commonEditedCount = countStandardChanges(
                    field.state.value,
                    COMMON_METADATA_KEYS,
                  )
                  const additionalKeys = ADDITIONAL_METADATA_GROUPS.flatMap(
                    (group) => group.fields.map((definition) => definition.key),
                  )
                  const additionalEditedCount = countStandardChanges(
                    field.state.value,
                    additionalKeys,
                  )

                  return (
                    <div className="flex flex-col gap-6">
                      <section
                        aria-labelledby="xlsx-common-properties"
                        className="flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <h2
                              id="xlsx-common-properties"
                              className="font-medium text-balance"
                            >
                              Common properties
                            </h2>
                            <p className="text-muted-foreground text-sm text-pretty">
                              The details people most often need to correct.
                            </p>
                          </div>
                          {commonEditedCount > 0 ? (
                            <Badge variant="secondary" className="tabular-nums">
                              {commonEditedCount} changed
                            </Badge>
                          ) : null}
                        </div>
                        <FieldGroup>
                          {COMMON_METADATA_FIELDS.map((definition) => (
                            <MetadataField
                              key={definition.key}
                              definition={definition}
                              edit={field.state.value[definition.key]}
                              baselineValue={
                                baselineValues[definition.key] ?? ''
                              }
                              canRemove={
                                usableFiles.length > 1 ||
                                Boolean(baselineValues[definition.key])
                              }
                              onChange={(edit) =>
                                field.handleChange({
                                  ...field.state.value,
                                  [definition.key]: edit,
                                })
                              }
                            />
                          ))}
                        </FieldGroup>
                      </section>

                      <MetadataDisclosure
                        title="More properties"
                        description="Document, ownership, lifecycle, and technical metadata."
                        summary="Subject, comments, keywords, dates, status, and technical details."
                        editedCount={additionalEditedCount}
                      >
                        <div className="flex flex-col gap-6">
                          {ADDITIONAL_METADATA_GROUPS.map((group, index) => (
                            <React.Fragment key={group.id}>
                              {index > 0 ? <Separator /> : null}
                              <MetadataGroup
                                group={group}
                                values={field.state.value}
                                baselineValues={baselineValues}
                                allowRemoveEmpty={usableFiles.length > 1}
                                onChange={(key, edit) =>
                                  field.handleChange({
                                    ...field.state.value,
                                    [key]: edit,
                                  })
                                }
                              />
                            </React.Fragment>
                          ))}
                        </div>
                      </MetadataDisclosure>
                    </div>
                  )
                }}
              </form.Field>

              <form.Field name="customProperties">
                {(field) => {
                  const editedCount = field.state.value.filter(
                    (property) => property.mode !== 'keep',
                  ).length
                  const existingCount = field.state.value.filter(
                    (property) => property.originalName,
                  ).length

                  return (
                    <MetadataDisclosure
                      title="Custom properties"
                      description="Typed values for specialized Office workflows and document libraries."
                      summary={
                        existingCount > 0
                          ? `${existingCount} existing ${existingCount === 1 ? 'property' : 'properties'} · open to review or add`
                          : 'Only needed for specialized Office workflows.'
                      }
                      editedCount={editedCount}
                    >
                      <CustomProperties
                        properties={field.state.value}
                        onChange={field.handleChange}
                      />
                    </MetadataDisclosure>
                  )
                }}
              </form.Field>

              <form.Subscribe selector={(state) => state.errors}>
                {(errors) =>
                  errors.length > 0 ? (
                    <Alert variant="destructive">
                      <IconAlertTriangle />
                      <AlertTitle>Review metadata changes</AlertTitle>
                      <AlertDescription>
                        {typeof errors[0] === 'string'
                          ? errors[0]
                          : 'One or more property values are invalid.'}
                      </AlertDescription>
                    </Alert>
                  ) : null
                }
              </form.Subscribe>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                className="h-10 transition-transform duration-150 active:scale-[0.96]"
                onClick={resetForm}
              >
                Reset changes
              </Button>
              <form.Subscribe
                selector={(state) => ({
                  values: state.values,
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ values, canSubmit, isSubmitting }) => {
                  const changeCount = countMetadataChanges(values)

                  return (
                    <Button
                      type="submit"
                      className="h-10 transition-transform duration-150 active:scale-[0.96]"
                      disabled={changeCount === 0 || !canSubmit || isSubmitting}
                    >
                      {usableFiles.length > 1 ? (
                        <IconFileZip data-icon="inline-start" />
                      ) : (
                        <IconDownload data-icon="inline-start" />
                      )}
                      {isSubmitting
                        ? 'Processing…'
                        : usableFiles.length > 1
                          ? `Apply to ${usableFiles.length} files`
                          : 'Apply & download'}
                    </Button>
                  )
                }}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </form>
      ) : (
        <p className="text-muted-foreground text-center text-sm text-pretty">
          Metadata form appears after a workbook is ready.
        </p>
      )}
    </div>
  )
}
