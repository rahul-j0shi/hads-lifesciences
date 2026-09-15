/**
 * The single editorial content source for the public page.
 *
 * Every string here is the proposed public wording from the design concept,
 * section 8. It is not approved client copy: publication prerequisites are
 * tracked in HADS-8. Do not edit wording here without updating that record, and
 * never fetch this from a database: it is static content compiled into the page.
 */

export interface NavItem {
  readonly label: string
  readonly href: string
}

export interface FrameworkCard {
  readonly letter: string
  readonly title: string
  readonly subline: string
  readonly body: string
  readonly emblem: { readonly src: string; readonly srcSet: string } | null
}

export interface TechnologyCard {
  readonly title: string
  readonly body: string
  readonly icon: string
}

export interface PortfolioArea {
  readonly focus: string
  readonly archetype: string
  readonly target: string
  readonly architecture: string
}

export interface ValueItem {
  readonly label: string
  readonly icon: 'award' | 'recycle' | 'lightbulb' | 'globe'
}

export const BRAND = {
  name: 'HADS Lifesciences',
  tagline: [
    { text: 'SCIENCE', tone: 'magenta' },
    { text: 'NATURE', tone: 'navy' },
    { text: 'BETTER LIVES', tone: 'magenta' },
  ],
  email: 'hadslifesciences@gmail.com',
} as const

