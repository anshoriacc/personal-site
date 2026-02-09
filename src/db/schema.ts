import {
  integer,
  pgTable,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const views = pgTable('views', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  count: integer('count').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const blogViewIps = pgTable(
  'blog_view_ips',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar('slug', { length: 255 }).notNull(),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    viewedAt: timestamp('viewed_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('unique_slug_ip').on(table.slug, table.ipHash)],
)

export type View = typeof views.$inferSelect
export type NewView = typeof views.$inferInsert
export type BlogViewIp = typeof blogViewIps.$inferSelect
export type NewBlogViewIp = typeof blogViewIps.$inferInsert
