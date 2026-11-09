import type { Localized } from "./i18n";

/* ------------------------------------------------------------------
   Pricing model for the estimate calculator.
   Rules agreed in "AI Pricing and Licensing" (2026-11-09):
   - Perpetual license per named user, minimum 20 users per customer.
   - MA 22% of the license per year, mandatory from year 2.
   - License excludes AI, cloud and implementation. Exceptions billed by
     Beryl8: Voice per minute (US$0.076 incl. AI), Meet transcription
     + summary (US$2.5 per hour, cost about US$0.74) and the Ask 8 AI
     Pack (draft, about ฿4 per credit at ฿33.5/US$).
   - Insight8 US$480 per named user (US$20 x 24 months).
   Every other number is a draft (`draft: true`) until finance confirms.
   All money here is USD; the page converts with the rate the user sets.
   ------------------------------------------------------------------ */

export const MA_RATE = 0.22;
export const MIN_USERS = 20;
export const YEARS = 5;
export const VAT = 0.07;
export const DEFAULT_RATE = 33.5; // THB per USD; makes US$0.076 = ฿2.55 as quoted
export const DEFAULT_DAY_RATE_THB = 15000;
export const DEFAULT_PARTNER = 30;

export type Payer = "beryl8" | "direct";
export type Kind = "usage" | "ai" | "cloud" | "telco";

export type Input = {
  id: string;
  label: Localized;
  unit: Localized;
  def: number;
  max: number;
  step?: number;
  help?: Localized;
  /** Two-way choice stored as 0 or 1; `choices[1]` is the value 1. */
  choices?: [Localized, Localized];
};

/** One monthly running cost. `sell` is what the customer pays, `cost` what it costs Beryl8 (same as sell when paid direct). */
/** `detail` shows how the amount was worked out, e.g. "20 users × 80 questions × US$0.30". */
export type Line = {
  id: string; label: Localized; payer: Payer; kind: Kind; sell: number; cost: number; draft?: boolean; detail?: Localized;
  /** Share taken off by a 1-year Google Cloud committed-use discount, when the customer buys one. */
  cud?: number;
};

export type Size = "lean" | "standard";
/** 1-year committed-use discounts: Cloud SQL 25%, Cloud Run about 17%. Only compute rows carry one. */
export const CUD = { run: 0.17, sql: 0.25 } as const;

export type ProductPricing = {
  id: string;
  /** US$ per named user, perpetual. null = no per-user license (priced by usage). */
  license: number | null;
  licenseDraft: boolean;
  unitLabel: Localized;
  setupDays: number;
  inputs: Input[];
  lines: (v: Record<string, number>, users: number, size: Size) => Line[];
  /** Products with a measured cheaper server setup offer a size choice. */
  sizes?: Record<Size, Localized>;
  notes: Localized[];
};

const L = (en: string, th: string): Localized => ({ en, th });
const blocks = (n: number, size: number) => Math.max(1, Math.ceil(n / size));
/** Which side of a two-way input a stored value means. A hand-edited share link can hold anything from 0 to 1. */
export const choiceIndex = (x: number) => (x >= 0.5 ? 1 : 0);

/* Ask 8 per answered question, all draft. Cost is Sonnet 5.5 at a 60% cache hit, not yet measured from real usage. */
const ASK8 = {
  creditSell: 4 / DEFAULT_RATE, // ฿4 at the default rate
  infra: 0.003,
  ask: { credits: 1, cost: 0.0389 },
  data: { credits: 2, cost: 0.0792 },
  action: { credits: 4, cost: 0.1805 },
};

const USERS = L("named users", "ผู้ใช้ (named user)");
const n = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 4 });

/** One Google Cloud service: label, US$ per month for one set of servers. */
type Svc = [en: string, th: string, usd: number, cud?: keyof typeof CUD];

/** Google Cloud services as separate rows, `sets` copies of the stack (more users → more sets). */
function gcp(svcs: Svc[], sets: number, draft: boolean): Line[] {
  return svcs.map(([en, th, usd, family]) => ({
    id: "gcp-" + en.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: L(`Google Cloud · ${en}`, `Google Cloud · ${th}`),
    payer: "direct" as const,
    kind: "cloud" as const,
    sell: usd * sets,
    cost: usd * sets,
    draft,
    cud: family ? CUD[family] : undefined,
    detail: L(sets > 1 ? `${sets} sets × US$${n(usd)} / month` : `US$${n(usd)} / month`, sets > 1 ? `${sets} ชุด × US$${n(usd)} ต่อเดือน` : `US$${n(usd)} ต่อเดือน`),
  }));
}

/** A usage-driven Google Cloud row with its formula. */
const gcpUsage = (id: string, en: string, th: string, usd: number, detail: Localized, family?: keyof typeof CUD): Line => ({
  id, label: L(`Google Cloud · ${en}`, `Google Cloud · ${th}`), payer: "direct", kind: "cloud", sell: usd, cost: usd, draft: true, detail,
  cud: family ? CUD[family] : undefined,
});

