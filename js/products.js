/**
 * PRODUCTS CATALOG
 * ================
 * Fields:
 *  id          — unique number (never reuse a deleted id)
 *  sku         — internal stock-keeping unit code
 *  name        — product display name
 *  category    — 'Digital' | 'Course' | 'Health' | 'Physical'
 *  price       — number in PHP
 *  currency    — 'PHP'
 *  description — short description shown on cards
 *  badge       — 'Bestseller' | 'New' | 'Hot' | '' (blank = none)
 *  image       — URL to product image
 *  stock       — number of units available; -1 = unlimited (digital)
 *  active      — true = listed in store; false = hidden
 *  isExternal  — true = open buyLink instead of add-to-cart
 *  buyLink     — external URL (only used when isExternal:true)
 *  delivery    — 'instant' | 'email_24h' | 'physical'
 */

const PRODUCTS = [

  {
    id: 1,
    sku: 'MM-DIG-001',
    name: 'OFW Financial Freedom Planner',
    category: 'Digital',
    price: 299,
    currency: 'PHP',
    description: 'Printable & digital planner for OFWs — budget tracker, remittance log, investment tracker, and balik-bayan goal planner. PDF download.',
    badge: 'Bestseller',
    image: 'https://pixabay.com/get/g9b83ab8aa0a1b663a46e18503fc40ca135e5a04b2d1f218d8e95a96af04f72a8a3899dc3c75394196588497c1e3bee9f5b827b99f35eec029d2868fb38cc319a_640.jpg',
    stock: -1,
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'email_24h',
  },

  {
    id: 2,
    sku: 'MM-DIG-002',
    name: 'Millionaire Mindset E-Book',
    category: 'Digital',
    price: 199,
    currency: 'PHP',
    description: 'Complete guide to building wealth as an OFW. Covers mindset, saving, investing, and building passive income from abroad.',
    badge: 'New',
    image: 'https://pixabay.com/get/g120179327b5d99691a909188d8874dcfcac45e195151aa37cec30235a87eb10cf18d0f28f5ce8f1eb00a07a69d94cb26c573f35006866d9225e1f337ab3a0e4f_640.jpg',
    stock: -1,
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'email_24h',
  },

  {
    id: 3,
    sku: 'MM-DIG-003',
    name: 'OFW Investment Starter Kit',
    category: 'Digital',
    price: 499,
    currency: 'PHP',
    description: 'Step-by-step guide and templates to open your first Philippine stock, UITF, and savings account from abroad. Includes video tutorials.',
    badge: '',
    image: 'https://pixabay.com/get/gc39449dfdb4ec67787bf2a02663fc44e458b0abd34a114b04b7615e5adb46425e156d4ec8479bee8fc933fafeb6bcfad2ae7cd8ca4644c4715b214ae644bf51e_640.jpg',
    stock: -1,
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'email_24h',
  },

  {
    id: 4,
    sku: 'MM-CRS-001',
    name: 'Family Budget Masterclass',
    category: 'Course',
    price: 799,
    currency: 'PHP',
    description: 'Online video course teaching your family back home how to manage remittances, avoid debt, and save for the future.',
    badge: '',
    image: 'https://pixabay.com/get/g8480b80cc8253c4e3e8c2a5a49ee1428646980e674b0676843a9914c167cce30324627b10c65804961f0d3856dca16232683bc3bc6bba74d3432badec2d676d2_640.jpg',
    stock: -1,
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'email_24h',
  },

  {
    id: 5,
    sku: 'MM-DIG-004',
    name: 'Remittance Tracker Spreadsheet',
    category: 'Digital',
    price: 99,
    currency: 'PHP',
    description: 'Track every remittance, fee, and exchange rate in one clean spreadsheet. Know exactly where your money goes each month.',
    badge: 'Hot',
    image: 'https://pixabay.com/get/g013c662c7fdfc85c614612af88af79c78077bffc3d1781371d623f5ead02bff474746033f87766fedbf160304a78fd587f901cb552db8cf13d6c64e7deb106f2_640.png',
    stock: -1,
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'instant',
  },

  {
    id: 6,
    sku: 'MM-DIG-005',
    name: 'First 100 Days Abroad — Full Guide',
    category: 'Digital',
    price: 399,
    currency: 'PHP',
    description: 'All 100 financial lessons compiled, expanded, and organized into a printable workbook — companion to our popular blog series.',
    badge: 'New',
    image: 'https://pixabay.com/get/ga7736b3595c14e01e9b4cfaedec5e317a708e71b3e3cf9ac288f2e0119ed5084bea6c08d8e92f6f07b77e0b5a76def71e60ee11fc728481af29a772272317140_640.jpg',
    stock: -1,
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'email_24h',
  },

  /* ── ADD NEW PRODUCT HERE ─────────────────────────────────────────────
  {
    id: 7,
    sku: 'MM-XXX-000',
    name: '',
    category: 'Digital',
    price: 0,
    currency: 'PHP',
    description: '',
    badge: '',
    image: '',
    stock: -1,        // -1 = unlimited (digital); set a number for physical stock
    active: true,
    isExternal: false,
    buyLink: '',
    delivery: 'email_24h',
  },
  ──────────────────────────────────────────────────────────────────────── */
];

