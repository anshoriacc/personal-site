import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL_TREE_ARITHMETIC!

const client = postgres(connectionString)

export const db = drizzle(client, { schema })
