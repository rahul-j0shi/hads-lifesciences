import { useCallback, useEffect, useRef, useState } from 'react'
import { BRAND, CONTACT } from '../content'
import styles from '../site.module.css'

type CopyState = 'idle' | 'copied' | 'failed'

export function ContactSection(): React.JSX.Element {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const timer = useRef<number | null>(null)

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const copy = useCallback(async (): Promise<void> => {
    if (timer.current) window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(BRAND.email)
      setCopyState('copied')
    } catch {
      // Never claim success. The address stays visible and selectable either way.
      setCopyState('failed')
    }
    timer.current = window.setTimeout(() => setCopyState('idle'), 4000)
  }, [])

  return (
    <section className={styles.contactBand} id="contact" aria-labelledby="contact-heading">
      <div className={styles.container}>
        <h2 className={`${styles.h2} ${styles.centered} ${styles.onNavy}`} id="contact-heading">
          {CONTACT.heading}
        </h2>
        <p className={`${styles.lead} ${styles.centered} ${styles.onNavy}`}>{CONTACT.lead}</p>

        <div className={styles.contactRow}>
          <a className={styles.emailLink} href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>
          <button type="button" className={styles.buttonInverse} onClick={() => void copy()}>
            {CONTACT.copyIdle}
          </button>
        </div>

        {/* Feedback is announced politely and never moves focus. The permanent
            button label is unchanged so its accessible name stays stable. */}
        <p className={styles.copyStatus} role="status" aria-live="polite">
          {copyState === 'copied' && CONTACT.copySuccess}
          {copyState === 'failed' && CONTACT.copyFailure}
        </p>

        <ul className={styles.inquiryList}>
          {CONTACT.inquiries.map((inq) => (
            <li key={inq.label}>
              <a
                className={styles.inquiryPill}
                href={`mailto:${BRAND.email}?subject=${encodeURIComponent(inq.subject)}`}
              >
                {inq.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
