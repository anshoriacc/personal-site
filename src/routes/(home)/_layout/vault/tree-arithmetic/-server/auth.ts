import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { treeUsers } from './schema'

const SESSION_COOKIE_NAME = 'tree-arithmetic-auth-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
})

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type Session = {
  userId: string
  username: string
} | null

export const getSession = createServerFn().handler(async (): Promise<Session> => {
  const sessionData = getCookie(SESSION_COOKIE_NAME)
  if (!sessionData) return null

  try {
    return JSON.parse(sessionData)
  } catch {
    return null
  }
})

export const register = createServerFn({ method: 'POST' })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {
    const { username, password } = data

    const existingUser = await db.query.treeUsers.findFirst({
      where: eq(treeUsers.username, username),
    })

    if (existingUser) throw new Error('Username already taken')

    const [user] = await db
      .insert(treeUsers)
      .values({
        username,
        passwordHash: await bcrypt.hash(password, 10),
      })
      .returning()

    const session: Session = {
      userId: user.id,
      username: user.username,
    }

    setCookie(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return session
  })

export const login = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const { username, password } = data

    const user = await db.query.treeUsers.findFirst({
      where: eq(treeUsers.username, username),
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid username or password')
    }

    const session: Session = {
      userId: user.id,
      username: user.username,
    }

    setCookie(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return session
  })

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  setCookie(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
})
