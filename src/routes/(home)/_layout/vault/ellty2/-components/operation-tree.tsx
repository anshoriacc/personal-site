import { useState } from 'react'

import { useSessionQuery } from '../-hooks/auth'
import type { OperationNode } from '../-server/discussion'
import { Card, CardContent } from '@/components/ui/card'
import { NewOperationForm } from './new-operation-form'
import { Button } from '@/components/ui/button'

const SYMBOLS = { ADD: '+', SUBTRACT: '−', MULTIPLY: '×', DIVIDE: '÷' } as const

type Props = {
  operation: OperationNode
  discussionId: string
  leftArgument: number
}

export function OperationTree({
  operation,
  discussionId,
  leftArgument,
}: Props) {
  const { data: session } = useSessionQuery()

  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  const hasChildren = operation.childOperations.length > 0

  return (
    <div className="space-y-2">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                <span className="text-muted-foreground">{leftArgument}</span>{' '}
                {SYMBOLS[operation.type as keyof typeof SYMBOLS]}{' '}
                {operation.rightArgument} ={' '}
                <span className="font-bold">{operation.result}</span>
              </span>
              <span className="text-muted-foreground text-xs">
                by {operation.author.username}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowChildren(!showChildren)}
                >
                  {showChildren ? 'Hide' : 'Show'} (
                  {operation.childOperations.length})
                </Button>
              )}

              {session && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  {showReplyForm ? 'Cancel' : 'Reply'}
                </Button>
              )}
            </div>
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <NewOperationForm
                discussionId={discussionId}
                parentOperationId={operation.id}
                leftArgument={operation.result}
                onSuccess={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {hasChildren && showChildren && (
        <div className="border-border ml-6 space-y-2 border-l-2 pl-4">
          {operation.childOperations.map((child) => (
            <OperationTree
              key={child.id}
              operation={child}
              discussionId={discussionId}
              leftArgument={operation.result}
            />
          ))}
        </div>
      )}
    </div>
  )
}
