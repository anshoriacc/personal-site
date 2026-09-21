type TAsyncTTLCacheOptions = {
  freshTTL: number
  staleTTL: number
}

type TCacheEntry<T> = {
  freshUntil: number
  staleUntil: number
  value: T
}

export class AsyncTTLCache<T> {
  private entry: TCacheEntry<T> | undefined
  private refreshPromise: Promise<T> | undefined

  constructor(private readonly options: TAsyncTTLCacheOptions) {}

  get(loader: () => Promise<T>): Promise<T> {
    const now = Date.now()

    if (this.entry && now < this.entry.freshUntil) {
      return Promise.resolve(this.entry.value)
    }

    if (this.entry && now < this.entry.staleUntil) {
      void this.refresh(loader).catch(() => undefined)
      return Promise.resolve(this.entry.value)
    }

    return this.refresh(loader)
  }

  clear(): void {
    this.entry = undefined
    this.refreshPromise = undefined
  }

  private refresh(loader: () => Promise<T>): Promise<T> {
    if (this.refreshPromise) return this.refreshPromise

    const refreshPromise = loader()
      .then((value) => {
        const now = Date.now()
        this.entry = {
          value,
          freshUntil: now + this.options.freshTTL,
          staleUntil: now + this.options.freshTTL + this.options.staleTTL,
        }
        return value
      })
      .catch((error: unknown) => {
        if (this.entry && Date.now() < this.entry.staleUntil) {
          return this.entry.value
        }
        throw error
      })
      .finally(() => {
        if (this.refreshPromise === refreshPromise) {
          this.refreshPromise = undefined
        }
      })

    this.refreshPromise = refreshPromise
    return refreshPromise
  }
}
