---
title: 'Building with TanStack Start: A Modern React Framework'
date: '2025-02-09'
slug: 'hello-world'
excerpt: 'Exploring the power of TanStack Start for building type-safe, full-stack React applications with excellent developer experience.'
tags: ['react', 'tanstack', 'typescript', 'webdev']
published: true
---

## Why TanStack Start?

TanStack Start represents a new generation of React frameworks that combines the best of modern web development practices. It's built on top of battle-tested libraries like TanStack Router and TanStack Query, providing a cohesive development experience.

### Key Features

- **File-based routing** with full type safety
- **Server functions** for API routes
- **TanStack Query** integration out of the box
- **Vite-powered** development experience

## Code Example

Here's a simple server function:

```typescript
import { createServerFn } from '@tanstack/react-start'

export const getData = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from the server!' }
})
```

## Tables

| Feature       | TanStack Start   | Next.js           |
| ------------- | ---------------- | ----------------- |
| Routing       | File-based       | File-based        |
| Data Fetching | Server Functions | Server Components |
| Caching       | TanStack Query   | Next.js Cache     |

## Lists and Formatting

**Bold text**, _italic text_, and `inline code` are all supported.

1. First item
2. Second item
3. Third item

- Unordered item
- Another item
  - Nested item
  - Another nested item

## Blockquotes

> The best way to predict the future is to invent it.
> — Alan Kay

## Images

You can include images like this:

![TanStack Logo](/dark800.png)

## Conclusion

TanStack Start is an excellent choice for modern React applications. It provides:

- Type safety throughout
- Great developer experience
- Performance optimizations
- Easy deployment

---

_Happy coding!_
