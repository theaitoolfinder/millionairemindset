/**
 * BLOG SERIES CONFIG
 * ==================
 * To ADD a new series: push a new object to BLOG_SERIES.
 * To ADD a post: push to the series's `posts` array.
 * To REORDER series on the page: rearrange the array.
 * post.html reads URL params: ?series=<id>&day=<n>
 */

const BLOG_SERIES = [

  /* ================================================================
     SERIES 1 — FIRST 100 DAYS ABROAD
     ================================================================ */
  {
    id: 'first-100-days',
    title: 'First 100 Days Abroad',
    subtitle: 'One financial lesson a day — so you never have to learn the hard way',
    description: 'The first 100 days as an overseas worker are the most important for your financial future. Most people arrive without a plan and end up in the same cycle for years. This series gives you one practical lesson every day — covering contracts, banking, remittance, savings, investing, insurance, and building a business on the side.',
    cover: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '📅',
    accentColor: '#CC1010',
    accentBg: 'rgba(204,16,16,0.07)',
    totalPosts: 100,
    posts: [

      /* ── WEEK 1: Arrival & Legal Foundation ─────────────────── */
      {
        day: 1,
        title: 'Read Your Employment Contract Before You Sign Anything',
        excerpt: 'Your contract is your most powerful protection abroad. Most OFWs never read it fully — and suffer the consequences.',
        tags: ['Legal', 'Contracts'],
        readTime: '6 min',
        content: `Your employment contract is the most important document you have when working abroad. It defines your rights, your salary, your benefits, and what happens if things go wrong.

**What to look for:**
- Exact salary amount (and what currency)
- Overtime pay and how it's calculated
- Working hours per day/week
- Annual leave and sick leave entitlements
- Housing and transportation allowances
- Termination clauses — what happens if YOU resign or if you're dismissed
- Repatriation clause — who pays for your flight home if the job ends

**The biggest mistake** most OFWs make is signing a contract they haven't read because they're excited to leave. Recruiters count on this. Even if your agency is trusted, always ask for a copy to read overnight before signing.

**Practical tip:** Take a photo of every page of your contract. Keep a digital copy in Google Drive or email it to yourself. If your employer ever violates your terms, this is your proof.

If there are things you don't understand, ask your POEA or OWWA representative before departure. Once you're abroad, fixing contract issues is much harder.

**Remember:** A bad contract accepted out of excitement can trap you for years. A good contract read carefully protects your family's future.`
      },
      {
        day: 2,
        title: 'Register with Your Country\'s Embassy or Consulate',
        excerpt: 'Most workers abroad never register with their embassy — until they need help and don\'t know where to turn.',
        tags: ['Legal', 'Safety'],
        readTime: '4 min',
        content: `On your first week abroad, one of the first things you should do is register with your country's embassy or consulate in the country where you're working.

**Why this matters:**
- In case of emergency (hospital, legal trouble, job loss), they can help you
- They maintain a database of overseas nationals for crisis evacuations
- They can assist with lost passports and travel documents
- They organize community events and financial literacy programs for OFWs

**How to register:**
Most embassies now have online registration portals. Search for "Philippine Embassy [country name] OFW registration" and you'll find the form. It takes about 10 minutes.

**What info you'll need:**
- Your passport details
- Your employer's name and address
- Your work address and contact number
- An emergency contact back home

**Pro tip:** Also join your embassy's official Facebook group or Viber community. They regularly post important announcements about labor law changes, scams targeting OFWs, and community assistance programs.

This simple step could save your life someday.`
      },
      {
        day: 3,
        title: 'Open a Local Bank Account on Your First Week',
        excerpt: 'Receiving your salary in cash or your employer\'s account is risky. Your own local bank account gives you control.',
        tags: ['Banking', 'Savings'],
        readTime: '5 min',
        content: `Having your own local bank account in the country where you're working is essential. Without it, you have no financial record, no credit history, and no safety net.

**Why you need a local account:**
- Receive your salary directly — safer than cash
- Pay bills, rent, and daily expenses without carrying cash
- Build a local banking record (useful for future loans or financial needs)
- Easier to transfer money internationally from a bank account

**What to bring to open an account:**
- Passport
- Work permit or residency ID (Iqama, employment pass, etc.)
- Employer's HR letter (some banks require this)
- A small initial deposit (usually $50–$200 equivalent)

**Choose the right bank:**
Look for a bank with:
- Low or no monthly fees for basic accounts
- Free ATM withdrawals
- Mobile banking app in English (or your language)
- International transfer capabilities

**Tip:** Ask your coworkers which bank they use. Filipino communities abroad often know which banks are most OFW-friendly and have lower international transfer fees.

Having your money in your own account gives you independence. Never rely solely on your employer to "hold" your money.`
      },
      {
        day: 4,
        title: 'Understand Your Exact Monthly Take-Home Pay',
        excerpt: 'Many OFWs are surprised when their first paycheck arrives. Taxes, deductions, and fees can reduce your salary significantly.',
        tags: ['Budgeting', 'Taxes'],
        readTime: '5 min',
        content: `Before you can plan your finances, you need to know exactly what you'll actually receive every month — not just what your contract says.

**Deductions that reduce your gross salary:**
- Income tax (varies by country — in UAE there is none; in Singapore, Canada, UK there is)
- Social security or pension contributions
- Health insurance premiums
- Union dues (if applicable)
- Accommodation or meal deductions (if provided by employer)
- Loan repayments (if you took an agency loan for deployment)

**How to calculate your net pay:**
Ask your HR department for a detailed payslip breakdown before your first payday. Don't guess — calculate it on paper.

**Example:**
- Gross salary: ₱60,000/month equivalent
- Social contributions: -₱3,000
- Health insurance: -₱1,500
- Agency loan: -₱5,000
- **Net take-home: ₱50,500**

**Now build from this number** — not the gross. Many OFWs budget based on their gross salary and end up short every month because they forgot about deductions.

Write your net take-home number somewhere visible. This is your real income. Everything — savings, remittance, personal expenses — comes from this number.`
      },
      {
        day: 5,
        title: 'Set Up Your First Budget: The 50-30-20 Rule for OFWs',
        excerpt: 'Without a budget, every peso you earn abroad disappears faster than you expect. This simple rule changes everything.',
        tags: ['Budgeting', 'Planning'],
        readTime: '6 min',
        content: `The first and most important financial habit you need abroad is a budget. Not a complicated spreadsheet — just a simple rule you can follow every month.

**The OFW 50-30-20 Rule:**

**50% — Needs (Living Expenses)**
Your rent, food, transportation, utilities, phone plan. These are things you must pay to survive where you are.

**30% — Remittance + Family Support**
What you send home. This includes your family's monthly allowance, mortgage payments, tuition — anything for the Philippines.

**20% — Your Future (Savings + Investment)**
This is the most neglected part. Most OFWs send everything home and keep nothing for themselves. This 20% is YOUR future — emergency fund, investments, retirement.

**Why this matters:**
Many OFWs work 10-15 years abroad and come home with nothing because they had no personal savings plan. The family consumed everything. With the 20% rule, even at ₱50,000/month net, you save ₱10,000 every month = ₱120,000/year = ₱1.2M in 10 years — before any investment returns.

**How to implement it:**
On payday, immediately transfer 20% to a separate savings account before you do anything else. Pay yourself first. What's left after savings goes to living and remittance.

Start this on Day 1. Every month you delay costs you real money.`
      },
      {
        day: 6,
        title: 'The Cheapest and Fastest Way to Send Money Home',
        excerpt: 'Remittance fees can cost you thousands of pesos every year. Choosing the right channel saves real money.',
        tags: ['Remittance', 'Savings'],
        readTime: '5 min',
        content: `Remittance is the lifeline between you and your family back home. But the channel you use makes a huge difference in how much actually arrives.

**Compare these factors:**
- Transfer fee (flat fee per transaction)
- Exchange rate margin (hidden cost — most providers give worse rates than the mid-market rate)
- Speed of delivery (same day vs 1-3 days)
- Recipient pickup options (bank, cash pickup, mobile wallet)

**Most OFW-friendly options:**
- **Wise (TransferWise):** Near mid-market exchange rate, transparent fees
- **Remitly:** Competitive rates, fast delivery
- **GCash Padala:** Direct to GCash in Philippines
- **Western Union/MoneyGram:** Widely available but higher fees

**The real cost of bad choices:**
If you send ₱30,000 home monthly and pay 2% in hidden exchange rate margin, that's ₱600/month = ₱7,200/year lost — just on fees.

**Practical tip:** Never use your employer's recommended remittance service without comparing. They often have partnerships that don't benefit you.

Use comparison sites like Monito.com or RemittanceRates.com to find the best rate for your corridor (your country → Philippines) before each transfer.`
      },
      {
        day: 7,
        title: 'Your First Week Review: Did You Do These 6 Things?',
        excerpt: 'A quick checklist to make sure your first week abroad sets the right financial foundation.',
        tags: ['Checklist', 'Planning'],
        readTime: '3 min',
        content: `If you've been following this series, here's your Week 1 checklist:

**✅ Day 1:** Read your employment contract fully
**✅ Day 2:** Registered with the Philippine Embassy
**✅ Day 3:** Opened a local bank account
**✅ Day 4:** Calculated your exact net take-home pay
**✅ Day 5:** Set up your 50-30-20 budget rule
**✅ Day 6:** Found the best remittance channel for your route

**How did you do?**

If you missed any of these, it's not too late. This week's lessons are the foundation. Without them, the next 93 days of lessons won't stick because you won't have a solid base to build on.

**What's coming in Week 2:**
We'll move into emergency fund building, understanding insurance requirements abroad, setting up a Philippine bank account, and having the important "money talk" with your family back home.

Share this series with a fellow OFW who just arrived. You might save them years of financial struggle.`
      },

      /* ── WEEK 2: Emergency Fund & Protection ────────────────── */
      { day: 8,  title: 'Why Your Emergency Fund Must Be Built Before You Send More Money Home', excerpt: 'Before you increase your family\'s allowance, you need 3 months of your OWN expenses saved. Here\'s why this isn\'t selfish — it\'s smart.', tags: ['Savings', 'Emergency Fund'], readTime: '5 min', content: '' },
      { day: 9,  title: 'Health Insurance Abroad: What Your Employer Covers and What It Doesn\'t', excerpt: 'Employer insurance is often minimal. Know the gaps before a medical emergency drains your savings.', tags: ['Insurance', 'Health'], readTime: '5 min', content: '' },
      { day: 10, title: 'Open a Philippine Bank Account Remotely', excerpt: 'Having a Philippine bank account is essential for receiving transfers and saving in pesos. You can open one from abroad.', tags: ['Banking', 'Philippines'], readTime: '4 min', content: '' },
      { day: 11, title: 'The Family Allowance Conversation You Need to Have Now', excerpt: 'Setting clear expectations with your family early prevents the most common OFW financial disaster: the bottomless remittance trap.', tags: ['Family', 'Remittance'], readTime: '6 min', content: '' },
      { day: 12, title: 'Understanding OFW Pag-IBIG Contributions from Abroad', excerpt: 'You can continue Pag-IBIG contributions while abroad — and you should. Here\'s how it works and why it matters for housing.', tags: ['Pag-IBIG', 'Benefits'], readTime: '5 min', content: '' },
      { day: 13, title: 'SSS for OFWs: Voluntary Membership and Why You Can\'t Skip It', excerpt: 'SSS is not just for employees in the Philippines. As an OFW, voluntary contributions protect you for sickness, disability, and retirement.', tags: ['SSS', 'Benefits'], readTime: '5 min', content: '' },
      { day: 14, title: 'Week 2 Review: Your Protection Foundation is Set', excerpt: 'By end of Week 2 you should have your emergency fund started, insurance gaps understood, and SSS/Pag-IBIG active.', tags: ['Checklist'], readTime: '3 min', content: '' },

      /* ── WEEK 3: Smart Saving Habits ────────────────────────── */
      { day: 15, title: 'Automate Your Savings So You Never Have to Think About It', excerpt: 'The biggest savings secret: remove willpower from the equation entirely by automating transfers on payday.', tags: ['Savings', 'Automation'], readTime: '4 min', content: '' },
      { day: 16, title: 'The OFW Lifestyle Trap: Why You\'re Spending More Than You Think', excerpt: 'Social pressure abroad causes many OFWs to overspend on food, gadgets, and remittances to impress people. Learn to spot it.', tags: ['Mindset', 'Budgeting'], readTime: '5 min', content: '' },
      { day: 17, title: 'How to Budget for Your Annual Vacation Home', excerpt: 'Going home is expensive: flights, gifts, parties. Budget for it monthly so it doesn\'t destroy your savings in one trip.', tags: ['Budgeting', 'Travel'], readTime: '4 min', content: '' },
      { day: 18, title: 'Understanding Exchange Rate Fluctuations and When to Send', excerpt: 'The peso-to-dollar rate changes daily. A simple strategy can help you send more home without changing how much you earn.', tags: ['Remittance', 'Exchange Rate'], readTime: '5 min', content: '' },
      { day: 19, title: 'Building a ₱100,000 Emergency Fund in 12 Months', excerpt: 'Step-by-step plan to build a 3-month emergency fund within your first year abroad — even on a modest salary.', tags: ['Savings', 'Emergency Fund'], readTime: '5 min', content: '' },
      { day: 20, title: 'The Debt You Must Clear Before Anything Else', excerpt: 'Agency loans, personal loans, and credit card debt are costing you more than you realize. Clear these first before investing.', tags: ['Debt', 'Priority'], readTime: '5 min', content: '' },
      { day: 21, title: 'Week 3 Review: Is Your Money Working for You Yet?', excerpt: 'Check your first month progress: emergency fund started, debt plan in place, savings automated.', tags: ['Checklist'], readTime: '3 min', content: '' },

      /* ── WEEK 4: Philippine Investments ─────────────────────── */
      { day: 22, title: 'Investing from Abroad: Where to Start as a Complete Beginner', excerpt: 'You don\'t need to understand everything to start investing. You just need to take the first step with a small amount.', tags: ['Investing', 'Beginner'], readTime: '6 min', content: '' },
      { day: 23, title: 'Philippine Stock Market 101 for OFWs', excerpt: 'How to open a PSE account from abroad, how Philippine stocks work, and why even ₱1,000 a month makes a real difference.', tags: ['Stocks', 'Investing'], readTime: '6 min', content: '' },
      { day: 24, title: 'UITF vs. Mutual Funds vs. Stocks: Which is Right for You?', excerpt: 'Three investment vehicles, three different risk profiles. Here\'s the simple framework to decide where to start.', tags: ['Investing', 'UITF'], readTime: '6 min', content: '' },
      { day: 25, title: 'What is VUL Insurance and Should OFWs Get It?', excerpt: 'Variable Universal Life insurance bundles protection with investment. It\'s popular among OFWs — but is it right for your situation?', tags: ['Insurance', 'VUL'], readTime: '6 min', content: '' },
      { day: 26, title: 'Real Estate Investing: Can You Buy Property While Abroad?', excerpt: 'Yes — OFWs can purchase Philippine real estate remotely through Special Power of Attorney. Here\'s how it works.', tags: ['Real Estate', 'Investing'], readTime: '6 min', content: '' },
      { day: 27, title: 'Dollar Cost Averaging: The Strategy That Removes All Guesswork', excerpt: 'You don\'t need to time the market. Investing a fixed amount every month automatically buys more when prices are low.', tags: ['Investing', 'Strategy'], readTime: '5 min', content: '' },
      { day: 28, title: 'Week 4 Review: Your Investment Foundation', excerpt: 'By the end of Month 1, you should have chosen at least one investment vehicle and made your first contribution.', tags: ['Checklist'], readTime: '3 min', content: '' },

      /* ── DAYS 29–50: Deeper Financial Topics ────────────────── */
      { day: 29, title: 'How to Talk to Your Family About Money Boundaries', excerpt: 'The hardest financial conversation OFWs must have — and how to have it without destroying relationships.', tags: ['Family', 'Mindset'], readTime: '6 min', content: '' },
      { day: 30, title: '30-Day Recap: Where You Should Be Financially Right Now', excerpt: 'A complete snapshot of what a financially healthy OFW should have accomplished in their first month abroad.', tags: ['Checklist', 'Milestone'], readTime: '5 min', content: '' },
      { day: 31, title: 'Understanding PhilHealth Benefits for OFWs', excerpt: 'As an OFW, you can maintain PhilHealth coverage for your family in the Philippines. Here\'s the process and why it\'s worth it.', tags: ['PhilHealth', 'Benefits'], readTime: '4 min', content: '' },
      { day: 32, title: 'How to Protect Your Savings from the "Emergency" Requests', excerpt: 'Every OFW faces this: family emergencies that seem to happen every month. A system to handle them without destroying your savings.', tags: ['Family', 'Boundaries'], readTime: '5 min', content: '' },
      { day: 33, title: 'Building Credit History Abroad', excerpt: 'Having a local credit history helps you access better financial products. How to build it responsibly from Day 1.', tags: ['Credit', 'Banking'], readTime: '4 min', content: '' },
      { day: 34, title: 'The Overseas Filipino Worker Act (RA 11641): Know Your Rights', excerpt: 'The law that protects you. Key provisions every OFW should know before accepting any overseas job.', tags: ['Legal', 'Rights'], readTime: '5 min', content: '' },
      { day: 35, title: 'How to Negotiate a Salary Increase After 6 Months', excerpt: 'Most OFWs never ask for more. A practical script and timing strategy for requesting a salary review abroad.', tags: ['Career', 'Income'], readTime: '5 min', content: '' },
      { day: 36, title: 'Setting Up a Family Business Back Home: Is Your Family Ready?', excerpt: 'Sending capital home for a family business is one of the highest-risk OFW investments. Here\'s how to do it smart.', tags: ['Business', 'Family'], readTime: '6 min', content: '' },
      { day: 37, title: 'Life Insurance for OFWs: Who Needs It and How Much', excerpt: 'Your family\'s financial security should not depend entirely on your continued ability to work. Life insurance changes that.', tags: ['Insurance', 'Protection'], readTime: '5 min', content: '' },
      { day: 38, title: 'The True Cost of Debt: Why Paying 2% Monthly Interest Destroys Wealth', excerpt: 'A 5-4-3 loan looks affordable until you calculate the total paid. The math that makes debt look terrifying — so you kill it faster.', tags: ['Debt', 'Math'], readTime: '5 min', content: '' },
      { day: 39, title: 'Why Your OWWA Membership is One of the Best Investments You Have', excerpt: 'OWWA benefits are underutilized by most OFWs. Education loans, reintegration programs, and emergency assistance are all available.', tags: ['OWWA', 'Benefits'], readTime: '5 min', content: '' },
      { day: 40, title: 'Halfway Check: 40 Days of Financial Discipline — How Are You Doing?', excerpt: 'A progress assessment. Are you saving? Investing? Or has lifestyle inflation already crept in?', tags: ['Checklist', 'Milestone'], readTime: '4 min', content: '' },
      { day: 41, title: 'Digital Wallets in the Philippines: GCash, Maya, and How to Use Them from Abroad', excerpt: 'Philippine digital wallets have transformed how OFW families receive and manage money. Here\'s how to set them up remotely.', tags: ['Technology', 'Remittance'], readTime: '4 min', content: '' },
      { day: 42, title: 'How Compound Interest Will Make You a Millionaire (If You Start Now)', excerpt: 'The math behind compound growth is simple — but its power is extraordinary. A ₱3,000/month investment at 8% annual return over 20 years.', tags: ['Investing', 'Compound'], readTime: '5 min', content: '' },
      { day: 43, title: 'Scams Targeting OFWs Abroad: How to Spot and Avoid Them', excerpt: 'Investment scams, fake employers, and loan sharks specifically target overseas workers. Real examples and how to stay safe.', tags: ['Safety', 'Scams'], readTime: '6 min', content: '' },
      { day: 44, title: 'How to Invest in Philippine Government Bonds from Abroad', excerpt: 'Retail Treasury Bonds and the PERA account give OFWs safe, government-backed investment options with tax advantages.', tags: ['Bonds', 'Government'], readTime: '5 min', content: '' },
      { day: 45, title: 'Understanding Your Work Visa and What Happens If You Lose Your Job', excerpt: 'In most countries, your visa is tied to your employer. Know what happens legally and financially if your job ends unexpectedly.', tags: ['Legal', 'Visa'], readTime: '6 min', content: '' },
      { day: 46, title: 'How to Build an Investment Portfolio with Just ₱5,000 a Month', excerpt: 'A practical allocation plan for OFWs with modest savings — spreading across stocks, bonds, and insurance.', tags: ['Portfolio', 'Investing'], readTime: '6 min', content: '' },
      { day: 47, title: 'Teaching Your Spouse or Parents to Handle Money Back Home', excerpt: 'The remittance is only as effective as the financial literacy of the person receiving it. How to guide your family from afar.', tags: ['Family', 'Education'], readTime: '5 min', content: '' },
      { day: 48, title: 'Foreign Currency Accounts: Should You Keep Savings in Dollars?', excerpt: 'Holding savings in a foreign currency has advantages and risks for OFWs. The strategy depends on your long-term plan.', tags: ['Banking', 'Currency'], readTime: '5 min', content: '' },
      { day: 49, title: 'The Part-Time Income Mindset: How to Earn More Without a Second Job', excerpt: 'Network marketing, digital reselling, and affiliate income are legitimate options for OFWs — if approached correctly.', tags: ['Side Income', 'Business'], readTime: '6 min', content: '' },
      { day: 50, title: 'Halfway There: 50-Day Financial Health Report Card', excerpt: 'Grade yourself honestly. Savings rate, investment status, debt reduction, family financial boundary setting.', tags: ['Checklist', 'Milestone'], readTime: '5 min', content: '' },

      /* ── DAYS 51–70: Investing & Building Wealth ──────────────── */
      { day: 51, title: 'Real Estate SPA: How to Buy Philippine Property Without Going Home', excerpt: 'A Special Power of Attorney gives your trusted representative legal power to sign real estate documents on your behalf.', tags: ['Real Estate', 'Legal'], readTime: '5 min', content: '' },
      { day: 52, title: 'Stock Market Timing vs. Time IN the Market', excerpt: 'Trying to time the market is why most small investors fail. Here\'s the strategy that consistently beats timing.', tags: ['Stocks', 'Strategy'], readTime: '5 min', content: '' },
      { day: 53, title: 'Understanding Inflation and Why Your Savings Are Losing Value', excerpt: 'Keeping money in a regular savings account at 1% interest when inflation is 5% means you\'re getting poorer. The solution.', tags: ['Investing', 'Inflation'], readTime: '5 min', content: '' },
      { day: 54, title: 'OFW PERA Account: The Tax-Free Retirement Vehicle You\'re Not Using', excerpt: 'The Personal Equity and Retirement Account (PERA) gives OFWs double tax benefits. Almost no one takes advantage of it.', tags: ['PERA', 'Retirement'], readTime: '5 min', content: '' },
      { day: 55, title: 'How to Research Philippine Stocks Like a Pro', excerpt: 'You don\'t need a finance degree. Three simple metrics that tell you whether a Philippine stock is worth buying.', tags: ['Stocks', 'Research'], readTime: '6 min', content: '' },
      { day: 56, title: 'Diversification: Why You Should Never Put All Your Money in One Place', excerpt: 'The most important rule in investing — explained for someone who has never invested before.', tags: ['Investing', 'Diversification'], readTime: '5 min', content: '' },
      { day: 57, title: 'Network Marketing as a Side Business: Honest Assessment', excerpt: 'The good, the bad, and the realistic. Can network marketing truly supplement OFW income? What the numbers actually show.', tags: ['Side Income', 'Business'], readTime: '6 min', content: '' },
      { day: 58, title: 'Insurance Claims: What to Do When Something Goes Wrong', excerpt: 'Filing an insurance claim from abroad is stressful. A step-by-step guide so you know exactly what to do before you need it.', tags: ['Insurance', 'Claims'], readTime: '5 min', content: '' },
      { day: 59, title: 'Building an Emergency Fund for Your Philippine Business', excerpt: 'If you have or plan to start a business in the Philippines, it needs its OWN emergency fund — separate from your personal savings.', tags: ['Business', 'Emergency Fund'], readTime: '4 min', content: '' },
      { day: 60, title: '60 Days In: Review Your Budget and Adjust', excerpt: 'After 60 days, review what\'s actually happening vs. what you planned. Adjust your budget based on reality — not wishful thinking.', tags: ['Checklist', 'Budgeting'], readTime: '4 min', content: '' },
      { day: 61, title: 'How to Handle OFW Taxes in Countries with Income Tax', excerpt: 'If you\'re in Singapore, Canada, UK, or other tax-requiring countries, here\'s what OFWs need to file and how to minimize legally.', tags: ['Taxes', 'Legal'], readTime: '6 min', content: '' },
      { day: 62, title: 'Peso Cost Averaging in Philippine Blue Chip Stocks', excerpt: 'A simple monthly investing strategy focused on the most stable large Philippine companies — for long-term wealth building.', tags: ['Stocks', 'Strategy'], readTime: '5 min', content: '' },
      { day: 63, title: 'How to Save for Your Children\'s Education from Abroad', excerpt: 'The most expensive investment a Filipino parent makes. How to start an education fund from day one and what instruments to use.', tags: ['Education', 'Family'], readTime: '5 min', content: '' },
      { day: 64, title: 'Side Hustle Ideas That Actually Work for OFWs', excerpt: 'Dropshipping, digital products, tutoring, affiliate marketing — which side businesses realistically work for people working full-time abroad.', tags: ['Side Income', 'Business'], readTime: '6 min', content: '' },
      { day: 65, title: 'The Psychology of Money: Why We Self-Sabotage Our Own Finances', excerpt: 'Understanding the emotional triggers that cause OFWs to overspend, under-save, and make bad financial decisions — and how to override them.', tags: ['Mindset', 'Psychology'], readTime: '6 min', content: '' },
      { day: 66, title: 'Understanding REITs: Investing in Philippine Real Estate Without Buying Property', excerpt: 'Real Estate Investment Trusts let you invest in commercial real estate with as little as ₱1,000 — with dividends paid quarterly.', tags: ['REITs', 'Investing'], readTime: '5 min', content: '' },
      { day: 67, title: 'Your 5-Year Financial Plan: What Should You Have by the Time You Go Home?', excerpt: 'If you\'re planning a 5-year contract, here\'s the specific financial targets you should hit for each year — savings, investment, and income.', tags: ['Planning', 'Goals'], readTime: '6 min', content: '' },
      { day: 68, title: 'How to Get a Housing Loan as an OFW in the Philippines', excerpt: 'Pag-IBIG housing loans and bank housing loans for OFWs — requirements, how much you can borrow, and the SPA process.', tags: ['Real Estate', 'Loans'], readTime: '6 min', content: '' },
      { day: 69, title: 'The Difference Between an Asset and a Liability (The #1 Financial Concept)', excerpt: 'Robert Kiyosaki\'s most important lesson — simplified for OFWs. Why your car and your house may not be what you think they are.', tags: ['Mindset', 'Financial Literacy'], readTime: '5 min', content: '' },
      { day: 70, title: '70 Days In: Are You Ahead or Behind Your Goals?', excerpt: 'A data-driven self-assessment for Day 70. How to calculate your personal net worth and what the number means for your future.', tags: ['Checklist', 'Milestone'], readTime: '5 min', content: '' },

      /* ── DAYS 71–90: Building Income & Future Planning ────────── */
      { day: 71, title: 'How to Build Passive Income Streams While Working Abroad', excerpt: 'Passive income doesn\'t mean no work — it means income that doesn\'t require your constant active presence. How OFWs create it.', tags: ['Passive Income', 'Strategy'], readTime: '6 min', content: '' },
      { day: 72, title: 'Sending Your Kids to School with a Full Scholarship: CHED and DOST Grants for OFW Families', excerpt: 'Free college education is possible through government scholarship programs specifically designed for children of OFWs.', tags: ['Education', 'Benefits'], readTime: '5 min', content: '' },
      { day: 73, title: 'Franchise vs. Traditional Business: Which is Better for Returning OFWs?', excerpt: 'When you go home, will you start a business? Compare franchise opportunities vs. starting from scratch — with real Philippine numbers.', tags: ['Business', 'Returning'], readTime: '6 min', content: '' },
      { day: 74, title: 'How to Protect Your Business Idea Before Launching It', excerpt: 'Business registration, intellectual property basics, and how to legally protect what you\'re building from abroad.', tags: ['Business', 'Legal'], readTime: '5 min', content: '' },
      { day: 75, title: 'The 75-Day Money Review: Your Financial Snapshot', excerpt: 'Calculate your progress: total saved, total invested, debt remaining, net worth estimate. Then set targets for the next 25 days.', tags: ['Checklist', 'Milestone'], readTime: '4 min', content: '' },
      { day: 76, title: 'How to Train a Trusted Person to Manage Your Philippine Finances', excerpt: 'Most OFWs discover the hard way that not everyone can be trusted with money. How to choose, train, and monitor a financial proxy.', tags: ['Family', 'Trust'], readTime: '6 min', content: '' },
      { day: 77, title: 'Digital Nomad Skills That OFWs Can Learn to Earn More Online', excerpt: 'Freelancing skills that complement your OFW job — and could eventually replace it. Graphic design, virtual assistance, video editing.', tags: ['Skills', 'Income'], readTime: '5 min', content: '' },
      { day: 78, title: 'What is a "Financial Plan" and How Do You Write One?', excerpt: 'A simple one-page financial plan template for OFWs — covering current status, goals, strategy, and timeline.', tags: ['Planning', 'Goals'], readTime: '6 min', content: '' },
      { day: 79, title: 'How to Build a Personal Brand Online While Working Abroad', excerpt: 'Your OFW experience is valuable content. Building an audience online opens doors to income opportunities that transcend geography.', tags: ['Social Media', 'Brand'], readTime: '5 min', content: '' },
      { day: 80, title: 'The Retirement Calculation: How Much Money Do You Actually Need to Retire?', excerpt: 'Most Filipinos have no idea how much retirement costs. The simple math that shows you your exact retirement target number.', tags: ['Retirement', 'Planning'], readTime: '6 min', content: '' },
      { day: 81, title: 'How Inflation Affects Your Philippine Retirement Plan', excerpt: '₱1 million sounds like a lot today. In 20 years it\'s worth much less. How to calculate a retirement fund that actually holds value.', tags: ['Retirement', 'Inflation'], readTime: '5 min', content: '' },
      { day: 82, title: 'Wills and Estate Planning for OFWs: What Happens to Your Money When You\'re Gone?', excerpt: 'No one likes to think about this — but without a will, Philippine inheritance law may distribute your assets in ways you never intended.', tags: ['Legal', 'Estate'], readTime: '6 min', content: '' },
      { day: 83, title: 'How to Start Investing in US Stocks from the Philippines', excerpt: 'Philippine brokers like First Metro Sec and ATRAM now offer access to US ETFs. How OFWs and their families can buy global investments.', tags: ['Stocks', 'Global'], readTime: '5 min', content: '' },
      { day: 84, title: 'The Debt Snowball vs. Debt Avalanche Method', excerpt: 'Two strategies for paying off multiple debts. One is mathematically optimal, the other is psychologically easier. Which fits you?', tags: ['Debt', 'Strategy'], readTime: '5 min', content: '' },
      { day: 85, title: 'How to Teach Your Teenage Children Financial Literacy from Abroad', excerpt: 'Financial habits form in the teenage years. Practical ways to teach your kids money management even when you\'re thousands of miles away.', tags: ['Family', 'Education'], readTime: '5 min', content: '' },
      { day: 86, title: '5 Financial Mistakes OFWs Make After 1 Year Abroad', excerpt: 'The patterns that emerge after the first year — complacency, lifestyle inflation, bad loans. Knowing them in advance lets you avoid them.', tags: ['Mistakes', 'Mindset'], readTime: '5 min', content: '' },
      { day: 87, title: 'Understanding the Philippine Economy: Why Macro Matters to Your Investments', excerpt: 'BSP interest rates, peso depreciation, inflation — how macro forces directly affect your Philippine stock and real estate investments.', tags: ['Economics', 'Investing'], readTime: '6 min', content: '' },
      { day: 88, title: 'Building a Network That Supports Your Financial Goals', excerpt: 'Your network is your most underrated financial asset. How to deliberately build relationships with people who accelerate your goals.', tags: ['Network', 'Mindset'], readTime: '5 min', content: '' },
      { day: 89, title: 'Crypto for OFWs: The Honest Assessment', excerpt: 'Cryptocurrency is volatile and not for everyone. An honest look at whether crypto belongs in an OFW investment portfolio — and how much.', tags: ['Crypto', 'Investing'], readTime: '6 min', content: '' },
      { day: 90, title: '90 Days In: The 90-Day Financial Transformation Review', excerpt: 'If you\'ve followed this series, here\'s a complete picture of what you should have built in 90 days — and what comes next.', tags: ['Checklist', 'Milestone'], readTime: '5 min', content: '' },

      /* ── DAYS 91–100: Mastery & Coming Home Plan ──────────────── */
      { day: 91, title: 'Building Multiple Income Streams Before You Go Home', excerpt: 'Before you leave your overseas job, make sure you have at least 2 sources of income waiting for you in the Philippines.', tags: ['Income', 'Planning'], readTime: '6 min', content: '' },
      { day: 92, title: 'How to Use Your OFW Experience to Get a Better Job Locally', excerpt: 'Your overseas skills and experience command a premium in the Philippine job market. How to position yourself correctly.', tags: ['Career', 'Returning'], readTime: '5 min', content: '' },
      { day: 93, title: 'Reintegration Programs: Free Money and Support for Returning OFWs', excerpt: 'OWWA, DOLE, and other agencies provide free capital assistance, training, and livelihood programs for OFWs coming home.', tags: ['OWWA', 'Reintegration'], readTime: '5 min', content: '' },
      { day: 94, title: 'How to Evaluate a Business Opportunity Before Investing', excerpt: 'A simple 5-question framework to evaluate any business opportunity — preventing you from losing your savings to bad ventures.', tags: ['Business', 'Investing'], readTime: '5 min', content: '' },
      { day: 95, title: 'Your Investment Portfolio at Day 95: What It Should Look Like', excerpt: 'A model portfolio for someone who has been saving and investing for 95 days — with exact allocation percentages.', tags: ['Portfolio', 'Investing'], readTime: '5 min', content: '' },
      { day: 96, title: 'How to Tell If You\'re Ready to Go Home for Good', excerpt: 'The financial checklist that tells you whether it\'s time to come home — or whether leaving now would be a financial mistake.', tags: ['Planning', 'Returning'], readTime: '6 min', content: '' },
      { day: 97, title: 'Tax Obligations When You Return to the Philippines Permanently', excerpt: 'When you stop being an OFW, your tax status changes. What you need to file, when, and how to stay compliant.', tags: ['Taxes', 'Returning'], readTime: '5 min', content: '' },
      { day: 98, title: 'The Millionaire OFW Blueprint: What the Top 5% Do Differently', excerpt: 'A study of OFWs who came home wealthy — the habits, decisions, and mindsets that separated them from the majority.', tags: ['Mindset', 'Success'], readTime: '7 min', content: '' },
      { day: 99, title: 'Passing the Baton: Teaching Your Family to Continue Building Wealth', excerpt: 'Wealth built by one person can be destroyed in one generation. How to build financial literacy into your family culture.', tags: ['Family', 'Legacy'], readTime: '6 min', content: '' },
      { day: 100, title: 'Day 100: You Are No Longer the OFW Who Arrived Unprepared', excerpt: 'A celebration and a challenge. Look back at how far you\'ve come — then set your next 100-day goal.', tags: ['Milestone', 'Motivation'], readTime: '5 min', content: '' },
    ]
  },

  /* ================================================================
     SERIES 2 — OFW MONEY MASTERCLASS
     Add more series below following the same structure
     ================================================================
  {
    id: 'money-masterclass',
    title: 'OFW Money Masterclass',
    subtitle: 'Deep dives into investing, insurance, and building wealth',
    description: '...',
    emoji: '🎓',
    accentColor: '#C8900A',
    accentBg: 'rgba(200,144,10,0.07)',
    totalPosts: 30,
    posts: []
  },
  ================================================================ */

];
