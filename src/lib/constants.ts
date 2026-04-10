import type {
  Achievement,
  CaseStudy,
  Insight,
  TeamMember,
  Service,
} from "@/types";

// ─── Services Data ────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    slug: "corporate",
    icon: "Building2",
    titleKey: "services.corporate.title",
    descriptionKey: "services.corporate.description",
    tags: ["Joint Ventures", "Due Diligence", "Shareholder Agreements", "Restructuring"],
    features: [
      "Company formation (LLC, JSC, Branch, Representative Office)",
      "Corporate governance frameworks",
      "Mergers, acquisitions & demergers",
      "Shareholder & joint venture agreements",
      "Due diligence & legal audits",
      "Corporate restructuring & reorganization",
      "Board advisory & secretarial services",
    ],
  },
  {
    slug: "international",
    icon: "Globe2",
    titleKey: "services.international.title",
    descriptionKey: "services.international.description",
    tags: ["FDI Advisory", "BIT Protection", "Free Economic Zones", "Market Entry"],
    features: [
      "Foreign direct investment structuring",
      "Free Economic Zone (FEZ) navigation",
      "Bilateral investment treaty analysis",
      "Export control & sanctions compliance",
      "Cross-border transaction counsel",
      "Government relations & regulatory liaison",
      "International trade documentation",
    ],
  },
  {
    slug: "contract",
    icon: "FileText",
    titleKey: "services.contract.title",
    descriptionKey: "services.contract.description",
    tags: ["Commercial Agreements", "Supply Contracts", "Distribution", "SLA"],
    features: [
      "Commercial contract drafting & review",
      "Multilingual agreement negotiation",
      "Supply chain & distribution agreements",
      "Technology licensing & IP agreements",
      "Construction & infrastructure contracts",
      "Real estate purchase & lease agreements",
      "Contract compliance monitoring",
    ],
  },
  {
    slug: "labor",
    icon: "Users",
    titleKey: "services.labor.title",
    descriptionKey: "services.labor.description",
    tags: ["Work Permits", "HR Compliance", "Employment Disputes", "Expat Advisory"],
    features: [
      "Employment contract drafting",
      "Expatriate work permit processing",
      "HR policy development & compliance",
      "Workforce restructuring advisory",
      "Collective bargaining support",
      "Labor dispute resolution",
      "Executive compensation structuring",
    ],
  },
  {
    slug: "litigation",
    icon: "Scale",
    titleKey: "services.litigation.title",
    descriptionKey: "services.litigation.description",
    tags: ["Commercial Courts", "ICC Arbitration", "LCIA", "Enforcement"],
    features: [
      "Commercial court representation",
      "International arbitration (ICC, LCIA, UNCITRAL)",
      "Administrative & regulatory proceedings",
      "Enforcement of foreign judgments",
      "Pre-litigation risk assessment",
      "Mediation & alternative dispute resolution",
      "Asset protection & recovery",
    ],
  },
];

