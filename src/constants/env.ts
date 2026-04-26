import { z } from 'zod'

const serverEnvSchema = z.object({
  SITE_URL: z.url().optional(),
  SPOTIFY_CLIENT_ID: z.string().min(1, 'SPOTIFY_CLIENT_ID is required'),
  SPOTIFY_CLIENT_SECRET: z.string().min(1, 'SPOTIFY_CLIENT_SECRET is required'),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1, 'SPOTIFY_REFRESH_TOKEN is required'),
})

type TServerEnv = z.infer<typeof serverEnvSchema>

function formatEnvValidationError(error: z.ZodError): string {
  const details = error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  return `Invalid server environment variables:\n${details}`
}

export function parseServerEnv(
  env: Record<string, string | undefined>,
): TServerEnv {
  const result = serverEnvSchema.safeParse(env)

  if (!result.success) {
    throw new Error(formatEnvValidationError(result.error))
  }

  return result.data
}

let cachedServerEnv: TServerEnv | null = null

export function getServerEnv(): TServerEnv {
  if (cachedServerEnv) {
    return cachedServerEnv
  }

  cachedServerEnv = parseServerEnv(process.env)
  return cachedServerEnv
}

export const SITE_URL = process.env.SITE_URL
