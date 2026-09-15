import { BrandValuesBand } from './components/BrandValuesBand'
import { ContactSection } from './components/ContactSection'
import { DeliverySection } from './components/DeliverySection'
import { FrameworkSection } from './components/FrameworkSection'
import { HeroSection } from './components/HeroSection'
import { PortfolioSection } from './components/PortfolioSection'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SustainabilitySection } from './components/SustainabilitySection'
import { VisionSection } from './components/VisionSection'
import styles from './site.module.css'

/**
 * The public page. Section order follows the design concept's page story:
 * Promise, Vision, Framework, Delivery Systems, Portfolio, Sustainability,
 * Values, Contact. Ground alternates so a long page does not read as one column.
 */
export function SitePage(): React.JSX.Element {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <VisionSection />
        <FrameworkSection />
        <DeliverySection />
        <PortfolioSection />
        <SustainabilitySection />
        <BrandValuesBand />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
