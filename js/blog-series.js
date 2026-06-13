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
     SERIES 2 — SMART REMITTANCE GUIDE
  ================================================================ */
  {
    id: 'smart-remittance',
    title: 'Smart Remittance Guide',
    subtitle: 'Send more money home — by losing less in fees and bad exchange rates',
    description: 'Every peso lost to remittance fees is money your family never sees. This series teaches you to compare platforms, time your transfers, and use referral programs to maximize what arrives in the Philippines.',
    cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '💸',
    accentColor: '#0284c7',
    accentBg: 'rgba(2,132,199,0.07)',
    totalPosts: 15,
    posts: [
      { day:1, title:'Why Remittance Fees Are Silently Stealing From Your Family', excerpt:'The difference between a 1% and 4% remittance fee on ₱100K/month is ₱36,000 a year. A complete breakdown of what you're losing.', tags:['Remittance','Fees'], readTime:'5 min', content:`Every time you send money home, a portion disappears in fees and unfavorable exchange rates. Most OFWs never calculate exactly how much this costs them over a year — or a career.

**The math:**
- If you send AED 3,000 (about ₱46,000) every month
- At a 3% fee + bad exchange rate: you lose roughly ₱1,380/month
- That's ₱16,560/year — enough for a laptop, a school year's tuition, or 3 months of groceries

**The main fee types:**
1. **Flat transaction fee** (e.g., AED 15 per transfer)
2. **Exchange rate markup** (the hidden one — companies quietly set exchange rates 1-3% below the real rate)
3. **Recipient charges** (some banks charge your family to receive money)

**The best platforms consistently:**
- TapTap Send — low fees, competitive rates, good for UAE to Philippines
- Wise (TransferWise) — uses the real mid-market rate, small transparent fee
- GCash padala — direct to GCash wallet, fast
- Remitly — good promotions for new users

**Action step:** Next time you send money, go to Google and type "1 AED to PHP" to see the real exchange rate. Then compare what your remittance app offers. The gap is your markup.` },
      { day:2, title:'TapTap Send Review — The App OFWs in UAE Are Switching To', excerpt:'Why thousands of UAE-based Filipino workers are moving from traditional remittance services to TapTap Send.', tags:['TapTap','Review'], readTime:'5 min', content:'' },
      { day:3, title:'How to Time Your Remittances to Get Better Exchange Rates', excerpt:'The Philippine peso fluctuates by 2-4% in a month. Strategic timing and peso-cost averaging can save your family tens of thousands per year.', tags:['Exchange Rate','Strategy'], readTime:'5 min', content:'' },
      { day:4, title:'GCash vs Bank Transfer — Which is Better for Your Family?', excerpt:'Your recipient\'s setup matters. If your family has GCash, a direct wallet transfer beats bank deposit in speed, cost, and convenience.', tags:['GCash','Digital Wallet'], readTime:'4 min', content:'' },
      { day:5, title:'Referral Programs: How to Get Paid to Send Money Home', excerpt:'TapTap Send, Remitly, and Wise all have referral programs. Using them correctly earns you free transfers and cash bonuses.', tags:['Referral','Savings'], readTime:'4 min', content:'' },
      { day:6, title:'Setting Up a Monthly Remittance Schedule That Protects Your Family', excerpt:'Lump sum vs. weekly transfers — the strategy that balances your family\'s cash flow with the best exchange rates.', tags:['Planning','Remittance'], readTime:'5 min', content:'' },
      { day:7, title:'How to Teach Your Family Not to Spend All the Remittance Immediately', excerpt:'The remittance arrives. By day 5, it\'s gone. How to set up a budget system with your family back home — from abroad.', tags:['Family','Budget'], readTime:'5 min', content:'' },
      { day:8, title:'Paano i-Protect ang Iyong Pera sa Buwanang Padala', excerpt:'Isang simpleng sistema ng budget para sa mga tatanggap ng remittance — para hindi masayang ang ipinaghirapan mo.', tags:['Tagalog','Budget'], readTime:'4 min', content:'' },
      { day:9, title:'The 50-30-20 Remittance Split Your Family Should Know', excerpt:'Divide every remittance into living expenses (50%), savings (30%), and investment/emergency fund (20%) before spending anything.', tags:['Budget','Family'], readTime:'4 min', content:'' },
      { day:10, title:'International Wire Transfers: When It Makes Sense to Use Your Bank', excerpt:'Sometimes bank wires are the safest option — for large amounts, for sending to accounts without apps, or for security.', tags:['Banking','Wire'], readTime:'5 min', content:'' },
      { day:11, title:'What Happens If Your Remittance Goes Missing?', excerpt:'Step-by-step process to track a failed transfer, escalate with the provider, and protect yourself with records.', tags:['Safety','Troubleshooting'], readTime:'5 min', content:'' },
      { day:12, title:'Tax Implications of Remittances: What You Need to Know', excerpt:'Philippines does not tax remittances received — but this is worth understanding clearly. What the rules actually say.', tags:['Tax','Legal'], readTime:'4 min', content:'' },
      { day:13, title:'Sending Money in an Emergency: Fastest Options When Time Matters', excerpt:'Family medical emergency, calamity, or urgent need. The fastest ways to get money to the Philippines within hours.', tags:['Emergency','Speed'], readTime:'4 min', content:'' },
      { day:14, title:'How to Build a Family Emergency Fund Using Your Remittances', excerpt:'Before the next emergency, set up a dedicated fund. How much, where to keep it, and how to make it "untouchable."', tags:['Emergency Fund','Savings'], readTime:'5 min', content:'' },
      { day:15, title:'The Complete OFW Remittance Toolkit: Apps, Tips, and Best Practices', excerpt:'A summary of the best remittance apps, timing strategies, family budget templates, and emergency protocols — all in one guide.', tags:['Summary','Toolkit'], readTime:'7 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 3 — STOCK MARKET 101 FOR OFWs
  ================================================================ */
  {
    id: 'stock-market-101',
    title: 'Stock Market 101 for OFWs',
    subtitle: 'Grow your money while you sleep — even from thousands of miles away',
    description: 'You don\'t need to be rich to invest in the stock market. You need to understand how it works. This beginner series walks you from zero — what stocks are, how to open an account from abroad, and how to build a long-term portfolio as an OFW.',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '📈',
    accentColor: '#059669',
    accentBg: 'rgba(5,150,105,0.07)',
    totalPosts: 20,
    posts: [
      { day:1, title:'What Is the Stock Market? A Plain-Language Explanation for OFWs', excerpt:'No jargon. No finance degree required. The stock market explained using an analogy every Filipino will understand.', tags:['Basics','Beginner'], readTime:'6 min', content:'' },
      { day:2, title:'Why OFWs Are Actually Perfectly Positioned to Invest', excerpt:'You have foreign currency, lower living costs than locals, and time. This combination makes OFWs ideal investors.', tags:['OFW','Mindset'], readTime:'5 min', content:'' },
      { day:3, title:'PSE vs. US Stocks: Which Market Should an OFW Invest In?', excerpt:'Philippine Stock Exchange or S&P 500 ETFs? The honest comparison — and why many OFWs do both.', tags:['PSE','US Stocks'], readTime:'6 min', content:'' },
      { day:4, title:'How to Open a COL Financial Account from Abroad', excerpt:'Step-by-step guide to opening the most popular Philippine stock broker account while working overseas.', tags:['COL','Account Setup'], readTime:'5 min', content:'' },
      { day:5, title:'What Are ETFs and Why Are They Perfect for Beginners?', excerpt:'Exchange-Traded Funds let you own hundreds of companies with one investment. The ideal starting point for new investors.', tags:['ETF','Beginner'], readTime:'5 min', content:'' },
      { day:6, title:'UITF vs. Stocks vs. ETF: Which Is Right for You?', excerpt:'Three common Philippine investment vehicles compared — liquidity, risk, returns, and minimum amounts.', tags:['UITF','Comparison'], readTime:'6 min', content:'' },
      { day:7, title:'How Much Should You Invest Every Month as an OFW?', excerpt:'The percentage of income rule — and how to work backward from your retirement goal to your monthly investment amount.', tags:['Amount','Planning'], readTime:'5 min', content:'' },
      { day:8, title:'Cost Averaging: The Investment Strategy That Removes Emotion', excerpt:'Don\'t try to time the market. Invest the same amount every month regardless of price — and watch it work over time.', tags:['Cost Averaging','Strategy'], readTime:'5 min', content:'' },
      { day:9, title:'5 Philippine Blue Chip Stocks Every OFW Should Know', excerpt:'SM, Ayala, BDO, PLDT, Jollibee — why these companies have consistently rewarded long-term investors.', tags:['Blue Chip','Philippines'], readTime:'6 min', content:'' },
      { day:10, title:'How to Read a Stock Chart: The Basics (Without Going Crazy)', excerpt:'You don\'t need to master technical analysis. Just understand price history, volume, and basic trend lines.', tags:['Charts','Analysis'], readTime:'6 min', content:'' },
      { day:11, title:'Dividends: Getting Paid Just for Owning Stocks', excerpt:'Some stocks pay you quarterly just for holding them. Dividend investing strategy for OFWs who want passive income.', tags:['Dividends','Passive'], readTime:'5 min', content:'' },
      { day:12, title:'The Biggest Stock Market Mistakes Beginners Make', excerpt:'Panic selling, following tips, putting all money in one stock — the mistakes that destroy portfolios and how to avoid them.', tags:['Mistakes','Mindset'], readTime:'5 min', content:'' },
      { day:13, title:'How to Invest in US Stocks from the Philippines', excerpt:'ATRAM, First Metro, and international brokers like Interactive Brokers — how to access the S&P 500 from abroad.', tags:['US Stocks','Global'], readTime:'6 min', content:'' },
      { day:14, title:'Crypto vs. Stocks: An Honest Comparison', excerpt:'Both can make you rich. Both can make you lose everything. The honest risk profile of each — and how they fit in a portfolio.', tags:['Crypto','Comparison'], readTime:'6 min', content:'' },
      { day:15, title:'Tax on Stock Market Gains: What Filipino Investors Need to Know', excerpt:'Capital gains tax, final withholding tax on dividends, and what records you need to keep. Simple breakdown.', tags:['Tax','Philippines'], readTime:'5 min', content:'' },
      { day:16, title:'Building Your First Portfolio: A Step-by-Step Blueprint', excerpt:'From zero to a diversified beginner portfolio — with exact allocations, which accounts to use, and how to automate.', tags:['Portfolio','Blueprint'], readTime:'7 min', content:'' },
      { day:17, title:'How Market Crashes Actually Help Long-Term Investors', excerpt:'When markets fall, new investors panic. Smart investors see a sale. The psychology of market downturns.', tags:['Crash','Mindset'], readTime:'5 min', content:'' },
      { day:18, title:'IMG International and Investment-Linked Insurance: Are They Worth It?', excerpt:'VUL insurance products combine life coverage with investment. The honest assessment — when they make sense for OFWs.', tags:['IMG','VUL'], readTime:'6 min', content:'' },
      { day:19, title:'Tracking Your Portfolio: Apps and Methods That Keep You Informed', excerpt:'How to monitor your investments without obsessing over daily movements — the right check-in frequency and tools.', tags:['Tools','Tracking'], readTime:'4 min', content:'' },
      { day:20, title:'The 20-Year OFW Investment Plan: From First Investment to Retirement', excerpt:'A realistic 20-year projection for an OFW investing consistently — showing the power of compounding returns over time.', tags:['Retirement','Planning'], readTime:'7 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 4 — INSURANCE SIMPLIFIED
  ================================================================ */
  {
    id: 'insurance-simplified',
    title: 'Insurance Simplified',
    subtitle: 'Protect your family before something bad forces you to wish you had',
    description: 'Insurance is not a luxury — it\'s the foundation of financial security. This series explains every type of insurance an OFW needs, in plain Tagalog and English, so you can make informed decisions without a finance degree.',
    cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '🛡️',
    accentColor: '#3b82f6',
    accentBg: 'rgba(59,130,246,0.07)',
    totalPosts: 10,
    posts: [
      { day:1, title:'Why Every OFW Needs Life Insurance — Even If You\'re Young and Healthy', excerpt:'You didn\'t come abroad to leave your family with nothing. Life insurance is the promise you make to them before anything happens.', tags:['Life Insurance','Basics'], readTime:'5 min', content:'' },
      { day:2, title:'Term Insurance vs. VUL Insurance: The Complete Comparison', excerpt:'Term is pure protection. VUL combines insurance with investment. Which is right depends on your goals and budget.', tags:['Term','VUL'], readTime:'6 min', content:'' },
      { day:3, title:'How Much Life Insurance Coverage Do You Actually Need?', excerpt:'The "10x annual income" rule is a starting point. A more precise formula based on your family\'s actual financial needs.', tags:['Coverage','Calculation'], readTime:'5 min', content:'' },
      { day:4, title:'IMG International: Financial Literacy + Insurance for OFWs', excerpt:'Why IMG\'s approach — combining financial education with insurance products — works well for OFWs building long-term wealth.', tags:['IMG','Partner'], readTime:'5 min', content:'' },
      { day:5, title:'Health Insurance for OFWs: Your Options Abroad and Back Home', excerpt:'Employer-provided coverage abroad vs. Philippine-based health insurance. The gap most OFWs don\'t realize exists.', tags:['Health','HMO'], readTime:'6 min', content:'' },
      { day:6, title:'SSS, Pag-IBIG, and PhilHealth: Keeping These Active While Abroad', excerpt:'The three government contributions that protect your future — and exactly how to pay them as a voluntary member from abroad.', tags:['SSS','PhilHealth','Pag-IBIG'], readTime:'5 min', content:'' },
      { day:7, title:'What Happens to Your Insurance If You Come Home Early?', excerpt:'Job loss, repatriation, early return — how your coverage changes and what you need to do to maintain protection.', tags:['Repatriation','Coverage'], readTime:'5 min', content:'' },
      { day:8, title:'Insurance for Your Family Back in the Philippines', excerpt:'Protecting the people who depend on your remittance — affordable family health insurance options in the Philippines.', tags:['Family','Philippines'], readTime:'5 min', content:'' },
      { day:9, title:'Accidental Death and Disability Insurance: The Coverage Most OFWs Miss', excerpt:'If an accident prevents you from working, life insurance doesn\'t pay out. ADD coverage fills this critical gap.', tags:['Accident','Disability'], readTime:'5 min', content:'' },
      { day:10, title:'Your Complete Insurance Checklist as an OFW', excerpt:'A printable checklist covering every type of insurance you need — with recommended coverage amounts and Philippine providers.', tags:['Checklist','Summary'], readTime:'6 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 5 — REAL ESTATE ROADMAP
  ================================================================ */
  {
    id: 'real-estate-roadmap',
    title: 'Real Estate Roadmap',
    subtitle: 'Build tangible wealth in the Philippines while you work abroad',
    description: 'Real estate is the investment most Filipinos understand and trust. But OFWs face unique challenges — buying from abroad, managing property remotely, choosing between locations. This series navigates all of it.',
    cover: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '🏠',
    accentColor: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.07)',
    totalPosts: 15,
    posts: [
      { day:1, title:'Should OFWs Buy Real Estate or Invest in Stocks First?', excerpt:'The classic debate. The honest answer depends on your income, family situation, and how soon you plan to return.', tags:['Strategy','Comparison'], readTime:'6 min', content:'' },
      { day:2, title:'How to Buy a Property in the Philippines While Living Abroad', excerpt:'A step-by-step guide to purchasing Philippine real estate — from choosing a developer to signing documents via SPA.', tags:['Buying','Process'], readTime:'7 min', content:'' },
      { day:3, title:'Vista Land Properties: Why OFWs Choose This Developer', excerpt:'Vista Land\'s track record, payment terms, OFW-friendly financing, and the specific projects available to Filipino workers abroad.', tags:['Vista Land','Partner'], readTime:'5 min', content:'' },
      { day:4, title:'Condo vs. House and Lot: What\'s the Better Investment?', excerpt:'Condos are cheaper upfront but have association dues. House and lot appreciates land value. The full comparison.', tags:['Condo','House'], readTime:'6 min', content:'' },
      { day:5, title:'How to Evaluate a Real Estate Developer\'s Reputation', excerpt:'Delivery record, HLURB registration, financing terms, and community reviews — how to assess a developer before buying.', tags:['Due Diligence','Developer'], readTime:'5 min', content:'' },
      { day:6, title:'Pag-IBIG Housing Loan for OFWs: The Complete Guide', excerpt:'Pag-IBIG offers OFW housing loans at competitive rates. How to apply, qualify, and maximize this underused benefit.', tags:['Pag-IBIG','Loan'], readTime:'6 min', content:'' },
      { day:7, title:'Special Power of Attorney: How to Buy Property Without Being There', excerpt:'A notarized SPA lets someone you trust handle property transactions in your place. What it covers and how to set it up safely.', tags:['SPA','Legal'], readTime:'5 min', content:'' },
      { day:8, title:'Real Estate as a Rental Business: Managing Property Remotely', excerpt:'OFWs who buy rental properties need systems to manage tenants, repairs, and income from abroad. The practical playbook.', tags:['Rental','Passive Income'], readTime:'6 min', content:'' },
      { day:9, title:'Becoming a Real Estate Agent as an OFW: Extra Income from Referrals', excerpt:'Vista Land and other developers pay commissions to accredited agents. How to get licensed and earn from property referrals.', tags:['Agent','Commission'], readTime:'5 min', content:'' },
      { day:10, title:'Which Philippine Cities Offer the Best Real Estate Appreciation?', excerpt:'Metro Manila, Cebu, Davao, Clark — the cities where property values are rising fastest and why.', tags:['Location','Investment'], readTime:'6 min', content:'' },
      { day:11, title:'Real Estate Taxes in the Philippines: What Buyers Need to Know', excerpt:'Documentary stamp tax, transfer tax, registration fees, and annual real property tax — the costs of buying and owning property.', tags:['Tax','Legal'], readTime:'5 min', content:'' },
      { day:12, title:'Pre-Selling vs. Ready for Occupancy: Which Should You Buy?', excerpt:'Pre-selling properties are cheaper but riskier. RFO units are ready to use or rent immediately. The tradeoffs explained.', tags:['Pre-selling','RFO'], readTime:'5 min', content:'' },
      { day:13, title:'How to Finance Real Estate When You Don\'t Have Enough Savings', excerpt:'Developer financing, bank loans, Pag-IBIG, and co-borrowing — multiple paths to owning Philippine real estate as an OFW.', tags:['Financing','Loans'], readTime:'6 min', content:'' },
      { day:14, title:'Foreclosed Properties: Opportunities and Dangers for OFW Investors', excerpt:'Bank foreclosures sell cheap but come with complications. How to evaluate foreclosed properties safely.', tags:['Foreclosure','Risk'], readTime:'6 min', content:'' },
      { day:15, title:'Your OFW Real Estate Portfolio: From First Property to Multiple Assets', excerpt:'The long-term game plan — how to grow from one property to a portfolio that generates passive income in retirement.', tags:['Portfolio','Retirement'], readTime:'7 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 6 — SIDE HUSTLE FROM ABROAD
  ================================================================ */
  {
    id: 'side-hustle-abroad',
    title: 'Side Hustle from Abroad',
    subtitle: 'Kumita nang higit pa — kahit layo ka sa Pilipinas',
    description: 'Your overseas salary is your starting point, not your ceiling. This series shows you the most practical side income streams for OFWs — from selling health products online to building a digital business from anywhere.',
    cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '💼',
    accentColor: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.07)',
    totalPosts: 12,
    posts: [
      { day:1, title:'Bakit Kailangan ng OFW ng Side Income (Hindi Ito Optional)', excerpt:'Ang trabaho sa abroad ay kontrata lang. Ang side income ay pananggalang sa hinaharap. Narito kung bakit mahalaga ito sa lahat ng OFW.', tags:['Mindset','Income'], readTime:'5 min', content:'' },
      { day:2, title:'JC Premiere: Selling Health Products Online as an OFW', excerpt:'No physical store needed. Sell JC Premiere supplements and wellness products via Viber, Facebook, and Lazada — from anywhere in the world.', tags:['JC Premiere','Online Sales'], readTime:'5 min', content:'' },
      { day:3, title:'Freelancing for OFWs: Get Paid in Foreign Currency for Filipino Skills', excerpt:'Virtual assistance, social media management, video editing — skills Filipinos excel at that command premium rates globally.', tags:['Freelance','Online Work'], readTime:'5 min', content:'' },
      { day:4, title:'How to Build a Facebook Selling Business from Abroad', excerpt:'FB Marketplace, OFW community groups, and the step-by-step process to start selling products your family manages locally.', tags:['Facebook','E-commerce'], readTime:'5 min', content:'' },
      { day:5, title:'HOF Siomai King Franchise: Let Your Family Run It While You Fund It', excerpt:'Put up a siomai cart for a family member to operate while you\'re abroad. The numbers, the process, and the income potential.', tags:['HOF','Franchise'], readTime:'5 min', content:'' },
      { day:6, title:'Digital Products: Creating Things That Sell While You Sleep', excerpt:'E-books, templates, online courses — OFW knowledge is valuable. How to package and sell it as a digital product.', tags:['Digital','Passive'], readTime:'5 min', content:'' },
      { day:7, title:'Dropshipping from Abroad: Low Capital, Global Income', excerpt:'Order products from suppliers and sell online without holding inventory. How dropshipping works and the best platforms for OFWs.', tags:['Dropshipping','E-commerce'], readTime:'5 min', content:'' },
      { day:8, title:'Becoming an Insurance Agent (IMG) While Working a Full-Time Job', excerpt:'IMG allows OFWs to become financial advisors part-time. Flexible hours, unlimited commissions, and you\'re helping fellow OFWs.', tags:['IMG','Agent'], readTime:'5 min', content:'' },
      { day:9, title:'How to Manage a Business Remotely: Tools and Systems That Work', excerpt:'Trello, GCash, Viber groups, and Google Sheets — the toolkit that lets you run a Philippine business from abroad.', tags:['Management','Tools'], readTime:'5 min', content:'' },
      { day:10, title:'Content Creation for OFWs: Building an Audience From Your Experience', excerpt:'Your OFW story is content. TikTok, YouTube, Facebook — how to build a following that eventually generates income.', tags:['Content','Social Media'], readTime:'5 min', content:'' },
      { day:11, title:'How Much Can You Realistically Earn from a Side Hustle?', excerpt:'The honest numbers — what different side income streams typically earn, the hours required, and the growth trajectory.', tags:['Income','Realistic'], readTime:'5 min', content:'' },
      { day:12, title:'From Side Hustle to Full Business: Planning Your Exit from Employment', excerpt:'The milestone when your side income matches your salary — and the checklist before you resign and go home for good.', tags:['Exit Plan','Business'], readTime:'6 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 7 — FAMILY FINANCE FROM ABROAD
  ================================================================ */
  {
    id: 'family-finance',
    title: 'Family Finance from Abroad',
    subtitle: 'Ang pera mo ay pamilya mo — paano sila turuan sa pamamahala ng pera',
    description: 'The hardest part of being an OFW isn\'t the work — it\'s watching remittances disappear without building anything. This series gives you practical tools to manage family finances across continents.',
    cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '👨‍👩‍👧‍👦',
    accentColor: '#ec4899',
    accentBg: 'rgba(236,72,153,0.07)',
    totalPosts: 10,
    posts: [
      { day:1, title:'Bakit Nauubos ang Padala Bago Mag-Katapusan ng Buwan?', excerpt:'Hindi ito tanong ng kultura kundi tanong ng sistema. Narito ang mga reyong dahilan kung bakit nauubos ang remittance — at ang solusyon.', tags:['Budget','Family'], readTime:'5 min', content:'' },
      { day:2, title:'How to Set Up a Family Budget System From Abroad', excerpt:'The four-envelope method adapted for remittance-dependent Filipino families. Simple enough for anyone to follow.', tags:['Budget','System'], readTime:'5 min', content:'' },
      { day:3, title:'Who Should Handle the Money at Home? Choosing Your Trusted Manager', excerpt:'Spouse, parent, or sibling? The criteria for choosing who manages family finances — and how to set clear expectations.', tags:['Family','Trust'], readTime:'5 min', content:'' },
      { day:4, title:'Teaching Your Children Financial Literacy from Abroad', excerpt:'You\'re building wealth for them. Make sure they know how to keep it. Age-appropriate financial lessons you can teach via video call.', tags:['Children','Education'], readTime:'5 min', content:'' },
      { day:5, title:'When Family Members Keep Asking for Extra Money: Setting Boundaries with Love', excerpt:'The guilt of saying no to extended family. How to establish financial boundaries that protect your goals without destroying relationships.', tags:['Boundaries','Family'], readTime:'5 min', content:'' },
      { day:6, title:'How to Build a Family Emergency Fund That Everyone Respects', excerpt:'A separate account that\'s only for emergencies — how to set it up, fund it, and make sure it\'s not spent on non-emergencies.', tags:['Emergency Fund','Family'], readTime:'5 min', content:'' },
      { day:7, title:'Sending Your Kids to Private School: Planning From Abroad', excerpt:'Private school tuition in the Philippines has been rising faster than inflation. How to plan and fund it without disrupting your investments.', tags:['Education','Planning'], readTime:'5 min', content:'' },
      { day:8, title:'Pag-IBIG and SSS: Keeping Government Benefits for Your Whole Family', excerpt:'Voluntary contributions keep you and your dependents eligible for housing loans, sickness benefits, and maternity benefits.', tags:['SSS','Pag-IBIG'], readTime:'4 min', content:'' },
      { day:9, title:'Estate Planning for OFWs: Making Sure Your Wealth Survives You', excerpt:'A will, beneficiary designations on insurance, and property titles — the three documents that protect your family after you\'re gone.', tags:['Estate','Will'], readTime:'6 min', content:'' },
      { day:10, title:'The OFW Family Financial Success Roadmap: 5 Years to Financial Freedom', excerpt:'A comprehensive 5-year plan for an OFW family — covering remittance, savings, insurance, investment, and business.', tags:['Roadmap','Planning'], readTime:'7 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 8 — EMERGENCY FUND & DEBT FREEDOM
  ================================================================ */
  {
    id: 'emergency-debt',
    title: 'Emergency Fund & Debt Freedom',
    subtitle: 'Ang pinaka-importante: protektahan ka bago ka magpalago',
    description: 'Before you invest, before you buy real estate, before anything — you need an emergency fund and you need to be free from consumer debt. This series builds those two foundations first.',
    cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '🆘',
    accentColor: '#dc2626',
    accentBg: 'rgba(220,38,38,0.07)',
    totalPosts: 8,
    posts: [
      { day:1, title:'What Is an Emergency Fund and Why Is It Step 1?', excerpt:'Before stocks, before real estate — you need a cash buffer. The reason every financial plan starts here.', tags:['Emergency Fund','Foundation'], readTime:'5 min', content:'' },
      { day:2, title:'How Big Should Your Emergency Fund Be? The Exact Calculation', excerpt:'The 3-6 month rule explained — how to calculate your specific number based on your family\'s actual monthly expenses.', tags:['Calculation','Savings'], readTime:'4 min', content:'' },
      { day:3, title:'Where to Keep Your Emergency Fund (It\'s Not Your Savings Account)', excerpt:'High-yield savings, money market funds, and digital banks — options for parking emergency money where it\'s safe but accessible.', tags:['Savings','Banking'], readTime:'4 min', content:'' },
      { day:4, title:'Understanding Bad Debt: Loans That Are Making You Poorer', excerpt:'Credit card debt, personal loans at 30% interest, salary loans — what they actually cost you and why eliminating them is urgent.', tags:['Debt','Interest'], readTime:'5 min', content:'' },
      { day:5, title:'The Debt Snowball Method: Paying Off All Debts in the Right Order', excerpt:'Pay the smallest debt first for psychological momentum. A step-by-step guide to becoming debt-free as an OFW.', tags:['Debt Snowball','Strategy'], readTime:'5 min', content:'' },
      { day:6, title:'How to Say No to New Debt While Building Your Future', excerpt:'Financing a phone, taking a coop loan, borrowing from family — how to evaluate every debt request against your financial goals.', tags:['Discipline','Mindset'], readTime:'5 min', content:'' },
      { day:7, title:'Rehabilitating Bad Credit as an OFW', excerpt:'Bad credit history in the Philippines affects your access to housing loans. The steps to rehabilitate your credit record.', tags:['Credit','Rehabilitation'], readTime:'5 min', content:'' },
      { day:8, title:'Debt-Free and Emergency-Ready: What to Do Next', excerpt:'You\'ve built your emergency fund and paid off bad debt. Now the real wealth-building begins. The transition to investing.', tags:['Milestone','Next Steps'], readTime:'5 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 9 — DIGITAL BANKING FOR OFWs
  ================================================================ */
  {
    id: 'digital-banking',
    title: 'Digital Banking for OFWs',
    subtitle: 'Pamahalaan ang iyong pera kahit wala kang branch malapit sa iyo',
    description: 'Philippine digital banking has transformed. OFWs can now open accounts, earn interest, invest, and pay bills — all through their phones. This series covers the best digital tools for managing money from abroad.',
    cover: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '📱',
    accentColor: '#0d9488',
    accentBg: 'rgba(13,148,136,0.07)',
    totalPosts: 10,
    posts: [
      { day:1, title:'GCash for OFWs: Everything You Can Do With It From Abroad', excerpt:'Send padala directly to GCash, invest in GInvest, buy insurance via GInsure, pay bills — the full OFW guide to GCash.', tags:['GCash','Philippines'], readTime:'5 min', content:'' },
      { day:2, title:'Maya (PayMaya) vs. GCash: Which Should OFWs Use?', excerpt:'Both are major Philippine e-wallets. The features, interest rates, and limitations compared from an OFW perspective.', tags:['Maya','GCash'], readTime:'5 min', content:'' },
      { day:3, title:'Best Philippine Digital Banks for OFW Savings: Tonik, Seabank, GoTyme', excerpt:'Digital banks offering 4-6% annual interest on savings — far higher than traditional banks. How to open one remotely.', tags:['Digital Bank','Savings'], readTime:'5 min', content:'' },
      { day:4, title:'How to Open a Philippine Bank Account from Abroad', excerpt:'BPI, BDO, Metrobank — the documentary requirements and remote options for OFWs who need a traditional bank account.', tags:['Banking','Philippines'], readTime:'5 min', content:'' },
      { day:5, title:'Wise Account for OFWs: Hold Multiple Currencies and Save on Conversion', excerpt:'Wise lets you hold AED, USD, and PHP — converting at real rates when needed. The smart OFW multi-currency tool.', tags:['Wise','Currency'], readTime:'5 min', content:'' },
      { day:6, title:'Investing Directly from GCash: GInvest, UITF, and More', excerpt:'GInvest provides access to mutual funds starting at ₱50. How to use it as your starter investment account.', tags:['GInvest','UITF'], readTime:'4 min', content:'' },
      { day:7, title:'Protecting Your Digital Accounts: Security Practices OFWs Must Follow', excerpt:'SIM-swap scams, phishing, fake remittance apps — the threats targeting OFW finances and how to defend against them.', tags:['Security','Scams'], readTime:'5 min', content:'' },
      { day:8, title:'Automating Your Family\'s Bill Payments from Abroad', excerpt:'Set up automatic payments for electricity, water, internet, and insurance so your family never faces disconnection.', tags:['Automation','Bills'], readTime:'4 min', content:'' },
      { day:9, title:'Digital Banking in the UAE: What OFWs in Dubai and Abu Dhabi Should Know', excerpt:'Emirates NBD, FAB, ENBD, Liv. — the UAE digital banking options and how they integrate with Philippine transfers.', tags:['UAE','Banking'], readTime:'5 min', content:'' },
      { day:10, title:'The Complete OFW Digital Finance Stack: All the Apps You Need', excerpt:'A recommended set of apps for managing money as an OFW — remittance, savings, investment, insurance, and budgeting.', tags:['Apps','Summary'], readTime:'5 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 10 — MILLIONAIRE MINDSET SERIES
  ================================================================ */
  {
    id: 'millionaire-mindset',
    title: 'Millionaire Mindset',
    subtitle: 'The psychology, habits, and decisions that separate wealthy OFWs from struggling ones',
    description: 'Financial tools only work if your mindset is right. This series addresses the beliefs, habits, and psychological patterns that determine whether an OFW builds lasting wealth — or returns home with nothing.',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '🧠',
    accentColor: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.07)',
    totalPosts: 10,
    posts: [
      { day:1, title:'The OFW Poverty Cycle: Why Hardworking People Stay Poor', excerpt:'High income does not equal wealth. The behavioral patterns that trap OFWs in the same financial position for decades.', tags:['Mindset','Cycle'], readTime:'6 min', content:'' },
      { day:2, title:'Lifestyle Inflation: The Invisible Enemy of Every OFW\'s Wealth', excerpt:'Your income grows, your expenses grow, your savings stay the same. The pattern and how to break it.', tags:['Lifestyle','Inflation'], readTime:'5 min', content:'' },
      { day:3, title:'How Wealthy OFWs Think Differently About Money', excerpt:'The mental models, spending filters, and decision frameworks of OFWs who have successfully built wealth from abroad.', tags:['Wealth','Psychology'], readTime:'6 min', content:'' },
      { day:4, title:'Utang na Loob vs. Financial Boundaries: The Filipino Money Dilemma', excerpt:'The cultural expectation to share wealth with extended family — and how to honor your culture without destroying your financial goals.', tags:['Culture','Boundaries'], readTime:'6 min', content:'' },
      { day:5, title:'The Comparison Trap: Why Looking at Other OFWs Is Costing You Money', excerpt:'Seeing someone else\'s new car or bag triggers spending you can\'t afford. The psychology of social comparison and how to fight it.', tags:['Social Media','Mindset'], readTime:'5 min', content:'' },
      { day:6, title:'Delayed Gratification: The Superpower Every Rich OFW Has Developed', excerpt:'The marshmallow test applied to OFW finances. How to train yourself to delay reward for greater future gain.', tags:['Discipline','Psychology'], readTime:'5 min', content:'' },
      { day:7, title:'Building Financial Confidence When No One Taught You About Money', excerpt:'Most Filipinos grew up in homes where money was never openly discussed. How to overcome financial ignorance without shame.', tags:['Education','Confidence'], readTime:'5 min', content:'' },
      { day:8, title:'Gratitude and Ambition: The Balance That Keeps OFWs Motivated', excerpt:'Being grateful for what you have while aggressively pursuing more — the mindset that sustains long-term financial effort.', tags:['Motivation','Balance'], readTime:'5 min', content:'' },
      { day:9, title:'How to Stay Focused on Financial Goals During Homesickness', excerpt:'When you\'re sad and far from home, overspending feels like comfort. Strategies to protect your goals during emotional low points.', tags:['Mental Health','Discipline'], readTime:'5 min', content:'' },
      { day:10, title:'Your Millionaire OFW Identity: Who You Decide to Become', excerpt:'Wealth is built from identity before income. The declaration, habits, and community that make financial success inevitable.', tags:['Identity','Success'], readTime:'6 min', content:'' },
    ]
  },

  /* ================================================================
     SERIES 11 — BALIK-BAYAN FINANCIAL BLUEPRINT
  ================================================================ */
  {
    id: 'balik-bayan-blueprint',
    title: 'Balik-Bayan Blueprint',
    subtitle: 'How to come home for good — not because you have to, but because you\'re ready',
    description: 'Coming home should be a celebration, not a financial crisis. This series walks you through the complete financial preparation needed to return to the Philippines permanently — with income, assets, and a plan.',
    cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=85&auto=format&fit=crop&crop=center',
    emoji: '✈️',
    accentColor: '#C8900A',
    accentBg: 'rgba(200,144,10,0.07)',
    totalPosts: 10,
    posts: [
      { day:1, title:'How to Know If You\'re Financially Ready to Come Home', excerpt:'The checklist: passive income, emergency fund, zero consumer debt, business or career income — the criteria for a successful return.', tags:['Readiness','Checklist'], readTime:'6 min', content:'' },
      { day:2, title:'Calculating Your Philippine Cost of Living — Realistically', excerpt:'Middle-class life in the Philippines costs more than most returning OFWs expect. An honest monthly budget template by city.', tags:['Budget','Philippines'], readTime:'5 min', content:'' },
      { day:3, title:'Building Income Streams Before You Come Home', excerpt:'You need income that doesn\'t require your overseas employment. The income sources to set up before your last contract ends.', tags:['Income','Planning'], readTime:'6 min', content:'' },
      { day:4, title:'OWWA Reintegration Program: Free Money for Returning OFWs', excerpt:'OWWA provides livelihood assistance, business capital, and training for returning workers. Most OFWs never claim these benefits.', tags:['OWWA','Benefits'], readTime:'5 min', content:'' },
      { day:5, title:'Starting a Business When You Return: Choosing the Right Venture', excerpt:'What business can you realistically start with your savings, skills, and Philippine network? A framework for choosing wisely.', tags:['Business','Return'], readTime:'6 min', content:'' },
      { day:6, title:'Re-entering the Philippine Job Market After Years Abroad', excerpt:'If you want employment rather than entrepreneurship, your overseas experience has market value — here\'s how to position it.', tags:['Career','Employment'], readTime:'5 min', content:'' },
      { day:7, title:'The Emotional Side of Coming Home: Financial Stress and Family Dynamics', excerpt:'The return is rarely as smooth as imagined. The financial pressures that follow repatriation and how to prepare for them.', tags:['Family','Psychology'], readTime:'5 min', content:'' },
      { day:8, title:'Health Insurance After OFW: Transitioning Your Coverage Back Home', excerpt:'Your employer health coverage abroad ends when your contract does. Philippine health insurance options for returning OFWs.', tags:['Insurance','Transition'], readTime:'5 min', content:'' },
      { day:9, title:'What to Do With Your Savings When You Return', excerpt:'Lump sum investing, real estate purchase, business capital, or emergency reserve — how to allocate the money you\'ve saved.', tags:['Savings','Allocation'], readTime:'6 min', content:'' },
      { day:10, title:'The Returning OFW 90-Day Financial Action Plan', excerpt:'Your first 90 days back — a day-by-day guide covering accounts, insurance, business registration, and investment setup.', tags:['Action Plan','Checklist'], readTime:'7 min', content:'' },
    ]
  },

];