export const PRICING: Record<string, ProductPricing> = {
  meet8: {
    id: "meet8",
    license: 360,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 3,
    inputs: [
      { id: "hours", label: L("Meeting hours transcribed per month", "ชั่วโมงประชุมที่ถอดเสียงต่อเดือน"), unit: L("hours", "ชั่วโมง"), def: 200, max: 100000, step: 10 },
      { id: "asks", label: L("Questions per user per month", "คำถามต่อผู้ใช้ต่อเดือน"), unit: L("questions", "คำถาม"), def: 30, max: 10000, step: 5, help: L("Questions asked across past meetings.", "คำถามที่ถามย้อนหลังข้ามการประชุม") },
    ],
    lines: (v, users) => [
      { id: "stt", label: L("Transcription and summary (US$2.5 per hour)", "ถอดเสียงและสรุป (US$2.5 ต่อชั่วโมง)"), payer: "beryl8", kind: "usage", sell: v.hours * 2.5, cost: v.hours * 0.74 },
      { id: "ai", label: L("AI model for questions", "ค่าโมเดล AI สำหรับถาม-ตอบ"), payer: "direct", kind: "ai", sell: users * v.asks * 0.012, cost: users * v.asks * 0.012, draft: true,
        detail: L(`${n(users)} users × ${n(v.asks)} questions × US$0.012`, `${n(users)} คน × ${n(v.asks)} คำถาม × US$0.012`) },
      // Size M stack from the Meet8 pricing model (app/[lang]/meet8/content.ts), one set per 300 users.
      ...gcp([
        ["Cloud Run (app and API)", "Cloud Run (แอปและ API)", 236, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 166, "sql"],
        ["Memorystore (Redis)", "Memorystore (Redis)", 166],
        ["Compute Engine (live transcription)", "Compute Engine (ถอดเสียงสด)", 135],
        ["Load Balancer", "Load Balancer", 21],
        ["Cloud Armor", "Cloud Armor", 18],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 22],
      ], blocks(users, 300), false),
    ],
    notes: [L("Cloud based on the size M Google Cloud stack, one stack per 300 users.", "ค่า cloud อิงชุด Google Cloud ขนาด M หนึ่งชุดต่อ 300 ผู้ใช้")],
  },
  agent8: {
    id: "agent8",
    license: 480,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 10,
    inputs: [
      { id: "runs", label: L("Agent runs per month", "จำนวนครั้งที่ Agent ทำงานต่อเดือน"), unit: L("runs", "ครั้ง"), def: 5000, max: 10000000, step: 500 },
      { id: "tokens", label: L("Tokens per run", "token ต่อครั้ง"), unit: L("tokens", "token"), def: 8000, max: 1000000, step: 1000 },
      { id: "price", label: L("Model price per 1M tokens (blended)", "ราคาโมเดลต่อ 1 ล้าน token (เฉลี่ย)"), unit: L("US$", "US$"), def: 3, max: 100, step: 0.5 },
    ],
    lines: (v, users) => [
      { id: "ai", label: L("AI model usage (your provider key)", "ค่าโมเดล AI (key ของคุณเอง)"), payer: "direct", kind: "ai", sell: (v.runs * v.tokens * v.price) / 1e6, cost: (v.runs * v.tokens * v.price) / 1e6,
        detail: L(`${n(v.runs)} runs × ${n(v.tokens)} tokens × US$${n(v.price)} per 1M`, `${n(v.runs)} ครั้ง × ${n(v.tokens)} token × US$${n(v.price)} ต่อ 1 ล้าน`) },
      ...gcp([
        ["Cloud Run (gateway and agents)", "Cloud Run (เกตเวย์และ Agent)", 120, "run"],
        ["Cloud SQL (database and logs)", "Cloud SQL (ฐานข้อมูลและ log)", 110, "sql"],
        ["Memorystore (rate limits, cache)", "Memorystore (rate limit, cache)", 40],
        ["Load Balancer", "Load Balancer", 20],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 10],
      ], blocks(users, 500), true),
    ],
    notes: [L("Model usage is paid directly to your provider. Runs on Cortex for now; recheck when Cortex starts charging.", "ค่าโมเดลจ่ายตรงกับผู้ให้บริการ ตอนนี้ใช้ Cortex ไปก่อน ต้องเทียบราคาใหม่เมื่อ Cortex เริ่มคิดเงิน")],
  },
  voice8: {
    id: "voice8",
    license: null,
    licenseDraft: false,
    unitLabel: L("Studio users", "ผู้ใช้ Studio"),
    setupDays: 10,
    inputs: [
      { id: "minutes", label: L("Conversation minutes per month", "นาทีสนทนาต่อเดือน"), unit: L("minutes", "นาที"), def: 10000, max: 10000000, step: 1000, help: L("Example: 1,000 calls x 5 minutes x 2 batches.", "ตัวอย่าง: 1,000 สาย x 5 นาที x 2 รอบ") },
      { id: "sip", label: L("Phone line charge per minute (your carrier)", "ค่าโทรต่อนาที (ผู้ให้บริการสายของคุณ)"), unit: L("US$", "US$"), def: 0.02, max: 5, step: 0.005 },
    ],
    lines: (v) => [
      { id: "min", label: L("AI conversation minutes (US$0.076 per minute, AI included)", "นาทีสนทนา AI (US$0.076 ต่อนาที รวมค่า AI)"), payer: "beryl8", kind: "usage", sell: v.minutes * 0.076, cost: v.minutes * 0.03 },
      { id: "sip", label: L("Phone line charges (SIP trunk)", "ค่าโทรศัพท์ (SIP trunk)"), payer: "direct", kind: "telco", sell: v.minutes * v.sip, cost: v.minutes * v.sip, draft: true,
        detail: L(`${n(v.minutes)} min × US$${n(v.sip)}`, `${n(v.minutes)} นาที × US$${n(v.sip)}`) },
      ...gcp([
        ["Compute Engine (call and media servers)", "Compute Engine (เซิร์ฟเวอร์สายและเสียง)", 140],
        ["Cloud Run (Studio and API)", "Cloud Run (Studio และ API)", 50, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 46, "sql"],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 14],
      ], blocks(v.minutes, 200000), true),
    ],
    notes: [L("Priced per minute with no per-user license. AI hands over to staff after 5 minutes.", "คิดตามนาที ไม่มี license ต่อผู้ใช้ AI คุยไม่เกิน 5 นาทีต่อสาย เกินแล้วโอนให้เจ้าหน้าที่")],
  },
  insight8: {
    id: "insight8",
    license: 480,
    licenseDraft: false,
    unitLabel: USERS,
    setupDays: 5,
    inputs: [
      { id: "asks", label: L("Questions per user per month", "คำถามต่อผู้ใช้ต่อเดือน"), unit: L("questions", "คำถาม"), def: 80, max: 10000, step: 10 },
      { id: "aiQ", label: L("AI cost per question", "ค่า AI ต่อคำถาม"), unit: L("US$", "US$"), def: 0.3, max: 10, step: 0.01,
        help: L("Draft. Replace with the cost measured from your real bill.", "ราคาร่าง แก้เป็นค่าที่วัดจากบิลจริงได้") },
    ],
    sizes: {
      lean: L("Lean: right-sized for about 20–200 users", "ประหยัด: ขนาดพอดีสำหรับราว 20–200 คน"),
      standard: L("Standard: the larger always-on setup", "มาตรฐาน: เครื่องใหญ่ เปิดค้างตลอด"),
    },
    lines: (v, users, size) => [
      { id: "ai", label: L("AI model for questions and dashboards", "ค่าโมเดล AI สำหรับคำถามและ dashboard"), payer: "direct", kind: "ai", sell: users * v.asks * v.aiQ, cost: users * v.asks * v.aiQ, draft: true,
        detail: L(`${n(users)} users × ${n(v.asks)} questions × US$${n(v.aiQ)}`, `${n(users)} คน × ${n(v.asks)} คำถาม × US$${n(v.aiQ)}`) },
      // Standard = the stack in app/[lang]/insight8/pricing-model.ts. Lean = the cost review of 2026-11-09:
      // Studio 1 vCPU / 1 GiB (−฿2,300), sandbox CPU only while answering (−฿3,000), Cloud SQL 1 vCPU / 3.75 GB (−฿2,400).
      ...gcp(
        size === "standard"
          ? [
              ["Cloud Run (Studio, 2 vCPU / 2 GiB)", "Cloud Run (Studio, 2 vCPU / 2 GiB)", 138.76, "run"],
              ["Cloud Run (gVisor sandbox, 2 vCPU / 4 GiB always on)", "Cloud Run (sandbox gVisor, 2 vCPU / 4 GiB เปิดค้าง)", 149.86, "run"],
              ["Cloud Run (agent tools)", "Cloud Run (tools ของ Agent)", 45.6, "run"],
              ["Cloud Run jobs (refresh, Pulse)", "Cloud Run jobs (refresh, Pulse)", 15.86],
              ["Cloud SQL (2 vCPU / 8 GB)", "Cloud SQL (2 vCPU / 8 GB)", 141.62, "sql"],
              ["Cloud SQL storage", "พื้นที่ Cloud SQL", 7.56],
              ["Networking", "Network", 16.22],
              ["Other", "อื่นๆ", 6.1],
            ]
          : [
              ["Cloud Run (Studio, 1 vCPU / 1 GiB)", "Cloud Run (Studio, 1 vCPU / 1 GiB)", 70.1, "run"],
              ["Cloud Run (gVisor sandbox, CPU only while answering)", "Cloud Run (sandbox gVisor, ใช้ CPU เฉพาะตอนตอบ)", 60.31, "run"],
              ["Cloud Run (agent tools)", "Cloud Run (tools ของ Agent)", 45.6, "run"],
              ["Cloud Run jobs (refresh, Pulse)", "Cloud Run jobs (refresh, Pulse)", 15.86],
              ["Cloud SQL (1 vCPU / 3.75 GB)", "Cloud SQL (1 vCPU / 3.75 GB)", 69.98, "sql"],
              ["Cloud SQL storage", "พื้นที่ Cloud SQL", 7.56],
              ["Networking", "Network", 16.22],
              ["Other", "อื่นๆ", 6.1],
            ],
        blocks(users, 200),
        size !== "standard",
      ),
    ],
    notes: [L("Compare: Tableau about US$35 per user per month.", "เทียบ: Tableau ราว US$35 ต่อผู้ใช้ต่อเดือน")],
  },
  connect8: {
    id: "connect8",
    license: 240,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 5,
    inputs: [
      { id: "runs", label: L("Workflow runs per month", "จำนวน workflow ที่รันต่อเดือน"), unit: L("runs", "ครั้ง"), def: 20000, max: 100000000, step: 1000 },
      { id: "aiShare", label: L("Runs with an AI step", "สัดส่วนที่มีขั้นตอน AI"), unit: L("%", "%"), def: 30, max: 100, step: 5 },
    ],
    lines: (v, users) => [
      { id: "ai", label: L("AI steps", "ขั้นตอน AI"), payer: "direct", kind: "ai", sell: v.runs * (v.aiShare / 100) * 0.004, cost: v.runs * (v.aiShare / 100) * 0.004, draft: true,
        detail: L(`${n(v.runs)} runs × ${n(v.aiShare)}% × US$0.004`, `${n(v.runs)} ครั้ง × ${n(v.aiShare)}% × US$0.004`) },
      ...gcp([
        ["Cloud Run (workflow engine)", "Cloud Run (ตัวรัน workflow)", 90, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 70, "sql"],
        ["Pub/Sub and Cloud Tasks", "Pub/Sub และ Cloud Tasks", 26],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 14],
      ], blocks(v.runs, 500000), true),
      gcpUsage("gcp-users", "Cloud Run (per user)", "Cloud Run (ตามจำนวนผู้ใช้)", users * 0.2, L(`${n(users)} users × US$0.20`, `${n(users)} คน × US$0.20`)),
    ],
    notes: [],
  },
  space8: {
    id: "space8",
    license: 144,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 2,
    inputs: [
      { id: "online", label: L("People online at the same time", "สัดส่วนคนออนไลน์พร้อมกัน"), unit: L("%", "%"), def: 40, max: 100, step: 5 },
    ],
    lines: (v, users) => [
      ...gcp([
        ["Cloud Run (app and realtime)", "Cloud Run (แอปและ realtime)", 60, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 50, "sql"],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 40],
      ], 1, true),
      gcpUsage("gcp-media", "Compute Engine (voice and video)", "Compute Engine (เสียงและวิดีโอ)", users * (v.online / 100) * 1.5,
        L(`${n(users)} users × ${n(v.online)}% online × US$1.50`, `${n(users)} คน × ออนไลน์ ${n(v.online)}% × US$1.50`)),
    ],
    notes: [],
  },
  pulse8: {
    id: "pulse8",
    license: 360,
    licenseDraft: true,
    unitLabel: L("marketing users", "ผู้ใช้ฝั่งการตลาด"),
    setupDays: 8,
    inputs: [
      { id: "contacts", label: L("Contacts", "จำนวนรายชื่อลูกค้า"), unit: L("contacts", "รายชื่อ"), def: 50000, max: 100000000, step: 5000 },
      { id: "email", label: L("Emails per month", "อีเมลต่อเดือน"), unit: L("emails", "ฉบับ"), def: 100000, max: 1000000000, step: 10000 },
      { id: "sms", label: L("SMS per month", "SMS ต่อเดือน"), unit: L("messages", "ข้อความ"), def: 10000, max: 100000000, step: 1000 },
      { id: "line", label: L("LINE OA messages per month", "ข้อความ LINE OA ต่อเดือน"), unit: L("messages", "ข้อความ"), def: 20000, max: 100000000, step: 1000 },
    ],
    lines: (v) => [
      { id: "email", label: L("Email sending (your provider)", "ค่าส่งอีเมล (ผู้ให้บริการของคุณ)"), payer: "direct", kind: "telco", sell: v.email * 0.0001, cost: v.email * 0.0001, draft: true,
        detail: L(`${n(v.email)} emails × US$0.0001`, `${n(v.email)} ฉบับ × US$0.0001`) },
      { id: "sms", label: L("SMS (your provider)", "ค่าส่ง SMS (ผู้ให้บริการของคุณ)"), payer: "direct", kind: "telco", sell: v.sms * 0.0075, cost: v.sms * 0.0075, draft: true,
        detail: L(`${n(v.sms)} messages × US$0.0075 (≈฿0.25)`, `${n(v.sms)} ข้อความ × US$0.0075 (≈฿0.25)`) },
      { id: "line", label: L("LINE OA messages", "ค่าส่ง LINE OA"), payer: "direct", kind: "telco", sell: v.line * 0.003, cost: v.line * 0.003, draft: true,
        detail: L(`${n(v.line)} messages × US$0.003 (≈฿0.10)`, `${n(v.line)} ข้อความ × US$0.003 (≈฿0.10)`) },
      ...gcp([
        ["Cloud Run (app and sending)", "Cloud Run (แอปและระบบส่ง)", 120, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 110, "sql"],
        ["Memorystore (queues)", "Memorystore (คิว)", 40],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 30],
      ], 1, true),
      gcpUsage("gcp-contacts", "Cloud SQL (per 100,000 contacts)", "Cloud SQL (ทุก 100,000 รายชื่อ)", blocks(v.contacts, 100000) * 100,
        L(`${blocks(v.contacts, 100000)} × US$100`, `${blocks(v.contacts, 100000)} × US$100`)),
    ],
    notes: [L("Assumed fees: SMS ฿0.25, LINE OA ฿0.10, email US$0.10 per 1,000.", "สมมติค่าส่ง: SMS ฿0.25 LINE OA ฿0.10 อีเมล US$0.10 ต่อ 1,000 ฉบับ")],
  },
  collab8: {
    id: "collab8",
    license: 216,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 5,
    inputs: [
      { id: "sessions", label: L("Agent sessions per user per month", "session ของ Agent ต่อผู้ใช้ต่อเดือน"), unit: L("sessions", "session"), def: 20, max: 10000, step: 5 },
    ],
    lines: (v, users) => [
      { id: "ai", label: L("AI model for agent sessions", "ค่าโมเดล AI สำหรับ session ของ Agent"), payer: "direct", kind: "ai", sell: users * v.sessions * 0.15, cost: users * v.sessions * 0.15, draft: true,
        detail: L(`${n(users)} users × ${n(v.sessions)} sessions × US$0.15`, `${n(users)} คน × ${n(v.sessions)} session × US$0.15`) },
      ...gcp([
        ["Cloud Run (chat and API)", "Cloud Run (แชตและ API)", 130, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 110, "sql"],
        ["Memorystore (realtime)", "Memorystore (realtime)", 40],
        ["Cloud Storage (files)", "Cloud Storage (ไฟล์)", 30],
        ["Logging and other", "Logging และอื่นๆ", 40],
      ], 1, true),
      gcpUsage("gcp-sandbox", "Cloud Run (agent workspaces)", "Cloud Run (พื้นที่ทำงานของ Agent)", users * v.sessions * 0.02,
        L(`${n(users)} users × ${n(v.sessions)} sessions × US$0.02`, `${n(users)} คน × ${n(v.sessions)} session × US$0.02`)),
    ],
    notes: [L("Compare: Slack about US$9 per user per month.", "เทียบ: Slack ราว US$9 ต่อผู้ใช้ต่อเดือน")],
  },
  ask8: {
    id: "ask8",
    license: 120,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 3,
    inputs: [
      { id: "asks", label: L("Questions per user per month", "คำถามต่อผู้ใช้ต่อเดือน"), unit: L("questions", "คำถาม"), def: 40, max: 10000, step: 5 },
      { id: "gb", label: L("Documents indexed", "ขนาดเอกสารที่ให้ค้น"), unit: L("GB", "GB"), def: 10, max: 100000, step: 5 },
      { id: "data", label: L("Questions that look up data", "คำถามที่ดึงข้อมูล"), unit: L("%", "%"), def: 30, max: 100, step: 5 },
      { id: "action", label: L("Questions that update data, run a flow or send email", "คำถามที่อัปเดตข้อมูล สั่ง flow หรือส่งอีเมล"), unit: L("%", "%"), def: 10, max: 100, step: 5,
        help: L("The rest are plain answers.", "ส่วนที่เหลือนับเป็นถามตอบทั่วไป") },
      { id: "pack", label: L("How AI is paid for", "วิธีจ่ายค่า AI"), unit: L("", ""), def: 1, max: 1,
        choices: [L("Pay your AI provider directly", "จ่ายค่าโมเดลกับผู้ให้บริการเอง"), L("AI Pack billed by Beryl8, per credit", "AI Pack เรียกเก็บโดย Beryl8 ตาม credit")] },
    ],
    lines: (v, users) => {
      const data = Math.min(v.data, 100 - v.action);
      const ask = Math.max(0, 100 - data - v.action); // float noise can land just below zero
      const mix = `${n(ask)}/${n(data)}/${n(v.action)}%`;
      const perQuestion = (k: "credits" | "cost") => (ask * ASK8.ask[k] + data * ASK8.data[k] + v.action * ASK8.action[k]) / 100;
      const questions = users * v.asks;
      const model = questions * perQuestion("cost");
      const ai: Line = choiceIndex(v.pack) === 1
        ? { id: "ai", label: L("AI Pack (≈฿4 per credit at ฿33.5/US$)", "AI Pack (≈฿4 ต่อ credit ที่ ฿33.5/US$)"), payer: "beryl8", kind: "usage", draft: true,
            sell: questions * perQuestion("credits") * ASK8.creditSell, cost: model + questions * ASK8.infra,
            detail: L(`${n(users)} users × ${n(v.asks)} questions × ${n(perQuestion("credits"))} credits · answers/data/actions ${mix}`, `${n(users)} คน × ${n(v.asks)} คำถาม × ${n(perQuestion("credits"))} credit · ถามตอบ/ดึงข้อมูล/สั่งงาน ${mix}`) }
        : { id: "ai", label: L("AI model for answers (your provider)", "ค่าโมเดล AI สำหรับคำตอบ (ผู้ให้บริการของคุณ)"), payer: "direct", kind: "ai", draft: true,
            sell: model, cost: model,
            detail: L(`${n(users)} users × ${n(v.asks)} questions · answers/data/actions ${mix}`, `${n(users)} คน × ${n(v.asks)} คำถาม · ถามตอบ/ดึงข้อมูล/สั่งงาน ${mix}`) };
      return [
        ai,
        ...gcp([
          ["Cloud Run (widget and API)", "Cloud Run (widget และ API)", 60, "run"],
          ["Cloud SQL with pgvector", "Cloud SQL พร้อม pgvector", 70, "sql"],
          ["Logging and other", "Logging และอื่นๆ", 20],
        ], 1, true),
        gcpUsage("gcp-docs", "Storage and search index", "Storage และดัชนีค้นหา", v.gb * 0.5, L(`${n(v.gb)} GB × US$0.50`, `${n(v.gb)} GB × US$0.50`)),
      ];
    },
    notes: [L("AI Pack: a plain answer is 1 credit, a data lookup 2, an update, flow or email 4. Failed answers are not charged.", "AI Pack: ถามตอบ 1 credit, ดึงข้อมูล 2 credit, อัปเดตข้อมูล สั่ง flow หรือส่งอีเมล 4 credit คำถามที่ตอบไม่สำเร็จไม่คิดเงิน")],
  },
  data8: {
    id: "data8",
    license: 480,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 8,
    inputs: [
      { id: "profiles", label: L("Customer profiles", "จำนวนโปรไฟล์ลูกค้า"), unit: L("profiles", "โปรไฟล์"), def: 100000, max: 1000000000, step: 10000 },
      { id: "events", label: L("Events per month", "event ต่อเดือน"), unit: L("events", "event"), def: 1000000, max: 10000000000, step: 100000 },
    ],
    lines: (v) => [
      ...gcp([
        ["Cloud Run (app and pipelines)", "Cloud Run (แอปและ pipeline)", 60, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 90, "sql"],
        ["Logging and other", "Logging และอื่นๆ", 50],
      ], 1, true),
      gcpUsage("gcp-bq-store", "BigQuery storage (per 100,000 profiles)", "BigQuery พื้นที่เก็บ (ทุก 100,000 โปรไฟล์)", blocks(v.profiles, 100000) * 80,
        L(`${blocks(v.profiles, 100000)} × US$80`, `${blocks(v.profiles, 100000)} × US$80`)),
      gcpUsage("gcp-bq-query", "BigQuery processing (per 1M events)", "BigQuery ประมวลผล (ทุก 1 ล้าน event)", blocks(v.events, 1000000) * 15,
        L(`${blocks(v.events, 1000000)} × US$15`, `${blocks(v.events, 1000000)} × US$15`)),
    ],
    notes: [],
  },
};

