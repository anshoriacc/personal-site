import React from 'react'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'

import { useSessionQuery } from '../-hooks/auth'
import { useCreateThreadMutation } from '../-hooks/thread'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

const threadSchema = z.object({
  startingNumber: z
    .string()
    .min(1, 'Starting number is required')
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'Please enter a valid number',
    }),
})

export function NewThreadForm() {
  const { data: session } = useSessionQuery()
  const createMutation = useCreateThreadMutation()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      startingNumber: '',
    },
    validators: {
      onSubmit: threadSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)

      try {
        await createMutation.mutateAsync({
          startingNumber: parseFloat(value.startingNumber),
        })
        form.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create thread')
      }
    },
  })

  if (!session) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <h3 className="mb-3 text-sm font-medium">Start a New Thread</h3>
        <form
          id="thread-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="startingNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="startingNumber">
                      Starting Number
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        id="startingNumber"
                        type="number"
                        step="any"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter a starting number..."
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        form="thread-form"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? 'Creating...' : 'Create'}
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
