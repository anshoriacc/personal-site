import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateDiscussionMutation } from '../-hooks/discussion'
import { useSessionQuery } from '../-hooks/auth'

export function NewDiscussionForm() {
  const { data: session } = useSessionQuery()
  const createMutation = useCreateDiscussionMutation()
  const [startingNumber, setStartingNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const number = parseFloat(startingNumber)
    if (isNaN(number)) {
      setError('Please enter a valid number')
      return
    }

    try {
      await createMutation.mutateAsync({ startingNumber: number })
      setStartingNumber('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discussion')
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium">Start a New Discussion</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="number"
          step="any"
          placeholder="Enter a starting number..."
          value={startingNumber}
          onChange={(e) => setStartingNumber(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
