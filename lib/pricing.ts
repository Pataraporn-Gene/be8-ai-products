import type { Localized } from "./i18n";

/* ------------------------------------------------------------------
   Pricing model for the estimate calculator.
   Rules agreed in "AI Pricing and Licensing" (2026-11-09):
   - Perpetual license per named user, minimum 20 users per customer.
   - MA 22% of the license per year, mandatory from year 2.
   - License excludes AI, cloud and implementation. Exceptions billed by
     Beryl8: Voice AI per minute (the "AI cost per minute" input) and the Ask 8 AI
     Pack (draft, about ฿4 per credit at ฿33.5/US$).
   - Meet8 transcription + summary is priced at measured cost (US$0.53/h,
     replacing the US$2.5/h agreed on 2026-11-09, user decision 2026-11-11).
   - Meet8 is sold three ways: perpetual with the customer paying Google
     Cloud, perpetual with Google Cloud billed through Beryl8 at cost plus
     HOST_MARKUP, or a per-user subscription on Beryl8's shared multi-tenant
     cloud priced from measured cost at MEET8_SUB.margin (all draft).
   - Insight8 US$480 per named user (US$20 x 24 months).
   Every other number is a draft (`draft: true`) until finance confirms.
   All money here is USD; the page converts with the rate the user sets.
   ------------------------------------------------------------------ */

export const MA_RATE = 0.22;
export const MIN_USERS = 20;
export const YEARS = 5;
export const VAT = 0.07;
export const DEFAULT_RATE = 33.5; // THB per USD
export const DEFAULT_DAY_RATE_THB = 15000;
export const DEFAULT_PARTNER = 30;
/** Markup on Google Cloud and AI billed through Beryl8 (Meet8 perpetual). Draft until finance confirms. */
export const HOST_MARKUP = 0.2;

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
  /** Choice stored as its index (0, 1, 2…). Radio buttons show the last option first; a `dropdown` shows them in order. */
  choices?: Localized[];
  /** Show `choices` as a drop-down in the field grid, in their own order, instead of radio buttons. */
  dropdown?: boolean;
  /** Shown only when this returns true; a hidden input keeps its value but the lines ignore it. */
  when?: (v: Record<string, number>) => boolean;
  /** A choice between ways of buying: the card shows every option side by side for the same usage. */
  compare?: boolean;
  /** One line per choice: who that option suits. */
  hints?: Localized[];
};

/** One monthly running cost. `sell` is what the customer pays, `cost` what it costs Beryl8 (same as sell when paid direct). */
/** `detail` shows how the amount was worked out, e.g. "20 users × 80 questions × US$0.30". */
export type Line = {
  id: string; label: Localized; payer: Payer; kind: Kind; sell: number; cost: number; draft?: boolean; detail?: Localized;
  /** Share taken off by a 1-year Google Cloud committed-use discount, when the customer buys one. */
  cud?: number;
  /** No measured spec or price source yet (see `unverified`). Such rows are also `draft`; the badge says "Estimate" instead of "Draft". */
  estimate?: boolean;
};

export type Badge = "estimate" | "draft";
/** Badges for one row, or for a folded group of rows: "estimate" if any row is unverified, "draft" if any other row is a draft. */
export const badgesOf = (lines: Pick<Line, "draft" | "estimate">[]): Badge[] => [
  ...(lines.some((l) => l.estimate) ? (["estimate"] as const) : []),
  ...(lines.some((l) => l.draft && !l.estimate) ? (["draft"] as const) : []),
];

export type Size = "lean" | "standard";
/** 1-year committed-use discounts: Cloud SQL 25%, Cloud Run about 17%. Only compute rows carry one.
 *  runInstance: Cloud Run services with instance-based billing (formerly "CPU always allocated") get 28% for a 1-year
 *  commitment, request-based billing 17% (docs.cloud.google.com/run/cud, read 2026-11-21). Only rows that are all
 *  instance-based Cloud Run in prod use it; mixed rows and every Meet8/Insight8 row keep `run`. */
export const CUD = { run: 0.17, runInstance: 0.28, sql: 0.25 } as const;

export type ProductPricing = {
  id: string;
  /** US$ per named user, perpetual. null = no per-user license (priced by usage). */
  license: number | null;
  /** Per-item license when it depends on the inputs (Meet8 subscription has none); see `licenseOf`. */
  licenseFor?: (v: Record<string, number>) => number | null;
  licenseDraft: boolean;
  /** US$ per minute shown in the product picker for products priced by the minute (no license). */
  perMinute?: number;
  /** Cheapest monthly price per user (US$) when the product can also be bought monthly. */
  fromMonthly?: number;
  /** True when this way of buying has no setup fee (Meet8 subscription runs on Beryl8's cloud). */
  noSetup?: (v: Record<string, number>) => boolean;
  /** Meeting hours a month the estimate assumes, so ways of buying can be compared on the same usage. */
  monthlyHours?: (v: Record<string, number>, users: number) => number;
  /** Inputs for buying option `k` of the `compare` choice with the same monthly usage as `v`. */
  switchTo?: (v: Record<string, number>, users: number, k: number) => Record<string, number>;
  unitLabel: Localized;
  setupDays: number;
  /** Implementation man-days worked out from the inputs; overrides `setupDays`. */
  setupDaysFor?: (v: Record<string, number>) => number;
  inputs: Input[];
  /** `rate` = THB per US$ (Settings.rate), for rows priced in baht such as the LINE OA plan. */
  lines: (v: Record<string, number>, users: number, size: Size, rate: number) => Line[];
  /** A red warning under the inputs when they cannot work together, e.g. more call minutes than the lines can carry. */
  warning?: (v: Record<string, number>) => Localized | null;
  /** Products with a measured cheaper server setup offer a size choice. */
  sizes?: Record<Size, Localized>;
  notes: Localized[];
  /** Date the prices were checked, shown centred under the breakdown. */
  asOf?: string;
};

const L = (en: string, th: string): Localized => ({ en, th });
const blocks = (n: number, size: number) => Math.max(1, Math.ceil(n / size));
/** Which option of an `n`-way choice a stored value means. A hand-edited share link can hold any number. */
export const choiceIndex = (x: number, n = 2) => Math.min(n - 1, Math.max(0, Math.round(x) || 0));
/** Index of a drop-down option; a hand-edited link can hold anything. */
export const optionIndex = (x: number, count: number) => choiceIndex(x, count);

/* Ask 8 per answered question, all draft. Cost is Sonnet 5.5 at a 60% cache hit, not yet measured from real usage. */
const ASK8 = {
  creditSell: 4 / DEFAULT_RATE, // ฿4 at the default rate
  infra: 0.003,
  ask: { credits: 1, cost: 0.0389 },
  data: { credits: 2, cost: 0.0792 },
  action: { credits: 4, cost: 0.1805 },
};

/* Voice8 Pipeline, from the Voice8 cost calculator (prod config + load test 2026-10-20). */
const VOICE8 = {
  aiMin: 0.0218, // default AI cost per minute (LLM + STT + TTS + judge + extractor), billed by Beryl8 at this rate
  callsPerVoice: 4,
  voiceBuffer: 1, // one spare voice instance on top of concurrent ÷ 4
  // ~60 calls per Asterisk VM: load test on prod Asterisk B (e2-standard-2), conversational-ai
  // docs/superpowers/specs/2026-11-10-asterisk-unbuffered-design.md: 60 calls rtt p95 414–433 ms, 90 calls 0.93–1.2 s;
  // the Voice8 page also says about 60 calls per Asterisk server (was 80).
  callsPerAsterisk: 60,
  // Extra call-runtime + system pair per 80 concurrent calls: the threshold it shared with Asterisk before 2026-11-21.
  // Kept until the runtime has a load test of its own.
  callsPerRuntime: 80,
  voiceHour: 0.1728, // 2 vCPU / 2 GiB always-on
  runtimeHour: 0.0864, // 1 vCPU / 1 GiB always-on
  idleTail: 0.25, // instances stay ~15 min after the last call
  warmUp: 1 / 6, // outbound only: pre-warmed ~10 min before calling starts
  mbPerMin: 0.5, // MB (10^6 bytes) of call audio per minute: G.711 64 kbps = 0.48 MB payload
  /** Region list prices. Singapore = prod bill (docs/cost.md) with Asterisk on e2-standard-2; Jakarta = Cloud Billing Catalog 2026-11-09,
   *  except jkt.ops 12.5, an estimate with no itemised source.
   *  egressGiB = Premium internet egress per GiB (the SKU unit), first-TiB tier, Cloud Billing Catalog 2026-11-21: Singapore to APAC
   *  (excl. Korea, Indonesia) 0.12 (SKU 400E-0B94-6FB4); Jakarta 0.19 to APAC (13AA-71ED-4A85) and to Indonesia (8827-24AC-FFAC) alike (was 0.12).
   *  ponytail: one tier only; from 1 to 10 TiB a month (1 TiB is about 2.2M call minutes at 0.5 MB) Google charges 0.11 / 0.18 on that part, so the row runs slightly high there. */
  region: {
    sg: { asterisk: 131.5, qdrant: 117.5, valkey: 55.3, ops: 12, asteriskVm: 67.3, egressGiB: 0.12 },
    jkt: { asterisk: 143.5, qdrant: 128.7, valkey: 60.3, ops: 12.5, asteriskVm: 73.3, egressGiB: 0.19 },
  },
};

