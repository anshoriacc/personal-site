import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDiscussionsQuery } from '../-hooks/discussion'
import { OperationTree } from './operation-tree'
import { NewOperationForm } from './new-operation-form'
import { useSessionQuery } from '../-hooks/auth'

export function DiscussionList() {
  const { data: session } = useSessionQuery()

  const { data: discussions, isLoading, error } = useDiscussionsQuery()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [replyForms, setReplyForms] = useState<Set<string>>(new Set())

  const toggle = (
    id: string,
    _: Set<string>,
    setter: (fn: (prev: Set<string>) => Set<string>) => void,
  ) => {
    setter((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-destructive text-sm">Failed to load discussions</p>
      </div>
    )
  }

  if (!discussions || discussions.length === 0) {
    return (
      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">
          No discussions yet. Be the first to start one!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => {
        const isExpanded = expanded.has(discussion.id)
        const showReplyForm = replyForms.has(discussion.id)
        const hasOperations = discussion.operations.length > 0

        return (
          <Card key={discussion.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">
                    Starting Number:{' '}
                    <span className="font-mono">
                      {discussion.startingNumber}
                    </span>
                  </CardTitle>
                  <span className="text-muted-foreground text-xs">
                    by {discussion.author.username}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {hasOperations && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        toggle(discussion.id, expanded, setExpanded)
                      }
                    >
                      {isExpanded ? 'Collapse' : 'Expand'} (
                      {discussion.operations.length})
                    </Button>
                  )}

                  {session && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        toggle(discussion.id, replyForms, setReplyForms)
                      }
                    >
                      {showReplyForm ? 'Cancel' : 'Reply'}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {showReplyForm && (
                <div className="mb-4">
                  <NewOperationForm
                    discussionId={discussion.id}
                    parentOperationId={null}
                    leftArgument={discussion.startingNumber}
                    onSuccess={() =>
                      toggle(discussion.id, replyForms, setReplyForms)
                    }
                  />
                </div>
              )}

              {hasOperations && isExpanded && (
                <div className="space-y-2">
                  {discussion.operations.map((operation) => (
                    <OperationTree
                      key={operation.id}
                      operation={operation}
                      discussionId={discussion.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
