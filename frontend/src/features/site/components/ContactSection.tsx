import { BRAND, CONTACT } from '../content'
import styles from '../site.module.css'

/**
 * Contact. The address is a plain mail link and the inquiry pills prefill a
 * subject. There is no copy-to-clipboard control: the link already opens the
 * visitor's mail client and the address itself is selectable, so a copy button
 * added a failure path without adding a capability.
 */
export function ContactSection(): React.JSX.Element {
  return (
    <section className={styles.contactBand} id="contact" aria-labelledby="contact-heading">
      <div className={styles.container}>
        <h2 className={`${styles.h2} ${styles.centered} ${styles.onNavy}`} id="contact-heading">
          {CONTACT.heading}
        </h2>
        <p className={`${styles.lead} ${styles.centered} ${styles.onNavy}`}>{CONTACT.lead}</p>

        <p className={styles.contactRow}>
          <a className={styles.emailLink} href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>
        </p>

        <ul className={styles.inquiryList}>
          {CONTACT.inquiries.map((inq) => (
            <li key={inq.label}>
              <a
                className={styles.inquiryPill}
                href={`mailto:${BRAND.email}?subject=${encodeURIComponent(inq.subject)}`}
              >
                {inq.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
