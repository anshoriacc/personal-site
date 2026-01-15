import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLoginMutation, useLogoutMutation, useRegisterMutation, useSessionQuery } from '../-hooks/auth'

export function AuthPanel() {
  const { data: session, isLoading } = useSessionQuery()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const logoutMutation = useLogoutMutation()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === 'login') {
        await loginMutation.mutateAsync({ username, password })
      } else {
        await registerMutation.mutateAsync({ username, password })
      }
      setUsername('')
      setPassword('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    }
  }

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
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Logged in as</span>
          <span className="text-sm font-medium">{session.username}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
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
          }}
        >
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending || registerMutation.isPending}
        >
          {loginMutation.isPending || registerMutation.isPending
            ? 'Loading...'
            : mode === 'login'
              ? 'Login'
              : 'Register'}
        </Button>
      </form>
    </div>
  )
}
