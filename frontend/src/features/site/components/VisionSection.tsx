import { VISION } from '../content'
import styles from '../site.module.css'

export function VisionSection(): React.JSX.Element {
  return (
    <section className={styles.sectionWhite} id="vision" aria-labelledby="vision-heading">
      <div className={styles.measure}>
        <h2 className={styles.h2} id="vision-heading">
          {VISION.heading}
        </h2>
        <p className={styles.lead}>{VISION.opening}</p>
        <p className={styles.body}>
          HADS Lifesciences is founded on the conviction that human vitality asks for both{' '}
          <strong className={styles.emphasis}>botanical respect</strong> and{' '}
          <strong className={styles.emphasis}>pharmaceutical rigor</strong>. We design sustainable,
          clean-label nutraceuticals with the whole body in view, from head to toe.
        </p>
        <p className={styles.body}>{VISION.body2}</p>
      </div>
    </section>
  )
}
