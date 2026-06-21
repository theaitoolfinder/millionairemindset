/**
 * BUSINESSES CONFIG
 * ==================
 * To ADD a business: copy one object block and fill in your details.
 * To REMOVE a business: delete its object from the array.
 * To REORDER: just move the objects around.
 * No other files need to be touched.
 */

const BUSINESSES = [
  {
    id: 'jcpremiere',
    name: 'JC Premiere',
    logo: 'images/logo-jcpremiere.png',
    category: 'Health & Wellness',
    categoryColor: '#22c55e',
    categoryBg: 'rgba(34,197,94,0.1)',
    categoryBorder: 'rgba(34,197,94,0.3)',
    tagline: 'Premium health and wellness products with a powerful business opportunity — earn while you help others get healthier.',
    why: [
      'High-quality, government-approved health products',
      'Huge demand — health is everyone\'s priority',
      'Very low entry cost to start',
      'Strong global community of sellers',
      'Products you can use AND sell',
      'Manage your business entirely online from anywhere',
    ],
    incomeTitle: 'Income Potential',
    incomeDesc: 'Direct selling commissions plus team overrides. Many members earn meaningful part-time income from home.',
    page: 'biz-jcpremiere.html',
    cta1: { label: 'See Full Details', href: 'biz-jcpremiere.html' },
    cta2: { label: 'Join My Team', href: 'index.html#contact' },
    visualTitle: 'Health + Income',
    visualDesc: 'When you join JC Premiere, you\'re not just selling products — you\'re building a health business that serves your community and generates income for your family.',
    tags: ['Wellness', 'Supplements', 'Natural Products', 'Commissions'],
    visualBorder: 'rgba(34,197,94,0.2)',
  },
  {
    id: 'img',
    name: 'International Marketing Group',
    nameShort: 'IMG',
    logo: 'images/logo-img.png',
    category: 'Insurance & Financial Literacy',
    categoryColor: '#3b82f6',
    categoryBg: 'rgba(59,130,246,0.1)',
    categoryBorder: 'rgba(59,130,246,0.3)',
    tagline: 'A leading financial literacy and insurance advocacy company — protect your family AND build a financial business at the same time.',
    why: [
      'Learn real financial literacy as you earn',
      'Offer life insurance, VUL, and investment plans',
      'Help families protect what matters most',
      'Huge market — millions of uninsured people worldwide',
      'Full training and mentorship provided',
      'Build a team from anywhere in the world',
    ],
    incomeTitle: 'Income Potential',
    incomeDesc: 'Commissions per policy plus management overrides. Start part-time alongside any job. Scale as your team grows.',
    page: 'biz-img.html',
    cta1: { label: 'See Full Details', href: 'biz-img.html' },
    cta2: { label: 'Join IMG with Me', href: 'index.html#contact' },
    visualTitle: 'Protect + Earn',
    visualDesc: 'IMG advocates financial literacy through insurance. You learn, then teach others — and earn commissions when you help families get protected.',
    tags: ['Life Insurance', 'VUL', 'Investments', 'Financial Literacy'],
    visualBorder: 'rgba(59,130,246,0.2)',
  },
  {
    id: 'vistaland',
    name: 'Vista Land',
    logo: 'images/logo-vistaland.png',
    category: 'Real Estate',
    categoryColor: '#f59e0b',
    categoryBg: 'rgba(245,158,11,0.1)',
    categoryBorder: 'rgba(245,158,11,0.3)',
    tagline: 'One of the largest homebuilders in the Philippines — help families buy their dream home while earning as an accredited property agent.',
    why: [
      'Trusted brand with decades of track record',
      'Properties for every budget — house and lot, condos, townhouses',
      'OFWs and migrant workers are the number one real estate buyers',
      'Earn large commissions per sale',
      'Help families achieve their dream home',
      'Flexible payment terms for buyers abroad',
    ],
    incomeTitle: 'Income Potential',
    incomeDesc: 'Real estate commissions are among the highest of any business. Even one sale a month can significantly change your financial picture.',
    page: 'biz-vistaland.html',
    cta1: { label: 'See Full Details', href: 'biz-vistaland.html' },
    cta2: { label: 'Become an Agent', href: 'index.html#contact' },
    visualTitle: 'The Dream',
    visualDesc: 'Many overseas workers dream of coming home to their own house. Vista Land makes that possible — affordable, flexible, and trusted by millions.',
    tags: ['House & Lot', 'Condominiums', 'Townhouses', 'High Commissions'],
    visualBorder: 'rgba(245,158,11,0.2)',
  },

  /* ── ADD NEW BUSINESS HERE ──────────────────────────────────────────
  {
    id: 'mybusiness',
    name: 'My New Business',
    logo: 'images/logo-mybusiness.png',  // place logo in images/ folder
    category: 'Category Name',
    categoryColor: '#hexcolor',
    categoryBg: 'rgba(r,g,b,0.1)',
    categoryBorder: 'rgba(r,g,b,0.3)',
    tagline: 'Short description shown under the title.',
    why: [
      'Reason 1',
      'Reason 2',
      'Reason 3',
    ],
    incomeTitle: 'Income Potential',
    incomeDesc: 'Describe earnings here.',
    cta1: { label: 'Primary Button', href: '#' },
    cta2: { label: 'Secondary Button', href: '#' },
    visualTitle: 'Card Title',
    visualDesc: 'Card description.',
    tags: ['Tag1', 'Tag2'],
    visualBorder: 'rgba(r,g,b,0.2)',
  },
  ─────────────────────────────────────────────────────────────────── */
];
