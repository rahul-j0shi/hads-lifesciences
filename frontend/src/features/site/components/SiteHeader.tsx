import { useEffect, useId, useState } from 'react'
import { BRAND, NAV } from '../content'
import styles from '../site.module.css'

/**
 * Sticky header with an in-flow disclosure menu at narrow widths.
 *
 * Deliberately not an ARIA menu: these are ordinary links, so the disclosure
 * pattern applies. The panel pushes content rather than overlaying it.
 */
export function SiteHeader(): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpen(false)
        document.getElementById('site-menu-button')?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.brandLink} href="#top">
          <span className={styles.brandName}>{BRAND.name}</span>
        </a>

        <nav className={styles.navWide} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV.map((item) => (
              <li key={item.href}>
                <a className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a className={styles.navContact} href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button
          id="site-menu-button"
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      <div id={panelId} className={styles.menuPanel} hidden={!open}>
        <nav aria-label="Primary, mobile">
          <ul className={styles.menuList}>
            {[...NAV, { label: 'Contact', href: '#contact' }].map((item) => (
              <li key={item.href}>
                <a className={styles.menuLink} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