// ─── Achievements Carousel Data ────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    headline: "Advised European Tech Investor on $45M FDI in Uzbek SaaS Platform",
    headlineRu: "Консультировали европейского инвестора по ПИИ на $45 млн в узбекскую SaaS-платформу",
    headlineUz: "Yevropa texnologiya investorini O'zbek SaaS platformasiga $45 mln TTIda maslahatladi",
    dealValue: "$45M",
    sector: "Technology",
    clientOrigin: "Germany",
    completedAt: "2026-02-15",
    caseStudySlug: "european-tech-fdi-2026",
  },
  {
    id: "ach-2",
    headline: "Successfully Defended Korean Manufacturer in $12M Contract Dispute",
    headlineRu: "Успешно защитили корейского производителя в споре на $12 млн",
    headlineUz: "Koreya ishlab chiqaruvchisini $12 mln shartnoma nizosida muvaffaqiyatli himoya qildi",
    dealValue: "$12M",
    sector: "Manufacturing",
    clientOrigin: "South Korea",
    completedAt: "2026-01-20",
    caseStudySlug: "korean-manufacturer-dispute",
  },
  {
    id: "ach-3",
    headline: "Structured $120M Energy Sector Joint Venture in Navoi FEZ",
    headlineRu: "Структурировали СП в энергетике на $120 млн в СЭЗ Навои",
    headlineUz: "Navoiy SEZda $120 mln energetika sektoridagi qo'shma korxonani tuzdi",
    dealValue: "$120M",
    sector: "Energy",
    clientOrigin: "UAE",
    completedAt: "2025-11-30",
    caseStudySlug: "navoi-fez-jv",
  },
  {
    id: "ach-4",
    headline: "Secured Work Permits for 200-Person International Workforce in 6 Weeks",
    headlineRu: "Оформили разрешения на работу для 200 иностранных специалистов за 6 недель",
    headlineUz: "6 hafta ichida 200 xorijiy mutaxassis uchun ish ruxsatnomalari oldi",
    dealValue: undefined,
    sector: "Construction",
    clientOrigin: "Turkey",
    completedAt: "2025-10-15",
    caseStudySlug: "workforce-permits-2025",
  },
  {
    id: "ach-5",
    headline: "Obtained ICC Arbitration Award — $8.5M Enforced Against State Entity",
    headlineRu: "Получили решение ICC на $8,5 млн против государственной структуры",
    headlineUz: "Davlat tashkilotiga qarshi $8,5 mln ICC arbitraj qarori oldi",
    dealValue: "$8.5M",
    sector: "Infrastructure",
    clientOrigin: "France",
    completedAt: "2025-09-08",
    caseStudySlug: "icc-award-state-entity",
  },
];

// ─── Case Studies Data ─────────────────────────────────────────────────────
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    slug: "european-tech-fdi-2026",
    category: "fdi",
    clientType: "European Technology Investor",
    dealValue: "$45M",
    timeline: "5 months",
    challenge:
      "A German SaaS company sought to acquire a 70% stake in a Tashkent-based fintech startup. The deal faced complex regulatory hurdles: Central Bank approval, currency repatriation restrictions, and simultaneous IT Park registration requirements.",
    solution:
      "R-Legal structured a phased acquisition through a Cypriot holding vehicle with BIT protection. We liaised with the Central Bank, IT Park administration, and Ministry of Investment simultaneously, compressing approval timelines by 40%.",
    result:
      "Deal closed in 5 months — 3 months ahead of client's internal deadline. Full repatriation rights secured. IT Park tax exemptions (0% corporate tax, 0% VAT) activated from day one.",
    metrics: [
      { label: "Deal Value", value: "$45M" },
      { label: "Timeline", value: "5 months" },
      { label: "Timeline Saved", value: "3 months" },
      { label: "Tax Savings (Year 1)", value: "$2.1M" },
    ],
    sector: "Technology / Fintech",
    featured: true,
  },
  {
    id: "cs-2",
    slug: "navoi-fez-jv",
    category: "corporate",
    clientType: "UAE Energy Conglomerate",
    dealValue: "$120M",
    timeline: "8 months",
    challenge:
      "A UAE-based energy group wanted to develop a solar generation facility in Navoi FEZ but faced uncertainty around land rights, off-take agreement enforceability, and Uzbek partner governance disputes.",
    solution:
      "R-Legal drafted a tri-party joint venture agreement with waterfall distribution mechanics, secured a 49-year land lease from the FEZ authority, and negotiated a government-backed Power Purchase Agreement with guaranteed tariff.",
    result:
      "Joint venture operational. $120M committed capital fully protected under Uzbekistan-UAE BIT. Government-guaranteed PPA secured for 20-year term.",
    metrics: [
      { label: "Investment Protected", value: "$120M" },
      { label: "PPA Term", value: "20 years" },
      { label: "Land Lease", value: "49 years" },
      { label: "IRR Improvement", value: "+4.2%" },
    ],
    sector: "Energy / Renewables",
    featured: true,
  },
  {
    id: "cs-3",
    slug: "korean-manufacturer-dispute",
    category: "litigation",
    clientType: "South Korean Manufacturer",
    dealValue: "$12M",
    timeline: "14 months",
    challenge:
      "Our client, a Korean machinery manufacturer, faced a $12M breach of contract claim from a local distributor alleging delivery failures. The opposing party sought enforcement via Tashkent Economic Court with fraudulent documentation.",
    solution:
      "R-Legal exposed document forgery through forensic analysis, filed counterclaims, and shifted proceedings to ICC arbitration under the original contract's dispute resolution clause.",
    result:
      "ICC tribunal ruled fully in our client's favor. $12M claim dismissed. Counterparty ordered to pay $1.2M in legal costs. Client's distribution network restructured with improved contract protections.",
    metrics: [
      { label: "Claim Dismissed", value: "$12M" },
      { label: "Costs Recovered", value: "$1.2M" },
      { label: "Arbitration Duration", value: "14 months" },
      { label: "Outcome", value: "Full Win" },
    ],
    sector: "Manufacturing / Distribution",
    featured: true,
  },
  {
    id: "cs-4",
    slug: "workforce-permits-2025",
    category: "labor",
    clientType: "Turkish Construction Group",
    dealValue: undefined,
    timeline: "6 weeks",
    challenge:
      "A Turkish construction conglomerate won a major infrastructure contract in Uzbekistan requiring 200 specialized foreign workers. Standard permit processing would take 4–6 months, threatening project timelines and penalty clauses.",
    solution:
      "R-Legal leveraged an expedited processing pathway under the 2023 Investment Climate Reforms, filed simultaneous batch applications, and coordinated with the Agency for External Labor Migration.",
    result:
      "200 work permits issued in 6 weeks — 75% faster than standard processing. Zero project delays. Client avoided $3M in potential contract penalties.",
    metrics: [
      { label: "Permits Issued", value: "200" },
      { label: "Processing Time", value: "6 weeks" },
      { label: "Savings vs. Penalties", value: "$3M" },
      { label: "Acceleration", value: "75%" },
    ],
    sector: "Construction / Infrastructure",
    featured: false,
  },
];

