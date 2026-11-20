/**
 * Every word on the page lives here, so copy changes never touch markup.
 *
 * Wording follows the client brief (idea/details.md) with the claim softening
 * from the design concept: no superlatives, no unverifiable numbers. Check with
 * the client before strengthening any claim.
 */

export const SITE = {
  name: 'HADS Lifesciences',
  url: 'https://hads.life',
  title: 'HADS Lifesciences | Science, Nature, Better Lives',
  description:
    'HADS Lifesciences designs clean-label nutraceuticals that pair botanical intelligence with advanced drug delivery systems. Partnerships, scientific collaborations and distribution inquiries welcome.',
  tagline: ['Science', 'Nature', 'Better Lives'],
} as const

export const CONTACT_DETAILS = {
  email: 'hadslifesciences@gmail.com',
  phoneDisplay: '+91 92860 09789',
  phoneHref: 'tel:+919286009789',
  address: {
    locality: 'Mukundpur, Samaipur, Kirari',
    city: 'Delhi',
    postalCode: '110042',
    country: 'India',
  },
} as const

export const NAV = [
  { label: 'Vision', href: '#vision' },
  { label: 'Framework', href: '#framework' },
  { label: 'Delivery Systems', href: '#delivery-systems' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Sustainability', href: '#sustainability' },
] as const

export const HERO = {
  headline: 'Precision Wellness Engineered for',
  headlineAccent: 'Human Vitality',
  lead: 'Ancient botanical intelligence, engineered into nutraceuticals designed for high bioavailability through advanced drug delivery systems.',
  mission: ['Enjoy Every', 'Moment of Life'],
  primary: { label: 'Discover Formulations', href: '#portfolio' },
  secondary: { label: 'Explore Delivery Systems', href: '#delivery-systems' },
} as const

export const VISION = {
  eyebrow: "Founders' Vision",
  heading: 'Head-to-Toe Everyday Comfort',
  quote: 'Optimal health is not fragmented. It is systemic.',
  body: [
    'HADS Lifesciences is founded on the conviction that human vitality asks for both botanical respect and pharmaceutical rigor. We design sustainable, clean-label nutraceuticals with the whole body in view, from head to toe.',
    'Poor herbal absorption is a formulation challenge we are working to address by considering how bioactive nutrients are protected, released, and made available. We engineer everyday comfort so you can live fully, actively, and naturally.',
  ],
} as const

export type Accent = 'pink' | 'blue'

export const FRAMEWORK = {
  eyebrow: 'Our Integrated Approach',
  heading: 'The H.A.D.S. Integrated Framework',
  closing: 'Bridging ancient wisdom with modern research for holistic well-being.',
  scopeNote:
    'This site presents a formulation framework. It is not a personalized health assessment, diagnosis, or treatment service.',
  // Emblems are the letterforms from the client's logo, so the framework and
  // the brand mark are literally the same drawing.
  pillars: [
    {
      letter: 'H',
      emblem: { src: '/brand/letter-h.svg', width: 100, height: 110 },
      accent: 'pink',
      title: "Nature's Purity",
      subline: 'Source-verified botanicals',
      body: 'Ethically sourced, origin-verified botanicals, cultivated with regenerative agricultural practices and chain-of-custody traceability.',
    },
    {
      letter: 'A',
      emblem: { src: '/brand/letter-a.svg', width: 124, height: 111 },
      accent: 'blue',
      title: 'Optimized Formulations',
      subline: 'Traditional alchemy, modern precision',
      body: 'Classical alchemy and modern standardized extraction, brought together to preserve full-spectrum phytochemical profiles.',
    },
    {
      letter: 'D',
      emblem: { src: '/brand/letter-d.svg', width: 112, height: 110 },
      accent: 'pink',
      title: 'Individual Well-Being',
      subline: 'Personalized wellness solutions',
      body: 'Personalized, adaptive wellness formulations aimed at metabolic balance, cognitive resilience, and cellular longevity.',
    },
    {
      letter: 'S',
      emblem: { src: '/brand/letter-s.svg', width: 82, height: 116 },
      accent: 'blue',
      title: 'Science-Based Solutions',
      // Softer than the artwork's "Rigorous clinical validation" until the
      // client can evidence clinical work.
      subline: 'Evidence-led development',
      body: 'Batch-level analytical testing, standardized active concentrations, and pharmacokinetic evidence, each weighed when evaluating a formulation.',
    },
  ] satisfies ReadonlyArray<{
    letter: string
    emblem: { src: string; width: number; height: number }
    accent: Accent
    title: string
    subline: string
    body: string
  }>,
} as const

export const DELIVERY = {
  eyebrow: 'Innovation',
  heading: 'Advanced Drug Delivery Systems',
  intro:
    'Bioavailability is central to formulating natural actives. Our model moves beyond traditional low-absorption powders toward advanced drug delivery system (DDS) architectures.',
  systems: [
    {
      title: 'Liposomal & Phytosomal Encapsulation',
      body: 'Encapsulation designed to shield delicate botanical bioactives from gastric degradation and support cellular uptake.',
      icon: '/images/encapsulation.svg',
    },
    {
      title: 'Targeted Micro-Pellet Systems',
      body: 'Multi-unit particulate systems (MUPS) engineered for pH-dependent, controlled intestinal release.',
      icon: '/images/micro-pellets.svg',
    },
    {
      title: 'Nano-Emulsified Liquid Actives',
      body: 'Formulated to improve the solubility of fat-soluble vitamins, adaptogens, and botanical oils.',
      icon: '/images/nano-emulsion.svg',
    },
    {
      title: 'Dual-Action Beadlet-in-Oil Technology',
      body: 'Combines otherwise incompatible actives, dry botanicals and essential fatty acids, in a single shelf-stable dose.',
      icon: '/images/beadlet-in-oil.svg',
    },
  ],
} as const

export const PORTFOLIO = {
  eyebrow: 'Portfolio Model',
  heading: 'Head-to-Toe Wellness',
  intro:
    'How we organise areas of formulation interest across the body. These categories describe our development model, not a live product catalog or a personalized health recommendation.',
  labels: {
    archetype: 'Formulation archetype',
    target: 'Functional health target',
    architecture: 'Delivery architecture',
  },
  areas: [
    {
      region: 'Head',
      focus: 'Neuro & Cognitive',
      archetype: 'Nootropics & Adaptogenic Blends',
      target: 'Focus, neurotransmitter support, and restorative sleep cycles',
      architecture: 'Sublingual fast-melts & phytosome-bound herbal actives',
    },
    {
      region: 'Hair & Skin',
      focus: 'Dermal & Follicular',
      archetype: 'Clinical Phytoceuticals',
      target: 'Keratin synthesis, skin barrier lipids, and UV-defense',
      architecture: 'Dual-phase lipid beadlets & bio-fermented collagen complexes',
    },
    {
      region: 'Core & Gut',
      focus: 'Metabolic & Vitality',
      archetype: 'Synergistic Nutraceuticals',
      target: 'Microbiome integrity, hepatic wellness, and glucose control',
      architecture: 'Delayed-release enteric micro-capsules',
    },
    {
      region: 'Joint to Toe',
      focus: 'Structural & Mobility',
      archetype: 'Bioactive Mineral Complexes',
      target: 'Synovial lubrication, bone density, and connective tissue recovery',
      architecture: 'Micronized powders & high-solubility chelated tablets',
    },
  ],
} as const

export const SUSTAINABILITY = {
  eyebrow: 'Responsibility',
  heading: 'Commitment to Sustainability',
  commitments: [
    {
      icon: 'leaf',
      title: 'Clean-Label Assurance',
      body: 'Formulated without artificial preservatives, synthetic binders, GMOs, or industrial contaminants.',
    },
    {
      icon: 'recycle',
      title: 'Eco-Centric Lifecycle',
      body: 'Our sourcing and packaging model targets verified carbon-neutral farms, recyclable non-leaching glass, and biodegradable alternatives to conventional blisters.',
    },
  ],
  image: {
    src: '/images/p05-960.webp',
    srcset: '/images/p05-480.webp 480w, /images/p05-960.webp 960w',
    width: 960,
    height: 640,
    alt: 'Hands holding a seedling above soil',
    // Generated imagery: never imply it shows a HADS farm or supplier.
    caption: 'Illustrative image',
  },
} as const

export const VALUES = [
  { label: 'Quality Assurance', icon: 'award' },
  { label: 'Sustainability', icon: 'recycle' },
  { label: 'Innovation', icon: 'bulb' },
  { label: 'Global Reach', icon: 'globe' },
] as const

export const CONTACT = {
  eyebrow: 'Contact',
  heading: 'Get in Touch',
  lead: 'For partnerships, scientific collaborations, and distribution inquiries, we would be glad to hear from you.',
  inquiries: [
    { label: 'Partnerships', subject: 'Partnership inquiry' },
    { label: 'Scientific Collaborations', subject: 'Scientific collaboration inquiry' },
    { label: 'Distribution', subject: 'Distribution inquiry' },
  ],
} as const
