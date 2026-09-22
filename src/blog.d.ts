declare module 'virtual:blog' {
  export const posts: Array<import('./lib/blog-types').TBlogPost>
  export const postLoaders: Record<
    string,
    () => Promise<{ default: import('mdx/types').MDXContent }>
  >
}
