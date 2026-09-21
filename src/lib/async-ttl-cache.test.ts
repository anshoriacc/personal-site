import { afterEach, describe, expect, it, vi } from 'vitest'

import { AsyncTTLCache } from './async-ttl-cache'

afterEach(() => {
  vi.useRealTimers()
})

describe('AsyncTTLCache', () => {
  it('coalesces concurrent cache misses', async () => {
    let resolveLoad!: (value: string) => void
    const loader = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveLoad = resolve
        }),
    )
    const cache = new AsyncTTLCache<string>({
      freshTTL: 1_000,
      staleTTL: 1_000,
    })

    const first = cache.get(loader)
    const second = cache.get(loader)
    resolveLoad('value')

    await expect(Promise.all([first, second])).resolves.toEqual([
      'value',
      'value',
    ])
    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('returns fresh values without reloading', async () => {
    const loader = vi.fn().mockResolvedValue('value')
    const cache = new AsyncTTLCache<string>({
      freshTTL: 1_000,
      staleTTL: 1_000,
    })

    await expect(cache.get(loader)).resolves.toBe('value')
    await expect(cache.get(loader)).resolves.toBe('value')
    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('serves stale data while one background refresh runs', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    let resolveRefresh!: (value: string) => void
    const loader = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('old')
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveRefresh = resolve
          }),
      )
    const cache = new AsyncTTLCache<string>({
      freshTTL: 1_000,
      staleTTL: 5_000,
    })

    await expect(cache.get(loader)).resolves.toBe('old')
    vi.advanceTimersByTime(1_001)

    await expect(cache.get(loader)).resolves.toBe('old')
    await expect(cache.get(loader)).resolves.toBe('old')
    expect(loader).toHaveBeenCalledTimes(2)

    resolveRefresh('new')
    await vi.runAllTimersAsync()
    await expect(cache.get(loader)).resolves.toBe('new')
  })

  it('returns stale data when background refresh fails', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    const loader = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('old')
      .mockRejectedValueOnce(new Error('offline'))
    const cache = new AsyncTTLCache<string>({
      freshTTL: 1_000,
      staleTTL: 5_000,
    })

    await cache.get(loader)
    vi.advanceTimersByTime(1_001)

    await expect(cache.get(loader)).resolves.toBe('old')
    await vi.runAllTimersAsync()
    expect(loader).toHaveBeenCalledTimes(2)
  })
})
