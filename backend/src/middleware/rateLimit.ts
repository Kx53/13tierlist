/**
 * Simple in-memory rate limiter for Elysia.
 * Uses a Map to track request counts per IP within a sliding window.
 */

interface RateLimitOptions {
  /** Time window in milliseconds */
  windowMs: number
  /** Max requests per window per IP */
  max: number
  /** Error message when limit exceeded */
  message?: string
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options
  const store = new Map<string, RateLimitEntry>()

  // Periodically clean up expired entries (every minute)
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) store.delete(key)
    }
  }, 60_000)

  return (app: any) =>
    app.onBeforeHandle(({ request, set }: { request: Request; set: any }) => {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'

      const now = Date.now()
      const entry = store.get(ip)

      if (!entry || now >= entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + windowMs })
        return
      }

      entry.count++

      if (entry.count > max) {
        set.status = 429
        set.headers['Retry-After'] = String(Math.ceil((entry.resetAt - now) / 1000))
        return { error: message }
      }
    })
}

/** 100 requests per 15 minutes — applied globally */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
})

/** 20 requests per hour — for tier list creation */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many tier lists created, please try again later.',
})
