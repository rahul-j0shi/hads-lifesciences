import { VALUES } from '../content'
import { ValueIcon } from '../shared/ValueIcon'
import styles from '../site.module.css'

/**
 * Closing band, positioned where the artwork puts it. These are brand themes,
 * not credentials: no seals, no checkmarks, no counts.
 */
export function BrandValuesBand(): React.JSX.Element {
  return (
    <section className={styles.valuesBand} aria-label="Brand values">
      <ul className={styles.valuesList}>
        {VALUES.map((item) => (
          <li className={styles.valueItem} key={item.label}>
            <span className={styles.valueIcon}>
              <ValueIcon name={item.icon} />
            </span>
            <span className={styles.valueLabel}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