// ─── Insights / Regulatory Pulse Data ─────────────────────────────────────
export const INSIGHTS: Insight[] = [
  {
    id: "ins-1",
    slug: "uzbekistan-digital-economy-law-2026",
    category: "regulatory",
    title: "Uzbekistan's Digital Economy Law: What Foreign Tech Investors Must Know",
    titleRu: "Закон о цифровой экономике Узбекистана: что должны знать иностранные инвесторы",
    titleUz: "O'zbekiston Raqamli Iqtisodiyot Qonuni: Xorijiy texnologiya investorlari nimani bilishi kerak",
    summary:
      "The April 2026 Digital Economy Development Law introduces mandatory data localization, updated e-signature standards, and new IT Park incentive tiers. Foreign tech companies operating in Uzbekistan must comply by Q3 2026.",
    summaryRu:
      "Закон о развитии цифровой экономики апреля 2026 года вводит обязательную локализацию данных, обновлённые стандарты ЭЦП и новые уровни льгот IT Park. Иностранные компании обязаны соответствовать требованиям до III квартала 2026 года.",
    summaryUz:
      "2026 yil aprel oyidagi Raqamli Iqtisodiyotni Rivojlantirish Qonuni majburiy ma'lumotlarni lokalizatsiya qilish, yangilangan elektron imzo standartlari va yangi IT Park imtiyoz darajalarini joriy etadi.",
    businessImpact:
      "Non-compliant companies face data processing suspension and loss of IT Park tax benefits (0% income tax, 0% VAT).",
    businessImpactRu:
      "Несоответствующие компании рискуют приостановкой обработки данных и потерей налоговых льгот IT Park (0% подоходный налог, 0% НДС).",
    businessImpactUz:
      "Talablarga javob bermagan kompaniyalar ma'lumotlarni qayta ishlashning to'xtatilishi va IT Park soliq imtiyozlarini (0% daromad solig'i, 0% QQS) yo'qotish xavfiga duch keladi.",
    recommendedAction:
      "Audit your data architecture and appoint a local data protection officer before September 2026.",
    recommendedActionRu:
      "Проведите аудит архитектуры данных и назначьте местного офицера по защите данных до сентября 2026 года.",
    recommendedActionUz:
      "Ma'lumotlar arxitekturangizni tekshiring va 2026 yil sentyabrigacha mahalliy ma'lumotlarni himoya qilish bo'yicha ofitserni tayinlang.",
    publishedAt: "2026-04-01",
    readingTime: 6,
    tags: ["Digital Economy", "Data Localization", "IT Park", "Compliance"],
    featured: true,
  },
  {
    id: "ins-2",
    slug: "fdi-screening-reform-2026",
    category: "investment",
    title: "Uzbekistan Tightens FDI Screening in Strategic Sectors",
    titleRu: "Узбекистан ужесточает контроль ПИИ в стратегических секторах",
    titleUz: "O'zbekiston strategik sohalarda TTI nazoratini kuchaytirdi",
    summary:
      "New Presidential Decree No. 87 introduces pre-approval screening for foreign investments exceeding $10M in energy, telecommunications, and financial services. Processing time: 45 business days.",
    summaryRu:
      "Новый Указ Президента № 87 вводит предварительную проверку иностранных инвестиций свыше $10 млн в энергетике, телекоммуникациях и финансовых услугах. Срок рассмотрения: 45 рабочих дней.",
    summaryUz:
      "Yangi Prezident farmoni №87 energetika, telekommunikatsiya va moliyaviy xizmatlarda $10 mln dan oshuvchi xorijiy investitsiyalar uchun oldindan tekshiruvni joriy etadi.",
    businessImpact:
      "Deal timelines for large investments in strategic sectors will extend by 45–90 days. BIT protections remain intact.",
    businessImpactRu:
      "Сроки сделок по крупным инвестициям в стратегические секторы увеличатся на 45–90 дней. Защита ДИД остаётся в силе.",
    businessImpactUz:
      "Strategik sohalardagi yirik investitsiyalar bo'yicha bitim muddatlari 45–90 kunga uzayadi. BIT himoyasi kuchda qolmoqda.",
    recommendedAction:
      "Factor screening timeline into deal structure from day one. File pre-notification to start clock early.",
    recommendedActionRu:
      "Учтите сроки проверки в структуре сделки с первого дня. Подайте предварительное уведомление для запуска отсчёта времени.",
    recommendedActionUz:
      "Tekshiruv muddatini birinchi kundan boshlab bitim tuzilmasiga kiriting. Muddatni boshlash uchun oldindan bildirishnoma yuboring.",
    publishedAt: "2026-03-15",
    readingTime: 4,
    tags: ["FDI", "Regulatory", "Investment Screening", "Presidential Decree"],
    featured: true,
  },
  {
    id: "ins-3",
    slug: "labor-code-amendment-2026",
    category: "labor",
    title: "Labor Code Amendment: New Remote Work and Fixed-Term Contract Rules",
    titleRu: "Поправки к Трудовому кодексу: новые правила удалённой работы и срочных договоров",
    titleUz: "Mehnat Kodeksiga o'zgartirish: yangi masofaviy ish va muddatli shartnoma qoidalari",
    summary:
      "Effective March 2026, Uzbekistan's Labor Code now explicitly governs remote work arrangements, limits fixed-term contracts to 3 renewals, and mandates electronic employment records for companies with 50+ employees.",
    summaryRu:
      "С марта 2026 года Трудовой кодекс Узбекистана явно регулирует удалённую работу, ограничивает срочные договоры до 3 продлений и обязывает компании с 50+ сотрудниками вести электронный кадровый учёт.",
    summaryUz:
      "2026 yil mart oyidan boshlab, O'zbekiston Mehnat Kodeksi masofaviy ish tartibotini aniq tartibga soladi, muddatli shartnomalarni 3 yangilanish bilan cheklaydi va 50+ xodimli kompaniyalar uchun elektron kadrlar yozuvlarini majburiy qiladi.",
    businessImpact:
      "Companies using fixed-term contracts with repeated renewals risk automatic conversion to permanent employment. Penalties: up to 200 BCU per violation.",
    businessImpactRu:
      "Компании, использующие срочные договоры с повторными продлениями, рискуют их автоматическим переводом в бессрочные. Штрафы: до 200 БРВ за нарушение.",
    businessImpactUz:
      "Qayta uzaytirilgan muddatli shartnomalardan foydalanayotgan kompaniyalar ularning avtomatik ravishda muddatsizga aylanishi xavfiga duch keladi. Jarima: har bir buzarlik uchun 200 BHM gacha.",
    recommendedAction:
      "Audit your employment contract portfolio and convert eligible fixed-term arrangements before Q2 2026.",
    recommendedActionRu:
      "Проведите аудит портфеля трудовых договоров и переведите соответствующие срочные договоры до 2 квартала 2026 года.",
    recommendedActionUz:
      "Mehnat shartnomalari portfolingizni tekshiring va mos muddatli tartiblarni 2026 yil 2-choragigacha o'tkazing.",
    publishedAt: "2026-02-28",
    readingTime: 5,
    tags: ["Labor Law", "Remote Work", "Employment Contracts", "HR Compliance"],
    featured: true,
  },
];

