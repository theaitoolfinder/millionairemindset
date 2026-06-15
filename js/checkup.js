// ===== FINANCIAL CHECK-UP QUIZ =====

const QUESTIONS = [
  {
    id: "income",
    category: "Income",
    icon: "💵",
    en: "How much of your monthly salary do you actually keep after sending remittance?",
    tl: "Magkano ang natitira sa iyong sahod pagkatapos magpadala ng remittance?",
    options: [
      { en: "Nothing — it all goes to remittance & bills", tl: "Wala — lahat napupunta sa remittance at bayarin", score: 0 },
      { en: "Less than 10% (very little)", tl: "Wala pang 10% (kakaunti lang)", score: 1 },
      { en: "10–20% of my salary", tl: "10–20% ng aking sahod", score: 2 },
      { en: "20–30% of my salary", tl: "20–30% ng aking sahod", score: 3 },
      { en: "More than 30%", tl: "Mahigit 30%", score: 4 },
    ]
  },
  {
    id: "savings",
    category: "Savings",
    icon: "🏦",
    en: "Do you have an emergency fund (money set aside for unexpected expenses)?",
    tl: "Mayroon ka bang emergency fund (pera na nakatabi para sa hindi inaasahang gastos)?",
    options: [
      { en: "No savings at all", tl: "Wala talaga akong ipon", score: 0 },
      { en: "Less than 1 month of expenses", tl: "Wala pang isang buwang gastos", score: 1 },
      { en: "1–3 months of expenses", tl: "1–3 buwang gastos", score: 2 },
      { en: "3–6 months of expenses", tl: "3–6 buwang gastos", score: 3 },
      { en: "More than 6 months — I'm well prepared", tl: "Mahigit 6 buwan — handa na ako", score: 4 },
    ]
  },
  {
    id: "debt",
    category: "Debt",
    icon: "💳",
    en: "How would you describe your current debt situation?",
    tl: "Paano mo ilalarawan ang iyong kasalukuyang utang?",
    options: [
      { en: "Heavily in debt — struggling to keep up", tl: "Malaki ang utang ko — hirap na hirap na ako", score: 0 },
      { en: "Some debt but manageable", tl: "May utang pero kaya naman", score: 1 },
      { en: "Minimal debt, mostly paying on time", tl: "Maliit na utang, nakakasingil sa tamang oras", score: 2 },
      { en: "Almost debt-free", tl: "Halos wala na akong utang", score: 3 },
      { en: "Completely debt-free", tl: "Walang utang", score: 4 },
    ]
  },
  {
    id: "investment",
    category: "Investing",
    icon: "📈",
    en: "Do you currently have any investments? (stocks, UITF, VUL, real estate, etc.)",
    tl: "Mayroon ka bang investment ngayon? (stocks, UITF, VUL, real estate, atbp.)",
    options: [
      { en: "No investments at all", tl: "Wala talaga", score: 0 },
      { en: "I want to but don't know how", tl: "Gusto ko pero hindi ko alam kung paano", score: 1 },
      { en: "Yes, I have a small investment", tl: "Oo, maliit lang ang investment ko", score: 2 },
      { en: "Yes, I invest regularly every month", tl: "Oo, namumuhunan ako bawat buwan", score: 3 },
      { en: "Yes, diversified in multiple assets", tl: "Oo, iba't ibang uri ng investment", score: 4 },
    ]
  },
  {
    id: "insurance",
    category: "Protection",
    icon: "🛡️",
    en: "Are you and your family protected with life or health insurance?",
    tl: "Ikaw at ang iyong pamilya ba ay may life o health insurance?",
    options: [
      { en: "No insurance at all", tl: "Wala kaming insurance", score: 0 },
      { en: "Only the basic from my employer (OWWA/PhilHealth)", tl: "Ang basic lang mula sa employer (OWWA/PhilHealth)", score: 1 },
      { en: "I have health insurance only", tl: "Mayroon akong health insurance lang", score: 2 },
      { en: "I have life and health insurance", tl: "Mayroon akong life at health insurance", score: 3 },
      { en: "Full coverage — life, health, and VUL/investment", tl: "Kumpleto — life, health, at VUL/investment", score: 4 },
    ]
  },
  {
    id: "budget",
    category: "Budgeting",
    icon: "📋",
    en: "Do you follow a monthly budget or spending plan?",
    tl: "Sumusunod ka ba sa monthly budget o plano sa paggastos?",
    options: [
      { en: "No — I spend freely and figure it out later", tl: "Hindi — gumagastos ako nang walang plano", score: 0 },
      { en: "I try but rarely stick to it", tl: "Sinusubukan ko pero madalas ay hindi nasusunod", score: 1 },
      { en: "I have a rough budget in my head", tl: "Mayroon akong ideya sa isip ko", score: 2 },
      { en: "Yes, I track my expenses monthly", tl: "Oo, sinusubaybayan ko ang gastos bawat buwan", score: 3 },
      { en: "Yes, detailed budget with savings & investment goals", tl: "Oo, detalyadong budget kasama ang ipon at investment", score: 4 },
    ]
  },
  {
    id: "home",
    category: "Property",
    icon: "🏠",
    en: "Do you own or are you building toward owning a home in the Philippines?",
    tl: "Mayroon ka bang sariling tahanan sa Pilipinas o nagtatayo ka pa lamang?",
    options: [
      { en: "No plans yet", tl: "Wala pa akong plano", score: 0 },
      { en: "I want to but don't know where to start", tl: "Gusto ko pero hindi ko alam kung saan magsisimula", score: 1 },
      { en: "I'm actively saving for a house", tl: "Nag-iipon na ako para sa bahay", score: 2 },
      { en: "I have an ongoing housing loan", tl: "Mayroon akong housing loan", score: 3 },
      { en: "I already own a home / property", tl: "Mayroon na akong bahay / property", score: 4 },
    ]
  },
  {
    id: "income2",
    category: "Extra Income",
    icon: "💼",
    en: "Do you have any income source aside from your regular OFW job?",
    tl: "Mayroon ka bang ibang pinagkukunan ng kita bukod sa iyong trabaho bilang OFW?",
    options: [
      { en: "No — my job is my only income", tl: "Wala — ang trabaho ko lang ang pinagkukunan ko", score: 0 },
      { en: "I've tried but nothing consistent", tl: "Nasubukan ko pero hindi tuloy-tuloy", score: 1 },
      { en: "I have a small side income", tl: "Mayroon akong maliit na karagdagang kita", score: 2 },
      { en: "Yes, I earn extra regularly", tl: "Oo, kumikita ako ng dagdag nang regular", score: 3 },
      { en: "Multiple income streams — I'm building real wealth", tl: "Maraming pinagkukunan ng kita — nagtatayo ako ng tunay na yaman", score: 4 },
    ]
  },
  {
    id: "health",
    category: "Health & Wellness",
    icon: "💪",
    en: "How would you rate your current physical health and wellness?",
    tl: "Paano mo ilalarawan ang iyong kasalukuyang kalusugan?",
    options: [
      { en: "Poor — I'm often sick or exhausted", tl: "Mahina — madalas akong masakit o pagod", score: 0 },
      { en: "Fair — manageable but not great", tl: "Katamtaman — kaya naman pero hindi maganda", score: 1 },
      { en: "Good — generally healthy", tl: "Mabuti — pangkalahatan ay malusog", score: 2 },
      { en: "Very good — I exercise and eat well", tl: "Napakagaling — nag-eehersisyo at kumakain nang tama", score: 3 },
      { en: "Excellent — health is a top priority for me", tl: "Napakahusay — ang kalusugan ay prayoridad ko", score: 4 },
    ]
  },
  {
    id: "retirement",
    category: "Future Planning",
    icon: "🌅",
    en: "Do you have a clear plan for your retirement or financial independence?",
    tl: "Mayroon ka bang malinaw na plano para sa iyong retirement o financial independence?",
    options: [
      { en: "No plan — I'll figure it out later", tl: "Walang plano — bahala na", score: 0 },
      { en: "I think about it but haven't started", tl: "Naiisip ko pero hindi pa nagsisimula", score: 1 },
      { en: "I have a rough idea and am starting to act", tl: "Mayroon akong ideya at nagsisimula na", score: 2 },
      { en: "I have a plan and am actively working on it", tl: "Mayroon akong plano at aktibong ginagawa", score: 3 },
      { en: "I have a detailed plan with clear timelines", tl: "Detalyadong plano na may malinaw na takdang panahon", score: 4 },
    ]
  },
];

