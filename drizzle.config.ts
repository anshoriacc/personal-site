import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/routes/(home)/_layout/vault/ellty2/-server/schema.ts',
  out: './drizzle/tree-arithmetic',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_TREE_ARITHMETIC!,
  },
})
