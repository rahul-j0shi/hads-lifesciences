import { SUSTAINABILITY } from '../content'
import styles from '../site.module.css'

export function SustainabilitySection(): React.JSX.Element {
  return (
    <section className={styles.sectionWhite} id="sustainability" aria-labelledby="sustainability-heading">
      <div className={styles.container}>
        <h2 className={styles.h2} id="sustainability-heading">
          {SUSTAINABILITY.heading}
        </h2>
        <div className={styles.sustainGrid}>
          {SUSTAINABILITY.panels.map((panel) => (
            <div className={styles.panel} key={panel.heading}>
              <h3 className={styles.h3}>{panel.heading}</h3>
              <p className={styles.cardBody}>{panel.body}</p>
            </div>
          ))}
          <figure className={styles.sustainFigure}>
            <img
              src={SUSTAINABILITY.image.src}
              srcSet={SUSTAINABILITY.image.srcSet}
              sizes="(min-width: 1024px) 320px, 100vw"
              width={480}
              height={360}
              alt={SUSTAINABILITY.image.alt}
              loading="lazy"
              decoding="async"
            />
            {/* Provenance disclosed visibly, not only in alt text. */}
            <figcaption className={styles.caption}>{SUSTAINABILITY.image.caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