/* ---------------------------- estimate ---------------------------- */

/** True only for our products; "constructor", "__proto__" etc. are not. */
export const isPriced = (id: unknown): id is string => typeof id === "string" && Object.hasOwn(PRICING, id);

export type Item = { uid: string; pid: string; users: number; inputs: Record<string, number>; setup: boolean; size: Size };
/** `cud`: the customer buys 1-year Google Cloud committed-use discounts. */
export type Settings = { rate: number; dayRate: number; discount: number; partner: number; viaPartner: boolean; cud: boolean };

export const DEFAULT_SETTINGS: Settings = { rate: DEFAULT_RATE, dayRate: DEFAULT_DAY_RATE_THB, discount: 0, partner: DEFAULT_PARTNER, viaPartner: false, cud: false };

export function newItem(pid: string, uid: string): Item {
  const p = PRICING[pid];
  return { uid, pid, users: p.license === null ? 0 : MIN_USERS, inputs: Object.fromEntries(p.inputs.map((i) => [i.id, i.def])), setup: true, size: "lean" };
}

const clamp = (n: unknown, lo: number, hi: number, def: number) =>
  typeof n === "number" && Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : def;

/** Inputs as the calculation sees them: missing or bad values fall back to defaults. */
export function values(item: Item): Record<string, number> {
  const p = PRICING[item.pid];
  return Object.fromEntries(p.inputs.map((i) => [i.id, clamp(item.inputs[i.id], 0, i.max, i.def)]));
}

