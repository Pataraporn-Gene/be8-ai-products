/* Pricing model for the Insight8 Studio internal sales page (ported from the source script). */

export type PlanKey = "standard" | "premium";
export type PlanId = PlanKey | "customize";
export const PLAN_KEYS: PlanKey[] = ["standard", "premium"];
export const PLAN_NAMES: Record<PlanId, string> = { standard: "Standard", premium: "Premium", customize: "Customize" };

export type ItemId =
  | "agent"
  | "oneshot"
  | "knowledge"
  | "studio"
  | "sandbox"
  | "tools"
  | "relay"
  | "jobs"
  | "sql"
  | "sqldisk"
  | "net"
  | "other";

export type CostItem = {
  id: ItemId;
  g: "ours" | "gcp";
  pre?: boolean;
  est?: boolean;
  calc?: boolean;
  v?: Record<PlanKey, number | null>;
  usd?: Record<PlanKey, number | null>;
};

/* Cost per org per year in THB. Estimates until finance confirms.
   "ours": model calls scale with the question quota; one-shot AI and Knowledge OCR are estimates.
   "gcp": one customer stack, asia-southeast1 list prices, USD per month. */
export const ITEMS: CostItem[] = [
  { id: "agent", g: "ours", calc: true },
  { id: "oneshot", g: "ours", est: true, v: { standard: 12000, premium: 30000 } },
  { id: "knowledge", g: "ours", pre: true, est: true, v: { standard: null, premium: 24000 } },
  { id: "studio", g: "gcp", usd: { standard: 138.76, premium: 138.76 } },
  { id: "sandbox", g: "gcp", usd: { standard: 149.86, premium: 285.02 } },
  { id: "tools", g: "gcp", usd: { standard: 45.6, premium: 63.07 } },
  { id: "relay", g: "gcp", pre: true, usd: { standard: null, premium: 59.92 } },
  { id: "jobs", g: "gcp", usd: { standard: 15.86, premium: 28.47 } },
  { id: "sql", g: "gcp", usd: { standard: 141.62, premium: 283.24 } },
  { id: "sqldisk", g: "gcp", usd: { standard: 7.56, premium: 18.76 } },
  { id: "net", g: "gcp", usd: { standard: 16.22, premium: 27.74 } },
  { id: "other", g: "gcp", usd: { standard: 6.1, premium: 8.6 } },
];

export const DEF = { qStd: 2000, qPre: 6000, thbQ: 9.9, usd: 33, md: 3, mdRate: 15000 };
export type RateKey = keyof typeof DEF;
export const RATE_KEYS = Object.keys(DEF) as RateKey[];

export type Cfg = Record<RateKey, number> & {
  margin: number;
  ai: "included" | "customer";
  cur: "THB" | "USD";
  cost: Partial<Record<ItemId, Partial<Record<PlanKey, number>>>>;
};

export const DEFAULT_CFG: Cfg = { margin: 76, ai: "included", cur: "THB", cost: {}, ...DEF };

export const CFG_KEY = "i8-pricing-cfg1";
export const PLAN_KEY = "i8-pricing-v1";
export const PRESENT_KEY = "i8-present";

const okNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

/** Validate a stored config the same way the source page did. */
export function parseCfg(raw: string | null): Cfg {
  const cfg: Cfg = { ...DEFAULT_CFG, cost: {} };
  const c0 = JSON.parse(raw || "null");
  if (!c0 || typeof c0 !== "object") return cfg;
  if (okNum(c0.margin) && c0.margin <= 95) cfg.margin = Math.round(c0.margin);
  if (c0.ai === "customer") cfg.ai = "customer";
  if (c0.cur === "USD") cfg.cur = "USD";
  RATE_KEYS.forEach((k) => {
    if (okNum(c0[k])) cfg[k] = c0[k];
  });
  if (!(cfg.usd > 0)) cfg.usd = DEF.usd;
  if (c0.cost && typeof c0.cost === "object") {
    ITEMS.forEach((it) => {
      const o = c0.cost[it.id];
      if (!o || typeof o !== "object") return;
      PLAN_KEYS.forEach((k) => {
        if (okNum(o[k])) cfg.cost[it.id] = { ...cfg.cost[it.id], [k]: o[k] };
      });
    });
  }
  return cfg;
}

export const setupFee = (cfg: Cfg) => Math.round(cfg.md * cfg.mdRate);
export const inPlan = (it: CostItem, k: PlanKey) =>
  !((it.v && it.v[k] === null) || (it.usd && it.usd[k] === null));
export const quota = (cfg: Cfg, k: PlanKey) => (k === "standard" ? cfg.qStd : cfg.qPre);

export function valOf(cfg: Cfg, it: CostItem, k: PlanKey): number {
  if (!inPlan(it, k)) return 0;
  if (it.calc) return Math.round(quota(cfg, k) * 12 * cfg.thbQ);
  const o = cfg.cost[it.id];
  if (o && typeof o[k] === "number") return o[k] as number;
  return it.usd ? Math.round((it.usd[k] as number) * 12 * cfg.usd) : (it.v?.[k] ?? 0);
}

const counts = (cfg: Cfg, it: CostItem) => it.g === "ours" || cfg.ai === "included";
export const costOf = (cfg: Cfg, k: PlanKey, g?: "ours" | "gcp") =>
  ITEMS.reduce((sum, it) => sum + (counts(cfg, it) && (!g || it.g === g) ? valOf(cfg, it, k) : 0), 0);
export const groupTotal = (cfg: Cfg, g: "ours" | "gcp", k: PlanKey) =>
  ITEMS.reduce((s, it) => s + (it.g === g ? valOf(cfg, it, k) : 0), 0);

const up5 = (n: number) => Math.ceil(n / 5) * 5;

export type Priced = { q: number; year: number; extra: number; month: number };

/* margin applies to our own costs only; the server is passed through at cost when included */
export function reprice(cfg: Cfg): Record<PlanKey, Priced> {
  const perQ = cfg.thbQ / (1 - cfg.margin / 100);
  const year = (k: PlanKey) =>
    Math.ceil((costOf(cfg, k, "ours") / (1 - cfg.margin / 100) + costOf(cfg, k, "gcp")) / 10000) * 10000;
  const build = (k: PlanKey, extra: number): Priced => {
    const y = year(k);
    return { q: quota(cfg, k), year: y, extra, month: Math.round(y / 12) };
  };
  return { standard: build("standard", up5(perQ * 1.2)), premium: build("premium", up5(perQ)) };
}

export function money(cfg: Cfg, n: number) {
  if (cfg.cur === "USD") {
    let u = n / cfg.usd;
    u = u >= 10000 ? Math.round(u / 100) * 100 : Math.round(u);
    return "$" + u.toLocaleString("en-US");
  }
  return "฿" + n.toLocaleString("en-US");
}
/* per-question prices are small, so USD keeps cents */
export const moneyQ = (cfg: Cfg, n: number) =>
  cfg.cur === "USD" ? "$" + (n / cfg.usd).toFixed(2) : "฿" + n.toLocaleString("en-US");
export const thb = (n: number) => (n < 0 ? "−฿" : "฿") + Math.abs(n).toLocaleString("en-US");
export const fmt = (n: number) => n.toLocaleString("en-US");

/** Replace {key} placeholders in a template string. */
export const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? String(v[k]) : m));
