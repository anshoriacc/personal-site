import React from 'react'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'

import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useSessionQuery,
} from '../-hooks/auth'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const authSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function AuthPanel() {
  const { data: session, isLoading } = useSessionQuery()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const logoutMutation = useLogoutMutation()

  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onSubmit: authSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)

      try {
        if (mode === 'login') {
          await loginMutation.mutateAsync(value)
        } else {
          await registerMutation.mutateAsync(value)
        }
        form.reset()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
      }
    },
  })

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      setError(message)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Loading...</span>
        </CardContent>
      </Card>
    )
  }

  if (session) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">Logged in as</span>
            <span className="text-sm font-semibold">{session.username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {mode === 'login' ? 'Login' : 'Register'}
          </h3>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError(null)
              form.reset()
            }}
          >
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </Button>
        </div>

        <form
          id="auth-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Username"
                      autoComplete="username"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Password"
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {error && <p className="text-destructive mt-3 text-xs">{error}</p>}

          <Button
            type="submit"
            form="auth-form"
            className="mt-3 w-full"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {loginMutation.isPending || registerMutation.isPending
              ? 'Loading...'
              : mode === 'login'
                ? 'Login'
                : 'Register'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
