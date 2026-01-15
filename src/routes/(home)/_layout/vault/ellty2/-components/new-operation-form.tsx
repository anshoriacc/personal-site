import React from 'react'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'

import { useSessionQuery } from '../-hooks/auth'
import { useAddOperationMutation } from '../-hooks/operation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

type OperationType = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'

const OPERATIONS = [
  { type: 'ADD' as const, symbol: '+', label: 'Add' },
  { type: 'SUBTRACT' as const, symbol: '−', label: 'Subtract' },
  { type: 'MULTIPLY' as const, symbol: '×', label: 'Multiply' },
  { type: 'DIVIDE' as const, symbol: '÷', label: 'Divide' },
]

type Props = {
  discussionId: string
  parentOperationId: string | null
  leftArgument: number
  onSuccess?: () => void
}

const operationSchema = z.object({
  rightArgument: z
    .string()
    .min(1, 'Right argument is required')
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'Please enter a valid number',
    }),
})

export function NewOperationForm({
  discussionId,
  parentOperationId,
  leftArgument,
  onSuccess,
}: Props) {
  const { data: session } = useSessionQuery()
  const addMutation = useAddOperationMutation()
  const [type, setType] = React.useState<OperationType>('ADD')
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      rightArgument: '',
    },
    validators: {
      onSubmit: operationSchema,
      onChange: z.object({
        rightArgument: z.string().refine(
          (val) => {
            if (!val) return true
            const num = parseFloat(val)
            if (isNaN(num)) return true
            return type !== 'DIVIDE' || num !== 0
          },
          {
            message: 'Cannot divide by zero',
          },
        ),
      }),
    },
    onSubmit: async ({ value }) => {
      setError(null)

      try {
        await addMutation.mutateAsync({
          discussionId,
          parentOperationId,
          type,
          rightArgument: parseFloat(value.rightArgument),
        })
        form.reset()
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add operation')
      }
    },
  })

  if (!session) {
    return null
  }

  return (
    <Card className="bg-card/50">
      <CardContent>
        <form
          id={`operation-form-${discussionId}-${parentOperationId ?? 'root'}`}
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
              <span className="font-medium">{leftArgument}</span>
              <span className="flex gap-1">
                {OPERATIONS.map((op) => (
                  <button
                    key={op.type}
                    type="button"
                    onClick={() => setType(op.type)}
                    className={`rounded px-2 py-1 transition-colors ${
                      type === op.type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    aria-label={op.label}
                  >
                    {op.symbol}
                  </button>
                ))}
              </span>
            </div>

            <form.Field
              name="rightArgument"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="sr-only">
                      Right Argument
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id={field.name}
                        type="number"
                        step="any"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter number..."
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        form={`operation-form-${discussionId}-${parentOperationId ?? 'root'}`}
                        size="sm"
                        disabled={addMutation.isPending}
                      >
                        {addMutation.isPending ? '...' : 'Add'}
                      </Button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {error && <p className="text-destructive mt-2 text-xs">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
