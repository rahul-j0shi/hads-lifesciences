import { FRAMEWORK } from '../content'
import { BracketRail } from '../shared/BracketRail'
import { LetterLockup } from '../shared/LetterLockup'
import styles from '../site.module.css'

export function FrameworkSection(): React.JSX.Element {
  return (
    <section className={styles.sectionCanvas} id="framework" aria-labelledby="framework-heading">
      {/* Decorative node-and-link motif from the artwork. Never behind body text. */}
      <img className={styles.constellation} src="/assets/g04-constellation.svg" alt="" aria-hidden="true" />
      <div className={styles.container}>
        <h2 className={`${styles.h2} ${styles.centered}`} id="framework-heading">
          {FRAMEWORK.heading}
        </h2>

        <ul className={styles.frameworkGrid}>
          {FRAMEWORK.cards.map((card) => (
            <li className={styles.card} key={card.letter}>
              {/* Lockup first, as in the client artwork. This also keeps every card
                  aligned at the top when a card has no emblem, which the D card does
                  not because that letterform is a client brand asset. */}
              <LetterLockup letter={card.letter} title={card.title} />
              <p className={styles.subline}>{card.subline}</p>
              {card.emblem ? (
                <div className={styles.emblemPlate}>
                  <img
                    src={card.emblem.src}
                    srcSet={card.emblem.srcSet}
                    sizes="160px"
                    width={160}
                    height={160}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
              <p className={styles.cardBody}>{card.body}</p>
            </li>
          ))}
        </ul>

        <p className={`${styles.scopeNote} ${styles.centered}`}>{FRAMEWORK.scopeNote}</p>
        <BracketRail label={FRAMEWORK.railLabel} />
        <p className={`${styles.lead} ${styles.centered} ${styles.closingLine}`}>{FRAMEWORK.closing}</p>
      </div>
    </section>
  )
}
