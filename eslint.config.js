//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      // Disable import ordering - you prefer visual grouping instead
      'import/order': 'off',
      // Disable alphabetical sorting of named imports - you prefer visual ordering
      'sort-imports': 'off',
      // Keep type imports with their packages, don't force separate lines
      'import/consistent-type-specifier-style': 'off',
      // Allow both type and value imports from same package on same line
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]