/** Seats billed: the 20-user minimum applies to every per-user license. */
export const billedUsers = (item: Item) =>
  PRICING[item.pid].license === null ? 0 : Math.max(MIN_USERS, Math.round(clamp(item.users, 0, 1e6, MIN_USERS)));

export type ItemCost = {
  license: number; // one-time, after discount
  listLicense: number; // before discount
  ma: number; // per year from year 2
  setup: number; // one-time
  lines: Line[]; // monthly
  monthlyBeryl8: number;
  monthlyDirect: number;
  monthlyCost: number; // Beryl8's own cost of the usage it bills
  years: { beryl8: number; direct: number }[];
};

/** All money in USD. */
export function costItem(item: Item, s: Settings): ItemCost {
  const p = PRICING[item.pid];
  const users = billedUsers(item);
  const listLicense = (p.license ?? 0) * users;
  const license = listLicense * (1 - clamp(s.discount, 0, 100, 0) / 100);
  const ma = license * MA_RATE;
  const setup = item.setup ? (p.setupDays * s.dayRate) / s.rate : 0;
  const lines = p.lines(values(item), users, item.size === "standard" ? "standard" : "lean").map((l) => {
    const k = s.cud && l.cud ? 1 - l.cud : 1;
    const detail = k !== 1 && l.detail ? L(`${l.detail.en} − ${Math.round(l.cud! * 100)}% committed use`, `${l.detail.th} − ส่วนลดผูกสัญญา ${Math.round(l.cud! * 100)}%`) : l.detail;
    return { ...l, detail, sell: Math.max(0, l.sell * k), cost: Math.max(0, l.cost * k) };
  });
  const sum = (payer: Payer, k: "sell" | "cost") => lines.reduce((a, l) => a + (l.payer === payer ? l[k] : 0), 0);
  const monthlyBeryl8 = sum("beryl8", "sell");
  const monthlyDirect = sum("direct", "sell");
  const years = Array.from({ length: YEARS }, (_, y) => ({
    beryl8: (y === 0 ? license + setup : ma) + monthlyBeryl8 * 12,
    direct: monthlyDirect * 12,
  }));
  return { license, listLicense, ma, setup, lines, monthlyBeryl8, monthlyDirect, monthlyCost: sum("beryl8", "cost"), years };
}

