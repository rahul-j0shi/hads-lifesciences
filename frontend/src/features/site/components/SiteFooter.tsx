import { BRAND, FOOTER } from '../content'
import styles from '../site.module.css'

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
          <a className={styles.footerLink} href="#top">
            {FOOTER.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