const USERS = L("users", "คน");
const n = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 4 });

/** One Google Cloud service: label, US$ per month for one set of servers. */
type Svc = [en: string, th: string, usd: number, cud?: keyof typeof CUD];

/**
 * Google Cloud services as separate rows, `sets` copies of the stack (more users → more sets).
 * With `markup`, Beryl8 bills the rows at cost × (1 + markup); the text shows only the sell price.
 */
function gcp(svcs: Svc[], sets: number, draft: boolean, markup?: number): Line[] {
  const hosted = markup !== undefined;
  const k = hosted ? 1 + markup : 1;
  return svcs.map(([en, th, usd, family]) => {
    const m = n(roundPrice(usd * k)); // a monthly amount shows cents only: 73.78 × 1.2 = 88.536 → 88.54
    return {
      id: "gcp-" + en.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label: L(`Google Cloud · ${en}`, `Google Cloud · ${th}`),
      payer: hosted ? ("beryl8" as const) : ("direct" as const),
      kind: "cloud" as const,
      sell: usd * k * sets,
      cost: usd * sets,
      draft: draft || hosted,
      cud: family ? CUD[family] : undefined,
      detail: L(sets > 1 ? `${sets} sets × US$${m} / month` : `US$${m} / month`, sets > 1 ? `${sets} ชุด × US$${m} ต่อเดือน` : `US$${m} ต่อเดือน`),
    };
  });
}

/** A row with no measured spec or price source yet: verdict UNSOURCEABLE, or a SPEC-QUESTION not fixed since, in the cost audit
 *  of 2026-11-21 (~/.claude/reports/be8-ai-products-bot-2026-11-21-other-products-cost-audit.md). The amount is unchanged and the
 *  row stays draft; the page labels it "Estimate (unverified)" / "ราคาประมาณการ". */
const unverified = (l: Line): Line => ({ ...l, estimate: true });

/** A usage-driven Google Cloud row with its formula. */
const gcpUsage = (id: string, en: string, th: string, usd: number, detail: Localized, family?: keyof typeof CUD): Line => ({
  id, label: L(`Google Cloud · ${en}`, `Google Cloud · ${th}`), payer: "direct", kind: "cloud", sell: usd, cost: usd, draft: true, detail,
  cud: family ? CUD[family] : undefined,
});

/* Meet8 Google Cloud, measured on production: sizes and fixed rows from the 2026-11-03 cost model
   (~/Desktop/meet8-concurrent-cost-2026-11-03.html, SIZES/COMMON_FIXED), checked against prod on
   2026-11-11 (Cloud SQL db-custom-2-7680, 2 × Redis BASIC 1 GB, e2-small runner). Hourly Cloud Run =
   (US$216 − US$97 floor and warm) / 805 recorded hours, Cloud Monitoring 4–10 Nov 2026. L/XL unmeasured.
   S/M sql, redis and vm re-priced 2026-11-18 from the Cloud Billing Catalog (asia-southeast1, on-demand, × 730 h):
   S and M specs = be8-brain lib/tenant/deploy-size.ts (S db-custom-1-3840 + 20 GB SSD, M db-custom-2-7680 + 50 GB SSD,
   both ZONAL) = prod be8-brain-pg-prod for M. Cloud SQL Zonal vCPU 0.0578/h (SKU DE86-B401-E60F), RAM 0.0098/GiB-h
   (EF83-F6A8-8EA7), SSD 0.238/GiB-mo (45B3-606F-EE91); backups (0.112/GiB-mo, 5C0F-D226-757F) are usage and not included.
   Redis: 2 × 1 GiB Basic M1 at 0.065/GiB-h (D7B2-9EA7-8B11) = 94.9. vm: prod atrium-runner-1 = e2-small (0.5 core ×
   0.02690931/h 7102-B9AA-2ACF + 2 GiB × 0.00360594/h E277-7DC2-2C7D) + 100 GB pd-balanced boot disk × 0.11 (16D2-FC49-A127).
   Decision 2026-11-18 (คุณเมิน): vm is priced as actually used (e2-small + 100 GB boot = 26.09, not a right-sized disk).
   Chat sessions run in the Cloud Run sandbox, and that cost stays in the Cloud Run rows (floor/warm/perHour), not in vm,
   so it is not counted twice.
   L/XL sql (decision 2026-11-18): L db-custom-4-15360, XL db-custom-8-30720, zonal SSD. Storage GB = maxRooms, the S→M
   pattern (S 20 GB / 20 rooms, M 50 GB / 50 rooms), so L 100 GB, XL 200 GB. Same SKUs as S/M (checked 2026-11-18):
   DE86-B401-E60F 0.0578/vCPU-h, EF83-F6A8-8EA7 0.0098/GiB-h, 45B3-606F-EE91 0.238/GiB-mo. L/XL redis and vm are still the
   2026-11-03 model estimates (no tier is defined for them), so L/XL rows stay draft. */
const MEET8_SIZES = [
  // sql 1 × 0.0578 × 730 + 3.75 × 0.0098 × 730 + 20 × 0.238 = 73.78 (was 85); vm 15.09 + 11.00 = 26.09 (was 20)
  { name: "S", maxRooms: 20, sql: 73.78, redis: 95, vm: 26.09 },
  // sql 2 × 0.0578 × 730 + 7.5 × 0.0098 × 730 + 50 × 0.238 = 149.94 (was 155); vm same e2-small runner = 26.09 (was 25)
  { name: "M", maxRooms: 50, sql: 149.94, redis: 95, vm: 26.09 },
  // sql 4 × 0.0578 × 730 + 15 × 0.0098 × 730 + 100 × 0.238 = 168.776 + 107.31 + 23.8 = 299.89 (was 320)
  { name: "L", maxRooms: 100, sql: 299.89, redis: 143, vm: 40 },
  // sql 8 × 0.0578 × 730 + 30 × 0.0098 × 730 + 200 × 0.238 = 337.552 + 214.62 + 47.6 = 599.77 (was 655)
  { name: "XL", maxRooms: 200, sql: 599.77, redis: 190, vm: 60 },
] as const;
/** Transcription + meeting AI per recorded hour, measured on prod 4–10 Nov 2026: STT 0.196 + AI 0.335 (list prices). */
const MEET8_STT_PER_HOUR = 0.53;
/** Meet8 chat answer, Gemini Flash at 2027 list price (US$0.048 a message, measured 2026-11-03; was US$0.012). */
const MEET8_ASK_COST = 0.048;
/* floor 61 is measured on prod with Cloud Run minScale 3, which is the correct prod value (decision 2026-11-18);
   be8-brain DEPLOY.md saying min 0 is stale. */
const MEET8_RUN = { floor: 61, warm: 18, roomsPerInstance: 4, perHour: 0.148, storagePerHour: 0.04 };
/* Meet8 subscription on Beryl8's shared multi-tenant cloud, from prod 4–10 Nov 2026 (× 30/7, 111 users active in 30 days):
   fixed US$3.74 per user = (servers US$311.03 + Cloud Run floor and warm US$97 + chat US$7.5) / 111, servers = size M
   rows (sql 149.94 + redis 95 + vm 26.09) + NAT/build/other 40; no Load Balancer or Cloud Armor, prod has none (gcloud
   2026-11-18: be8-brain is served by a Cloud Run domain mapping, no forwarding rule or security policy). Was US$4.10 =
   (351 = 155 + 95 + 25 + LB 20 + Armor 16 + 40 + 97 + 7.5) / 111. Decision 2026-11-18 (คุณเมิน): subscription keeps
   LB and Armor out, because it runs on Beryl8's own prod, which has neither. Per recorded hour
   US$0.72 = Cloud Run 0.148 + storage 0.04 + STT 0.196 (stt_usage_log) + AI 0.335 (ai_usage_log, catalog list prices).
   Priced as if the whole pool is used. `hours` index order makes the radios read 5, 10, 20. */
const MEET8_SUB = { fixedPerUser: 3.74, perHour: 0.72, margin: 0.5, hours: [20, 10, 5] };
const MEET8_LICENSE = 360;
/** `host` options: 0 your own Google Cloud, 1 Google Cloud through Beryl8, 2 subscription. */
const MEET8_HOST = { options: 3, viaBeryl8: 1, subscription: 2 };
const meet8Host = (v: Record<string, number>) => choiceIndex(v.host, MEET8_HOST.options);
const isMeet8Sub = (v: Record<string, number>) => meet8Host(v) === MEET8_HOST.subscription;

