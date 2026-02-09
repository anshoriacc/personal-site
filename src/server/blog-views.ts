import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { views } from '@/db/schema'

export const getBlogViews = createServerFn({
  method: 'GET',
})
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const result = await db
      .select({ count: views.count })
      .from(views)
      .where(eq(views.slug, slug))
      .limit(1)

    return result[0]?.count ?? 0
  })

export const incrementBlogViews = createServerFn({
  method: 'POST',
})
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    // Try to update existing row
    const updated = await db
      .update(views)
      .set({
        count: sql`${views.count} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(views.slug, slug))
      .returning({ count: views.count })

    if (updated.length > 0) {
      return updated[0].count
    }

    // Insert new row if doesn't exist
    const inserted = await db
      .insert(views)
      .values({ slug, count: 1 })
      .returning({ count: views.count })

    return inserted[0].count
  })
