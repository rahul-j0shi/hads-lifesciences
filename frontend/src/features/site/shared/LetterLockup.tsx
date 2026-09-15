import styles from '../site.module.css'

/**
 * The artwork's signature device: a serif capital, a magenta rule, then an
 * uppercase title. Rendered as one heading so a screen reader announces
 * "H Nature's Purity" rather than treating the letter as separate content.
 */
export function LetterLockup({
  letter,
  title,
  id,
}: {
  letter: string
  title: string
  id?: string
}): React.JSX.Element {
  return (
    <h3 className={styles.lockup} {...(id ? { id } : {})}>
      <span className={styles.lockupLetter}>{letter}</span>
      <span className={styles.lockupTitle}>{title}</span>
    </h3>
  )
}
