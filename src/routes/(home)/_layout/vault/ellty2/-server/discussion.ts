import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { eq, isNull, asc, desc, and } from 'drizzle-orm'
import { db } from './db'
import { discussions, operations, treeUsers } from './schema'
import type { Session } from './auth'

const createDiscussionSchema = z.object({
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
  childOperations: OperationNode[]
}

export type DiscussionWithOperations = {
  id: string
  startingNumber: number
  author: {
    id: string
    username: string
  }
  createdAt: Date
  operations: OperationNode[]
}

export const getDiscussions = createServerFn().handler(async () => {
  const buildOperationTree = async (
    discussionId: string,
    parentId: string | null,
  ): Promise<OperationNode[]> => {
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
          eq(operations.discussionId, discussionId),
          parentId === null
            ? isNull(operations.parentOperationId)
            : eq(operations.parentOperationId, parentId)
        )
      )
      .orderBy(asc(operations.createdAt))

    const result: OperationNode[] = []
    for (const op of ops) {
      const childOperations = await buildOperationTree(discussionId, op.id)
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

  const allDiscussions = await db
    .select({
      id: discussions.id,
      startingNumber: discussions.startingNumber,
      createdAt: discussions.createdAt,
      authorId: treeUsers.id,
      authorUsername: treeUsers.username,
    })
    .from(discussions)
    .innerJoin(treeUsers, eq(discussions.authorId, treeUsers.id))
    .orderBy(desc(discussions.createdAt))

  const result: DiscussionWithOperations[] = []
  for (const d of allDiscussions) {
    const ops = await buildOperationTree(d.id, null)
    result.push({
      id: d.id,
      startingNumber: d.startingNumber,
      createdAt: d.createdAt,
      author: {
        id: d.authorId,
        username: d.authorUsername,
      },
      operations: ops,
    })
  }

  return result
})

export const createDiscussion = createServerFn({ method: 'POST' })
  .inputValidator(createDiscussionSchema)
  .handler(async ({ data }) => {
    const sessionData = getCookie('tree-arithmetic-auth-session')
    let session: Session = null
    
    if (sessionData) {
      try {
        session = JSON.parse(sessionData)
      } catch {}
    }

    if (!session) throw new Error('Unauthorized')

    const [discussion] = await db
      .insert(discussions)
      .values({
        startingNumber: data.startingNumber,
        authorId: session.userId,
      })
      .returning()

    const author = await db.query.treeUsers.findFirst({
      where: eq(treeUsers.id, session.userId),
    })

    return {
      ...discussion,
      author: {
        id: author!.id,
        username: author!.username,
      },
      operations: [],
    }
  })
