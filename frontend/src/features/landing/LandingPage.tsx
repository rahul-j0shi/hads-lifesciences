import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchWelcome, type Welcome } from '../../lib/apiClient'
import styles from './LandingPage.module.css'

type ConnectionState =
  | { status: 'loading' }
  | { status: 'ready'; welcome: Welcome }
  | { status: 'unavailable' }

/**
 * Neutral branded placeholder.
 *
 * Copy here is intentionally minimal. The client's marketing content is not
 * approved for publication, so none of it appears on this page.
 */
export function LandingPage(): React.JSX.Element {
  const [connection, setConnection] = useState<ConnectionState>({ status: 'loading' })
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback((): void => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setConnection({ status: 'loading' })

    fetchWelcome(controller.signal)
      .then((welcome) => {
        if (!controller.signal.aborted) setConnection({ status: 'ready', welcome })
      })
      .catch(() => {
        // Never show a fabricated success. The page stays useful either way.
        if (!controller.signal.aborted) setConnection({ status: 'unavailable' })
      })
  }, [])

  useEffect(() => {
    load()
    return () => abortRef.current?.abort()
  }, [load])

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Science &middot; Nature &middot; Better Lives</p>
        <h1 className={styles.title}>HADS Lifesciences</h1>
        <p className={styles.lead}>Website coming soon.</p>

        <div className={styles.status} aria-live="polite">
          {connection.status === 'loading' && (
            <p className={styles.muted}>Checking service status.</p>
          )}
          {connection.status === 'ready' && (
            <p className={styles.muted}>
              Service connected. {connection.welcome.message}
            </p>
          )}
          {connection.status === 'unavailable' && (
            <>
              <p className={styles.muted}>
                The service is not reachable right now. This page is unaffected.
              </p>
              <button type="button" className={styles.retry} onClick={load}>
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
