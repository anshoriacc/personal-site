import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'
import { eq, sql, and } from 'drizzle-orm'
import { db } from '@/db'
import { views, blogViewIps } from '@/db/schema'

function hashIp(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(16, '0')
}

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
    const ip = getRequestIP()

    if (!ip) {
      console.log('No IP found for slug:', slug)
      const current = await db
        .select({ count: views.count })
        .from(views)
        .where(eq(views.slug, slug))
        .limit(1)
      return current[0]?.count ?? 0
    }

    const ipHash = hashIp(ip)

    const existingView = await db
      .select({ id: blogViewIps.id })
      .from(blogViewIps)
      .where(and(eq(blogViewIps.slug, slug), eq(blogViewIps.ipHash, ipHash)))
      .limit(1)

    if (existingView.length > 0) {
      const current = await db
        .select({ count: views.count })
        .from(views)
        .where(eq(views.slug, slug))
        .limit(1)
      return current[0]?.count ?? 0
    }

    await db.insert(blogViewIps).values({
      slug,
      ipHash,
    })

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
