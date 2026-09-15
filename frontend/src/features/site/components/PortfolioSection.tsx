import { PORTFOLIO } from '../content'
import styles from '../site.module.css'

/**
 * One representation at every width: four profile cards.
 *
 * Partners and distributors ask what areas are covered and what each involves,
 * which is a profile question, not a cross-row comparison. A single rendering
 * also removes the duplicated DOM a responsive table would need.
 */
export function PortfolioSection(): React.JSX.Element {
  return (
    <section className={styles.sectionCanvas} id="portfolio" aria-labelledby="portfolio-heading">
      <div className={styles.container}>
        <h2 className={styles.h2} id="portfolio-heading">
          {PORTFOLIO.heading}
        </h2>
        <p className={`${styles.lead} ${styles.introMeasure}`}>{PORTFOLIO.intro}</p>

        <ul className={styles.portfolioGrid}>
          {PORTFOLIO.areas.map((area) => (
            <li className={styles.card} key={area.focus}>
              <h3 className={styles.portfolioFocus}>{area.focus}</h3>
              <dl className={styles.fieldList}>
                <dt className={styles.fieldLabel}>{PORTFOLIO.fieldLabels.archetype}</dt>
                <dd className={styles.fieldValue}>{area.archetype}</dd>
                <dt className={styles.fieldLabel}>{PORTFOLIO.fieldLabels.target}</dt>
                <dd className={styles.fieldValue}>{area.target}</dd>
                <dt className={styles.fieldLabel}>{PORTFOLIO.fieldLabels.architecture}</dt>
                <dd className={`${styles.fieldValue} ${styles.fieldValueStrong}`}>{area.architecture}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
