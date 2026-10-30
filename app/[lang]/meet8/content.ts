import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------
   Pricing model, ported from the source script with its default inputs
   (margin 0%, server cost included at cost, THB). Placeholders until
   finance confirms; the internal pricing-setup tools are not ported.
   ------------------------------------------------------------------ */
const DEF = { hStd: 500, hPre: 1000, stt: 10, gemHr: 40, gemMsg: 1, msgHr: 5, usd: 33 };
const MARGIN = 0;
/** Server (Google Cloud) rows, USD per month, size M: Cloud Run, Cloud SQL, Memorystore, Compute Engine, LB, Cloud Armor, other. */
const GCP_USD = [236, 166, 166, 135, 21, 18, 22];
/** Premium-only estimates in THB per year: KM agent, KM files, MCP + Audit log. */
const PREMIUM_EXTRAS = [20000, 20000, 10000];

function yearPrice(hours: number, extras: number[]) {
  const ours =
    Math.round(hours * 12 * DEF.stt) +
    Math.round(hours * 12 * DEF.gemHr + hours * DEF.msgHr * 12 * DEF.gemMsg) +
    extras.reduce((a, b) => a + b, 0);
  const gcp = GCP_USD.reduce((sum, u) => sum + Math.round(u * 12 * DEF.usd), 0);
  return Math.ceil((ours / (1 - MARGIN / 100) + gcp) / 10000) * 10000;
}

export const PLANS = {
  standard: { name: "Standard", hours: DEF.hStd, year: yearPrice(DEF.hStd, []), extra: 1500 },
  premium: { name: "Premium", hours: DEF.hPre, year: yearPrice(DEF.hPre, PREMIUM_EXTRAS), extra: 600 },
  customize: { name: "Customize" },
} as const;

export type PlanKey = keyof typeof PLANS;
export const isPlanKey = (v: unknown): v is PlanKey => typeof v === "string" && v in PLANS;

const baht = (n: number) => "฿" + n.toLocaleString("en-US");
const hrs = (n: number) => n.toLocaleString("en-US");
const monthly = (k: "standard" | "premium") => Math.round(PLANS[k].year / 12);

const P = {
  stdYear: baht(PLANS.standard.year),
  preYear: baht(PLANS.premium.year),
  stdMonth: baht(monthly("standard")),
  preMonth: baht(monthly("premium")),
  stdHrs: hrs(PLANS.standard.hours),
  preHrs: hrs(PLANS.premium.hours),
  stdExtra: baht(PLANS.standard.extra),
  preExtra: baht(PLANS.premium.extra),
};

/* ------------------------------------------------------------------ */

export type StepKey = "live" | "recap" | "ask" | "minute";
export type TourStep = {
  key: StepKey;
  num: string;
  label: string;
  h: string;
  p: string;
  list: string[];
  img: string;
  url: string;
  alt: string;
};

export type ScreenKey = "today" | "meetings" | "chat";
export type Screen = { key: ScreenKey; label: string; img: string; url: string };

/** A comparison cell: true = tick, false = dash, string = text. */
export type Cell = boolean | string;
export type CompareRow = { group: string } | { label: string; std: Cell; prem: Cell; cus: Cell; beta?: boolean };

export type BarPlan = {
  name: string;
  meta: string;
  priceLabel?: string;
  price: string;
  monthly?: string;
  cta: string;
  sent: string;
};

