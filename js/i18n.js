// ===== BILINGUAL CONTENT =====
const LANG = {
  en: {
    nav_home: "Home",
    nav_blog: "Blog",
    nav_shop: "Shop",
    nav_business: "Business",
    nav_about: "About",
    nav_contact: "Contact",

    hero_tag: "For Global Workers Who Refuse to Just Survive",
    hero_h1_line1: "Your Sacrifice",
    hero_h1_line2: "Deserves a",
    hero_h1_line3: "Millionaire Plan.",
    hero_sub: "Financial literacy, extra income opportunities, and curated products — everything you need to build real wealth while working anywhere in the world.",
    hero_btn1: "Learn & Grow",
    hero_btn2: "Browse Shop",

    trust1_num: "5,000+", trust1_label: "Members Reached",
    trust2_num: "Global", trust2_label: "Worldwide Community",
    trust3_num: "Free",   trust3_label: "Financial Resources",
    trust4_num: "Part-time", trust4_label: "Income Options",

    topics_label: "What We Cover",
    topics_h2: "Built for the OFW Journey",
    topics_sub: "From your first remittance to your first investment — we guide every step.",
    topic1_title: "Smart Remittances",
    topic1_desc: "Stop losing money on fees. Learn the best channels to send more home with less cost.",
    topic2_title: "Investing for OFWs",
    topic2_desc: "Stocks, UITF, real estate — where to put your savings so your money grows while you work.",
    topic3_title: "Balik-Bayan Planning",
    topic3_desc: "Build a solid plan so when you come home, you come home for good — not because you have to.",
    topic4_title: "Family Financial Plan",
    topic4_desc: "Teach your family to manage remittances wisely so your hard work doesn't disappear.",

    articles_label: "Latest Articles",
    articles_h2: "Financial Tips for OFWs",
    post1_tag: "Remittance", post1_date: "June 2026",
    post1_title: "5 Best Ways to Send Money Home from Abroad in 2026",
    post1_desc: "Comparing fees, exchange rates, and speed — so more of your hard-earned money reaches your family.",
    post2_tag: "Investing", post2_date: "May 2026",
    post2_title: "OFW Beginner's Guide to the Philippine Stock Market",
    post2_desc: "You don't need to be rich to invest. Here's how to start with as little as ₱1,000.",
    post3_tag: "Mindset", post3_date: "April 2026",
    post3_title: "Why Most OFWs Come Home Broke — And How Not To",
    post3_desc: "The lifestyle traps, the family pressure, and the money habits that drain OFW savings.",
    view_all: "View All Articles",

    aff_label: "Recommended",
    aff1_title: "OFW Home Loan",
    aff1_desc: "Buy your dream home in the Philippines while working abroad.",
    aff2_title: "OFW Health Insurance",
    aff2_desc: "Protect yourself and your family with affordable coverage.",
    aff3_title: "Online Investment Account",
    aff3_desc: "Open a stock account from anywhere in the world.",
    aff_cta: "Learn More →",

    shop_label: "Our Shop",
    shop_h2: "Products for the OFW Lifestyle",
    shop_sub: "Curated products to support your health, growth, and hustle.",
    shop_btn: "Browse Full Shop",

    biz_label: "Extra Income",
    biz_h2: "Build a Business From Anywhere in the World",
    biz_desc: "Flexible business opportunities you can run from any country — low capital, part-time hours, and managed entirely from your phone.",
    biz_b1: "No need to quit your job — start part-time",
    biz_b2: "Work from any country, earn globally",
    biz_b3: "Help your family back home earn too",
    biz_b4: "Build passive income streams",
    biz_b5: "Join a supportive Filipino community",
    biz_btn: "Learn About the Opportunity",
    biz_card_h: "Part-Time. Real Income.",
    biz_card_p: "Thousands of Filipinos are building income streams through network marketing — while keeping their day jobs.",
    biz_s1: "Flexible", biz_s1b: "Work anytime",
    biz_s2: "Low Capital", biz_s2b: "Start small",
    biz_s3: "Scalable", biz_s3b: "Grow your team",

    quote: '"You are not just working for your family. You are building their future."',
    quote_attr: "— Millionaire Mindset",

    nl_h2: "Join Our OFW Community",
    nl_p: "Free weekly tips on saving, investing, and building income. No spam, ever.",
    nl_btn: "Subscribe Free",
    nl_placeholder: "Enter your email address",

    contact_label: "Get In Touch",
    contact_h2: "Let's Talk",
    contact_sub: "Questions about the business, products, or financial advice? Message me anytime.",
    contact_p: "Whether you want to learn about financial literacy, explore the business opportunity, or just connect with a fellow Filipino — I'm here.",
    contact_select0: "What are you interested in?",
    contact_select1: "Financial Literacy Resources",
    contact_select2: "Business Opportunity",
    contact_select3: "Product Inquiry",
    contact_select4: "General Inquiry",
    contact_placeholder_name: "Your Name",
    contact_placeholder_email: "Your Email",
    contact_placeholder_msg: "Your Message",
    contact_btn: "Send Message",

    footer_tagline: "Empowering Global Workers to Build Wealth & Freedom",
    footer_copy: "© 2026 MillionaireMindset.ae — All rights reserved.",
    footer_aff: "This site may contain affiliate links. We earn a small commission at no extra cost to you.",

    // Blog page
    blog_hero_label: "Financial Literacy",
    blog_hero_h1: "Blog &amp; Series",
    blog_hero_sub: "Guided learning series + practical articles — everything you need to build financial confidence, wherever you are in the world.",
    blog_series_label: "Guided Learning",
    blog_series_h2: "Blog Series",
    blog_series_sub: "Structured multi-part series published on a schedule. Follow along day by day — each post builds on the last.",
    blog_art_label: "Latest Articles",
    blog_art_h2: "Financial Tips",
    blog_read_more: "Read More →",

    blog_p1_tag: "Remittance", blog_p1_date: "June 2026",
    blog_p1_title: "5 Best Ways to Send Money Home from Abroad in 2026",
    blog_p1_desc: "Comparing fees, exchange rates, and speed — so more of your hard-earned money reaches your family.",

    blog_p2_tag: "Investing", blog_p2_date: "May 2026",
    blog_p2_title: "OFW Beginner's Guide to the Philippine Stock Market",
    blog_p2_desc: "You don't need to be rich to invest. Here's how to open an account and start with as little as ₱1,000.",

    blog_p3_tag: "Mindset", blog_p3_date: "April 2026",
    blog_p3_title: "Why Most OFWs Come Home Broke — And How Not To",
    blog_p3_desc: "The lifestyle traps, the family pressure, and the money habits that drain savings. Let's fix them.",

    blog_p4_tag: "Insurance", blog_p4_date: "March 2026",
    blog_p4_title: "Why Every OFW Needs Life Insurance — Even If You're Healthy",
    blog_p4_desc: "Your family depends on your income. What happens if something unexpected happens to you?",

    blog_p5_tag: "Real Estate", blog_p5_date: "February 2026",
    blog_p5_title: "How OFWs Can Buy a House in the Philippines from Abroad",
    blog_p5_desc: "Step-by-step guide to purchasing property remotely — without going home to sign papers.",

    blog_aff_label: "Recommended",
    blog_aff1_title: "OFW Health Insurance", blog_aff1_desc: "Affordable coverage for you and your family back home.", blog_aff_cta: "Get a Quote →",
    blog_aff2_title: "Vista Land Properties", blog_aff2_desc: "Affordable homes and lots across the Philippines.", blog_aff_cta2: "View Properties →",
    blog_aff3_title: "JC Premiere Wellness", blog_aff3_desc: "Premium health products delivered anywhere.", blog_aff_cta3: "Shop Now →",
  },

  tl: {
    nav_home: "Bahay",
    nav_blog: "Blog",
    nav_shop: "Tindahan",
    nav_business: "Negosyo",
    nav_about: "Tungkol",
    nav_contact: "Makipag-ugnayan",

    hero_tag: "Para sa mga OFW na Hindi Basta Sumusuko",
    hero_h1_line1: "Ang Iyong Sakripisyo",
    hero_h1_line2: "ay Karapat-dapat sa",
    hero_h1_line3: "Plano ng Milyonaryo.",
    hero_sub: "Financial literacy, karagdagang kita, at mga produkto — lahat ng kailangan ng isang OFW para bumuo ng tunay na yaman mula sa ibang bansa.",
    hero_btn1: "Matuto at Lumago",
    hero_btn2: "Bisitahin ang Tindahan",

    trust1_num: "5,000+", trust1_label: "Miyembro ang Naabot",
    trust2_num: "Global", trust2_label: "Komunidad sa Buong Mundo",
    trust3_num: "Libre",  trust3_label: "Mga Resources",
    trust4_num: "Part-time", trust4_label: "Pagkakataon sa Kita",

    topics_label: "Ano ang Aming Tinatalakay",
    topics_h2: "Para sa Buhay ng OFW",
    topics_sub: "Mula sa unang padala hanggang unang investment — gagabayan ka namin sa bawat hakbang.",
    topic1_title: "Matalinong Padala",
    topic1_desc: "Huwag hayaang maubos sa bayad ang iyong pinaghirapan. Alamin ang pinakamababang bayad sa pagpapadala.",
    topic2_title: "Investment para sa OFW",
    topic2_desc: "Stocks, UITF, real estate — saan ilalagay ang iyong ipon para lumago kahit nandito ka pa rin.",
    topic3_title: "Plano sa Balik-Bayan",
    topic3_desc: "Gumawa ng plano para pagbalik mo, permanent na — hindi dahil kailangan mo na.",
    topic4_title: "Pamilyang Budget Plan",
    topic4_desc: "Turuan ang iyong pamilya kung paano pamahalaan ang padala para hindi maubos.",

    articles_label: "Pinakabagong Artikulo",
    articles_h2: "Tips sa Pera para sa OFW",
    post1_tag: "Padala", post1_date: "Hunyo 2026",
    post1_title: "5 Pinakamahusay na Paraan ng Pagpapadala ng Pera mula sa Ibang Bansa noong 2026",
    post1_desc: "Inihambing ang bayad, halaga ng palitan, at bilis — para mas maraming pera ang makakarating sa iyong pamilya.",
    post2_tag: "Investment", post2_date: "Mayo 2026",
    post2_title: "Gabay ng OFW Beginner sa Philippine Stock Market",
    post2_desc: "Hindi kailangan maging mayaman para mag-invest. Narito kung paano magsimula sa ₱1,000 lang.",
    post3_tag: "Mindset", post3_date: "Abril 2026",
    post3_title: "Bakit Karamihan sa OFW ay Walang Naipon — At Paano Maiiwasan",
    post3_desc: "Ang mga bitag sa pamumuhay, presyur ng pamilya, at ugali sa pera na nagpapalubog ng ipon ng OFW.",
    view_all: "Tingnan Lahat ng Artikulo",

    aff_label: "Inirerekomenda",
    aff1_title: "OFW Home Loan",
    aff1_desc: "Bilhin ang iyong pangarap na tahanan sa Pilipinas habang nagtatrabaho sa ibang bansa.",
    aff2_title: "OFW Health Insurance",
    aff2_desc: "Abot-kayang proteksyon para sa iyo at sa iyong pamilya.",
    aff3_title: "Online Investment Account",
    aff3_desc: "Magbukas ng stock account kahit saan ka man sa mundo.",
    aff_cta: "Alamin Pa →",

    shop_label: "Aming Tindahan",
    shop_h2: "Mga Produkto para sa OFW",
    shop_sub: "Mga piling produkto para sa iyong kalusugan, kaalaman, at tagumpay.",
    shop_btn: "Tingnan ang Lahat ng Produkto",

    biz_label: "Karagdagang Kita",
    biz_h2: "Magtayo ng Negosyo Kahit Saan Ka Man sa Mundo",
    biz_desc: "Mga flexible na oportunidad sa negosyo na magagawa mo mula sa anumang bansa — mababa ang puhunan, part-time ang oras, at lahat ay sa iyong telepono.",
    biz_b1: "Hindi kailangang mag-resign — magsimula bilang part-time",
    biz_b2: "Nagtatrabaho sa kahit saang bansa, kumikita sa buong mundo",
    biz_b3: "Maaaring kumita pati ang pamilya mo sa bahay",
    biz_b4: "Bumuo ng passive income",
    biz_b5: "Sumali sa suportadong komunidad ng mga Filipino",
    biz_btn: "Alamin ang Pagkakataon",
    biz_card_h: "Part-Time. Tunay na Kita.",
    biz_card_p: "Libo-libong Filipino ang bumubuo ng kita sa network marketing — habang nagtatrabaho pa rin.",
    biz_s1: "Flexible", biz_s1b: "Anumang oras",
    biz_s2: "Mababang Puhunan", biz_s2b: "Magsimula nang maliit",
    biz_s3: "Mapalawak", biz_s3b: "Palakihin ang team",

    quote: '"Hindi ka lang nagtatrabaho para sa pamilya mo. Binubuo mo ang kanilang kinabukasan."',
    quote_attr: "— Millionaire Mindset",

    nl_h2: "Sumali sa Aming Komunidad ng OFW",
    nl_p: "Libreng lingguhang tips sa pag-iimpok, pag-invest, at pagbuo ng kita. Walang spam.",
    nl_btn: "Mag-subscribe nang Libre",
    nl_placeholder: "Ilagay ang iyong email",

    contact_label: "Makipag-ugnayan",
    contact_h2: "Kausapin Tayo",
    contact_sub: "May tanong sa negosyo, produkto, o payo sa pera? Makipag-ugnayan sa akin anumang oras.",
    contact_p: "Gusto mong matuto tungkol sa financial literacy, tuklasin ang pagkakataon sa negosyo, o makipag-koneksyon sa kapwa Filipino — nandito ako.",
    contact_select0: "Ano ang iyong interes?",
    contact_select1: "Financial Literacy Resources",
    contact_select2: "Pagkakataon sa Negosyo",
    contact_select3: "Tanong sa Produkto",
    contact_select4: "Pangkalahatang Tanong",
    contact_placeholder_name: "Iyong Pangalan",
    contact_placeholder_email: "Iyong Email",
    contact_placeholder_msg: "Iyong Mensahe",
    contact_btn: "Ipadala ang Mensahe",

    footer_tagline: "Binibigyan ng Kakayahan ang mga Global Worker na Bumuo ng Yaman at Kalayaan",
    footer_copy: "© 2026 MillionaireMindset.ae — Lahat ng karapatan ay nakalaan.",
    footer_aff: "Ang site na ito ay maaaring may mga affiliate links. Kumikita kami ng maliit na komisyon nang walang dagdag na bayad sa inyo.",

    // Blog page — Tagalog
    blog_hero_label: "Pinansyal na Karunungan",
    blog_hero_h1: "Blog at Serye",
    blog_hero_sub: "Mga gabay na serye at praktikal na artikulo — lahat ng kailangan mo para maging matalino sa pera, saan ka man naroroon sa mundo.",
    blog_series_label: "Gabay na Pag-aaral",
    blog_series_h2: "Mga Blog Series",
    blog_series_sub: "Nakabalangkas na serye na inilalathala araw-araw. Sundan mo ito — ang bawat post ay nagdadagdag sa nakaraang aralin.",
    blog_art_label: "Pinakabagong Artikulo",
    blog_art_h2: "Tips sa Pera para sa OFW",
    blog_read_more: "Basahin →",

    blog_p1_tag: "Padala", blog_p1_date: "Hunyo 2026",
    blog_p1_title: "5 Pinakamahusay na Paraan ng Pagpapadala ng Pera mula sa Ibang Bansa noong 2026",
    blog_p1_desc: "Inihambing ang bayad, halaga ng palitan, at bilis — para mas maraming pera ang makakarating sa iyong pamilya.",

    blog_p2_tag: "Pamumuhunan", blog_p2_date: "Mayo 2026",
    blog_p2_title: "Gabay ng OFW Baguhan sa Philippine Stock Market",
    blog_p2_desc: "Hindi kailangan maging mayaman para mag-invest. Narito kung paano magsimula sa halagang ₱1,000 lang.",

    blog_p3_tag: "Mindset", blog_p3_date: "Abril 2026",
    blog_p3_title: "Bakit Karamihan sa OFW ay Walang Naipon Pag-uwi — At Paano Maiiwasan",
    blog_p3_desc: "Ang mga bitag sa pamumuhay, presyur ng pamilya, at ugali sa pera na nagpapalubog ng ipon ng OFW.",

    blog_p4_tag: "Insurance", blog_p4_date: "Marso 2026",
    blog_p4_title: "Bakit Kailangan ng Bawat OFW ng Life Insurance — Kahit Malusog Ka",
    blog_p4_desc: "Ang pamilya mo ay umaasa sa iyong kita. Ano ang mangyayari kung may hindi inaasahang mangyari sa iyo?",

    blog_p5_tag: "Real Estate", blog_p5_date: "Pebrero 2026",
    blog_p5_title: "Paano Makakabili ng Bahay ang OFW sa Pilipinas Kahit Nasa Abroad",
    blog_p5_desc: "Hakbang-hakbang na gabay sa pagbili ng property nang malayo — nang hindi na kailangang umuwi para pumirma.",

    blog_aff_label: "Inirerekomenda",
    blog_aff1_title: "OFW Health Insurance", blog_aff1_desc: "Abot-kayang coverage para sa iyo at sa iyong pamilya sa Pilipinas.", blog_aff_cta: "Kumuha ng Quote →",
    blog_aff2_title: "Vista Land Properties", blog_aff2_desc: "Abot-kayang bahay at lupa sa buong Pilipinas.", blog_aff_cta2: "Tingnan ang Mga Property →",
    blog_aff3_title: "JC Premiere Wellness", blog_aff3_desc: "Mga premium na produktong pangkalusugan na maipapadala kahit saan.", blog_aff_cta3: "Mag-order Na →",
  }
};

let currentLang = localStorage.getItem('mm_lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('mm_lang', lang);
  // Reload so all content re-renders in the chosen language
  window.location.reload();
}

function applyLang() {
  const t = LANG[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else if (el.tagName === 'OPTION') {
        el.textContent = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
});
