/**
 * OUR STORE — PRODUCTS CONFIG
 * ============================
 * To ADD a product: copy one object block and fill in your details.
 * To REMOVE: delete the block.
 * To REORDER: move blocks around.
 *
 * FIELD GUIDE:
 *  id          — unique number
 *  name        — product name
 *  category    — 'Digital' | 'Course' | 'Health' | 'Physical'
 *  price       — number (e.g. 299)
 *  currency    — 'PHP' | 'AED' | 'USD'
 *  description — short product description
 *  badge       — 'Bestseller' | 'New' | 'Hot' | '' (leave blank for none)
 *  image       — path to product image, e.g. 'images/product-planner.jpg'
 *               (leave as '' if no image — a category icon will show instead)
 *  buyLink     — URL for external products; leave '' to use add-to-cart
 *  isExternal  — true if the buy button should open an external link
 */

const PRODUCTS = [

  {
    id: 1,
    name: 'OFW Financial Freedom Planner',
    category: 'Digital',
    price: 299,
    currency: 'PHP',
    description: 'A printable and digital planner designed for OFWs — budget tracker, remittance log, investment tracker, and balik-bayan goal planner.',
    badge: 'Bestseller',
    image: '',
    buyLink: '',
    isExternal: false,
    comingSoon: true,
  },

  {
    id: 2,
    name: 'Millionaire Mindset E-Book',
    category: 'Digital',
    price: 199,
    currency: 'PHP',
    description: 'The complete guide to building wealth as an OFW. Covers mindset, saving, investing, and building passive income from abroad.',
    badge: 'New',
    image: '',
    buyLink: '',
    isExternal: false,
    comingSoon: true,
  },

  {
    id: 3,
    name: 'OFW Investment Starter Kit',
    category: 'Digital',
    price: 499,
    currency: 'PHP',
    description: 'Step-by-step guide and templates to open your first Philippine stock, UITF, and savings account from abroad. Includes video tutorials.',
    badge: '',
    image: '',
    buyLink: '',
    isExternal: false,
    comingSoon: true,
  },

  {
    id: 4,
    name: 'Family Budget Masterclass',
    category: 'Course',
    price: 799,
    currency: 'PHP',
    description: 'Online video course teaching your family back home how to manage remittances, avoid debt, and save for the future.',
    badge: '',
    image: '',
    buyLink: '',
    isExternal: false,
    comingSoon: true,
  },

  {
    id: 5,
    name: 'Remittance Tracker Spreadsheet',
    category: 'Digital',
    price: 99,
    currency: 'PHP',
    description: 'Track every remittance, fee, and exchange rate in one clean spreadsheet. Know exactly where your money goes each month.',
    badge: 'Hot',
    image: '',
    buyLink: '',
    isExternal: false,
    comingSoon: true,
  },

  {
    id: 6,
    name: 'First 100 Days Abroad — Full Guide',
    category: 'Digital',
    price: 399,
    currency: 'PHP',
    description: 'The companion PDF guide to our blog series. All 100 financial lessons compiled, expanded, and organized into a printable workbook.',
    badge: 'New',
    image: '',
    buyLink: '',
    isExternal: false,
    comingSoon: true,
  },

  /* ── ADD NEW PRODUCT HERE ────────────────────────────────────────────────
  {
    id: 7,
    name: 'Product Name',
    category: 'Digital',   // 'Digital' | 'Course' | 'Health' | 'Physical'
    price: 0,
    currency: 'PHP',
    description: 'Product description.',
    badge: '',
    image: '',
    buyLink: '',
    isExternal: false,
  },
  ──────────────────────────────────────────────────────────────────────── */

];