const en = {
  meta: {
    title: "MEET8 (Second Brain) · Every meeting recorded, written up and searchable",
    description:
      "Record and transcribe meetings in Thai, English or both, get decisions and action items written up for you, and look up anything said in past meetings.",
  },
  brand: "MEET8 (Second Brain)",
  menuLabel: "Main menu",
  menu: [
    { href: "#features", label: "Product" },
    { href: "#cases", label: "Use cases" },
    { href: "#plans", label: "Pricing" },
    { href: "#faq", label: "Help" },
  ],
  hero: {
    eyebrow: "MEET8 (Second Brain)",
    h1: "Every meeting recorded,",
    h1Em: "written up and searchable",
    lead: "Record and transcribe meetings in Thai, English or both, get decisions and action items written up for you, and look up anything said in past meetings, with a link to the exact moment it was said.",
    ctaPrimary: "See how it works",
    ctaSecondary: "View plans and pricing",
    mini: ["Unlimited users on every plan", "Web, macOS, iOS and Google Meet"],
    shotUrl: "second-brain.beryl8.com/today",
    mainAlt: "Today page showing a meeting being recorded and the Second Brain Ask box",
    floatCaption: "Action items · captured from the meeting",
    floatAlt: "Action item table with owners and due dates",
    pill: "Recording · Thai and English",
  },
  facts: [
    { b: "Thai + English", span: "Handles speakers who switch languages mid-sentence" },
    { b: "Answers with sources", span: "Links to the moment in the transcript" },
    { b: "Respects access rights", span: "Only searches meetings you're allowed to see" },
    { b: "Data stays in the region", span: "Google Cloud asia-southeast1" },
  ],
  shotNote: "Screenshots are from the live product, shown with sample data.",
  marquee: [
    "Live Thai and English transcription",
    "Decisions and action items written up for you",
    "Prep Brief before meetings",
    "PDF meeting minutes",
    "Team chat with a built-in assistant",
    "Manager visibility by reporting line",
  ],
  tryit: {
    eyebrow: "Take a look",
    h2: "The screens your team will use every day",
    tabsLabel: "View screens",
    alt: "Sample product screen",
    urlHost: "second-brain.beryl8.com",
    screens: [
      { key: "today", label: "Today", img: "today.jpg", url: "/today" },
      { key: "meetings", label: "Meetings", img: "meetings-full.png", url: "/meetings" },
      { key: "chat", label: "Chat", img: "chat-full.png", url: "/chat" },
    ] as Screen[],
  },
  tabsLabel: "Page sections",
  tabs: [
    { href: "#features", label: "Features" },
    { href: "#cases", label: "Use cases" },
    { href: "#plans", label: "Plans" },
    { href: "#spec", label: "Specs" },
    { href: "#faq", label: "FAQ" },
  ],
  features: {
    eyebrow: "How it works",
    h2: "From the meeting room to answers you can check",
    stepsLabel: "Workflow steps",
    urlHost: "second-brain.beryl8.com",
    steps: [
      {
        key: "live",
        num: "01",
        label: "Record",
        h: "Press record, and every word is captured",
        p: "Start recording from the web, the desktop app, mobile or Google Meet. The transcript fills in as people talk.",
        list: [
          "Handles Thai and English in the same sentence",
          "Speakers and timestamps on every line",
          "Teammates can follow along while it's being recorded",
        ],
        img: "live-close.jpg",
        url: "/meetings/steering-committee/live",
        alt: "Live transcription during a meeting, with speakers separated",
      },
      {
        key: "recap",
        num: "02",
        label: "Summarize",
        h: "The summary is ready when the meeting ends",
        p: "Decisions, action items, owners and due dates are pulled out for you, so everyone works from the same notes and nobody has to write them up.",
        list: [
          "Executive summary: situation, problem and next steps",
          "Key decisions and the reasons behind them",
          "Action items with owners and due dates",
        ],
        img: "recap-close.jpg",
        url: "/meetings/weekly-review",
        alt: "Meeting recap page with executive summary and topics discussed",
      },
      {
        key: "ask",
        num: "03",
        label: "Ask",
        h: "Ask about any meeting, and see the source",
        p: "Ask a question the way you'd ask a colleague. The answer links back to the point in the transcript where it was said.",
        list: [
          "Searches every meeting you have access to",
          "Every answer links to its source",
          "Ask privately or in a team channel",
        ],
        img: "ask-close.jpg",
        url: "/chat",
        alt: "Asking Second Brain in chat and getting an answer with sources",
      },
      {
        key: "minute",
        num: "04",
        label: "PDF minutes",
        h: "Meeting minutes in your organization's format",
        p: "Generate PDF meeting minutes in Thai or English, with headings, attendees, resolutions and follow-ups laid out in the format your company secretary already uses.",
        list: [
          "10 standard sections you can reorder and edit",
          "Pick your company template for each meeting",
          "Every PDF version is kept",
        ],
        img: "minute-close.jpg",
        url: "/meetings/weekly-review/minute",
        alt: "Meeting minutes editor with executive summary and key resolutions",
      },
    ] as TourStep[],
  },
  more: {
    eyebrow: "More than meeting notes",
    h2: "What's said in meetings, available to the whole team",
    chat: {
      k: "Team chat",
      h3: "Ask questions right in your team chat",
      p: "Mention @be8-second-brain to ask about any meeting. Everyone in the channel sees the same answer and sources.",
      alt: "Team chat room where the AI replies with links back to the source meeting",
    },
    prep: {
      k: "Before the meeting",
      h3: "Walk into every meeting prepared",
      p: "The Prep Brief pulls together open items, questions you're likely to get and notes from related meetings.",
      alt: "Prep Brief with likely questions and suggested answers",
    },
    access: {
      k: "Access control",
      h3: "People only see the meetings they should",
      p: "Owners and attendees see their own meetings, managers see their team's meetings, and answers only draw on meetings the person asking can see.",
      alt: "List of meetings within the user's permissions",
    },
  },
  cases: {
    h2: "Built for every kind of meeting",
    items: [
      { h3: "Client meetings", p: "Keep a record of every agreement and client concern, without relying on memory." },
      {
        h3: "Internal meetings",
        p: "Weekly syncs, stand-ups and leadership meetings come with a summary and follow-ups as soon as they end.",
      },
      {
        h3: "Interviews and workshops",
        p: "Full transcripts with each speaker labeled, so you can spot themes that come up across sessions.",
      },
      { h3: "Voice notes", p: "Record a quick voice note after a client visit and get a write-up ready for your CRM." },
    ],
  },
  plans: {
    eyebrow: "Plans",
    h2: "Choose the plan that fits your organization",
    p: "Unlimited users on every plan. Pricing is based on total transcription hours used across the organization.",
    perYear: "/ year",
    standard: {
      price: P.stdYear,
      sub: `Avg. ${P.stdMonth} per month`,
      for: "For teams that want every meeting recorded, summarized and searchable.",
      cta: "Select Standard",
      listLabel: "Included in this plan",
      list: [
        "Unlimited users",
        "Your own private environment and database",
        `${P.stdHrs} transcription hours a month, shared across your organization`,
        "Unlimited questions and in-depth answers",
        "Second Brain assistant",
        "Recap, Prep and PDF meeting minutes",
      ],
    },
    premium: {
      tag: "Most popular · lower cost per hour",
      price: P.preYear,
      sub: `Avg. ${P.preMonth} per month`,
      for: "For organizations that want a searchable document library and manager visibility across teams.",
      cta: "Select Premium",
      listLabel: "Everything in Standard, plus",
      list: [
        `${P.preHrs} transcription hours a month, shared across your organization`,
        "2 knowledge assistants",
        "Up to 4,000 documents in your library",
        "Managers can see their team's meetings",
        "Audit log and connection to other AI tools",
      ],
    },
    customize: {
      price: "Contact sales",
      for: "For organizations that need custom usage, assistants or integrations.",
      cta: "Contact sales",
      listLabel: "Everything in Premium, plus",
      list: [
        "Transcription hours per contract",
        "Custom assistants built for your workflows",
        "SSO and integration with your CRM and internal systems",
        "Dedicated support with an SLA",
      ],
    },
    note: "Prices are in THB per organization per year, excluding 7% VAT · server cost included at cost · prices are indicative and subject to confirmation",
  },
  compare: {
    heading: "Compare plans",
    featureCol: "Feature",
    std: { year: `${P.stdYear} / year`, month: `${P.stdMonth} / month`, cta: "Select" },
    prem: { year: `${P.preYear} / year`, month: `${P.preMonth} / month`, cta: "Select Premium" },
    cus: { price: "Contact sales", cta: "Contact sales" },
    yes: "Included",
    no: "Not included",
    beta: "(Beta)",
    rows: [
      { group: "Usage" },
      { label: "Number of users", std: "Unlimited", prem: "Unlimited", cus: "Unlimited" },
      { label: "Transcription hours per month", std: `${P.stdHrs} hours`, prem: `${P.preHrs} hours`, cus: "Per contract" },
      { label: "Buy extra hours", std: `${P.stdExtra} / hour`, prem: `${P.preExtra} / hour`, cus: "Per contract" },
      { group: "Assistant" },
      { label: "In-depth answers (Think)", std: true, prem: true, cus: true },
      { label: "Ask across every meeting", std: "Unlimited", prem: "Unlimited", cus: "Unlimited" },
      { label: "Second Brain assistant", std: true, prem: true, cus: true },
      { label: "Knowledge assistant", std: false, prem: "2 assistants", cus: "As needed" },
      { label: "Documents in your library", std: false, prem: "Up to 4,000 documents", cus: "As needed" },
      { group: "Record and summarize" },
      { label: "Live Thai and English transcription with speaker labels", std: true, prem: true, cus: true },
      { label: "Recap, Prep and PDF meeting minutes", std: true, prem: true, cus: true },
      { label: "Company minute templates", std: false, prem: true, cus: true },
      { label: "Team chat", std: true, prem: true, cus: true },
      { label: "Google Calendar and Outlook", std: true, prem: true, cus: true },
      { label: "Web, macOS and iOS apps and Chrome extension", std: true, prem: true, cus: true },
      { label: "Connect to other AI tools (MCP)", std: false, prem: true, cus: true, beta: true },
      { group: "Privacy & Security" },
      { label: "Encryption in transit and at rest", std: true, prem: true, cus: true },
      { label: "Owners and attendees see their meetings", std: true, prem: true, cus: true },
      { label: "Managers can see their team's meetings", std: false, prem: true, cus: true },
      { label: "Access audit log", std: false, prem: true, cus: true },
      { label: "Your own private environment and database", std: true, prem: true, cus: true },
      { label: "Data stored in Singapore (asia-southeast1)", std: true, prem: true, cus: true },
      { group: "Customize only" },
      { label: "Custom assistants built for your workflows", std: false, prem: false, cus: true },
      { label: "SSO, CRM and internal system integration", std: false, prem: false, cus: true },
      { label: "Dedicated support with an SLA", std: false, prem: false, cus: true },
    ] as CompareRow[],
  },
  spec: {
    h2: "Specifications",
    items: [
      { dt: "Platforms", dd: "Web, macOS app, iOS and a Chrome extension for Google Meet" },
      { dt: "Transcription languages", dd: "Thai, English, and mixed Thai-English within a single sentence" },
      { dt: "Calendar", dd: "Google Calendar and Microsoft Outlook" },
      { dt: "Sign-in", dd: "Your organization's Google or Microsoft account" },
      { dt: "Export", dd: "PDF meeting minutes in Thai and English" },
      { dt: "Connect other AI tools", dd: "Connects to Claude and other tools that support MCP" },
      { dt: "Access control", dd: "Owners, attendees, managers (by reporting line) and administrators" },
      { dt: "Data storage", dd: "Google Cloud (Singapore region, asia-southeast1), encrypted in transit and at rest" },
    ],
  },
  faq: {
    h2: "Frequently asked questions",
    items: [
      {
        q: "What does “unlimited users” mean?",
        a: "Add as many people from your organization as you like at no extra cost. Your plan sets the total transcription hours each month, shared across everyone.",
      },
      {
        q: "How are transcription hours counted?",
        a: "We count the actual length of the audio, across live recordings, uploaded files and voice notes from everyone in your organization. The quota resets on the 1st of each month, and unused hours do not roll over.",
      },
      {
        q: "What if we use all our hours before the end of the month?",
        a: "You can keep recording. Recordings are saved and transcribed when the new month starts, or you can upgrade to continue right away.",
      },
      {
        q: "Who can see my meetings?",
        a: "Owners and attendees can see a meeting on every plan. Premium also lets managers see their team's meetings, and admins can review who accessed what in the audit log.",
      },
      {
        q: "Can I change plans mid-cycle?",
        a: "You can upgrade immediately and pay only the prorated difference for the remaining days. A downgrade takes effect at the start of the next billing cycle. All of your existing meeting data is kept.",
      },
      {
        q: "What is Customize?",
        a: `A plan built around your needs, for example more than ${P.preHrs} transcription hours a month, custom assistants or integrations with your internal systems. Contact sales for a quote.`,
      },
    ],
  },
  footer: {
    left: "© 2026 Beryl8 · MEET8 (Second Brain)",
    right: "Prices shown in THB, excluding VAT",
  },
  bar: {
    label: "Selected plan summary",
    plans: {
      standard: {
        name: "MEET8 (Second Brain) · Standard",
        meta: `Unlimited users · ${P.stdHrs} hours per month`,
        priceLabel: "Price:",
        price: `${P.stdYear} / year`,
        monthly: `Avg. ${P.stdMonth} /month`,
        cta: "Select Standard",
        sent: "Request sent. Our sales team will be in touch.",
      },
      premium: {
        name: "MEET8 (Second Brain) · Premium",
        meta: `Unlimited users · ${P.preHrs} hours per month`,
        priceLabel: "Price:",
        price: `${P.preYear} / year`,
        monthly: `Avg. ${P.preMonth} /month`,
        cta: "Select Premium",
        sent: "Request sent. Our sales team will be in touch.",
      },
      customize: {
        name: "MEET8 (Second Brain) · Customize",
        meta: "Unlimited users · usage and assistants tailored to you",
        price: "Contact sales",
        cta: "Contact sales",
        sent: "Request sent. Our sales team will be in touch.",
      },
    } as Record<PlanKey, BarPlan>,
  },
};

