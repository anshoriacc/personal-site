# AGENTS.md - Coding Agent Guidelines

This file contains guidelines for AI agents working on this codebase.

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview production build

# Code quality
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm check            # Format + lint --fix

# Testing
pnpm test             # Run all tests (vitest run)
pnpm test <pattern>   # Run single test by pattern
pnpm test -- --watch # Run in watch mode
```

## Project Overview

- **Framework**: TanStack Start (React framework with TanStack Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-nova style)
- **State**: Zustand for client state, TanStack Query for server state
- **Animation**: Motion library
- **TypeScript**: Strict mode enabled
- **Package Manager**: pnpm

## Code Style Guidelines

### Imports

- Use `@/` prefix for project imports (configured in tsconfig.json and vite.config.ts)
- Group imports: React/libraries → `@/` aliases → relative imports
- Use type-only imports: `import { type Foo } from '...'`

### Formatting

- **Prettier**: No semicolons, single quotes, trailing commas
- Use `prettier-plugin-tailwindcss` for Tailwind class sorting
- Run `pnpm check` before committing

### Naming Conventions

- Components: PascalCase (e.g., `Button.tsx`, `ThemeToggle.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useTheme.ts`, `useMobile.ts`)
- Stores: camelCase with `.store.ts` suffix (e.g., `theme.store.ts`)
- Utils: camelCase (e.g., `utils.ts`, `lru-cache.ts`)
- Types: PascalCase with `T` prefix (e.g., `TTheme`, `TCurrentlyPlaying`)
- Server functions: camelCase in `server/` directories
- Route files: follow TanStack Router conventions (see `src/routes/`)

### Types & TypeScript

- Enable `strict: true` in tsconfig.json
- Use `type` for type aliases (not `interface`)
- Export types from server files when needed by client
- Prefer explicit return types on public APIs
- Use `satisfies` for constraint checking when appropriate

### Error Handling

- Use `.catch(() => null)` pattern for non-critical failures (see spotify.ts example)
- Log errors with context: `console.error('Failed to persist theme:', error)`
- Return null/defaults for graceful degradation
- Use Zod for runtime validation when external data shape is uncertain

### Tailwind & Styling

- Use `cn()` utility from `@/lib/utils` for class merging
- Prefer semantic color tokens: `bg-primary`, `text-foreground`
- Use `data-slot` attributes for component identification
- Support dark mode via `dark:` prefix and CSS variables

### Component Patterns

- Use `class-variance-authority` (cva) for component variants
- Base UI primitives from `@base-ui/react`
- Forward props with spread: `...props`
- Keep components focused and composable

### State Management

- **Zustand**: Client-only state (theme, UI state)
  - Create stores with explicit interfaces
  - Export selectors as separate hooks
- **TanStack Query**: Server state and caching
  - Use `queryOptions` for reusable query configs
  - Set appropriate `staleTime` for caching

### Server Functions

- Use `createServerFn()` from `@tanstack/react-start`
- Cache expensive operations with LRUCache (see spotify.ts example)
- Parallel fetch with `Promise.all()` when possible
- Store server functions in `-server/` directories within routes

### File Organization

```
src/
  components/       # Reusable UI components
    ui/            # shadcn/ui components
    svg/           # SVG icon components
  hooks/           # React hooks
    api/           # TanStack Query hooks
  lib/             # Utilities and helpers
  routes/          # TanStack Router routes
    (home)/        # Route groups
    api/           # API routes
  server/          # Server functions (non-route)
  stores/          # Zustand stores
  constants/       # Constants and env
```

### Route Conventions

- Use `-components/`, `-hooks/`, `-server/` for route-specific code
- Route files use `(group)` for grouping, `[param]` for dynamic segments
- Index routes named `index.tsx`

### Git Workflow

- No existing AGENTS.md - you're creating it
- Run `pnpm check` before commits
- No specific commit message format enforced

## Environment Variables

Stored in `/Users/jks-anshori-dev/Dev/personal-site/src/constants/env.ts`:

- SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
- GITHUB_TOKEN
- DATABASE_URL

## Notes for Agents

- This is a portfolio/personal site with Spotify integration and GitHub contributions
- Uses React 19 with modern patterns
- No existing Cursor rules or Copilot instructions found
- Always run linting after changes: `pnpm check`