/* ── PAYMENT METHODS ────────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  {
    id: 'gcash',
    label: 'GCash',
    instructions: 'Send payment to GCash <strong>0917-XXX-XXXX</strong> (Benjie G.). Put your Order Reference as the note. Screenshot your receipt and email it to <strong>hello@millionairemindset.ae</strong>.',
  },
  {
    id: 'bdo',
    label: 'BDO Bank Transfer',
    instructions: 'BDO Savings — <strong>Account Name:</strong> Benjie Gadiaza | <strong>Account No:</strong> XXXX-XXXX-XXXX. Use your Order Reference as reference. Email deposit slip to <strong>hello@millionairemindset.ae</strong>.',
  },
  {
    id: 'bpi',
    label: 'BPI Bank Transfer',
    instructions: 'BPI Savings — <strong>Account Name:</strong> Benjie Gadiaza | <strong>Account No:</strong> XXXX-XXXX-XXXX. Use your Order Reference as reference. Email deposit slip to <strong>hello@millionairemindset.ae</strong>.',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    instructions: 'Send to PayPal: <strong>hello@millionairemindset.ae</strong>. Select "Friends &amp; Family". Include your Order Reference in the note.',
  },
  {
    id: 'wu',
    label: 'Western Union',
    instructions: 'Send to <strong>Benjie Gadiaza</strong>, Philippines. Email the MTCN + Order Reference to <strong>hello@millionairemindset.ae</strong>.',
  },
];

/* ── DELIVERY LABELS ─────────────────────────────────────────────────── */
function deliveryLabel(delivery) {
  if (delivery === 'instant')   return 'Instant delivery after payment';
  if (delivery === 'email_24h') return 'Sent to your email within 24 hrs';
  if (delivery === 'physical')  return 'Ships within 3-5 business days';
  return '';
}

/* ── STOCK HELPERS ───────────────────────────────────────────────────── */
function getStock(productId) {
  var p = PRODUCTS.find(function(x){ return x.id === productId; });
  if (!p) return 0;
  if (p.stock === -1) return Infinity;
  // Check localStorage overrides (admin can update stock)
  try {
    var overrides = JSON.parse(localStorage.getItem('mm_stock') || '{}');
    if (overrides[productId] !== undefined) return overrides[productId];
  } catch(e){}
  return p.stock;
}

function decrementStock(productId, qty) {
  var p = PRODUCTS.find(function(x){ return x.id === productId; });
  if (!p || p.stock === -1) return; // unlimited
  try {
    var overrides = JSON.parse(localStorage.getItem('mm_stock') || '{}');
    var current = overrides[productId] !== undefined ? overrides[productId] : p.stock;
    overrides[productId] = Math.max(0, current - qty);
    localStorage.setItem('mm_stock', JSON.stringify(overrides));
  } catch(e){}
}

function setStock(productId, qty) {
  try {
    var overrides = JSON.parse(localStorage.getItem('mm_stock') || '{}');
    overrides[productId] = qty;
    localStorage.setItem('mm_stock', JSON.stringify(overrides));
  } catch(e){}
}
