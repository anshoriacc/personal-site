import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { eq, isNull, asc, desc, and } from 'drizzle-orm'
import { db } from './db'
import { threads, operations, treeUsers } from './schema'
import type { Session } from './auth'

const createThreadSchema = z.object({
  startingNumber: z.number(),
})
export type OperationNode = {
  id: string
  type: string
  rightArgument: number
  result: number
  author: {
    id: string
    username: string
  }
  createdAt: Date
  childOperations: Array<OperationNode>
}

export type ThreadWithOperations = {
  id: string
  startingNumber: number
  author: {
    id: string
    username: string
  }
  createdAt: Date
  operations: Array<OperationNode>
}

export const getThreads = createServerFn().handler(async () => {
  const buildOperationTree = async (
    threadId: string,
    parentId: string | null,
  ): Promise<Array<OperationNode>> => {
    const ops = await db
      .select({
        id: operations.id,
        type: operations.type,
        rightArgument: operations.rightArgument,
        result: operations.result,
        createdAt: operations.createdAt,
        authorId: treeUsers.id,
        authorUsername: treeUsers.username,
      })
      .from(operations)
      .innerJoin(treeUsers, eq(operations.authorId, treeUsers.id))
      .where(
        and(
          eq(operations.threadId, threadId),
          parentId === null
            ? isNull(operations.parentOperationId)
            : eq(operations.parentOperationId, parentId),
        ),
      )
      .orderBy(asc(operations.createdAt))

    const result: Array<OperationNode> = []
    for (const op of ops) {
      const childOperations = await buildOperationTree(threadId, op.id)
      result.push({
        id: op.id,
        type: op.type,
        rightArgument: op.rightArgument,
        result: op.result,
        createdAt: op.createdAt,
        author: {
          id: op.authorId,
          username: op.authorUsername,
        },
        childOperations,
      })
    }
    return result
  }

  const allThreads = await db
    .select({
      id: threads.id,
      startingNumber: threads.startingNumber,
      createdAt: threads.createdAt,
      authorId: treeUsers.id,
      authorUsername: treeUsers.username,
    })
    .from(threads)
    .innerJoin(treeUsers, eq(threads.authorId, treeUsers.id))
    .orderBy(desc(threads.createdAt))

  const result: Array<ThreadWithOperations> = []
  for (const t of allThreads) {
    const ops = await buildOperationTree(t.id, null)
    result.push({
      id: t.id,
      startingNumber: t.startingNumber,
      createdAt: t.createdAt,
      author: {
        id: t.authorId,
        username: t.authorUsername,
      },
      operations: ops,
    })
  }

  return result
})

export const createThread = createServerFn({ method: 'POST' })
  .inputValidator(createThreadSchema)
  .handler(async ({ data }) => {
    const sessionData = getCookie('tree-arithmetic-auth-session')
    let session: Session = null

    if (sessionData) {
      try {
        session = JSON.parse(sessionData)
      } catch {}
    }

    if (!session) throw new Error('Unauthorized')

    const [thread] = await db
      .insert(threads)
      .values({
        startingNumber: data.startingNumber,
        authorId: session.userId,
      })
      .returning()

    const author = await db.query.treeUsers.findFirst({
      where: eq(treeUsers.id, session.userId),
    })

    return {
      ...thread,
      author: {
        id: author!.id,
        username: author!.username,
      },
      operations: [],
    }
  })
