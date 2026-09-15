import { BRAND, FOOTER } from '../content'
import styles from '../site.module.css'

/**
 * Footer. "Back to top" is an arrow control, which is the conventional
 * affordance; the words remain as its accessible name rather than as body text.
 */
export function SiteFooter(): React.JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerInner}`}>
        <div>
          <p className={styles.footerBrand}>{BRAND.name}</p>
          <p className={styles.footerTagline}>
            {BRAND.tagline.map((part, i) => (
              <span key={part.text}>
                <span className={part.tone === 'navy' ? styles.toneNavy : styles.toneMagenta}>
                  {part.text}
                </span>
                {i < BRAND.tagline.length - 1 && <span className={styles.bullet}> • </span>}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.footerRight}>
          <a className={styles.footerLink} href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>
          <a className={styles.toTop} href="#top" aria-label={FOOTER.backToTop} title={FOOTER.backToTop}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