// ─── Team Data ────────────────────────────────────────────────────────────
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Rustam Nazarov",
    role: "Managing Partner",
    roleRu: "Управляющий партнёр",
    roleUz: "Boshqaruvchi sherik",
    yearsExp: 18,
    admittedIn: ["Uzbekistan", "Russia"],
    languages: ["UZ", "RU", "EN", "DE"],
    education: [
      "LL.M. International Law — University of Vienna",
      "LL.B. — Tashkent State University of Law",
    ],
    specializations: ["international", "corporate", "litigation"],
    bio: "Rustam leads R-Legal's international practice with 18 years of experience advising sovereign wealth funds, multinational corporations, and foreign governments on Uzbekistan market entry and cross-border transactions.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "tm-2",
    name: "Dilnoza Yusupova",
    role: "Senior Partner — Corporate & M&A",
    roleRu: "Старший партнёр — Корпоративное право и M&A",
    roleUz: "Katta sherik — Korporativ va M&A",
    yearsExp: 14,
    admittedIn: ["Uzbekistan"],
    languages: ["UZ", "RU", "EN"],
    education: [
      "LL.M. Corporate Law — King's College London",
      "LL.B. — Westminster International University in Tashkent",
    ],
    specializations: ["corporate", "contract"],
    bio: "Dilnoza specializes in complex M&A transactions and corporate restructuring, having advised on over 50 major transactions totaling more than $500M in deal value in the Uzbek and Central Asian markets.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "tm-3",
    name: "Bobur Tashmatov",
    role: "Partner — Litigation & Arbitration",
    roleRu: "Партнёр — Судебные споры и арбитраж",
    roleUz: "Sherik — Sud va arbitraj",
    yearsExp: 12,
    admittedIn: ["Uzbekistan", "ICC Court"],
    languages: ["UZ", "RU", "EN", "FR"],
    education: [
      "LL.M. International Arbitration — Sciences Po Paris",
      "LL.B. — Tashkent State University of Law",
    ],
    specializations: ["litigation"],
    bio: "Bobur is R-Legal's lead litigator with ICC, LCIA, and UNCITRAL arbitration experience. He has successfully represented clients in disputes ranging from $500K to $120M across energy, construction, and financial services sectors.",
    linkedin: "https://linkedin.com",
  },
  {
    id: "tm-4",
    name: "Kamola Mirzayeva",
    role: "Associate — Labor & Employment",
    roleRu: "Юрист — Трудовое право",
    roleUz: "Yurist — Mehnat huquqi",
    yearsExp: 7,
    admittedIn: ["Uzbekistan"],
    languages: ["UZ", "RU", "EN", "KO"],
    education: [
      "LL.M. Labor Law — Seoul National University",
      "LL.B. — WIUT Tashkent",
    ],
    specializations: ["labor"],
    bio: "Kamola leads R-Legal's labor and employment practice, advising multinational corporations on workforce establishment, expatriate compliance, and labor dispute resolution in Uzbekistan.",
    linkedin: "https://linkedin.com",
  },
];

