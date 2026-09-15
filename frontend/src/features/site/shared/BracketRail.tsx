import styles from '../site.module.css'

/**
 * The artwork's framing device around a short label. The brackets are decorative
 * and hidden from assistive technology; the label is real text.
 */
export function BracketRail({ label }: { label: string }): React.JSX.Element {
  return (
    <div className={styles.rail}>
      <span className={styles.railArm} aria-hidden="true" />
      <p className={styles.railLabel}>{label}</p>
      <span className={`${styles.railArm} ${styles.railArmRight}`} aria-hidden="true" />
    </div>
  )
}