export type Meet8Content = typeof en;

const th: Meet8Content = {
  meta: {
    title: "MEET8 (Second Brain) · ทุกการประชุม บันทึก สรุป และค้นหาได้",
    description:
      "บันทึกและถอดเสียงการประชุมภาษาไทย อังกฤษ หรือทั้งสองภาษา ได้สรุปมติและงานที่ต้องทำให้อัตโนมัติ และค้นสิ่งที่เคยพูดในการประชุมย้อนหลังได้",
  },
  brand: "MEET8 (Second Brain)",
  menuLabel: "เมนูหลัก",
  menu: [
    { href: "#features", label: "ผลิตภัณฑ์" },
    { href: "#cases", label: "การใช้งาน" },
    { href: "#plans", label: "ราคา" },
    { href: "#faq", label: "ช่วยเหลือ" },
  ],
  hero: {
    eyebrow: "MEET8 (Second Brain)",
    h1: "ทุกการประชุม บันทึกไว้",
    h1Em: "สรุปให้ และค้นหาได้",
    lead: "บันทึกและถอดเสียงการประชุมภาษาไทย อังกฤษ หรือทั้งสองภาษา ได้สรุปมติและงานที่ต้องทำให้อัตโนมัติ และค้นสิ่งที่เคยพูดในการประชุมย้อนหลังได้ พร้อมลิงก์ไปยังช่วงเวลาที่พูดจริง",
    ctaPrimary: "ดูวิธีการทำงาน",
    ctaSecondary: "ดูแพ็กเกจและราคา",
    mini: ["ผู้ใช้ไม่จำกัดทุกแพ็กเกจ", "เว็บ, macOS, iOS และ Google Meet"],
    shotUrl: "second-brain.beryl8.com/today",
    mainAlt: "หน้า Today แสดงการประชุมที่กำลังบันทึกและช่องถาม Second Brain",
    floatCaption: "งานที่ต้องทำ · ดึงจากการประชุมให้อัตโนมัติ",
    floatAlt: "ตารางงานที่ต้องทำพร้อมผู้รับผิดชอบและกำหนดส่ง",
    pill: "กำลังบันทึก · ไทยและอังกฤษ",
  },
  facts: [
    { b: "ไทย + อังกฤษ", span: "รองรับผู้พูดที่สลับภาษากลางประโยค" },
    { b: "ตอบพร้อมแหล่งที่มา", span: "ลิงก์ไปยังช่วงเวลาในทรานสคริปต์" },
    { b: "เคารพสิทธิ์การเข้าถึง", span: "ค้นเฉพาะการประชุมที่คุณมีสิทธิ์เห็น" },
    { b: "ข้อมูลอยู่ในภูมิภาค", span: "Google Cloud asia-southeast1" },
  ],
  shotNote: "ภาพหน้าจอมาจากระบบจริง แสดงด้วยข้อมูลตัวอย่าง",
  marquee: [
    "ถอดเสียงไทยและอังกฤษแบบสด",
    "สรุปมติและงานที่ต้องทำให้อัตโนมัติ",
    "Prep Brief ก่อนประชุม",
    "รายงานการประชุม PDF",
    "แชตทีมพร้อมผู้ช่วยในตัว",
    "ผู้บริหารเห็นตามสายบังคับบัญชา",
  ],
  tryit: {
    eyebrow: "ลองดู",
    h2: "หน้าจอที่ทีมของคุณจะใช้ทุกวัน",
    tabsLabel: "ดูหน้าจอ",
    alt: "ตัวอย่างหน้าจอผลิตภัณฑ์",
    urlHost: "second-brain.beryl8.com",
    screens: [
      { key: "today", label: "Today", img: "today.jpg", url: "/today" },
      { key: "meetings", label: "การประชุม", img: "meetings-full.png", url: "/meetings" },
      { key: "chat", label: "แชต", img: "chat-full.png", url: "/chat" },
    ],
  },
  tabsLabel: "ส่วนของหน้า",
  tabs: [
    { href: "#features", label: "ฟีเจอร์" },
    { href: "#cases", label: "การใช้งาน" },
    { href: "#plans", label: "แพ็กเกจ" },
    { href: "#spec", label: "สเปก" },
    { href: "#faq", label: "คำถามที่พบบ่อย" },
  ],
  features: {
    eyebrow: "ทำงานอย่างไร",
    h2: "จากห้องประชุม ถึงคำตอบที่ตรวจสอบได้",
    stepsLabel: "ขั้นตอนการทำงาน",
    urlHost: "second-brain.beryl8.com",
    steps: [
      {
        key: "live",
        num: "01",
        label: "บันทึก",
        h: "กดอัดครั้งเดียว ได้ทุกคำที่พูด",
        p: "เริ่มบันทึกได้จากเว็บ แอปบนเครื่อง มือถือ หรือ Google Meet ทรานสคริปต์ขึ้นสดระหว่างที่ทุกคนพูด",
        list: [
          "รองรับไทยและอังกฤษในประโยคเดียวกัน",
          "แยกผู้พูดและเวลาให้ทุกบรรทัด",
          "คนในทีมติดตามได้ระหว่างที่กำลังบันทึก",
        ],
        img: "live-close.jpg",
        url: "/meetings/steering-committee/live",
        alt: "ถอดเสียงสดระหว่างประชุม แยกผู้พูด",
      },
      {
        key: "recap",
        num: "02",
        label: "สรุป",
        h: "จบประชุม ได้สรุปทันที",
        p: "ระบบดึงมติ งานที่ต้องทำ ผู้รับผิดชอบ และกำหนดส่งให้อัตโนมัติ ทุกคนทำงานจากบันทึกชุดเดียวกัน โดยไม่ต้องมีใครนั่งเขียนสรุป",
        list: [
          "บทสรุปผู้บริหาร: สถานการณ์ ปัญหา และขั้นตอนถัดไป",
          "มติสำคัญพร้อมเหตุผล",
          "งานที่ต้องทำพร้อมผู้รับผิดชอบและกำหนดส่ง",
        ],
        img: "recap-close.jpg",
        url: "/meetings/weekly-review",
        alt: "หน้าสรุปการประชุม บทสรุปผู้บริหารและประเด็นที่คุยกัน",
      },
      {
        key: "ask",
        num: "03",
        label: "ถามย้อนหลัง",
        h: "ถามได้ทุกการประชุม พร้อมดูแหล่งที่มา",
        p: "ถามเหมือนถามเพื่อนร่วมงาน คำตอบมีลิงก์กลับไปยังจุดในทรานสคริปต์ที่มีคนพูดจริง",
        list: [
          "ค้นทุกการประชุมที่คุณมีสิทธิ์เข้าถึง",
          "ทุกคำตอบมีลิงก์ไปยังแหล่งที่มา",
          "ถามแบบส่วนตัวหรือในช่องแชตของทีม",
        ],
        img: "ask-close.jpg",
        url: "/chat",
        alt: "ถาม Second Brain ในแชต ได้คำตอบพร้อมแหล่งที่มา",
      },
      {
        key: "minute",
        num: "04",
        label: "รายงาน PDF",
        h: "รายงานการประชุมตามแบบขององค์กร",
        p: "ออกรายงานการประชุม PDF ภาษาไทยหรืออังกฤษ จัดหัวข้อ ผู้เข้าร่วม มติ และงานต่อตามรูปแบบที่เลขานุการบริษัทใช้อยู่แล้ว",
        list: [
          "10 หัวข้อมาตรฐาน เรียงลำดับและแก้ไขได้",
          "เลือกแม่แบบของบริษัทได้ในแต่ละการประชุม",
          "เก็บทุกเวอร์ชันของ PDF ไว้",
        ],
        img: "minute-close.jpg",
        url: "/meetings/weekly-review/minute",
        alt: "หน้าแก้ไขรายงานการประชุม บทสรุปผู้บริหารและมติสำคัญ",
      },
    ],
  },
  more: {
    eyebrow: "มากกว่าบันทึกการประชุม",
    h2: "สิ่งที่พูดในการประชุม ทั้งทีมใช้ต่อได้",
    chat: {
      k: "แชตของทีม",
      h3: "ถามได้ทันทีในแชตของทีม",
      p: "แท็ก @be8-second-brain เพื่อถามเรื่องการประชุมใดก็ได้ ทุกคนในช่องเห็นคำตอบและแหล่งที่มาเดียวกัน",
      alt: "ห้องแชตทีมที่ AI ตอบพร้อมลิงก์กลับไปยังการประชุมต้นทาง",
    },
    prep: {
      k: "ก่อนประชุม",
      h3: "เข้าประชุมพร้อมทุกครั้ง",
      p: "Prep Brief รวบรวมเรื่องที่ค้าง คำถามที่น่าจะถูกถาม และบันทึกจากการประชุมที่เกี่ยวข้อง",
      alt: "Prep Brief พร้อมคำถามที่น่าจะถูกถามและคำตอบที่แนะนำ",
    },
    access: {
      k: "สิทธิ์การเข้าถึง",
      h3: "แต่ละคนเห็นเฉพาะการประชุมที่ควรเห็น",
      p: "เจ้าของและผู้เข้าร่วมเห็นการประชุมของตัวเอง ผู้จัดการเห็นการประชุมของทีม และคำตอบมาจากการประชุมที่ผู้ถามมีสิทธิ์เห็นเท่านั้น",
      alt: "รายการประชุมที่อยู่ในสิทธิ์ของผู้ใช้",
    },
  },
  cases: {
    h2: "รองรับการประชุมทุกรูปแบบ",
    items: [
      { h3: "ประชุมลูกค้า", p: "เก็บทุกข้อตกลงและข้อกังวลของลูกค้าไว้ครบ ไม่ต้องพึ่งความจำ" },
      { h3: "ประชุมภายใน", p: "ประชุมประจำสัปดาห์ standup และประชุมผู้บริหาร ได้สรุปและงานต่อทันทีที่จบ" },
      { h3: "สัมภาษณ์และเวิร์กช็อป", p: "ทรานสคริปต์ครบทุกคำ ระบุผู้พูดแต่ละคน เห็นประเด็นที่พูดถึงซ้ำข้ามหลายรอบ" },
      { h3: "Voice note", p: "อัดเสียงสั้น ๆ หลังพบลูกค้า แล้วได้บันทึกที่พร้อมใส่ CRM" },
    ],
  },
  plans: {
    eyebrow: "แพ็กเกจ",
    h2: "เลือกแพ็กเกจที่เหมาะกับองค์กร",
    p: "ผู้ใช้ไม่จำกัดทุกแพ็กเกจ คิดราคาตามชั่วโมงถอดเสียงที่ใช้รวมทั้งองค์กร",
    perYear: "/ ปี",
    standard: {
      price: P.stdYear,
      sub: `เฉลี่ย ${P.stdMonth} ต่อเดือน`,
      for: "สำหรับทีมที่ต้องการให้ทุกการประชุมถูกบันทึก สรุป และค้นหาได้",
      cta: "เลือก Standard",
      listLabel: "รวมในแพ็กเกจ",
      list: [
        "ผู้ใช้ไม่จำกัด",
        "สภาพแวดล้อมและฐานข้อมูลส่วนตัวขององค์กร",
        `ถอดเสียง ${P.stdHrs} ชั่วโมงต่อเดือน ใช้ร่วมกันทั้งองค์กร`,
        "ถามได้ไม่จำกัด พร้อมคำตอบเชิงลึก",
        "ผู้ช่วย Second Brain",
        "Recap, Prep และรายงานการประชุม PDF",
      ],
    },
    premium: {
      tag: "ยอดนิยม · ต้นทุนต่อชั่วโมงต่ำกว่า",
      price: P.preYear,
      sub: `เฉลี่ย ${P.preMonth} ต่อเดือน`,
      for: "สำหรับองค์กรที่ต้องการคลังเอกสารที่ค้นหาได้ และให้ผู้จัดการเห็นภาพรวมข้ามทีม",
      cta: "เลือก Premium",
      listLabel: "ทุกอย่างใน Standard และ",
      list: [
        `ถอดเสียง ${P.preHrs} ชั่วโมงต่อเดือน ใช้ร่วมกันทั้งองค์กร`,
        "ผู้ช่วยด้านความรู้ 2 ตัว",
        "เอกสารในคลังสูงสุด 4,000 ไฟล์",
        "ผู้จัดการเห็นการประชุมของทีม",
        "Audit log และการเชื่อมต่อกับเครื่องมือ AI อื่น",
      ],
    },
    customize: {
      price: "ติดต่อทีมขาย",
      for: "สำหรับองค์กรที่ต้องการปริมาณการใช้งาน ผู้ช่วย หรือการเชื่อมระบบเฉพาะ",
      cta: "ติดต่อทีมขาย",
      listLabel: "ทุกอย่างใน Premium และ",
      list: [
        "ชั่วโมงถอดเสียงตามสัญญา",
        "ผู้ช่วยเฉพาะทางตามขั้นตอนงานขององค์กร",
        "SSO และการเชื่อมต่อกับ CRM และระบบภายใน",
        "ทีมดูแลเฉพาะ พร้อม SLA",
      ],
    },
    note: "ราคาเป็นบาทต่อองค์กรต่อปี ยังไม่รวม VAT 7% · รวมค่าเซิร์ฟเวอร์ตามต้นทุนจริง · ราคาเป็นตัวอย่าง รอยืนยัน",
  },
  compare: {
    heading: "เปรียบเทียบแพ็กเกจ",
    featureCol: "ฟีเจอร์",
    std: { year: `${P.stdYear} / ปี`, month: `${P.stdMonth} / เดือน`, cta: "เลือก" },
    prem: { year: `${P.preYear} / ปี`, month: `${P.preMonth} / เดือน`, cta: "เลือก Premium" },
    cus: { price: "ติดต่อทีมขาย", cta: "ติดต่อทีมขาย" },
    yes: "มี",
    no: "ไม่มี",
    beta: "(Beta)",
    rows: [
      { group: "การใช้งาน" },
      { label: "จำนวนผู้ใช้", std: "ไม่จำกัด", prem: "ไม่จำกัด", cus: "ไม่จำกัด" },
      { label: "ชั่วโมงถอดเสียงต่อเดือน", std: `${P.stdHrs} ชั่วโมง`, prem: `${P.preHrs} ชั่วโมง`, cus: "ตามสัญญา" },
      { label: "ซื้อชั่วโมงเพิ่ม", std: `${P.stdExtra} / ชั่วโมง`, prem: `${P.preExtra} / ชั่วโมง`, cus: "ตามสัญญา" },
      { group: "ผู้ช่วย" },
      { label: "คำตอบเชิงลึก (Think)", std: true, prem: true, cus: true },
      { label: "ถามข้ามทุกการประชุม", std: "ไม่จำกัด", prem: "ไม่จำกัด", cus: "ไม่จำกัด" },
      { label: "ผู้ช่วย Second Brain", std: true, prem: true, cus: true },
      { label: "ผู้ช่วยด้านความรู้", std: false, prem: "2 ตัว", cus: "ตามต้องการ" },
      { label: "เอกสารในคลัง", std: false, prem: "สูงสุด 4,000 ไฟล์", cus: "ตามต้องการ" },
      { group: "บันทึกและสรุป" },
      { label: "ถอดเสียงสดไทยและอังกฤษ พร้อมระบุผู้พูด", std: true, prem: true, cus: true },
      { label: "Recap, Prep และรายงานการประชุม PDF", std: true, prem: true, cus: true },
      { label: "แม่แบบรายงานการประชุมของบริษัท", std: false, prem: true, cus: true },
      { label: "แชตของทีม", std: true, prem: true, cus: true },
      { label: "Google Calendar และ Outlook", std: true, prem: true, cus: true },
      { label: "แอป Web, macOS, iOS และ Chrome extension", std: true, prem: true, cus: true },
      { label: "เชื่อมต่อกับเครื่องมือ AI อื่น (MCP)", std: false, prem: true, cus: true, beta: true },
      { group: "Privacy & Security" },
      { label: "เข้ารหัสข้อมูลขณะส่งและจัดเก็บ", std: true, prem: true, cus: true },
      { label: "เจ้าของและผู้เข้าร่วมเห็นการประชุมของตัวเอง", std: true, prem: true, cus: true },
      { label: "ผู้จัดการเห็นการประชุมของทีม", std: false, prem: true, cus: true },
      { label: "Audit log การเข้าถึง", std: false, prem: true, cus: true },
      { label: "สภาพแวดล้อมและฐานข้อมูลส่วนตัวขององค์กร", std: true, prem: true, cus: true },
      { label: "ข้อมูลเก็บในสิงคโปร์ (asia-southeast1)", std: true, prem: true, cus: true },
      { group: "เฉพาะ Customize" },
      { label: "ผู้ช่วยเฉพาะทางตามขั้นตอนงานขององค์กร", std: false, prem: false, cus: true },
      { label: "เชื่อม SSO, CRM และระบบภายใน", std: false, prem: false, cus: true },
      { label: "ทีมดูแลเฉพาะ พร้อม SLA", std: false, prem: false, cus: true },
    ],
  },
  spec: {
    h2: "สเปก",
    items: [
      { dt: "แพลตฟอร์ม", dd: "เว็บ, แอป macOS, iOS และ Chrome extension สำหรับ Google Meet" },
      { dt: "ภาษาที่ถอดเสียง", dd: "ไทย, อังกฤษ และไทยปนอังกฤษในประโยคเดียว" },
      { dt: "ปฏิทิน", dd: "Google Calendar และ Microsoft Outlook" },
      { dt: "การเข้าสู่ระบบ", dd: "บัญชี Google หรือ Microsoft ขององค์กร" },
      { dt: "การส่งออก", dd: "รายงานการประชุม PDF ภาษาไทยและอังกฤษ" },
      { dt: "เชื่อมเครื่องมือ AI อื่น", dd: "เชื่อมต่อกับ Claude และเครื่องมืออื่นที่รองรับ MCP" },
      { dt: "สิทธิ์การเข้าถึง", dd: "เจ้าของ, ผู้เข้าร่วม, ผู้จัดการ (ตามสายบังคับบัญชา) และผู้ดูแลระบบ" },
      { dt: "ที่เก็บข้อมูล", dd: "Google Cloud (region สิงคโปร์, asia-southeast1) เข้ารหัสขณะส่งและจัดเก็บ" },
    ],
  },
  faq: {
    h2: "คำถามที่พบบ่อย",
    items: [
      {
        q: "“ผู้ใช้ไม่จำกัด” หมายความว่าอย่างไร",
        a: "เพิ่มคนในองค์กรได้ไม่จำกัดโดยไม่มีค่าใช้จ่ายเพิ่ม แพ็กเกจกำหนดเฉพาะชั่วโมงถอดเสียงรวมต่อเดือนที่ทุกคนใช้ร่วมกัน",
      },
      {
        q: "นับชั่วโมงถอดเสียงอย่างไร",
        a: "นับตามความยาวเสียงจริง ทั้งการบันทึกสด ไฟล์ที่อัปโหลด และ voice note ของทุกคนในองค์กรรวมกัน โควตารีเซ็ตทุกวันที่ 1 ของเดือน ชั่วโมงที่ไม่ได้ใช้ไม่สะสม",
      },
      {
        q: "ถ้าใช้ชั่วโมงหมดก่อนสิ้นเดือน",
        a: "ยังบันทึกได้ตามปกติ ระบบเก็บไฟล์ไว้และถอดเสียงให้เมื่อเริ่มเดือนใหม่ หรืออัปเกรดแพ็กเกจเพื่อถอดเสียงต่อได้ทันที",
      },
      {
        q: "ใครเห็นการประชุมของฉันได้บ้าง",
        a: "เจ้าของและผู้เข้าร่วมเห็นการประชุมได้ทุกแพ็กเกจ Premium เพิ่มให้ผู้จัดการเห็นการประชุมของทีม และผู้ดูแลระบบตรวจสอบได้ว่าใครเข้าถึงอะไรจาก Audit log",
      },
      {
        q: "เปลี่ยนแพ็กเกจกลางรอบได้ไหม",
        a: "อัปเกรดได้ทันทีและจ่ายเฉพาะส่วนต่างตามวันที่เหลือ การลดแพ็กเกจมีผลเมื่อเริ่มรอบบิลถัดไป ข้อมูลการประชุมเดิมยังอยู่ครบ",
      },
      {
        q: "Customize คืออะไร",
        a: `แพ็กเกจที่ออกแบบตามความต้องการขององค์กร เช่น ชั่วโมงถอดเสียงมากกว่า ${P.preHrs} ชั่วโมงต่อเดือน ผู้ช่วยเฉพาะทาง หรือการเชื่อมระบบภายใน ติดต่อทีมขายเพื่อขอใบเสนอราคา`,
      },
    ],
  },
  footer: {
    left: "© 2026 Beryl8 · MEET8 (Second Brain)",
    right: "ราคาแสดงเป็นบาท ยังไม่รวมภาษีมูลค่าเพิ่ม",
  },
  bar: {
    label: "สรุปแพ็กเกจที่เลือก",
    plans: {
      standard: {
        name: "MEET8 (Second Brain) · Standard",
        meta: `ผู้ใช้ไม่จำกัด · ${P.stdHrs} ชั่วโมงต่อเดือน`,
        priceLabel: "ราคา:",
        price: `${P.stdYear} / ปี`,
        monthly: `เฉลี่ย ${P.stdMonth} /เดือน`,
        cta: "เลือก Standard",
        sent: "ส่งคำขอแล้ว ทีมขายจะติดต่อกลับ",
      },
      premium: {
        name: "MEET8 (Second Brain) · Premium",
        meta: `ผู้ใช้ไม่จำกัด · ${P.preHrs} ชั่วโมงต่อเดือน`,
        priceLabel: "ราคา:",
        price: `${P.preYear} / ปี`,
        monthly: `เฉลี่ย ${P.preMonth} /เดือน`,
        cta: "เลือก Premium",
        sent: "ส่งคำขอแล้ว ทีมขายจะติดต่อกลับ",
      },
      customize: {
        name: "MEET8 (Second Brain) · Customize",
        meta: "ผู้ใช้ไม่จำกัด · ปริมาณการใช้งานและผู้ช่วยตามความต้องการ",
        price: "ติดต่อทีมขาย",
        cta: "ติดต่อทีมขาย",
        sent: "ส่งคำขอแล้ว ทีมขายจะติดต่อกลับ",
      },
    },
  },
};

const content: Record<Locale, Meet8Content> = { en, th };

export const getMeet8Content = (lang: Locale): Meet8Content => content[lang];
