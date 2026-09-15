import { BRAND, HERO } from '../content'
import styles from '../site.module.css'

/**
 * Hero. No approved D emblem exists yet, so the art column is omitted entirely
 * rather than filled with a substitute, per the design concept's art fallback.
 */
export function HeroSection(): React.JSX.Element {
  const [before, accent] = HERO.headline.split(HERO.headlineAccent) as [string, string?]

  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-heading">
      {/* Single centered column: the art fallback in the design concept, used
          because no approved D emblem exists. Never fill the gap with a
          substitute illustration. */}
      <div className={`${styles.heroInner} ${styles.heroSolo}`}>
        <p className={styles.eyebrow}>
          {BRAND.tagline.map((part, i) => (
            <span key={part.text}>
              <span className={part.tone === 'navy' ? styles.toneNavy : styles.toneMagenta}>
                {part.text}
              </span>
              {i < BRAND.tagline.length - 1 && <span className={styles.bullet}> • </span>}
            </span>
          ))}
        </p>

        <h1 className={styles.heroHeadline} id="hero-heading">
          {before}
          <span className={styles.headlineAccent}>{HERO.headlineAccent}</span>
          {accent}
        </h1>

        <p className={styles.heroLead}>{HERO.subHeadline}</p>

        {/* The mission strip is white for a reason: the client's magenta measures
            4.48:1 on the canvas ground, below AA. Do not remove this surface. */}
        <p className={styles.missionStrip}>
          <span className={styles.missionFirst}>{HERO.mission.first}</span>{' '}
          <span className={styles.missionSecond}>{HERO.mission.second}</span>
        </p>

        <div className={styles.heroActions}>
          <a className={styles.buttonPrimary} href={HERO.primary.href}>
            {HERO.primary.label}
          </a>
          <a className={styles.buttonOutline} href={HERO.secondary.href}>
            {HERO.secondary.label}
          </a>
        </div>
      </div>
    </section>
  )
}