export type Totals = {
  items: { item: Item; cost: ItemCost }[];
  years: { beryl8: number; direct: number; total: number }[];
  year1: number;
  tco: number;
  monthly: number; // running cost per month (usage + cloud + AI), excludes one-time and MA
  internal: { revenue: number; partnerShare: number; net: number; usageCost: number; usageMargin: number };
};

export function totals(items: Item[], s: Settings): Totals {
  const rows = items.filter((i) => isPriced(i.pid)).map((item) => ({ item, cost: costItem(item, s) }));
  const years = Array.from({ length: YEARS }, (_, y) => {
    const beryl8 = rows.reduce((a, r) => a + r.cost.years[y].beryl8, 0);
    const direct = rows.reduce((a, r) => a + r.cost.years[y].direct, 0);
    return { beryl8, direct, total: beryl8 + direct };
  });
  const revenue = years.reduce((a, y) => a + y.beryl8, 0);
  const licenseAndMa = rows.reduce((a, r) => a + r.cost.license + r.cost.ma * (YEARS - 1), 0);
  const partnerShare = s.viaPartner ? licenseAndMa * (clamp(s.partner, 0, 100, DEFAULT_PARTNER) / 100) : 0;
  const usageCost = rows.reduce((a, r) => a + r.cost.monthlyCost * 12 * YEARS, 0);
  const usageRevenue = rows.reduce((a, r) => a + r.cost.monthlyBeryl8 * 12 * YEARS, 0);
  return {
    items: rows,
    years,
    year1: years[0]?.total ?? 0,
    tco: years.reduce((a, y) => a + y.total, 0),
    monthly: rows.reduce((a, r) => a + r.cost.monthlyBeryl8 + r.cost.monthlyDirect, 0),
    internal: {
      revenue,
      partnerShare,
      net: revenue - partnerShare - usageCost,
      usageCost,
      usageMargin: usageRevenue > 0 ? (usageRevenue - usageCost) / usageRevenue : 0,
    },
  };
}

