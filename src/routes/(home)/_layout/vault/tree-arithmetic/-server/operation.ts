import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { operations, threads, treeUsers, type OperationType } from './schema'
import type { Session } from './auth'

const addOperationSchema = z.object({
  threadId: z.string(),
  parentOperationId: z.string().nullable(),
  type: z.enum(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']),
  rightArgument: z.number(),
})
export const addOperation = createServerFn({ method: 'POST' })
  .inputValidator(addOperationSchema)
  .handler(async ({ data }) => {
    const sessionData = getCookie('tree-arithmetic-auth-session')
    let session: Session = null

    if (sessionData) {
      try {
        session = JSON.parse(sessionData)
      } catch {}
    }

    if (!session) throw new Error('Unauthorized')
    const calculateResult = (
      left: number,
      type: OperationType,
      right: number,
    ) => {
      if (type === 'ADD') return left + right
      if (type === 'SUBTRACT') return left - right
      if (type === 'MULTIPLY') return left * right
      if (type === 'DIVIDE') {
        if (right === 0) throw new Error('Cannot divide by zero')
        return left / right
      }
      throw new Error('Invalid operation type')
    }

    const { threadId, parentOperationId, type, rightArgument } = data

    let leftArgument: number

    if (parentOperationId) {
      const parent = await db.query.operations.findFirst({
        where: eq(operations.id, parentOperationId),
      })
      if (!parent) throw new Error('Parent operation not found')
      leftArgument = parent.result
    } else {
      const thread = await db.query.threads.findFirst({
        where: eq(threads.id, threadId),
      })
      if (!thread) throw new Error('Thread not found')
      leftArgument = thread.startingNumber
    }

    const result = calculateResult(leftArgument, type, rightArgument)
    const [operation] = await db
      .insert(operations)
      .values({
        threadId,
        parentOperationId,
        type,
        rightArgument,
        result,
        authorId: session.userId,
      })
      .returning()

    const author = await db.query.treeUsers.findFirst({
      where: eq(treeUsers.id, session.userId),
    })

    return {
      ...operation,
      author: {
        id: author!.id,
        username: author!.username,
      },
    }
  })