/** Meet8's own Google Cloud project, sized by meetings at the same time. With `markup`, billed through Beryl8. */
function meet8Gcp(users: number, conc: number, hours: number, markup?: number): Line[] {
  const rooms = Math.max(1, Math.ceil(+((users * conc) / 100).toFixed(6)));
  const size = MEET8_SIZES.find((x) => rooms <= x.maxRooms) ?? MEET8_SIZES[MEET8_SIZES.length - 1];
  const warm = Math.max(0, Math.ceil(rooms / MEET8_RUN.roomsPerInstance) - 1) * MEET8_RUN.warm;
  const draft = size.name === "L" || size.name === "XL";
  const k = 1 + (markup ?? 0);
  const perHour = (id: string, en: string, th: string, usd: number): Line => ({
    id, label: L(`Google Cloud · ${en}`, `Google Cloud · ${th}`), payer: markup === undefined ? "direct" : "beryl8", kind: "cloud",
    sell: hours * usd * k, cost: hours * usd, draft: true,
    detail: L(`${n(hours)} h × US$${n(usd * k)}`, `${n(hours)} ชม. × US$${n(usd * k)}`),
  });
  return [
    ...gcp([["Cloud Run (app and API)", "Cloud Run (แอปและ API)", MEET8_RUN.floor + warm, "run"]], 1, draft, markup),
    perHour("gcp-run-hours", "Cloud Run (per meeting hour)", "Cloud Run (ตามชั่วโมงประชุม)", MEET8_RUN.perHour),
    ...gcp([
      [`Cloud SQL (database, size ${size.name})`, `Cloud SQL (ฐานข้อมูล ขนาด ${size.name})`, size.sql, "sql"],
      ["Memorystore (2 × Redis)", "Memorystore (Redis 2 ตัว)", size.redis],
      ["Compute Engine (chat runner)", "Compute Engine (ตัวรันแชต)", size.vm],
      // Decision 2026-11-18 (คุณเมิน): perpetual keeps LB and Armor, recommended for enterprise production (WAF, custom
      // domain); Beryl8's own prod runs without them (Cloud Run domain mapping), so the subscription leaves them out.
      // Global forwarding rule minimum 0.025/h (DEE3-C42E-3E4D) = 18.25 + data; Armor policy 5 (4B13-E64F-4A2B) + rules
      // 1 each (A321-89BD-F5BC) + 0.75/M requests.
      ["Load Balancer", "Load Balancer", 20],
      ["Cloud Armor", "Cloud Armor", 16],
      ["NAT, build and other", "NAT, build และอื่นๆ", 40],
    ], 1, draft, markup),
    perHour("gcp-storage-hours", "Storage, egress and logs (per meeting hour)", "Storage, egress และ log (ตามชั่วโมงประชุม)", MEET8_RUN.storagePerHour),
  ];
}

/** Space8 GKE Autopilot agent runtime, US$ a month: cluster fee and the always-on runner + egress pods (sources at the row). */
const SPACE8_GKE = { clusterFee: 73, pods: 49.32 };
/** Cloud SQL storage limits for a shared-core machine, GiB (sources at the Data8 input). */
const SQL_SHARED_CORE_GIB = { min: 10, max: 3054 };
/** Cloud SQL disks are whole GB, so a typed size is rounded up and held at the 10 GiB minimum. */
const billedSqlGiB = (gib: number) => Math.max(SQL_SHARED_CORE_GIB.min, Math.ceil(gib));

/* LINE OA Thailand, Pulse8's LINE row: the plan picked in the `linePlan` input (Pro by default), in THB.
   Pricing table https://lineforbusiness.com/th/service/line-oa-features/broadcast-message (read 2026-11-21, re-read 2026-11-21 for
   Basic): Basic (เบสิก) "1,280 บาท" a month with "15,000 ข้อความ", "ค่าบริการข้อความเพิ่มเติม" "0.1 บาท/ข้อความ"; Pro (โปร) ฿1,780 with
   35,000 messages, then ฿0.06 per message; Free 300 messages; "ราคาที่ระบุในตาราง ยังไม่รวมภาษีมูลค่าเพิ่ม (VAT) 7%". The Help Center
   https://lineforbusiness.com/th/helpcenter/line-oa (read 2026-11-21) gives the Pro overage as "0.6 บาท/ข้อความ" ("ประมาณ 600 บาท
   ต่อ 1,000 ข้อความ") and Basic's as 0.1; neither page is dated.
   Pro ฿0.06 is used (decision 2026-11-21 under คุณเมิน's rule "recommended = do"): the pricing table is LINE's price page, a higher
   tier normally has a lower overage than Basic's ฿0.1, and the default 20,000 messages has no overage either way.
   Messages count per recipient (Help Center: Target Reach, active followers who have not blocked the account; broadcasts, step
   messages and Push/Multicast/Broadcast API count; chats, auto-replies, AI replies, greetings and Reply API do not).
   Net of VAT like every other row: the page adds VAT once, on the totals. Index order = the `linePlan` choices. */
const LINE_OA = [
  { name: "Basic", fee: 1280, included: 15000, extra: 0.1 },
  { name: "Pro", fee: 1780, included: 35000, extra: 0.06 },
] as const;
/** The default plan: share links and saved estimates from before the plan choice existed open as Pro, the plan they were priced on. */
const LINE_PRO = 1;

/** Pulse8's LINE OA row: plan fee + extra messages in THB, divided by the user's rate (as the setup fee is) so the row shows the
 *  same baht at any rate while the US$ totals move with it. Messages are whole: a typed 35,000.5 bills one extra. */
function lineOaRow(messages: number, rate: number, plan: number): Line {
  const p = LINE_OA[choiceIndex(plan, LINE_OA.length)];
  const extra = Math.max(0, Math.ceil(messages) - p.included);
  const usd = (p.fee + extra * p.extra) / rate;
  const [fee, inc, x, per] = [`฿${n(p.fee)}`, n(p.included), n(extra), `฿${n(p.extra)}`];
  return {
    id: "line", label: L("LINE OA messages", "ค่าส่ง LINE OA"), payer: "direct", kind: "telco", sell: usd, cost: usd, draft: true,
    detail: L(`${p.name} plan ${fee} (${inc} messages included) + ${x} extra × ${per} · excl. 7% VAT`,
      `แพ็กเกจ ${p.name} ${fee} (รวม ${inc} ข้อความ) + ส่วนเกิน ${x} ข้อความ × ${per} · ไม่รวม VAT 7%`),
  };
}

/* Pulse8 SMS, sent through the customer's own provider account (ThaiBulkSMS or Twilio, Pulse8 packages/channels/src/sms.ts),
   priced in THB per credit. Default ฿0.32 = ThaiBulkSMS Standard SMS, the ฿30,000 package: "฿ 0.32 / เครดิต", "93,750 เครดิต",
   "ราคาแพ็กเกจยังไม่รวมภาษีมูลค่าเพิ่ม" (https://www.thaibulksms.com/pricing/sms/?lang=th, read 2026-11-21; the same as the audit's
   reading). Credits (https://www.thaibulksms.com/credit-calculation/, read 2026-11-21): Thai "70 ตัวอักษร คิดเป็น 1 เครดิต", up to
   134 characters = 2 credits, English 160 = 1, mixed Thai and English counts as Thai. Was US$0.0075 a message, which had no source. The input keeps its id `sms`, so a link saved with messages reads them as 1 credit each. */
const SMS_THB_PER_CREDIT = 0.32;

/** Pulse8's SMS row: credits × the baht price per credit, divided by the user's rate like the LINE row, before VAT.
 *  Credits are whole, as providers sell them: a typed 10,000.5 bills 10,001. */
function smsRow(credits: number, thbPerCredit: number, rate: number): Line {
  const c = Math.ceil(credits);
  const usd = (c * thbPerCredit) / rate;
  return {
    id: "sms", label: L("SMS (your provider)", "ค่าส่ง SMS (ผู้ให้บริการของคุณ)"), payer: "direct", kind: "telco", sell: usd, cost: usd, draft: true,
    detail: L(`${n(c)} credits × ฿${n(thbPerCredit)} · excl. 7% VAT`, `${n(c)} เครดิต × ฿${n(thbPerCredit)} · ไม่รวม VAT 7%`),
  };
}

