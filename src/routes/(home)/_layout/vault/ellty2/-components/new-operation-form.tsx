import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAddOperationMutation } from '../-hooks/operation'
import { useSessionQuery } from '../-hooks/auth'

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

export function NewOperationForm({ discussionId, parentOperationId, leftArgument, onSuccess }: Props) {
  const { data: session } = useSessionQuery()
  const addMutation = useAddOperationMutation()
  const [type, setType] = useState<OperationType>('ADD')
  const [rightArgument, setRightArgument] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const number = parseFloat(rightArgument)
    if (isNaN(number)) {
      setError('Please enter a valid number')
      return
    }

    if (type === 'DIVIDE' && number === 0) {
      setError('Cannot divide by zero')
      return
    }

    try {
      await addMutation.mutateAsync({
        discussionId,
        parentOperationId,
        type,
        rightArgument: number,
      })
      setRightArgument('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add operation')
    }
  }

  if (!session) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            >
              {op.symbol}
            </button>
          ))}
        </span>
      </div>
      <div className="flex gap-2">
        <Input
          type="number"
          step="any"
          placeholder="Enter number..."
          value={rightArgument}
          onChange={(e) => setRightArgument(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={addMutation.isPending}>
          {addMutation.isPending ? '...' : 'Add'}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  )
}
