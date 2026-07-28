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
  createMetadataFormValues,
  type CustomPropertyEdit,
  type CustomPropertyType,
  type MetadataEdit,
  type MetadataFieldDefinition,
  type MetadataFormValues,
  type MetadataGroupDefinition,
  type MetadataKey,
  type PropertyMode,
  type WorkbookMetadata,
} from '../-lib/xlsx-metadata.types'

const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const ZIP_MIME_TYPE = 'application/zip'
const MAX_FILE_COUNT = 20
const MAX_TOTAL_BYTES = 250 * 1024 * 1024

const PROPERTY_MODES = ['keep', 'set', 'clear'] as const
const CUSTOM_PROPERTY_TYPES = ['text', 'number', 'boolean', 'date'] as const

const PROPERTY_MODE_LABELS = {
  keep: 'Keep',
  set: 'Set',
  clear: 'Clear',
} as const satisfies Record<PropertyMode, string>

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

function PropertyModeSelect({
  label,
  value,
  onValueChange,
}: {
  label: string
  value: PropertyMode
  onValueChange: (value: PropertyMode) => void
}) {
  return (
    <Select
      items={PROPERTY_MODE_LABELS}
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as PropertyMode)}
    >
      <SelectTrigger
        size="sm"
        aria-label={`${label} update mode`}
        className="w-24 shrink-0"
      >
        <SelectValue>{PROPERTY_MODE_LABELS[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {PROPERTY_MODES.map((mode) => (
            <SelectItem key={mode} value={mode}>
              {PROPERTY_MODE_LABELS[mode]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
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
  onChange,
}: {
  definition: MetadataFieldDefinition
  edit: MetadataEdit
  onChange: (edit: MetadataEdit) => void
}) {
  const inputId = `xlsx-metadata-${definition.key}`
  const updateValue = (value: string) => onChange({ mode: 'set', value })
  const controlProps = {
    id: inputId,
    value: edit.value,
    disabled: edit.mode === 'clear',
    placeholder: definition.placeholder,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => updateValue(event.target.value),
  }

  return (
    <Field data-disabled={edit.mode === 'clear' ? true : undefined}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FieldLabel htmlFor={inputId}>{definition.label}</FieldLabel>
          <FieldDescription>{definition.description}</FieldDescription>
        </div>
        <PropertyModeSelect
          label={definition.label}
          value={edit.mode}
          onValueChange={(mode) => onChange({ ...edit, mode })}
        />
      </div>

      {definition.input === 'textarea' ? (
        <Textarea {...controlProps} rows={3} />
      ) : (
        <Input type={definition.input} {...controlProps} />
      )}
    </Field>
  )
}

function MetadataSection({
  group,
  values,
  onChange,
  defaultOpen = false,
}: {
  group: MetadataGroupDefinition
  values: MetadataFormValues['standard']
  onChange: (key: MetadataKey, edit: MetadataEdit) => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const editedCount = group.fields.filter(
    (field) => values[field.key].mode !== 'keep',
  ).length

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="focus-visible:ring-ring/50 flex min-h-11 w-full items-center gap-3 rounded-lg px-1 text-left outline-none focus-visible:ring-[3px]">
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-medium">{group.label}</span>
          <span className="text-muted-foreground text-xs text-pretty">
            {group.description}
          </span>
        </span>
        {editedCount > 0 ? (
          <Badge variant="secondary" className="tabular-nums">
            {editedCount}
          </Badge>
        ) : null}
        <IconChevronDown
          aria-hidden="true"
          className={cn(open ? 'rotate-180' : undefined)}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <FieldGroup className="pt-5">
          {group.fields.map((definition) => (
            <MetadataField
              key={definition.key}
              definition={definition}
              edit={values[definition.key]}
              onChange={(edit) => onChange(definition.key, edit)}
            />
          ))}
        </FieldGroup>
      </CollapsibleContent>
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
          onClick={() => onChange({ ...property, mode: 'keep' })}
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
          <span className="text-muted-foreground text-xs">
            Existing property
          </span>
          <PropertyModeSelect
            label={property.name || 'Custom property'}
            value={property.mode}
            onValueChange={(mode) => onChange({ ...property, mode })}
          />
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FieldLegend>Custom properties</FieldLegend>
          <FieldDescription>
            Add typed values used by Office workflows and document libraries.
          </FieldDescription>
        </div>
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
  const unsupportedCustomPropertyCount = files.reduce(
    (total, queuedFile) =>
      total + (queuedFile.metadata?.unsupportedCustomPropertyCount ?? 0),
    0,
  )

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
        description: 'Add at least one readable XLSX workbook.',
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
      downloadData(results[0].data, results[0].fileName, XLSX_MIME_TYPE)
    } else {
      downloadData(
        await createBulkArchive(results),
        'xlsx-metadata-updated.zip',
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
      status: /\.xlsx$/i.test(file.name) && file.size > 0 ? 'reading' : 'error',
      error: !/\.xlsx$/i.test(file.name)
        ? 'Only .xlsx files are supported.'
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
          <CardTitle>Choose workbooks</CardTitle>
          <CardDescription>
            Drop up to {MAX_FILE_COUNT} XLSX files. One file loads its current
            metadata; multiple files use safe bulk mode.
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
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            className="sr-only"
            onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
          />
          <button
            type="button"
            className={cn(
              'focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center outline-none focus-visible:ring-[3px]',
              'transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96]',
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
            <span className="bg-muted flex size-11 items-center justify-center rounded-xl">
              <IconUpload aria-hidden="true" />
            </span>
            <span className="flex max-w-sm flex-col gap-1">
              <span className="font-medium">Drop XLSX files here</span>
              <span className="text-muted-foreground text-sm text-pretty">
                or click to browse. Combined size limit: 250 MB.
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
              <CardTitle>Metadata changes</CardTitle>
              <CardDescription>
                Typing switches that property to Set. Keep leaves each original
                value untouched; Clear removes it.
              </CardDescription>
              <CardAction>
                <Badge variant="outline">
                  {usableFiles.length === 1
                    ? 'Single file'
                    : `Bulk · ${usableFiles.length}`}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <form.Field name="standard">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    {METADATA_GROUPS.map((group, index) => (
                      <React.Fragment key={group.id}>
                        {index > 0 ? <Separator /> : null}
                        <MetadataSection
                          group={group}
                          values={field.state.value}
                          defaultOpen={index === 0}
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
                )}
              </form.Field>

              <Separator />

              <form.Field name="customProperties">
                {(field) => (
                  <CustomProperties
                    properties={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
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
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="h-10 transition-transform duration-150 active:scale-[0.96]"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {usableFiles.length > 1 ? (
                      <IconFileZip data-icon="inline-start" />
                    ) : (
                      <IconDownload data-icon="inline-start" />
                    )}
                    {isSubmitting
                      ? 'Processing…'
                      : usableFiles.length > 1
                        ? `Update ${usableFiles.length} files`
                        : 'Update & download'}
                  </Button>
                )}
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
