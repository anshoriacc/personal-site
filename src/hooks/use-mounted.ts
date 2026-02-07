import React from 'react'

// Server snapshot always returns false
const getServerSnapshot = () => false

// Client snapshot checks if document is available
const getSnapshot = () => typeof document !== 'undefined'

// Subscribe function (no-op since this is derived state)
const subscribe = () => () => {}

/**
 * Hook to detect if component is mounted (client-side only)
 * Uses useSyncExternalStore to derive state during render (no extra re-render)
 */
export function useMounted() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
