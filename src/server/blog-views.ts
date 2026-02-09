import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { views } from '@/db/schema'

export const getBlogViews = createServerFn()
  .inputValidator((slug: string) => slug)
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
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    console.log('Incrementing views for slug:', slug, new Date().toISOString())
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
      .values({ slug: slug, count: 1 })
      .returning({ count: views.count })

    return inserted[0].count
  })

export const getAllBlogViews = createServerFn({
  method: 'GET',
}).handler(async () => {
  const result = await db
    .select({ slug: views.slug, count: views.count })
    .from(views)

  return result.reduce(
    (acc, row) => {
      acc[row.slug] = row.count
      return acc
    },
    {} as Record<string, number>,
  )
})
