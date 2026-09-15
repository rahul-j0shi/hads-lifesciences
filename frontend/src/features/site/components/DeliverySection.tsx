import { DELIVERY } from '../content'
import styles from '../site.module.css'

export function DeliverySection(): React.JSX.Element {
  return (
    <section className={styles.sectionWhite} id="delivery-systems" aria-labelledby="delivery-heading">
      <div className={styles.container}>
        <h2 className={styles.h2} id="delivery-heading">
          {DELIVERY.heading}
        </h2>
        <p className={`${styles.lead} ${styles.introMeasure}`}>{DELIVERY.intro}</p>

        <ul className={styles.deliveryGrid}>
          {DELIVERY.cards.map((card) => (
            <li className={styles.card} key={card.title}>
              {/* Conceptual mark, deliberately not a technical diagram. */}
              <img className={styles.conceptIcon} src={card.icon} alt="" width={56} height={56} loading="lazy" decoding="async" />
              <h3 className={styles.h3}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
