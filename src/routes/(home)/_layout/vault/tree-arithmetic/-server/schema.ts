import { pgTable, text, doublePrecision, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const operationTypeEnum = pgEnum('operation_type', ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'])
export const treeUsers = pgTable('tree_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const threads = pgTable('threads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  startingNumber: doublePrecision('starting_number').notNull(),
  authorId: text('author_id').notNull().references(() => treeUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const operations = pgTable('operations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  threadId: text('thread_id').notNull().references(() => threads.id, { onDelete: 'cascade' }),
  parentOperationId: text('parent_operation_id'),
  type: operationTypeEnum('type').notNull(),
  rightArgument: doublePrecision('right_argument').notNull(),
  result: doublePrecision('result').notNull(),
  authorId: text('author_id').notNull().references(() => treeUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
export const treeUsersRelations = relations(treeUsers, ({ many }) => ({
  threads: many(threads),
  operations: many(operations),
}))

export const threadsRelations = relations(threads, ({ one, many }) => ({
  author: one(treeUsers, { fields: [threads.authorId], references: [treeUsers.id] }),
  operations: many(operations),
}))

export const operationsRelations = relations(operations, ({ one, many }) => ({
  thread: one(threads, { fields: [operations.threadId], references: [threads.id] }),
  author: one(treeUsers, { fields: [operations.authorId], references: [treeUsers.id] }),
  parentOperation: one(operations, {
    fields: [operations.parentOperationId],
    references: [operations.id],
    relationName: 'operationTree',
  }),
  childOperations: many(operations, { relationName: 'operationTree' }),
}))
export type TreeUser = typeof treeUsers.$inferSelect
export type Thread = typeof threads.$inferSelect
export type Operation = typeof operations.$inferSelect
export type OperationType = (typeof operationTypeEnum.enumValues)[number]
