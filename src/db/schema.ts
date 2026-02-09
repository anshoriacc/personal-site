import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const views = pgTable('views', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  count: integer('count').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type View = typeof views.$inferSelect
export type NewView = typeof views.$inferInsert