/* ------------------------- display rounding ------------------------- */

export type Display = { cur: "THB" | "USD"; rate: number; vat: boolean };

/** USD → the currency on screen, VAT included when switched on. Not rounded. */
export const toDisplay = (usd: number, d: Display) => (d.cur === "THB" ? usd * d.rate : usd) * (d.vat ? 1 + VAT : 1);

/** Round half up to a whole unit, ignoring float noise (1.15 * 10 = 11.4999… must give 12). */
export const roundMoney = (n: number) => Math.round(Number(n.toPrecision(12)));

/** VAT on a total already in whole display units, computed once on the total as on a tax invoice. */
export const vatOf = (n: number) => roundMoney(n * VAT);

/** Unit prices keep two decimals so "units × price" on screen multiplies out to the amount shown. */
export const roundPrice = (n: number) => Math.round(Number((n * 100).toPrecision(12))) / 100;

type Pair = { beryl8: number; direct: number };
export type HostingSplit = { cloud: number; ai: number; other: number; total: number };

/** One product as it appears on screen: every row rounded once, in the display currency. */
export type ShownItem = {
  uid: string;
  unitPrice: number; // per-user license price, 2 decimals
  license: number; // seats × unitPrice, less discount
  setup: number;
  ma: number; // 22% of the license row
  lines: { id: string; sell: number; cost: number; payer: Payer; kind: Kind }[]; // per month
  monthlyBeryl8: number;
  monthlyDirect: number;
  monthlyCost: number;
  years: Pair[];
  year1: number;
  total: number;
};

