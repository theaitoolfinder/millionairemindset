/**
 * EXTERNAL SHOP CONFIG
 * =====================
 * Update the url fields below whenever you have the links.
 * Nothing else needs to change.
 */

const SHOP_CONFIG = {

  amazon: {
    name: 'Amazon Store',
    tagline: 'Products shipped to your door — anywhere in the UAE and beyond.',
    description: 'Browse our curated Amazon storefront featuring products hand-picked for OFWs and global workers: home essentials, productivity tools, health items, and more.',
    url: 'https://www.amazon.ae/s?me=A3UBW4PBDA4OOS&marketplaceID=A2VIGQ35RCS4UG',
    ctaLabel: 'Visit Amazon Store',
    badge: 'Ships Worldwide',
    accentColor: '#FF9900',
    accentBg: 'rgba(255,153,0,0.08)',
    accentBorder: 'rgba(255,153,0,0.2)',
    cover: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=85&auto=format&fit=crop&crop=center',
    /* Optional: featured product tiles shown before the CTA */
    featured: [
      { name: 'Home Essentials', desc: 'Kitchen, bedroom & living room picks' },
      { name: 'Productivity Tools', desc: 'Planners, gadgets & work-from-home gear' },
      { name: 'Health & Fitness', desc: 'Supplements, equipment & wellness items' },
      { name: 'Gifts for Family', desc: 'Send love home — curated gift ideas' },
    ],
  },

  jcpremiere: {
    name: 'JC Premiere Health & Wellness',
    tagline: 'Premium supplements and skincare — government-approved and globally trusted.',
    description: 'Shop JC Premiere\'s full range of health supplements, skincare, and wellness products. As an independent associate, I can help you order and get the best value.',
    url: 'https://shop.jcpremiere.com/MillionaireShop',
    ctaLabel: 'Shop Health & Wellness',
    badge: 'Natural & Organic',
    accentColor: '#22c55e',
    accentBg: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.2)',
    logo: 'images/logo-jcpremiere.png',
    cover: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=85&auto=format&fit=crop&crop=center',
    featured: [
      { name: 'Immunity Boosters', desc: 'Stay strong while working abroad' },
      { name: 'Skincare Collection', desc: 'Natural formulas for all skin types' },
      { name: 'Energy & Vitality', desc: 'Stay energized through long shifts' },
      { name: 'Starter Packs', desc: 'Best value bundles for new members' },
    ],
  },

  hof: {
    name: 'HOF Food Shop',
    tagline: 'Authentic Filipino and Asian food delivered to your door.',
    description: 'Miss the taste of home? HOF brings authentic Filipino flavors and quality food products straight to OFWs and Filipino communities worldwide.',
    url: 'https://shop.siomaiking.ph/MillionaireShop',
    ctaLabel: 'Shop HOF Food',
    badge: 'Authentic Filipino',
    accentColor: '#dc2626',
    accentBg: 'rgba(220,38,38,0.07)',
    accentBorder: 'rgba(220,38,38,0.18)',
    cover: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=85&auto=format&fit=crop&crop=center',
    featured: [
      { name: 'Ready-to-Eat Meals', desc: 'Filipino favorites, oven-ready' },
      { name: 'Dry Goods & Pantry', desc: 'Rice, noodles, sauces & more' },
      { name: 'Snacks & Sweets', desc: 'Pastries, chips & Filipino treats' },
      { name: 'Gift Packs', desc: 'Hampers for family and friends' },
    ],
  },

};
