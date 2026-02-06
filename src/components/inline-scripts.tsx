import React from 'react'

// Module-level cached script contents - created once
const THEME_DETECTION_SCRIPT = `(${(() => {
  const THEME_COOKIE = '_preferred-theme'
  const cookieMatch = document.cookie.match(
    new RegExp('(?:^|; )' + THEME_COOKIE + '=([^;]*)'),
  )
  if (!cookieMatch) {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const theme = prefersDark ? 'dark' : 'light'
    document.documentElement.className = theme
  }
}).toString()})()`

const BODY_SELECTION_SCRIPT = `(${(() => {
  const t = new Date()
  const fullHours = t.getHours()
  const isNight = fullHours >= 18 || fullHours < 4

  const baseClasses =
    'relative w-screen cursor-default overflow-x-hidden overflow-y-visible'
  const selectionClasses = isNight
    ? 'selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-200'
    : 'selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-200'

  document.body.className = baseClasses + ' ' + selectionClasses
}).toString()})()`

// Cached script element props
const themeDetectionProps = {
  dangerouslySetInnerHTML: { __html: THEME_DETECTION_SCRIPT },
}

const bodySelectionProps = {
  dangerouslySetInnerHTML: { __html: BODY_SELECTION_SCRIPT },
}

export const ThemeDetectionScript = (): React.ReactNode => (
  <script {...themeDetectionProps} />
)

export const BodySelectionScript = (): React.ReactNode => (
  <script {...bodySelectionProps} />
)