export const NAV: readonly NavItem[] = [
  { label: 'Vision', href: '#vision' },
  { label: 'Framework', href: '#framework' },
  { label: 'Delivery Systems', href: '#delivery-systems' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Sustainability', href: '#sustainability' },
]

export const HERO = {
  headline: 'Precision Wellness Engineered for Human Vitality',
  headlineAccent: 'Human Vitality',
  subHeadline:
    'Ancient botanical intelligence, engineered into nutraceuticals designed for high bioavailability through advanced drug delivery systems.',
  // Exact client phrase. The two colors are the client's supplied values and are
  // only legible on a white ground: 4.48:1 on canvas fails AA. See design concept 7.2.
  mission: { first: 'Enjoy Every', second: 'Moment of Life' },
  primary: { label: 'Discover Formulations', href: '#portfolio' },
  secondary: { label: 'Explore Delivery Systems', href: '#delivery-systems' },
  tertiary: { label: 'Contact', href: '#contact' },
} as const

export const VISION = {
  heading: "Founders' Vision: Head-to-Toe Everyday Comfort",
  opening: 'Optimal health is not fragmented. It is systemic.',
  body1:
    'HADS Lifesciences is founded on the conviction that human vitality asks for both botanical respect and pharmaceutical rigor. We design sustainable, clean-label nutraceuticals with the whole body in view, from head to toe.',
  body2:
    'Poor herbal absorption is a formulation challenge we are working to address by considering how bioactive nutrients are protected, released, and made available. We engineer everyday comfort so you can live fully, actively, and naturally.',
} as const

export const FRAMEWORK = {
  heading: 'The H.A.D.S. Integrated Framework',
  scopeNote:
    'This site presents a formulation framework. It is not a personalized health assessment, diagnosis, or treatment service.',
  railLabel: 'OUR INTEGRATED APPROACH',
  closing:
    'HADS Lifesciences: Bridging ancient wisdom with modern research for holistic well-being.',
  cards: [
    {
      letter: 'H',
      title: "Nature's Purity",
      subline: 'SOURCE-VERIFIED BOTANICALS',
      body: 'Ethically sourced, origin-verified botanicals, cultivated with regenerative agricultural practices and chain-of-custody traceability.',
      emblem: { src: '/assets/g01-160.webp', srcSet: '/assets/g01-160.webp 160w, /assets/g01-320.webp 320w' },
    },
    {
      letter: 'A',
      title: 'Optimized Formulations',
      subline: 'TRADITIONAL ALCHEMY, MODERN PRECISION',
      body: 'Classical alchemy and modern standardized extraction, brought together to preserve full-spectrum phytochemical profiles.',
      emblem: { src: '/assets/g02-160.webp', srcSet: '/assets/g02-160.webp 160w, /assets/g02-320.webp 320w' },
    },
    {
      letter: 'D',
      title: 'Individual Well-Being',
      subline: 'PERSONALIZED WELLNESS SOLUTIONS',
      body: 'Personalized, adaptive wellness formulations aimed at metabolic balance, cognitive resilience, and cellular longevity.',
      // The D emblem is a client brand letterform. It may not be generated, so
      // this card shows no illustration until an approved master arrives (B02).
      emblem: null,
    },
    {
      letter: 'S',
      title: 'Science-Based Solutions',
      // Reduced-exposure alternative is the default until C08 is evidenced.
      subline: 'EVIDENCE-LED DEVELOPMENT',
      body: 'The framework distinguishes batch-level analytical testing, standardized active concentrations, and pharmacokinetic evidence when evaluating a formulation.',
      emblem: { src: '/assets/g03-160.webp', srcSet: '/assets/g03-160.webp 160w, /assets/g03-320.webp 320w' },
    },
  ] as readonly FrameworkCard[],
} as const

export const DELIVERY = {
  heading: 'Innovation & Advanced Drug Delivery Systems',
  intro:
    'Bioavailability is a central consideration when formulating natural actives. Our formulation model moves beyond traditional low-absorption powders toward advanced drug delivery system (DDS) architectures.',
  cards: [
    {
      title: 'Liposomal & Phytosomal Encapsulation',
      body: 'Encapsulation designed to shield delicate botanical bioactives from gastric degradation and support cellular uptake.',
      icon: '/assets/i01-encapsulation.svg',
    },
    {
      title: 'Targeted Micro-Pellet Systems',
      body: 'Multi-unit particulate systems (MUPS) engineered for pH-dependent, controlled intestinal release.',
      icon: '/assets/i02-micro-pellets.svg',
    },
    {
      title: 'Nano-Emulsified Liquid Actives',
      body: 'Formulated to improve the solubility of fat-soluble vitamins, adaptogens, and botanical oils.',
      icon: '/assets/i03-nano-emulsion.svg',
    },
    {
      title: 'Dual-Action Beadlet-in-Oil Technology',
      body: 'Combines otherwise incompatible actives, dry botanicals and essential fatty acids, in a single shelf-stable dose.',
      icon: '/assets/i04-beadlet-in-oil.svg',
    },
  ] as readonly TechnologyCard[],
} as const

export const PORTFOLIO = {
  heading: 'Head-to-Toe Wellness Portfolio Model',
  intro:
    'A framework for discussing areas of formulation interest. These categories describe our development model. They are not a live product catalog or a personalized health recommendation.',
  fieldLabels: {
    archetype: 'Formulation Archetype',
    target: 'Functional Health Target',
    architecture: 'Delivery Architecture',
  },
  // All sixteen client cells preserved verbatim. Requires technical and claims
  // review before publication (C13). Never omit a cell silently.
  areas: [
    {
      focus: 'Neuro & Cognitive (Head)',
      archetype: 'Nootropics & Adaptogenic Blends',
      target: 'Focus, neurotransmitter support, and restorative sleep cycles',
      architecture: 'Sublingual fast-melts & phytosome-bound herbal actives',
    },
    {
      focus: 'Dermal & Follicular (Hair & Skin)',
      archetype: 'Clinical Phytoceuticals',
      target: 'Keratin synthesis, skin barrier lipids, and UV-defense',
      architecture: 'Dual-phase lipid beadlets & bio-fermented collagen complexes',
    },
    {
      focus: 'Metabolic & Vitality (Core & Gut)',
      archetype: 'Synergistic Nutraceuticals',
      target: 'Microbiome integrity, hepatic wellness, and glucose control',
      architecture: 'Delayed-release enteric micro-capsules',
    },
    {
      focus: 'Structural & Mobility (Joint to Toe)',
      archetype: 'Bioactive Mineral Complexes',
      target: 'Synovial lubrication, bone density, and connective tissue recovery',
      architecture: 'Micronized powders & high-solubility chelated tablets',
    },
  ] as readonly PortfolioArea[],
} as const

export const SUSTAINABILITY = {
  heading: 'Commitment to Sustainability',
  panels: [
    {
      heading: 'Clean-Label Assurance',
      body: 'Formulated without artificial preservatives, synthetic binders, GMOs, or industrial contaminants.',
    },
    {
      heading: 'Eco-Centric Lifecycle',
      body: 'Our sourcing and packaging model targets verified carbon-neutral farms, recyclable non-leaching glass, and biodegradable alternatives to conventional blisters.',
    },
  ],
  image: {
    src: '/assets/p05-480.webp',
    srcSet: '/assets/p05-480.webp 480w, /assets/p05-960.webp 960w',
    // Illustrative only. It proves nothing about sourcing and must never be
    // captioned as a HADS farm or supplier.
    alt: '',
    caption: 'Illustrative image',
  },
} as const

export const VALUES: readonly ValueItem[] = [
  { label: 'Quality Assurance', icon: 'award' },
  { label: 'Sustainability', icon: 'recycle' },
  { label: 'Innovation', icon: 'lightbulb' },
  { label: 'Global Reach', icon: 'globe' },
]

export const CONTACT = {
  heading: 'Get in Touch',
  lead: 'For partnerships, scientific collaborations, and distribution inquiries:',
  copyIdle: 'Copy email address',
  copySuccess: 'Email address copied.',
  copyFailure: 'Could not copy. Select the email address to copy it.',
  inquiries: [
    { label: 'Partnerships', subject: 'HADS partnership inquiry' },
    { label: 'Scientific Collaborations', subject: 'HADS scientific collaboration inquiry' },
    { label: 'Distribution', subject: 'HADS distribution inquiry' },
  ],
} as const

export const FOOTER = { backToTop: 'Back to top' } as const