// ─── Testimonials Data ────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name: "Klaus Bauer",
    role: "CEO, Bauer Industrietechnik GmbH",
    country: "Germany",
    text: "R-Legal guided us through a complex joint venture registration in Uzbekistan with exceptional professionalism. Their deep knowledge of local regulations and international standards gave us full confidence throughout the process.",
  },
  {
    name: "Yoon Ji-young",
    role: "Head of Legal, KoreaTech Investments",
    country: "South Korea",
    text: "We've worked with several law firms in the region, but R-Legal stands apart. Their AI-powered research tools and multilingual team made our FDI structuring seamless and cost-effective.",
  },
  {
    name: "Ahmed Al-Rashid",
    role: "Managing Director, Gulf Capital Partners",
    country: "UAE",
    text: "When a contractual dispute threatened a major project, R-Legal's litigation team resolved it through skilled arbitration in record time. I cannot recommend them highly enough.",
  },
  {
    name: "Maria Sokolova",
    role: "CFO, RosExport Trading",
    country: "Russia",
    text: "Their labor law practice helped us navigate Uzbekistan's 2024 Labor Code amendments smoothly. All our work permits, employment contracts and HR compliance were handled expertly.",
  },
] as const;

// ─── FAQ Items Data ────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    category: "investment",
    question: "What are the main requirements for foreign investors in Uzbekistan?",
    answer: "Foreign investors in Uzbekistan must comply with the Law on Foreign Investments (1998, amended 2019). Key requirements include registration with the Ministry of Justice, obtaining necessary licenses for regulated sectors, compliance with currency regulations, and adherence to local content requirements in certain industries. Investors from countries with Bilateral Investment Treaties (BITs) enjoy additional protections.",
  },
  {
    category: "corporate",
    question: "How do I register a company in Uzbekistan as a foreign entity?",
    answer: "Foreign entities can register in Uzbekistan through several legal forms: LLC (Mas'uliyati Cheklangan Jamiyat), JSC (Aksiyadorlik Jamiyati), or a branch/representative office. The process involves submitting articles of association, proof of foreign entity, bank statements, and paying state duties. Registration typically takes 3–7 business days. We recommend legal assistance to ensure full compliance.",
  },
  {
    category: "corporate",
    question: "What is the minimum share capital requirement for an LLC in Uzbekistan?",
    answer: "As of 2024, there is no minimum share capital requirement for LLCs in Uzbekistan (it was abolished in 2019 reforms). However, the charter capital must be fully contributed within one year of registration. For joint stock companies (JSC), the minimum is 400 times the base settlement amount for open JSCs.",
  },
  {
    category: "investment",
    question: "What investment incentives are available in Uzbekistan's Free Economic Zones?",
    answer: "Uzbekistan's Free Economic Zones (FEZs) offer significant incentives: 0% corporate income tax for 3–10 years, 0% property tax, 0% land tax, 0% water use tax, preferential customs duties, and simplified administrative procedures. Key FEZs include Navoi, Angren, Jizzakh, Urgut, and Nukus. The duration of incentives depends on investment amount and sector.",
  },
  {
    category: "labor",
    question: "What are the key provisions of Uzbekistan's Labor Code regarding employment contracts?",
    answer: "Under Uzbekistan's Labor Code (as amended 2022-2024), employment contracts must be in writing and include: parties' details, job position, salary, work schedule, social guarantees, and term (indefinite or fixed-term up to 5 years). Fixed-term contracts require justification. Probation periods cannot exceed 3 months. The code also mandates minimum 24 working days of annual leave.",
  },
  {
    category: "labor",
    question: "How do foreign nationals obtain work permits in Uzbekistan?",
    answer: "Foreign nationals need a work permit (confirmed invitation) issued by the Agency for External Labor Migration. The employer applies on behalf of the employee. Required documents include: employment contract, employer's registration documents, employee's passport, qualifications confirmation, and medical certificate. Processing takes 10–15 working days. Annual quotas apply for certain nationalities.",
  },
  {
    category: "taxation",
    question: "What are the main tax rates for businesses in Uzbekistan?",
    answer: "As of 2024: Corporate Income Tax (CIT) — 15% (standard rate); VAT — 12%; Social tax — 25% (employer); Personal income tax — 12% (flat rate); Property tax — 2% of cadastral value; Land tax — varies by region and purpose. Micro-enterprises and small businesses may qualify for simplified tax regimes. Numerous exemptions apply for FEZ residents and priority sectors.",
  },
  {
    category: "arbitration",
    question: "How does commercial arbitration work in Uzbekistan?",
    answer: "Uzbekistan has a modern arbitration framework based on the UNCITRAL Model Law. The main arbitration institutions are the International Commercial Arbitration Court (ICAC) at the Uzbek Chamber of Commerce, and the Tashkent International Arbitration Centre (TIAC). Foreign arbitral awards are enforceable under the New York Convention (Uzbekistan acceded in 1996). Parties can also choose ICC, LCIA, or ad hoc UNCITRAL arbitration.",
  },
  {
    category: "investment",
    question: "Does Uzbekistan have Bilateral Investment Treaties (BITs)?",
    answer: "Yes, Uzbekistan has signed BITs with over 50 countries, including Germany, France, the UK, South Korea, China, Japan, the UAE, and most CIS states. These treaties provide investors with: national treatment, most-favored-nation treatment, protection against expropriation without compensation, and access to international arbitration for investor-state disputes. The specific protections vary by treaty.",
  },
  {
    category: "corporate",
    question: "What are the requirements for mergers and acquisitions in Uzbekistan?",
    answer: "M&A transactions in Uzbekistan require: antitrust clearance from the Anti-Monopoly Committee (for transactions above thresholds), sector-specific approvals for regulated industries (banking, insurance, telecoms), notification to the State Assets Management Agency for privatization deals, and potential Foreign Investment Review for strategic sectors. Due diligence covering legal, financial, and tax aspects is strongly recommended.",
  },
] as const;

