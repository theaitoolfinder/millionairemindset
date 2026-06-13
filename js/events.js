/**
 * EVENTS CONFIG
 * ==============
 * To ADD an event: copy one object block below and fill in your details.
 * To REMOVE: delete the block.
 * To REORDER: move blocks around.
 * No other files need to be touched.
 *
 * FIELD GUIDE:
 *  id            — unique slug, no spaces (e.g. 'img-seminar-jul2026')
 *  title         — event name
 *  organizer     — which networking company / group is hosting
 *  organizerColor — hex colour for the organizer badge
 *  date          — 'YYYY-MM-DD' format (used for sorting & display)
 *  time          — display string e.g. '2:00 PM – 5:00 PM'
 *  timezone      — e.g. 'GMT+8', 'UAE Time', 'London Time'
 *  mode          — 'online' | 'physical' | 'hybrid'
 *  location      — venue name or 'Zoom / Google Meet'
 *  description   — 1–2 sentence event summary
 *  registrationLink — URL to register; '#contact' to use site contact form
 *  category      — 'Seminar' | 'Training' | 'Orientation' | 'Conference' | 'Workshop' | 'Social'
 *  isFeatured    — true = shown in a highlight card at the top
 *  seats         — total seats (0 = unlimited / not shown)
 *  seatsLeft     — remaining seats (0 = not tracked)
 */

const EVENTS = [

  {
    id: 'img-financial-freedom-jul2026',
    title: 'Financial Freedom Seminar',
    organizer: 'IMG International',
    organizerColor: '#3b82f6',
    date: '2026-07-19',
    time: '2:00 PM – 5:00 PM',
    timezone: 'GMT+8',
    mode: 'online',
    location: 'Zoom Webinar',
    description: 'Learn the basics of financial literacy, insurance, and investment planning in this free 3-hour online seminar hosted by IMG. Open to all — OFWs especially welcome.',
    registrationLink: '#contact',
    category: 'Seminar',
    isFeatured: true,
    seats: 200,
    seatsLeft: 87,
  },

  {
    id: 'jcpremiere-orientation-aug2026',
    title: 'JC Premiere Business Orientation',
    organizer: 'JC Premiere',
    organizerColor: '#22c55e',
    date: '2026-08-02',
    time: '10:00 AM – 12:00 PM',
    timezone: 'GMT+8',
    mode: 'online',
    location: 'Facebook Live',
    description: 'New to JC Premiere? This free orientation covers the product line, compensation plan, and how to start your health business from anywhere in the world.',
    registrationLink: '#contact',
    category: 'Orientation',
    isFeatured: false,
    seats: 0,
    seatsLeft: 0,
  },

  {
    id: 'mm-ofw-wealth-workshop-aug2026',
    title: 'OFW Wealth-Building Workshop',
    organizer: 'Millionaire Mindset',
    organizerColor: '#CC1010',
    date: '2026-08-16',
    time: '3:00 PM – 6:00 PM',
    timezone: 'UAE Time (GMT+4)',
    mode: 'online',
    location: 'Zoom',
    description: 'A hands-on workshop covering budgeting, remittance strategies, and the first steps to investing your savings while working abroad. Limited seats — reserve yours.',
    registrationLink: '#contact',
    category: 'Workshop',
    isFeatured: true,
    seats: 50,
    seatsLeft: 23,
  },

  /* ── ADD NEW EVENT HERE ──────────────────────────────────────────────────
  {
    id: 'my-event-slug',
    title: 'Event Title',
    organizer: 'Organizer Name',
    organizerColor: '#hexcolor',
    date: 'YYYY-MM-DD',
    time: '00:00 AM – 00:00 PM',
    timezone: 'GMT+8',
    mode: 'online',           // 'online' | 'physical' | 'hybrid'
    location: 'Zoom / Venue',
    description: 'Short description of the event.',
    registrationLink: '#contact',
    category: 'Seminar',
    isFeatured: false,
    seats: 0,
    seatsLeft: 0,
  },
  ──────────────────────────────────────────────────────────────────────── */

];