export type Grid = {
  items: ShownItem[];
  years: (Pair & { total: number })[];
  foot: Pair & { total: number };
  year1: number;
  tco: number;
  monthly: number;
  /** What the customer pays providers directly each month, split by provider type. */
  hosting: { rows: (HostingSplit & { uid: string })[]; total: HostingSplit };
  internal: { revenue: number; partnerShare: number; usageCost: number; net: number };
};

/** Customer-paid monthly rows grouped as Google Cloud, AI models, and other (phone lines, message fees). */
function hostingOf(items: ShownItem[]): Grid["hosting"] {
  const rows = items.map((i) => {
    const by = (k: (kind: Kind) => boolean) => i.lines.reduce((a, l) => a + (l.payer === "direct" && k(l.kind) ? l.sell : 0), 0);
    const cloud = by((k) => k === "cloud");
    const ai = by((k) => k === "ai");
    const other = by((k) => k !== "cloud" && k !== "ai");
    return { uid: i.uid, cloud, ai, other, total: cloud + ai + other };
  });
  const total = rows.reduce((a, r) => ({ cloud: a.cloud + r.cloud, ai: a.ai + r.ai, other: a.other + r.other, total: a.total + r.total }), { cloud: 0, ai: 0, other: 0, total: 0 });
  return { rows, total };
}

/**
 * The estimate as shown. Each row on screen is rounded exactly once; every total on screen
 * (card header, year table, footer, running cost, internal net) is built from those rows,
 * so a reader adding up what they see always gets the total that is printed.
 */
