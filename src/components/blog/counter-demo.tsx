import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function CounterDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="border-border my-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
      <div className="space-y-1">
        <p className="text-sm font-medium">A little interaction</p>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-muted-foreground text-sm tabular-nums"
        >
          Clicked {count} {count === 1 ? 'time' : 'times'}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => setCount(0)}
          disabled={count === 0}
        >
          Reset
        </Button>
        <Button
          variant="secondary"
          onClick={() => setCount((value) => value + 1)}
        >
          Click me
        </Button>
      </div>
    </div>
  )
}
