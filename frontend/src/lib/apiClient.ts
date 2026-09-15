/**
 * Minimal API client for the public read-only endpoints.
 *
 * Deployed, the site and the API share one origin, so paths are relative and no
 * build-time URL is baked into the bundle. `VITE_API_BASE_URL` exists only for
 * local development where the two halves run on separate ports.
 */

const BASE_URL: string = import.meta.env['VITE_API_BASE_URL'] ?? ''

export interface Welcome {
  name: string
  message: string
}

export class ApiError extends Error {
  readonly kind: 'timeout' | 'network' | 'status'
  constructor(kind: 'timeout' | 'network' | 'status', message: string) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
  }
}

function isWelcome(value: unknown): value is Welcome {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate['name'] === 'string' && typeof candidate['message'] === 'string'
}

/**
 * Fetch the welcome response under a bounded deadline.
 *
 * A provider cold start can outlast the deadline, so a later retry may succeed.
 * There is no automatic retry loop and no fabricated fallback value: the caller
 * shows a real error state instead.
 */
export async function fetchWelcome(signal?: AbortSignal, timeoutMs = 10_000): Promise<Welcome> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const onAbort = (): void => controller.abort()
  signal?.addEventListener('abort', onAbort)

  try {
    const response = await fetch(`${BASE_URL}/api/v1/welcome`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      throw new ApiError('status', `Request failed with status ${response.status}`)
    }
    const body: unknown = await response.json()
    if (!isWelcome(body)) {
      throw new ApiError('status', 'Response did not match the expected shape')
    }
    return body
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      // Distinguish our own deadline from a caller-initiated cancel on unmount.
      if (signal?.aborted) throw error
      throw new ApiError('timeout', 'The request took too long to complete')
    }
    throw new ApiError('network', 'The service could not be reached')
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