export function displayGrid(t: Totals, d: Display, s: Settings): Grid {
  const disc = 1 - clamp(s.discount, 0, 100, 0) / 100;
  const items: ShownItem[] = t.items.map(({ item, cost }) => {
    const p = PRICING[item.pid];
    const unitPrice = p.license === null ? 0 : roundPrice(toDisplay(p.license, d));
    const license = roundMoney(billedUsers(item) * unitPrice * disc);
    const ma = roundMoney(license * MA_RATE);
    const setup = roundMoney(toDisplay(cost.setup, d));
    const lines = cost.lines.map((l) => ({ id: l.id, sell: roundMoney(toDisplay(l.sell, d)), cost: roundMoney(toDisplay(l.cost, d)), payer: l.payer, kind: l.kind }));
    const sum = (payer: Payer, k: "sell" | "cost") => lines.reduce((a, l) => a + (l.payer === payer ? l[k] : 0), 0);
    const monthlyBeryl8 = sum("beryl8", "sell");
    const monthlyDirect = sum("direct", "sell");
    const years = Array.from({ length: YEARS }, (_, y) => ({
      beryl8: (y === 0 ? license + setup : ma) + 12 * monthlyBeryl8,
      direct: 12 * monthlyDirect,
    }));
    return {
      uid: item.uid,
      unitPrice,
      license,
      setup,
      ma,
      lines,
      monthlyBeryl8,
      monthlyDirect,
      monthlyCost: sum("beryl8", "cost"),
      years,
      year1: years[0].beryl8 + years[0].direct,
      total: years.reduce((a, y) => a + y.beryl8 + y.direct, 0),
    };
  });
  const years = Array.from({ length: YEARS }, (_, y) => {
    const beryl8 = items.reduce((a, i) => a + i.years[y].beryl8, 0);
    const direct = items.reduce((a, i) => a + i.years[y].direct, 0);
    return { beryl8, direct, total: beryl8 + direct };
  });
  const foot = years.reduce((a, y) => ({ beryl8: a.beryl8 + y.beryl8, direct: a.direct + y.direct, total: a.total + y.total }), { beryl8: 0, direct: 0, total: 0 });
  const licenseAndMa = items.reduce((a, i) => a + i.license + i.ma * (YEARS - 1), 0);
  const partnerShare = s.viaPartner ? roundMoney(licenseAndMa * (clamp(s.partner, 0, 100, DEFAULT_PARTNER) / 100)) : 0;
  const usageCost = items.reduce((a, i) => a + i.monthlyCost * 12 * YEARS, 0);
  return {
    items,
    years,
    foot,
    year1: years[0].total,
    tco: foot.total,
    monthly: items.reduce((a, i) => a + i.monthlyBeryl8 + i.monthlyDirect, 0),
    hosting: hostingOf(items),
    internal: { revenue: foot.beryl8, partnerShare, usageCost, net: foot.beryl8 - partnerShare - usageCost },
  };
}

/* ----------------------- share link encoding ----------------------- */

export type Saved = { v: 1; items: Item[]; s: Settings; cur: "THB" | "USD"; vat: boolean };

/** `internal: false` (customer links) leaves partner settings out of the link entirely. */
export function encode(saved: Saved, { internal = true }: { internal?: boolean } = {}): string {
  const { partner, viaPartner, ...shared } = saved.s;
  const compact = {
    v: 1,
    i: saved.items.map((i) => [i.pid, i.users, i.inputs, i.setup ? 1 : 0, i.size === "standard" ? "s" : "l"]),
    s: internal ? { ...shared, partner, viaPartner } : shared,
    c: saved.cur,
    t: saved.vat ? 1 : 0,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(compact)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a share link; anything malformed returns null so the page starts empty instead of crashing. */
export function decode(hash: string): Saved | null {
  try {
    const json = decodeURIComponent(escape(atob(hash.replace(/-/g, "+").replace(/_/g, "/"))));
    const o = JSON.parse(json);
    if (!o || o.v !== 1 || !Array.isArray(o.i)) return null;
    const items: Item[] = [];
    o.i.slice(0, 50).forEach((row: unknown, n: number) => {
      if (!Array.isArray(row) || !isPriced(row[0])) return;
      const base = newItem(row[0], `i${n}`);
      const inputs = row[2] && typeof row[2] === "object" ? row[2] : {};
      PRICING[row[0]].inputs.forEach((inp) => {
        base.inputs[inp.id] = clamp(inputs[inp.id], 0, inp.max, inp.def);
      });
      base.users = clamp(row[1], 0, 1e6, base.users);
      base.setup = row[3] !== 0;
      base.size = row[4] === "s" ? "standard" : "lean";
      items.push(base);
    });
    const so = o.s && typeof o.s === "object" ? o.s : {};
    const s: Settings = {
      rate: clamp(so.rate, 1, 1000, DEFAULT_RATE) || DEFAULT_RATE,
      dayRate: clamp(so.dayRate, 0, 1e7, DEFAULT_DAY_RATE_THB),
      discount: clamp(so.discount, 0, 100, 0),
      partner: clamp(so.partner, 0, 100, DEFAULT_PARTNER),
      viaPartner: so.viaPartner === true,
      cud: so.cud === true,
    };
    return { v: 1, items, s, cur: o.c === "USD" ? "USD" : "THB", vat: o.t === 1 };
  } catch {
    return null;
  }
}
