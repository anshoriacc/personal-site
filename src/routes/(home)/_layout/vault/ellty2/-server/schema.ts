import { pgTable, text, doublePrecision, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const operationTypeEnum = pgEnum('operation_type', ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'])
export const treeUsers = pgTable('tree_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const discussions = pgTable('discussions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  startingNumber: doublePrecision('starting_number').notNull(),
  authorId: text('author_id').notNull().references(() => treeUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const operations = pgTable('operations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  discussionId: text('discussion_id').notNull().references(() => discussions.id, { onDelete: 'cascade' }),
  parentOperationId: text('parent_operation_id'),
  type: operationTypeEnum('type').notNull(),
  rightArgument: doublePrecision('right_argument').notNull(),
  result: doublePrecision('result').notNull(),
  authorId: text('author_id').notNull().references(() => treeUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
export const treeUsersRelations = relations(treeUsers, ({ many }) => ({
  discussions: many(discussions),
  operations: many(operations),
}))

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  author: one(treeUsers, { fields: [discussions.authorId], references: [treeUsers.id] }),
  operations: many(operations),
}))

export const operationsRelations = relations(operations, ({ one, many }) => ({
  discussion: one(discussions, { fields: [operations.discussionId], references: [discussions.id] }),
  author: one(treeUsers, { fields: [operations.authorId], references: [treeUsers.id] }),
  parentOperation: one(operations, {
    fields: [operations.parentOperationId],
    references: [operations.id],
    relationName: 'operationTree',
  }),
  childOperations: many(operations, { relationName: 'operationTree' }),
}))
export type TreeUser = typeof treeUsers.$inferSelect
export type Discussion = typeof discussions.$inferSelect
export type Operation = typeof operations.$inferSelect
export type OperationType = (typeof operationTypeEnum.enumValues)[number]
