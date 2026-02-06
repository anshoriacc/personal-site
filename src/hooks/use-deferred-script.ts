import React from 'react'

export function useDeferredScript({
  src,
  defer = true,
  async = false,
  ...attributes
}: {
  src: string
  defer?: boolean
  async?: boolean
  [key: string]: string | boolean | undefined
}) {
  React.useEffect(() => {
    // Defer loading until after hydration
    const loadScript = () => {
      const existingScript = document.querySelector(`script[src="${src}"]`)
      if (existingScript) return

      const script = document.createElement('script')
      script.src = src
      script.defer = defer
      script.async = async

      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined) {
          script.setAttribute(key, String(value))
        }
      })

      document.body.appendChild(script)
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadScript, { timeout: 2000 })
    } else {
      setTimeout(loadScript, 2000)
    }
  }, [src, defer, async])
}