// ─── Resources Data ────────────────────────────────────────────────────────
export const RESOURCES_ITEMS = [
  { category: "guides", title: "Foreign Investment Guide: Uzbekistan 2024", description: "A comprehensive guide covering FDI regulations, incentives, and registration procedures for international investors.", pages: 42, free: true },
  { category: "legislation", title: "Uzbekistan Labor Code — Key Provisions (EN/RU)", description: "Annotated summary of the 2024 Labor Code amendments affecting employment contracts, work permits, and HR compliance.", pages: 28, free: true },
  { category: "templates", title: "Commercial Contract Templates Pack", description: "Ready-to-use templates for supply agreements, distribution contracts, service agreements, and NDAs under Uzbek law.", pages: 85, free: false },
  { category: "reports", title: "Uzbekistan Legal Market Report 2024", description: "Annual analysis of the Uzbek legal market, key legislative changes, and business climate indicators.", pages: 56, free: true },
  { category: "guides", title: "Free Economic Zones — Investor Handbook", description: "Step-by-step guide to establishing operations in Uzbekistan's FEZs, with tax incentive comparisons.", pages: 34, free: true },
  { category: "legislation", title: "Tax Code Digest — Business Edition 2024", description: "Plain-language digest of Uzbekistan's Tax Code with rates, exemptions, and FEZ-specific provisions.", pages: 38, free: false },
] as const;

// ─── Contact Info ──────────────────────────────────────────────────────────
export const CONTACT_INFO = {
  phone: "+998 90 825 08 78",
  email: "rlegalpractice@gmail.com",
  address: {
    en: "Tashkent, Republic of Uzbekistan",
    ru: "Ташкент, Республика Узбекистан",
    uz: "Toshkent, O'zbekiston Respublikasi",
    "uz-cyrl": "Тошкент, Ўзбекистон Республикаси",
  },
  hours: "Mon–Fri: 9:00–18:00 (UTC+5)",
  socialLinks: {
    linkedin: "https://linkedin.com",
    telegram: "https://t.me/rlegalpractice",
  },
};