export const PRICING: Record<string, ProductPricing> = {
  meet8: {
    id: "meet8",
    license: MEET8_LICENSE,
    licenseFor: (v) => (isMeet8Sub(v) ? 0 : MEET8_LICENSE),
    noSetup: isMeet8Sub,
    monthlyHours: (v, users) =>
      isMeet8Sub(v) ? users * MEET8_SUB.hours[choiceIndex(v.pkg, MEET8_SUB.hours.length)] + Math.max(0, v.extra) : v.hours,
    // A subscription is priced as if its package is used in full, so its usage is the package plus extra hours.
    switchTo: (v, users, k) => {
      const pool = users * MEET8_SUB.hours[choiceIndex(v.pkg, MEET8_SUB.hours.length)];
      const usage = isMeet8Sub(v) ? pool + Math.max(0, v.extra) : v.hours;
      return k === MEET8_HOST.subscription ? { ...v, host: k, extra: Math.max(0, usage - pool) } : { ...v, host: k, hours: usage };
    },
    fromMonthly: (MEET8_SUB.fixedPerUser + Math.min(...MEET8_SUB.hours) * MEET8_SUB.perHour) / (1 - MEET8_SUB.margin),
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 3,
    inputs: [
      { id: "host", label: L("How you buy Meet8", "รูปแบบการซื้อ Meet8"), unit: L("", ""), def: 0, max: 2, compare: true,
        choices: [
          L("Buy once, you pay Google Cloud directly", "ซื้อขาด จ่ายค่า Google Cloud เอง"),
          L("Buy once, Google Cloud billed through Beryl8", "ซื้อขาด ซื้อ Google Cloud ผ่าน Beryl8"),
          L("Subscription, monthly per user on Beryl8's cloud", "Subscription รายเดือนต่อคน บน cloud ของ Beryl8"),
        ],
        hints: [
          L("Best if you already run Google Cloud and want Meet8 and its data in your own project.", "เหมาะถ้ามี Google Cloud อยู่แล้ว และอยากเก็บระบบและข้อมูลไว้ใน project ของตัวเอง"),
          L("Best if you want to own the license but get one invoice: Beryl8 bills the cloud and AI monthly.", "เหมาะถ้าอยากซื้อขาด แต่ได้บิลเดียว: Beryl8 เรียกเก็บค่า cloud และ AI รายเดือนให้"),
          L("Best to start fast with no upfront license or servers to run: package hours are shared across the company.", "เหมาะถ้าอยากเริ่มเร็ว ไม่จ่าย license ก้อนแรกและไม่ต้องดูแลเครื่อง ชั่วโมงในแพ็กเกจใช้ร่วมกันทั้งบริษัท"),
        ] },
      { id: "pkg", label: L("Meeting hours per user per month", "ชั่วโมงประชุมต่อคนต่อเดือน"), unit: L("", ""), def: 1, max: 2,
        choices: MEET8_SUB.hours.map((h) => L(`${h} hours`, `${h} ชั่วโมง`)), when: isMeet8Sub },
      { id: "hours", label: L("Meeting hours recorded per month, whole company", "ชั่วโมงประชุมที่อัดต่อเดือน รวมทั้งบริษัท"), unit: L("hours", "ชั่วโมง"), def: 200, max: 100000, step: 10,
        help: L("Typical: about 10 hours per user a month.", "ทั่วไปราว 10 ชั่วโมงต่อคนต่อเดือน"), when: (v) => !isMeet8Sub(v) },
      { id: "asks", label: L("Questions per user per month", "คำถามต่อคนต่อเดือน"), unit: L("questions", "คำถาม"), def: 30, max: 10000, step: 5,
        help: L("Questions about past meetings. Typical: 20–50.", "ถามย้อนหลังข้ามการประชุม ทั่วไป 20–50 คำถาม"), when: (v) => !isMeet8Sub(v) },
      { id: "conc", label: L("Meetings at the same time, as % of users", "ห้องประชุมพร้อมกัน คิดเป็น % ของผู้ใช้"), unit: L("%", "%"), def: 30, max: 100, step: 5,
        help: L("Sets the server size. Typical: 20–40%.", "ใช้เลือกขนาดเครื่อง ทั่วไป 20–40%"), when: (v) => !isMeet8Sub(v) },
      { id: "extra", label: L("Extra hours beyond the package per month", "ชั่วโมงที่ใช้เกินแพ็กเกจต่อเดือน"), unit: L("hours", "ชั่วโมง"), def: 0, max: 100000, step: 10,
        help: L("The package is shared across the company: users × hours per user.", "แพ็กเกจใช้ร่วมกันทั้งบริษัท = จำนวนคน × ชั่วโมงต่อคน"), when: isMeet8Sub },
    ],
    lines: (v, users) => {
      if (isMeet8Sub(v)) {
        const pkgHours = MEET8_SUB.hours[choiceIndex(v.pkg, MEET8_SUB.hours.length)];
        const unitCost = MEET8_SUB.fixedPerUser + pkgHours * MEET8_SUB.perHour;
        const unitSell = unitCost / (1 - MEET8_SUB.margin);
        const hourSell = MEET8_SUB.perHour / (1 - MEET8_SUB.margin);
        const sub: Line = { id: "sub", label: L(`Meet8 subscription, ${pkgHours} hours per user`, `Meet8 แบบ subscription ${pkgHours} ชั่วโมงต่อคน`), payer: "beryl8", kind: "usage", draft: true,
          sell: users * unitSell, cost: users * unitCost,
          detail: L(`${n(users)} users × US$${n(unitSell)} / month · ${n(users * pkgHours)} hours shared`, `${n(users)} คน × US$${n(unitSell)} ต่อเดือน · รวม ${n(users * pkgHours)} ชั่วโมงทั้งบริษัท`) };
        if (!(v.extra > 0)) return [sub];
        return [sub, { id: "extra", label: L("Extra hours beyond the package", "ชั่วโมงที่ใช้เกินแพ็กเกจ"), payer: "beryl8", kind: "usage", draft: true,
          sell: v.extra * hourSell, cost: v.extra * MEET8_SUB.perHour,
          detail: L(`${n(v.extra)} h × US$${n(hourSell)}`, `${n(v.extra)} ชม. × US$${n(hourSell)}`) }];
      }
      const markup = meet8Host(v) === MEET8_HOST.viaBeryl8 ? HOST_MARKUP : undefined;
      const perAsk = MEET8_ASK_COST * (1 + (markup ?? 0)); // sell price per question
      return [
        { id: "stt", label: L("Transcription and summary (AI, at measured cost)", "ถอดเสียงและสรุป (AI ตามต้นทุนจริง)"), payer: markup === undefined ? "direct" : "beryl8", kind: "ai", draft: true,
          sell: v.hours * MEET8_STT_PER_HOUR * (1 + (markup ?? 0)), cost: v.hours * MEET8_STT_PER_HOUR,
          detail: L(`${n(v.hours)} h × US$${n(MEET8_STT_PER_HOUR * (1 + (markup ?? 0)))}`, `${n(v.hours)} ชม. × US$${n(MEET8_STT_PER_HOUR * (1 + (markup ?? 0)))}`) },
        { id: "ai", label: L("AI model for questions", "ค่าโมเดล AI สำหรับถาม-ตอบ"), payer: markup === undefined ? "direct" : "beryl8", kind: "ai", sell: users * v.asks * perAsk, cost: users * v.asks * MEET8_ASK_COST, draft: true,
          detail: L(`${n(users)} users × ${n(v.asks)} questions × US$${n(perAsk)}`, `${n(users)} คน × ${n(v.asks)} คำถาม × US$${n(perAsk)}`) },
        ...meet8Gcp(users, v.conc, v.hours, markup),
      ];
    },
    notes: [
      L("Buy once: servers sized from our production measurements by meetings at the same time (sizes S and M at Google list prices; L and XL are draft, with Cloud SQL at list prices).",
        "ซื้อขาด: ขนาดเครื่องคิดจากการวัดบน production ตามจำนวนห้องประชุมพร้อมกัน (ขนาด S และ M ใช้ราคา list ของ Google, L และ XL ยังเป็นร่าง โดย Cloud SQL ใช้ราคา list)"),
      L("Buy once: Load Balancer and Cloud Armor are recommended for enterprise production (WAF, custom domain). Meet8's own production runs without them.",
        "ซื้อขาด: แนะนำ Load Balancer และ Cloud Armor สำหรับ production ระดับองค์กร (WAF, custom domain) ส่วน production ของ Meet8 เองไม่ได้ใช้"),
    ],
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
    // Every Agent8 row is UNSOURCEABLE (audit 2026-11-21): no prod on GCP to measure and the model is unknown; draft prices kept
    // until the real system is identified (decision 8).
    lines: (v, users) => [
      { id: "ai", label: L("AI model usage (your provider key)", "ค่าโมเดล AI (key ของคุณเอง)"), payer: "direct", kind: "ai", sell: (v.runs * v.tokens * v.price) / 1e6, cost: (v.runs * v.tokens * v.price) / 1e6, draft: true, estimate: true,
        detail: L(`${n(v.runs)} runs × ${n(v.tokens)} tokens × US$${n(v.price)} per 1M`, `${n(v.runs)} ครั้ง × ${n(v.tokens)} token × US$${n(v.price)} ต่อ 1 ล้าน`) },
      ...gcp([
        ["Cloud Run (gateway and agents)", "Cloud Run (เกตเวย์และ Agent)", 120, "run"],
        ["Cloud SQL (database and logs)", "Cloud SQL (ฐานข้อมูลและ log)", 110, "sql"],
        ["Memorystore (rate limits, cache)", "Memorystore (rate limit, cache)", 40],
        ["Load Balancer", "Load Balancer", 20],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 10],
      ], blocks(users, 500), true).map(unverified),
    ],
    notes: [L("Model usage is paid directly to your provider. Runs on Cortex for now; recheck when Cortex starts charging.", "ค่าโมเดลจ่ายตรงกับผู้ให้บริการ ตอนนี้ใช้ Cortex ไปก่อน ต้องเทียบราคาใหม่เมื่อ Cortex เริ่มคิดเงิน")],
  },
  voice8: {
    id: "voice8",
    license: null,
    licenseDraft: false,
    perMinute: VOICE8.aiMin,
    unitLabel: L("Studio users", "ผู้ใช้ Studio"),
    setupDays: 10,
    // Implementation = call flows × man-days per flow (Voice8 cost calculator).
    setupDaysFor: (v) => v.flows * v.flowDays,
    warning: (v) => {
      const daily = v.calls * v.callMin;
      const capacity = v.concurrent * v.hours * 60;
      return daily > capacity
        ? L(`${n(v.calls)} calls × ${n(v.callMin)} min = ${n(daily)} min a day, more than ${n(v.concurrent)} lines × ${n(v.hours)} h can carry (${n(capacity)} min). Add concurrent calls or calling hours.`,
            `${n(v.calls)} สาย × ${n(v.callMin)} นาที = ${n(daily)} นาที/วัน เกินที่ ${n(v.concurrent)} สายพร้อมกัน × ${n(v.hours)} ชม. รับได้ (${n(capacity)} นาที) เพิ่มสายพร้อมกันหรือชั่วโมงทำงาน`)
        : null;
    },
    inputs: [
      { id: "region", label: L("Google Cloud region", "Region ของ Google Cloud"), unit: L("", ""), def: 0, max: 1, dropdown: true,
        choices: [L("Singapore (asia-southeast1)", "Singapore (asia-southeast1)"), L("Jakarta (asia-southeast2)", "Jakarta (asia-southeast2)")] },
      { id: "direction", label: L("Call type", "ประเภทสาย"), unit: L("", ""), def: 0, max: 2, dropdown: true,
        choices: [L("Inbound", "Inbound (รับสายเข้า)"), L("Outbound", "Outbound (โทรออก)"), L("Inbound + outbound", "Inbound (รับสายเข้า) + Outbound (โทรออก)")] },
      { id: "concurrent", label: L("Concurrent calls", "สายพร้อมกัน (concurrent)"), unit: L("calls", "สาย"), def: 10, max: 10000, step: 1 },
      { id: "calls", label: L("Calls per day", "จำนวนสายต่อวัน"), unit: L("calls/day", "สาย/วัน"), def: 1000, max: 1000000, step: 100 },
      { id: "callMin", label: L("Minutes per call", "นาทีต่อสาย"), unit: L("minutes", "นาที"), def: 3, max: 60, step: 0.5 },
      { id: "hours", label: L("Calling hours per day", "ชั่วโมงทำงานต่อวัน"), unit: L("hours", "ชม."), def: 8, max: 23.75, step: 0.5,
        help: L("Hours with the full concurrent capacity open.", "ช่วงที่เปิดรับ concurrent เต็มจำนวน") },
      { id: "days", label: L("Days per month", "วันต่อเดือน"), unit: L("days", "วัน"), def: 30, max: 31, step: 1 },
      { id: "aiMin", label: L("AI cost per minute", "ค่า AI ต่อนาที"), unit: L("US$/min", "USD/นาที"), def: VOICE8.aiMin, max: 1, step: 0.0001 },
      { id: "flows", label: L("Call flows to build", "จำนวน Call flow"), unit: L("flows", "flow"), def: 2, max: 1000, step: 1 },
      { id: "flowDays", label: L("Man-days per call flow", "Man-day ต่อ Call flow"), unit: L("man-days", "man-day"), def: 5, max: 100, step: 0.5 },
    ],
    lines: (v) => {
      const V = VOICE8;
      const jkt = choiceIndex(v.region) === 1;
      const R = V.region[jkt ? "jkt" : "sg"];
      const daily = v.calls * v.callMin;
      const minutes = daily * v.days;
      // Billed hours per day are rounded up to the next half hour, as in the customer specs (5 h 25 min → 5.5 h).
      const halfUp = (h: number) => Math.ceil(Number((h * 2).toPrecision(12))) / 2;
      const dayHours = halfUp(v.hours + V.idleTail);
      const billedHours = dayHours * v.days;
      const voices = Math.max(1, Math.ceil(v.concurrent / V.callsPerVoice)) + V.voiceBuffer;
      // Inbound can ring at any hour, so one voice instance stays warm all month (min 1).
      // Outbound only dials in calling hours: min 0, every instance pre-warmed before calling starts.
      const outbound = optionIndex(v.direction, 3) === 1;
      const voiceExtra = outbound ? voices : voices - 1;
      const voiceDay = outbound ? halfUp(v.hours + V.warmUp + V.idleTail) : dayHours;
      const voiceHours = voiceDay * v.days;
      const asteriskExtra = Math.max(0, Math.ceil(v.concurrent / V.callsPerAsterisk) - 1);
      const runtimeExtra = Math.max(0, Math.ceil(v.concurrent / V.callsPerRuntime) - 1);
      const egressGiB = (minutes * V.mbPerMin * 1e6) / 2 ** 30; // MB → GiB, the unit Google bills egress in
      return [
        { id: "min", label: L("AI conversation minutes", "นาทีสนทนา AI"), payer: "beryl8", kind: "ai",
          sell: minutes * v.aiMin, cost: minutes * v.aiMin,
          detail: L(`${n(v.calls)} calls × ${n(v.callMin)} min × ${n(v.days)} days = ${n(minutes)} min × US$${n(v.aiMin)}`, `${n(v.calls)} สาย × ${n(v.callMin)} นาที × ${n(v.days)} วัน = ${n(minutes)} นาที × US$${n(v.aiMin)}`) },
        // Fixed stack: prod in docs/cost.md (~$640) with both Asterisk VMs on e2-standard-2; Cloud Run and LB cost the same in both regions.
        // CUD (gcloud run services describe, 2026-11-21): the 207.9 row mixes instance-based services (call-runtime, business,
        // system) with request-based ones (engine, studio), so it keeps 17%; voice, and the extra voice and runtime rows below,
        // are instance-based only (run.googleapis.com/cpu-throttling: false), so 28%.
        ...gcp([
          ["Cloud Run (call runtime, business, system, engine, studio)", "Cloud Run (call runtime, business, system, engine, studio)", 207.9, "run"],
          ...(outbound ? [] : [["Cloud Run (voice, 1 instance always on)", "Cloud Run (voice, 1 instance เปิดตลอด)", V.voiceHour * 730, "runInstance"] as Svc]),
          ["Compute Engine (Asterisk active/standby, e2-standard-2 × 2)", "Compute Engine (Asterisk active/standby, e2-standard-2 × 2)", R.asterisk],
          ["Compute Engine (Qdrant cluster, 3 VMs + internal LB)", "Compute Engine (Qdrant cluster, 3 VM + internal LB)", R.qdrant],
          ["Memorystore Valkey (HA)", "Memorystore Valkey (HA)", R.valkey],
          ["Load Balancer and Cloud Armor", "Load Balancer และ Cloud Armor", 50.3],
        ], 1, true),
        // Singapore ops 12 is itemised in docs/cost.md (NAT 4.7 + build 3.8 + registry 1.2 + storage 1.2 + secrets 1); Jakarta 12.5 has
        // no itemised source (audit 2026-11-21: UNSOURCEABLE), so only the Jakarta row is an estimate.
        ...gcp([["NAT, build, storage and other", "NAT, build, storage และอื่นๆ", R.ops]], 1, true).map((l) => (jkt ? unverified(l) : l)),
        gcpUsage("gcp-voice", outbound ? "Cloud Run (voice instances in calling hours)" : "Cloud Run (extra voice instances)", outbound ? "Cloud Run (voice instance ช่วงโทร)" : "Cloud Run (voice instance ที่เพิ่ม)", voiceExtra * V.voiceHour * voiceHours,
          outbound
            ? L(`${voiceExtra} × US$${V.voiceHour}/h × ${n(voiceDay)} h (10 min warm-up + ${n(v.hours)} h + 15 min, rounded up) × ${n(v.days)} days · ${V.callsPerVoice} calls per instance + ${V.voiceBuffer} spare · min 0 outside calling hours`, `${voiceExtra} × US$${V.voiceHour}/ชม. × ${n(voiceDay)} ชม. (warm-up 10 นาที + ${n(v.hours)} ชม. + 15 นาที ปัดขึ้น) × ${n(v.days)} วัน · ${V.callsPerVoice} สายต่อ instance + เผื่อ ${V.voiceBuffer} · min 0 นอกเวลาโทร`)
            : L(`${voiceExtra} × US$${V.voiceHour}/h × ${n(voiceDay)} h (${n(v.hours)} h + 15 min, rounded up) × ${n(v.days)} days · ${V.callsPerVoice} calls per instance + ${V.voiceBuffer} spare`, `${voiceExtra} × US$${V.voiceHour}/ชม. × ${n(voiceDay)} ชม. (${n(v.hours)} ชม. + 15 นาที ปัดขึ้น) × ${n(v.days)} วัน · ${V.callsPerVoice} สายต่อ instance + เผื่อ ${V.voiceBuffer}`), "runInstance"),
        ...(runtimeExtra > 0 ? [
          gcpUsage("gcp-runtime", "Cloud Run (extra call runtime and system)", "Cloud Run (call runtime และ system ที่เพิ่ม)", runtimeExtra * 2 * V.runtimeHour * billedHours,
            L(`${runtimeExtra} × 2 × US$${V.runtimeHour}/h × ${n(billedHours)} h`, `${runtimeExtra} × 2 × US$${V.runtimeHour}/ชม. × ${n(billedHours)} ชม.`), "runInstance"),
        ] : []),
        ...(asteriskExtra > 0 ? [
          gcpUsage("gcp-asterisk", "Compute Engine (extra Asterisk VMs)", "Compute Engine (Asterisk VM ที่เพิ่ม)", asteriskExtra * R.asteriskVm,
            L(`${asteriskExtra} × US$${R.asteriskVm} · ${V.callsPerAsterisk} calls per VM`, `${asteriskExtra} × US$${R.asteriskVm} · ${V.callsPerAsterisk} สายต่อ VM`)),
        ] : []),
        gcpUsage("gcp-egress", "Network egress (call audio)", "Network egress (เสียงออก internet)", egressGiB * R.egressGiB,
          L(`${n(minutes)} min × ${V.mbPerMin} MB ≈ ${n(roundPrice(egressGiB))} GiB × US$${R.egressGiB}/GiB`, `${n(minutes)} นาที × ${V.mbPerMin} MB ≈ ${n(roundPrice(egressGiB))} GiB × US$${R.egressGiB}/GiB`)),
      ];
    },
    notes: [],
    asOf: "2026-11-10",
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
    // Every Connect8 row is UNSOURCEABLE or an open SPEC-QUESTION (audit 2026-11-21): no repo or confirmed prod; the connect8 /
    // connect8-pg resources in be8-ai-research are not confirmed as its prod and are not used (decision 8).
    lines: (v, users) => [
      { id: "ai", label: L("AI steps", "ขั้นตอน AI"), payer: "direct", kind: "ai", sell: v.runs * (v.aiShare / 100) * 0.004, cost: v.runs * (v.aiShare / 100) * 0.004, draft: true, estimate: true,
        detail: L(`${n(v.runs)} runs × ${n(v.aiShare)}% × US$0.004`, `${n(v.runs)} ครั้ง × ${n(v.aiShare)}% × US$0.004`) },
      ...gcp([
        ["Cloud Run (workflow engine)", "Cloud Run (ตัวรัน workflow)", 90, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 70, "sql"],
        ["Pub/Sub and Cloud Tasks", "Pub/Sub และ Cloud Tasks", 26],
        ["Storage, logging and other", "Storage, logging และอื่นๆ", 14],
      ], blocks(v.runs, 500000), true).map(unverified),
      unverified(gcpUsage("gcp-users", "Cloud Run (per user)", "Cloud Run (ตามจำนวนผู้ใช้)", users * 0.2, L(`${n(users)} users × US$0.20`, `${n(users)} คน × US$0.20`))),
    ],
    notes: [],
  },
  space8: {
    id: "space8",
    license: 144,
    licenseDraft: true,
    unitLabel: USERS,
    setupDays: 2,
    // No usage inputs: every Space8 row below is a fixed monthly cost. The "people online" input (US$1.50 per online user for
    // voice and video) was removed 2026-11-21: LiveKit runs on the VM priced in full below, and the one cost outside it that
    // grows with users, internet egress of call media (0.12/GiB for the first TiB Singapore → APAC, 400E-0B94-6FB4), has no measured GB per user.
    inputs: [],
    lines: () => [
      // Space8 prod, gcloud/kubectl 2026-11-21 (Space8 docs/architecture.md): no Cloud Run. Cloud Billing Catalog asia-southeast1,
      // on-demand, × 730 h, prices checked 2026-11-21.
      // VM (web, realtime/Colyseus, LiveKit and its egress, redis on docker compose; was "Cloud Run (app and realtime)" 60):
      // e2-standard-2 = 2 cores × 0.02690931 (7102-B9AA-2ACF) × 730 + 8 GiB × 0.00360594 (E277-7DC2-2C7D) × 730 = 39.2876 + 21.0587,
      // + 20 GB pd-standard boot × 0.044/GiB-mo (0572-568A-4FC4) = 0.88, + in-use static external IP 0.005/h (C054-7F72-A02E) × 730
      // = 3.65 → 64.88. Space8's doc lists 69.26 for the VM; the 4.38 more is not itemised there, so it is not used.
      // Cloud SQL re-priced 2026-11-21 (db-custom-1-3840 zonal + 20 GB SSD): 1 × 0.0578 (DE86-B401-E60F) × 730 + 3.75 GiB × 0.0098
      // (EF83-F6A8-8EA7) × 730 + 20 GiB × 0.238/GiB-mo (45B3-606F-EE91) = 42.194 + 26.8275 + 4.76 = 73.78 (was 50); backups are usage, not included.
      ...gcp([
        ["Compute Engine (VM: app, realtime and LiveKit)", "Compute Engine (VM: แอป, realtime และ LiveKit)", 64.88],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 73.78, "sql"],
      ], 1, true),
      // GKE Autopilot space8-agents (agent runtime from Collab8), pod-based billing at the pods' requests, sidecars counted as in
      // Space8's doc: runner 550 mCPU (500 + cloud-sql-proxy 50), 1.0625 GiB, 4.25 GiB ephemeral; egress 500 mCPU (caddy 450 +
      // vertex-token 50), 0.5 GiB, 2 GiB ephemeral. Pods = (1,050 mCPU × 0.0000549 (589B-F840-EC19) + 1.5625 GiB × 0.0060729
      // (6500-7637-6ACA) + 6.25 GiB × 0.0000676 (3577-D694-91BC)) per hour × 730 = 42.0809 + 6.9269 + 0.3084 = 49.32 (runner 26.96,
      // egress 22.35, as in the doc). Cluster fee 0.10/h (F52D-A61F-C7D1) × 730 = 73. Agent session pods run only while a session
      // does and are not here. GKE free tier: US$74.40 a month per billing account, about one free Autopilot or zonal cluster
      // (cloud.google.com/kubernetes-engine/pricing, read 2026-11-21); Space8's doc says another cluster on its billing account
      // already uses it. Not subtracted: a customer's own billing account may or may not have it free.
      // Counted once with Collab8: this row is the always-on runtime only; Collab8's gcp-sandbox row prices the per-session pods.
      gcpUsage("gcp-gke-agents", "GKE Autopilot (agent runtime)", "GKE Autopilot (ระบบรัน agent)", roundPrice(SPACE8_GKE.clusterFee + SPACE8_GKE.pods),
        L(`cluster fee US$${SPACE8_GKE.clusterFee} + always-on runner and egress pods US$${SPACE8_GKE.pods} / month`, `ค่า cluster US$${SPACE8_GKE.clusterFee} + pod runner และ egress ที่เปิดตลอด US$${SPACE8_GKE.pods} ต่อเดือน`)),
      // Cloud NAT, Cloud Storage, Artifact Registry and Secret Manager: ~3 a month at small volumes (Space8 docs/architecture.md
      // cost table, list prices 2026-11-09); was "Storage, logging and other" 40 with no source. The GKE row above holds the rest.
      ...gcp([["Cloud NAT, storage and other", "Cloud NAT, storage และอื่นๆ", 3]], 1, true),
    ],
    // Variable costs from Space8 docs/architecture.md: agent session ≈ US$0.011 per 10-minute session (1.1 vCPU, 1.125 GiB pod),
    // models billed per token; egress price as above.
    notes: [L("Voice and video run on the VM. Not included, as they grow with use: internet egress for calls (US$0.12/GiB from Singapore to Asia-Pacific for the first TiB), agent session pods (about US$0.011 per 10-minute session; Collab8's agent workspaces row prices them per session, so with both products they are counted once) and AI model tokens.",
      "เสียงและวิดีโอรันบน VM ไม่รวมค่าที่เพิ่มตามการใช้งาน: egress ออก internet ของการโทร (US$0.12/GiB จาก Singapore ไปเอเชียแปซิฟิกใน 1 TiB แรก), pod ของ session agent (ราว US$0.011 ต่อ session 10 นาที แถวพื้นที่ทำงานของ Agent ใน Collab8 คิดส่วนนี้ต่อ session จึงนับครั้งเดียวเมื่อเลือกทั้งสอง product) และค่า token ของโมเดล AI")],
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
      { id: "sms", label: L("SMS credits per month", "เครดิต SMS ต่อเดือน"), unit: L("credits", "เครดิต"), def: 10000, max: 100000000, step: 1000,
        help: L("A Thai message over 70 characters uses more than one credit (up to 134 characters = 2). Links saved earlier count each message as 1 credit.",
          "ข้อความภาษาไทยเกิน 70 ตัวอักษรใช้มากกว่า 1 เครดิต (ไม่เกิน 134 ตัวอักษร = 2 เครดิต) ลิงก์ที่บันทึกไว้ก่อนหน้านี้นับข้อความละ 1 เครดิต") },
      { id: "smsPrice", label: L("SMS price per credit", "ราคา SMS ต่อเครดิต"), unit: L("THB", "บาท"), def: SMS_THB_PER_CREDIT, max: 10, step: 0.01,
        help: L(`Default: ThaiBulkSMS Standard, ฿30,000 package, ฿${n(SMS_THB_PER_CREDIT)} a credit before VAT. Enter your provider's price.`,
          `ค่าเริ่มต้น: ThaiBulkSMS Standard แพ็กเกจ ฿30,000 เครดิตละ ฿${n(SMS_THB_PER_CREDIT)} ก่อน VAT ใส่ราคาของผู้ให้บริการที่ใช้จริงได้`) },
      { id: "line", label: L("LINE OA messages per month (per recipient)", "ข้อความ LINE OA ต่อเดือน (นับต่อผู้รับ)"), unit: L("messages", "ข้อความ"), def: 20000, max: 100000000, step: 1000,
        help: L("As LINE counts the plan's quota: one broadcast to 1,000 followers = 1,000 messages. Chats and auto-replies are not counted.",
          "ตามที่ LINE นับโควตาแพ็กเกจ: broadcast 1 ครั้งถึงเพื่อน 1,000 คน = 1,000 ข้อความ ข้อความแชทและตอบกลับอัตโนมัติไม่นับ") },
      { id: "linePlan", label: L("LINE OA plan", "แพ็กเกจ LINE OA"), unit: L("", ""), def: LINE_PRO, max: LINE_OA.length - 1,
        choices: LINE_OA.map((p) => L(`${p.name}: ฿${n(p.fee)} a month, ${n(p.included)} messages included`, `${p.name}: ฿${n(p.fee)} ต่อเดือน รวม ${n(p.included)} ข้อความ`)) },
    ],
    lines: (v, _users, _size, rate) => [
      { id: "email", label: L("Email sending (your provider)", "ค่าส่งอีเมล (ผู้ให้บริการของคุณ)"), payer: "direct", kind: "telco", sell: v.email * 0.0001, cost: v.email * 0.0001, draft: true,
        detail: L(`${n(v.email)} emails × US$0.0001`, `${n(v.email)} ฉบับ × US$0.0001`) },
      smsRow(v.sms, v.smsPrice, rate),
      lineOaRow(v.line, rate, v.linePlan),
      // Cloud SQL and Memorystore re-priced 2026-11-21 from the Cloud Billing Catalog (asia-southeast1, on-demand, × 730 h)
      // for the Pulse8 prod stack (gcloud 2026-11-21: Cloud SQL db-g1-small zonal + 10 GB SSD, Redis Basic 1 GB):
      // sql 0.049/h (FB2B-BC59-824D) × 730 + 10 GiB × 0.238/GiB-mo (45B3-606F-EE91) = 35.77 + 2.38 = 38.15 (was 110), backups
      // (0.112/GiB-mo, 5C0F-D226-757F) are usage and not included; redis 1 GiB × 0.065/h (D7B2-9EA7-8B11) × 730 = 47.45 (was 40).
      // No Cloud SQL committed-use discount: shared-core tiers (db-g1-small) are not eligible
      // (docs.cloud.google.com/sql/docs/postgres/cud, read 2026-11-21).
      // Cloud Run 120 (audit: worker pool 39.35 + unmeasured web/public requests) and storage/logging 30 (LB minimum 18.25 + unmeasured
      // usage) are UNSOURCEABLE; SQL and Redis above are sourced.
      ...gcp([["Cloud Run (app and sending)", "Cloud Run (แอปและระบบส่ง)", 120, "run"]], 1, true).map(unverified),
      ...gcp([
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 38.15],
        ["Memorystore (queues)", "Memorystore (คิว)", 47.45],
      ], 1, true),
      ...gcp([["Storage, logging and other", "Storage, logging และอื่นๆ", 30]], 1, true).map(unverified),
      // UNSOURCEABLE: no evidence that the Cloud SQL tier or disk grows with contacts (prod is still db-g1-small, 10 GB).
      unverified(gcpUsage("gcp-contacts", "Cloud SQL (per 100,000 contacts)", "Cloud SQL (ทุก 100,000 รายชื่อ)", blocks(v.contacts, 100000) * 100,
        L(`${blocks(v.contacts, 100000)} × US$100`, `${blocks(v.contacts, 100000)} × US$100`))),
    ],
    notes: [(() => {
      const [basic, pro] = LINE_OA;
      return L(`Assumed fees: SMS ฿${n(SMS_THB_PER_CREDIT)} a credit unless you change it (ThaiBulkSMS Standard), email US$0.10 per 1,000. LINE OA Basic ฿${n(basic.fee)} a month with ${n(basic.included)} messages, then ฿${n(basic.extra)} per extra message; Pro ฿${n(pro.fee)} with ${n(pro.included)}, then ฿${n(pro.extra)}. SMS and LINE prices exclude 7% VAT.`,
        `สมมติค่าส่ง: SMS เครดิตละ ฿${n(SMS_THB_PER_CREDIT)} ถ้าไม่ได้แก้ (ThaiBulkSMS Standard) อีเมล US$0.10 ต่อ 1,000 ฉบับ · LINE OA แพ็กเกจ Basic ฿${n(basic.fee)} ต่อเดือน รวม ${n(basic.included)} ข้อความ ส่วนเกินข้อความละ ฿${n(basic.extra)} · Pro ฿${n(pro.fee)} รวม ${n(pro.included)} ข้อความ ส่วนเกินข้อความละ ฿${n(pro.extra)} · ราคา SMS และ LINE ไม่รวม VAT 7%`);
    })()],
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
    // Every Collab8 row is UNSOURCEABLE or an open SPEC-QUESTION (audit 2026-11-21): no Collab8 prod to measure; kept as a labelled
    // draft (decision 6).
    // Agent runtime is counted once with Space8 (checked 2026-11-21): Space8's gcp-gke-agents is the cluster fee + always-on runner and
    // egress pods and leaves session pods out (Space8 docs/architecture.md); gcp-sandbox here is per session only. No row of one prices
    // a cost of the other, so no amount changed.
    lines: (v, users) => [
      { id: "ai", label: L("AI model for agent sessions", "ค่าโมเดล AI สำหรับ session ของ Agent"), payer: "direct", kind: "ai", sell: users * v.sessions * 0.15, cost: users * v.sessions * 0.15, draft: true, estimate: true,
        detail: L(`${n(users)} users × ${n(v.sessions)} sessions × US$0.15`, `${n(users)} คน × ${n(v.sessions)} session × US$0.15`) },
      ...gcp([
        ["Cloud Run (chat and API)", "Cloud Run (แชตและ API)", 130, "run"],
        ["Cloud SQL (database)", "Cloud SQL (ฐานข้อมูล)", 110, "sql"],
        ["Memorystore (realtime)", "Memorystore (realtime)", 40],
        ["Cloud Storage (files)", "Cloud Storage (ไฟล์)", 30],
        ["Logging and other", "Logging และอื่นๆ", 40],
      ], 1, true).map(unverified),
      unverified(gcpUsage("gcp-sandbox", "Cloud Run (agent workspaces)", "Cloud Run (พื้นที่ทำงานของ Agent)", users * v.sessions * 0.02,
        L(`${n(users)} users × ${n(v.sessions)} sessions × US$0.02 · per-session pods; the always-on runtime is in Space8`,
          `${n(users)} คน × ${n(v.sessions)} session × US$0.02 · pod ต่อ session ส่วนระบบที่เปิดตลอดอยู่ใน Space8`))),
    ],
    notes: [
      L("Compare: Slack about US$9 per user per month.", "เทียบ: Slack ราว US$9 ต่อผู้ใช้ต่อเดือน"),
      L("Agent runtime is counted once: the always-on part (GKE cluster, runner and egress pods) is priced in Space8; the agent workspaces row here covers only the pods each session starts, which Space8 leaves out.",
        "ค่าระบบรัน agent นับครั้งเดียว: ส่วนที่เปิดตลอด (GKE cluster, pod runner และ egress) คิดใน Space8 ส่วนแถวพื้นที่ทำงานของ Agent ที่นี่คิดเฉพาะ pod ที่แต่ละ session เปิด ซึ่ง Space8 ไม่ได้รวม"),
    ],
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
      // Every Ask8 row is UNSOURCEABLE or an open SPEC-QUESTION (audit 2026-11-21): the cost per question has no token mix behind it
      // ("estimate until measured") and there is no Ask8 prod; prices kept as drafts (decision 7).
      const ai: Line = choiceIndex(v.pack) === 1
        ? { id: "ai", label: L("AI Pack (≈฿4 per credit at ฿33.5/US$)", "AI Pack (≈฿4 ต่อ credit ที่ ฿33.5/US$)"), payer: "beryl8", kind: "usage", draft: true, estimate: true,
            sell: questions * perQuestion("credits") * ASK8.creditSell, cost: model + questions * ASK8.infra,
            detail: L(`${n(users)} users × ${n(v.asks)} questions × ${n(perQuestion("credits"))} credits · answers/data/actions ${mix}`, `${n(users)} คน × ${n(v.asks)} คำถาม × ${n(perQuestion("credits"))} credit · ถามตอบ/ดึงข้อมูล/สั่งงาน ${mix}`) }
        : { id: "ai", label: L("AI model for answers (your provider)", "ค่าโมเดล AI สำหรับคำตอบ (ผู้ให้บริการของคุณ)"), payer: "direct", kind: "ai", draft: true, estimate: true,
            sell: model, cost: model,
            detail: L(`${n(users)} users × ${n(v.asks)} questions · answers/data/actions ${mix}`, `${n(users)} คน × ${n(v.asks)} คำถาม · ถามตอบ/ดึงข้อมูล/สั่งงาน ${mix}`) };
      return [
        ai,
        ...gcp([
          ["Cloud Run (widget and API)", "Cloud Run (widget และ API)", 60, "run"],
          ["Cloud SQL with pgvector", "Cloud SQL พร้อม pgvector", 70, "sql"],
          ["Logging and other", "Logging และอื่นๆ", 20],
        ], 1, true).map(unverified),
        unverified(gcpUsage("gcp-docs", "Storage and search index", "Storage และดัชนีค้นหา", v.gb * 0.5, L(`${n(v.gb)} GB × US$0.50`, `${n(v.gb)} GB × US$0.50`))),
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
    // No BigQuery rows (removed 2026-11-21, was US$80 per 100,000 profiles + US$15 per 1M events): Data8 prod has no BigQuery,
    // its data lake is Postgres (schemas lake/model/insight) and pipelines run as a job queue in the same Cloud Run service.
    // The profile and event counts drove only those rows, so they are gone too. Storage is an assumption the user sets:
    // the lake tables are created per data source, so their size per profile cannot be read from the schema and is not measured.
    inputs: [
      // Cloud SQL storage is 10 GB minimum, and shared-core machines (db-g1-small) take up to 3,054 GB
      // (docs.cloud.google.com/sql/docs/postgres/instance-settings and …/issues-updating-storage-capacity, read 2026-11-21).
      { id: "sqlGiB", label: L("Database storage (Cloud SQL SSD)", "พื้นที่ฐานข้อมูล (Cloud SQL SSD)"), unit: L("GiB", "GiB"), def: 10, max: SQL_SHARED_CORE_GIB.max, step: 10,
        help: L("Starts at production's 10 GiB; Cloud SQL takes 10 to 3,054 on this machine. Growth per customer profile is not measured yet: set the size you expect.",
          "เริ่มที่ 10 GiB เท่า production (Cloud SQL เครื่องรุ่นนี้รับ 10 ถึง 3,054) ยังไม่ได้วัดว่าโตเท่าไรต่อโปรไฟล์ลูกค้า ใส่ขนาดที่คาดไว้") },
    ],
    lines: (v) => [
      // Cloud Run and Cloud SQL re-priced 2026-11-21 from the Cloud Billing Catalog (asia-southeast1, on-demand, × 730 h) for the
      // Data8 prod stack (gcloud 2026-11-21, Data8 infra main.tf): Cloud Run 1 vCPU / 1 GiB, min = max 1, CPU always allocated
      // (instance-based) = 2,628,000 s × (2.16e-05 CPU 4D3C-D63E-1DF1 + 2.4e-06 GiB 7550-6D11-4653) = 56.7648 + 6.3072 = 63.072
      // → 63.07 (was 60); Cloud SQL db-g1-small zonal = 0.049/h (FB2B-BC59-824D) × 730 = 35.77, its SSD storage a separate row:
      // provisioned GiB × 0.238/GiB-mo (45B3-606F-EE91), prod 10 GiB (auto-resize on) = 2.38, so the two rows are the earlier
      // 38.15 at defaults. Backups and PITR logs are usage and not included. No Cloud SQL committed-use discount: shared-core
      // tiers (db-g1-small) and storage are not eligible (docs.cloud.google.com/sql/docs/postgres/cud, read 2026-11-21).
      ...gcp([
        ["Cloud Run (app and pipelines)", "Cloud Run (แอปและ pipeline)", 63.07, "runInstance"], // instance-based only: 28% CUD
        ["Cloud SQL (database server)", "Cloud SQL (เครื่องฐานข้อมูล)", 35.77],
      ], 1, true),
      gcpUsage("gcp-sql-storage", "Cloud SQL storage (SSD)", "พื้นที่ Cloud SQL (SSD)", billedSqlGiB(v.sqlGiB) * 0.238,
        L(`${n(billedSqlGiB(v.sqlGiB))} GiB × US$0.238 per GiB-month · growth per profile not measured`,
          `${n(billedSqlGiB(v.sqlGiB))} GiB × US$0.238 ต่อ GiB ต่อเดือน · ยังไม่ได้วัดการโตต่อโปรไฟล์`)),
      // Logging and other: the earlier estimate, unchanged; no usage was measured for it in the 2026-11-21 audit (UNSOURCEABLE).
      ...gcp([["Logging and other", "Logging และอื่นๆ", 50]], 1, true).map(unverified),
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

/** The per-user license for this item (Meet8's depends on how it is bought); null = none, 0 = per-user but no license. */
export const licenseOf = (item: Item): number | null => {
  const p = PRICING[item.pid];
  return p.licenseFor ? p.licenseFor(values(item)) : p.license;
};

export const setupDaysOf = (item: Item) => {
  const p = PRICING[item.pid];
  return p.setupDaysFor ? p.setupDaysFor(values(item)) : p.setupDays;
};

/** Seats billed: the 20-user minimum applies to every per-user license (and to Meet8 subscriptions). */
export const billedUsers = (item: Item) =>
  licenseOf(item) === null ? 0 : Math.max(MIN_USERS, Math.round(clamp(item.users, 0, 1e6, MIN_USERS)));

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
  const listLicense = (licenseOf(item) ?? 0) * users;
  const license = listLicense * (1 - clamp(s.discount, 0, 100, 0) / 100);
  const ma = license * MA_RATE;
  const setup = item.setup && !p.noSetup?.(values(item)) ? (setupDaysOf(item) * s.dayRate) / s.rate : 0;
  const lines = p.lines(values(item), users, item.size === "standard" ? "standard" : "lean", s.rate).map((l) => {
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
  /** Per billed user, whole display units; null for products with no per-user license. */
  perUser: { monthly: number; avgMonthly: number } | null;
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
  /** Everything paid each month (Beryl8 and providers), split into Google Cloud, AI and the rest; adds up to `monthly`. */
  month: HostingSplit;
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
    const lic = licenseOf(item);
    const unitPrice = lic === null ? 0 : roundPrice(toDisplay(lic, d));
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
    const seats = billedUsers(item);
    const total = years.reduce((a, y) => a + y.beryl8 + y.direct, 0);
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
      total,
      perUser: seats > 0
        ? { monthly: roundMoney((monthlyBeryl8 + monthlyDirect) / seats), avgMonthly: roundMoney(total / seats / (YEARS * 12)) }
        : null,
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
  const monthly = items.reduce((a, i) => a + i.monthlyBeryl8 + i.monthlyDirect, 0);
  const byKind = (k: Kind) => items.reduce((a, i) => a + i.lines.reduce((b, l) => b + (l.kind === k ? l.sell : 0), 0), 0);
  return {
    items,
    years,
    foot,
    year1: years[0].total,
    tco: foot.total,
    monthly,
    hosting: hostingOf(items),
    month: { cloud: byKind("cloud"), ai: byKind("ai"), other: monthly - byKind("cloud") - byKind("ai"), total: monthly },
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