let currentQ = 0;
let answers = {};
let lang = 'tl';

function startQuiz() {
  lang = localStorage.getItem('mm_lang') || 'tl';
  document.getElementById('screen-start').classList.remove('active');
  document.getElementById('screen-questions').classList.add('active');
  document.getElementById('quizProgress').style.display = 'block';
  currentQ = 0;
  answers = {};
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const total = QUESTIONS.length;
  const pct = Math.round(((currentQ + 1) / total) * 100);

  document.getElementById('progressText').textContent =
    lang === 'tl' ? `Tanong ${currentQ + 1} sa ${total}` : `Question ${currentQ + 1} of ${total}`;
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('progressFill').style.width = pct + '%';

  const selected = answers[q.id];

  document.getElementById('questionArea').innerHTML = `
    <div class="question-card">
      <div class="question-icon">${q.icon}</div>
      <div class="question-category">${q.category}</div>
      <h3 class="question-text">${q[lang]}</h3>
      <div class="options-list">
        ${q.options.map((opt, i) => `
          <label class="option-label ${selected === i ? 'selected' : ''}" onclick="selectOption(${i})">
            <input type="radio" name="q${currentQ}" value="${i}" ${selected === i ? 'checked' : ''} />
            <span class="option-letter">${String.fromCharCode(65 + i)}</span>
            <span class="option-text">${opt[lang]}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('btnBack').style.display = currentQ > 0 ? 'inline-block' : 'none';
  document.getElementById('btnNext').textContent =
    currentQ === total - 1
      ? (lang === 'tl' ? 'Tingnan ang Resulta 🎯' : 'See My Results 🎯')
      : (lang === 'tl' ? 'Susunod →' : 'Next →');
  document.getElementById('skipNote').style.display = selected === undefined ? 'block' : 'none';
}

function selectOption(index) {
  answers[QUESTIONS[currentQ].id] = index;
  document.querySelectorAll('.option-label').forEach((el, i) => {
    el.classList.toggle('selected', i === index);
  });
  document.getElementById('skipNote').style.display = 'none';
}

function nextQuestion() {
  if (answers[QUESTIONS[currentQ].id] === undefined) {
    document.getElementById('skipNote').style.display = 'block';
    document.getElementById('questionArea').classList.add('shake');
    setTimeout(() => document.getElementById('questionArea').classList.remove('shake'), 500);
    return;
  }
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function showResults() {
  document.getElementById('screen-questions').classList.remove('active');
  document.getElementById('quizProgress').style.display = 'none';
  document.getElementById('screen-results').classList.add('active');

  const totalScore = Object.values(answers).reduce((sum, v) => sum + QUESTIONS.find((_, i) => i === Object.keys(answers).indexOf(Object.keys(answers)[Object.values(answers).indexOf(v)])) ? v : 0, 0);

  // Calculate properly
  let score = 0;
  QUESTIONS.forEach(q => { if (answers[q.id] !== undefined) score += q.options[answers[q.id]].score; });
  const maxScore = QUESTIONS.length * 4;
  const pct = Math.round((score / maxScore) * 100);

  // Animate score
  animateScore(pct);

  // Tier
  let tier, tierColor, tierEmoji;
  if (pct >= 80) { tier = lang === 'tl' ? 'Millionaire Track 🏆' : 'Millionaire Track 🏆'; tierColor = '#22c55e'; tierEmoji = '🏆'; }
  else if (pct >= 60) { tier = lang === 'tl' ? 'Malapit Na! Kailangan ng Push' : 'Getting There — Needs a Push'; tierColor = '#f59e0b'; tierEmoji = '💪'; }
  else if (pct >= 40) { tier = lang === 'tl' ? 'Sa Tamang Daan Pero May Gaps' : 'On the Right Path — But Has Gaps'; tierColor = '#f97316'; tierEmoji = '⚡'; }
  else { tier = lang === 'tl' ? 'Kailangan ng Tulong Ngayon' : 'Needs Immediate Attention'; tierColor = '#ef4444'; tierEmoji = '🚨'; }

  document.getElementById('scoreTier').innerHTML = `<span style="color:${tierColor}">${tier}</span>`;

  // Breakdown
  const breakdown = QUESTIONS.map(q => {
    const ans = answers[q.id];
    const s = ans !== undefined ? q.options[ans].score : 0;
    const max = 4;
    const pctBar = Math.round((s / max) * 100);
    const barColor = pctBar >= 75 ? '#22c55e' : pctBar >= 50 ? '#f59e0b' : '#ef4444';
    return `
      <div class="breakdown-item">
        <div class="breakdown-header">
          <span>${q.icon} ${q.category}</span>
          <span style="color:${barColor}">${s}/${max}</span>
        </div>
        <div class="breakdown-bar"><div class="breakdown-fill" style="width:${pctBar}%; background:${barColor}"></div></div>
        ${ans !== undefined ? `<p class="breakdown-answer">${q.options[ans][lang]}</p>` : ''}
      </div>
    `;
  }).join('');
  document.getElementById('resultsBreakdown').innerHTML = `<h3>${lang === 'tl' ? 'Detalye ng Iyong Score' : 'Your Score Breakdown'}</h3>${breakdown}`;

  // CTA based on weak areas
  // Financial literacy fundamental order: IMG (protect) → JC Premiere (health/income) → Vista Land (asset)
  const weakAreas = QUESTIONS.filter(q => answers[q.id] !== undefined && q.options[answers[q.id]].score <= 1).map(q => q.id);
  let ctaHTML = `<div class="cta-box"><h3>${lang === 'tl' ? 'Ang Iyong Personalized na Plano' : 'Your Personalized Action Plan'}</h3><div class="cta-cards">`;

  // 1st priority: Insurance & Investment protection (IMG)
  if (weakAreas.includes('insurance') || weakAreas.includes('investment') || weakAreas.includes('retirement')) {
    ctaHTML += `
      <div class="cta-card cta-img">
        <div class="cta-card-logo">IMG</div>
        <h4>${lang === 'tl' ? '🛡️ Protektahan at I-invest ang Pera Mo' : '🛡️ Protect & Invest Your Money'}</h4>
        <p>${lang === 'tl' ? 'Ang International Marketing Group (IMG) ay tumutulong sa mga OFW na makakuha ng tamang insurance, investment plan, at financial literacy — at kumita sa proseso.' : 'International Marketing Group (IMG) helps OFWs get proper insurance, build investment plans, and gain financial literacy — while earning from sharing it with others.'}</p>
        <a href="business.html#img" class="btn-primary btn-sm">${lang === 'tl' ? 'Alamin Ang IMG →' : 'Learn About IMG →'}</a>
      </div>`;
  }

  // 2nd priority: Health + Extra Income (JC Premiere)
  if (weakAreas.includes('health') || weakAreas.includes('income2')) {
    ctaHTML += `
      <div class="cta-card cta-jcp">
        <div class="cta-card-logo">JC Premiere</div>
        <h4>${lang === 'tl' ? '💊 Pagbutihin ang Kalusugan + Kumita' : '💊 Improve Health + Earn Extra'}</h4>
        <p>${lang === 'tl' ? 'Ang JC Premiere ay nag-aalok ng premium na health products at isang business opportunity para kumita ng part-time habang nag-aayos ng kalusugan mo.' : 'JC Premiere offers premium health & wellness products plus a part-time business opportunity to boost your income while improving your health.'}</p>
        <a href="business.html#jcpremiere" class="btn-primary btn-sm">${lang === 'tl' ? 'Alamin Ang JC Premiere →' : 'Learn About JC Premiere →'}</a>
      </div>`;
  }

  // 3rd priority: Real Estate asset building (Vista Land)
  if (weakAreas.includes('home') || pct >= 50) {
    ctaHTML += `
      <div class="cta-card cta-vista">
        <div class="cta-card-logo">Vista Land</div>
        <h4>${lang === 'tl' ? '🏠 Mag-invest sa Real Estate' : '🏠 Invest in Real Estate'}</h4>
        <p>${lang === 'tl' ? 'Ang Vista Land ay nag-aalok ng abot-kayang bahay at lupa sa buong Pilipinas — perpekto para sa mga OFW na nagtatayo para sa kanilang pamilya.' : 'Vista Land offers affordable homes and lots across the Philippines — perfect for OFWs building a future for their family back home.'}</p>
        <a href="business.html#vistaland" class="btn-primary btn-sm">${lang === 'tl' ? 'Tingnan ang mga Property →' : 'View Properties →'}</a>
      </div>`;
  }

  ctaHTML += `</div></div>`;
  document.getElementById('resultsCta').innerHTML = ctaHTML;
}

function animateScore(target) {
  let current = 0;
  const el = document.getElementById('scoreNumber');
  const ring = document.getElementById('ringFill');
  const circumference = 2 * Math.PI * 52;
  ring.style.strokeDasharray = circumference;

  const labelEl = document.getElementById('scoreLabel');

  const interval = setInterval(() => {
    current += 2;
    if (current >= target) current = target;
    el.textContent = current;
    labelEl.textContent = lang === 'tl' ? 'out of 100' : 'out of 100';

    const offset = circumference - (current / 100) * circumference;
    ring.style.strokeDashoffset = offset;

    if (current >= 80) ring.style.stroke = '#22c55e';
    else if (current >= 60) ring.style.stroke = '#f59e0b';
    else if (current >= 40) ring.style.stroke = '#f97316';
    else ring.style.stroke = '#ef4444';

    if (current >= target) clearInterval(interval);
  }, 20);
}

function restartQuiz() {
  document.getElementById('screen-results').classList.remove('active');
  document.getElementById('screen-start').classList.add('active');
  answers = {};
  currentQ = 0;
}

function shareFacebook() {
  const url = encodeURIComponent('https://millionairemindset.ae/checkup.html');
  const text = encodeURIComponent(lang === 'tl' ? 'Sinubukan ko ang libreng OFW Financial Check-up ng Millionaire Mindset! Alamin ang iyong financial health score.' : 'I just took the free OFW Financial Check-up on Millionaire Mindset! Find out your financial health score.');
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareWhatsapp() {
  const text = encodeURIComponent((lang === 'tl' ? 'Sinubukan ko ang libreng OFW Financial Check-up! Alamin din ang iyong score: ' : 'I just took the free OFW Financial Check-up! Find out your score: ') + 'https://millionairemindset.ae/checkup.html');
  window.open(`https://wa.me/?text=${text}`, '_blank');
}
