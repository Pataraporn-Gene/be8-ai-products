"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { PricingStrings } from "./content";

// Plans mirror packages/db/src/seed.ts (price per month, THB). Enterprise is quoted per organization.
type LimitKey = "contacts" | "messages" | "users" | "bus" | "journeys";
type PlanId = "free" | "growth" | "scale" | "enterprise";
type Plan = { id: PlanId; name: string; thb: number | null; reco?: boolean; limits: Record<LimitKey, number> | null };

const PLANS: Plan[] = [
  { id: "free", name: "Free", thb: 0, limits: { contacts: 1000, messages: 3000, users: 2, bus: 1, journeys: 2 } },
  { id: "growth", name: "Growth", thb: 4900, reco: true, limits: { contacts: 25000, messages: 150000, users: 10, bus: 3, journeys: 25 } },
  { id: "scale", name: "Scale", thb: 19900, limits: { contacts: 250000, messages: 2000000, users: 50, bus: 20, journeys: 500 } },
  { id: "enterprise", name: "Enterprise", thb: null, limits: null },
];
const LIMIT_KEYS: LimitKey[] = ["contacts", "messages", "users", "bus", "journeys"];
const KEY = "pulse8-pricing-public";

type State = { cycle: "month" | "year"; discount: number; cur: "THB" | "USD"; rate: number; plan: PlanId };
const DEFAULT: State = { cycle: "month", discount: 15, cur: "THB", rate: 33, plan: "growth" };

const clamp = (v: number, lo: number, hi: number, d: number) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d);
const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

// Saved state is untrusted: an older or hand-edited value must never reach the price math.
function load(): State {
  let saved: Record<string, unknown> = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {}
  return {
    cycle: saved.cycle === "year" ? "year" : "month",
    discount: clamp(Math.round(Number(saved.discount)), 0, 50, 15),
    cur: saved.cur === "USD" ? "USD" : "THB",
    rate: clamp(Number(saved.rate), 10, 100, 33),
    plan: PLANS.some((p) => p.id === saved.plan) ? (saved.plan as PlanId) : "growth",
  };
}

type Ctx = ReturnType<typeof useModel>;
const PricingCtx = createContext<Ctx | null>(null);
const usePricing = () => {
  const c = useContext(PricingCtx);
  if (!c) throw new Error("Pricing components must be inside <PricingProvider>");
  return c;
};

function useModel(t: PricingStrings) {
  const [S, setS] = useState<State>(DEFAULT);
  const loaded = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      loaded.current = true;
      setS(load());
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...S, present: false }));
    } catch {}
  }, [S]);

  return useMemo(() => {
    const n0 = new Intl.NumberFormat(t.numberLocale);
    const price = (p: Plan) => {
      if (p.thb == null) return null;
      const perMonth = S.cycle === "year" ? p.thb * (1 - S.discount / 100) : p.thb;
      const total = S.cycle === "year" ? perMonth * 12 : perMonth;
      const conv = (v: number) => (S.cur === "USD" ? Math.round(v / S.rate) : Math.round(v));
      return { total: conv(total), perMonth: conv(perMonth), fullYear: conv(p.thb * 12) };
    };
    const money = (v: number) => (S.cur === "USD" ? "US$" + n0.format(v) : "฿" + n0.format(v));
    const per = () => (S.cycle === "year" ? t.perYear : t.perMonth);
    const amount = (p: Plan) => {
      const pr = price(p);
      return pr ? (p.thb === 0 ? money(0) : money(pr.total)) : null;
    };
    const subline = (p: Plan) => {
      const pr = price(p);
      if (!pr || p.thb === 0) return p.thb === 0 ? t.freeForever : "";
      return S.cycle === "year"
        ? fill(t.yearSub, { perMonth: money(pr.perMonth), save: money(pr.fullYear - pr.total) })
        : fill(t.monthSub, { discount: S.discount });
    };
    const limitItems = (l: Record<LimitKey, number>) => LIMIT_KEYS.map((k) => [n0.format(l[k]), t.limits[k]] as const);
    const current = PLANS.find((x) => x.id === S.plan) || PLANS[1];

    const quoteText = () => {
      const p = current;
      const pr = price(p);
      const lines = [fill(t.text.title, { name: p.name })];
      if (pr && p.limits) {
        lines.push(fill(t.text.price, { price: amount(p) ?? "", per: per() }));
        if (S.cycle === "year" && p.thb) lines.push(fill(t.text.year, { perMonth: money(pr.perMonth), discount: S.discount }));
        lines.push(...limitItems(p.limits).map(([value, label]) => fill(t.text.limit, { value, label })));
        lines.push(t.text.all);
      } else {
        lines.push(...t.text.ent);
      }
      lines.push(t.text.fees);
      return lines.join("\n");
    };

    return {
      S,
      t,
      n0,
      price,
      money,
      per,
      amount,
      subline,
      limitItems,
      current,
      quoteText,
      pick: (id: PlanId) => setS((s) => ({ ...s, plan: id })),
    };
  }, [S, t]);
}

export function PricingProvider({ t, children }: { t: PricingStrings; children: ReactNode }) {
  const model = useModel(t);
  return <PricingCtx.Provider value={model}>{children}</PricingCtx.Provider>;
}

const Tick = () => (
  <svg className="i">
    <use href="#p8-i-check" />
  </svg>
);

export function PlanCards() {
  const { S, t, price, amount, per, subline, limitItems, pick } = usePricing();
  return (
    <div className="plans" id="planCards">
      {PLANS.map((p) => {
        const pr = price(p);
        const picked = S.plan === p.id;
        return (
          <article
            key={p.id}
            className={`plan${p.reco ? " reco" : ""}${picked ? " picked" : ""}`}
            aria-label={fill(t.planAria, { name: p.name })}
          >
            {p.reco ? <span className="plan-badge">{t.badge}</span> : null}
            <h3>{p.name}</h3>
            <p className="plan-for">{t.planFor[p.id]}</p>
            {pr ? (
              <>
                <div className="price">
                  <b>{amount(p)}</b>
                  <span>{per()}</span>
                </div>
                <div className="price-sub">{subline(p)}</div>
              </>
            ) : (
              <>
                <div className="price-contact">{t.contactSales}</div>
                <div className="price-sub">{t.priceBySize}</div>
              </>
            )}
            <button
              type="button"
              className={`btn ${p.reco ? "btn-primary" : "btn-outline"} btn-block`}
              aria-pressed={picked}
              onClick={() => pick(p.id)}
            >
              {pr ? (picked ? t.picked : fill(t.pick, { name: p.name })) : t.contactBtn}
            </button>
            <hr />
            <div className="plan-list-h">{p.limits ? t.listHead : t.listHeadEnt}</div>
            <ul>
              {p.limits ? (
                <>
                  {limitItems(p.limits).map(([v, label]) => (
                    <li key={label}>
                      <Tick />
                      <span>
                        <b>{v}</b> {label}
                      </span>
                    </li>
                  ))}
                  <li>
                    <Tick />
                    <span>{t.allFeatures}</span>
                  </li>
                </>
              ) : (
                t.enterpriseItems.map((x) => (
                  <li key={x}>
                    <Tick />
                    <span>{x}</span>
                  </li>
                ))
              )}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

export function FinePrint() {
  const { S, t } = usePricing();
  const cur = S.cur === "USD" ? fill(t.fineCurUSD, { rate: S.rate }) : t.fineCurTHB;
  return (
    <p className="fine" id="fineprint">
      {fill(t.fineprint, { cur })}
    </p>
  );
}

export function FootCur() {
  const { S, t } = usePricing();
  return <span id="footCur">{S.cur === "USD" ? fill(t.footUSD, { rate: S.rate }) : t.footTHB}</span>;
}

export function CompareTable() {
  const { S, t, n0, price, amount, per, pick } = usePricing();
  const yes = (
    <span className="y" aria-label={t.yes}>
      <Tick />
    </span>
  );
  const no = (
    <span className="n" aria-label={t.no}>
      —
    </span>
  );
  return (
    <table className="compare" id="compare">
      <thead>
        <tr>
          <th scope="col">
            <span className="sr">{t.feature}</span>
          </th>
          {PLANS.map((p) => {
            const pr = price(p);
            const on = S.plan === p.id;
            return (
              <th scope="col" key={p.id}>
                <b>{p.name}</b>
                <small>{pr ? `${amount(p)} ${per()}` : t.contactSales}</small>
                <button type="button" aria-pressed={on} onClick={() => pick(p.id)}>
                  {pr ? (on ? t.picked : t.pickShort) : t.contactBtn}
                </button>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {t.rows.map((row, ri) => {
          if (row.t === "g")
            return (
              <tr className="grp" key={ri}>
                <td colSpan={5}>{row.label}</td>
              </tr>
            );
          const kind = row.t;
          return (
            <tr key={ri}>
              <th scope="row">{row.label}</th>
              {PLANS.map((p) => {
                let cell: ReactNode;
                if (kind === "y") cell = yes;
                else if (kind === "ent") cell = p.limits ? no : yes;
                else cell = p.limits ? n0.format(p.limits[kind]) : t.perContract;
                return <td key={p.id}>{cell}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function QuoteBar() {
  const { S, t, n0, price, money, amount, per, current, quoteText } = usePricing();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<{ msg: string; on: boolean }>({ msg: "", on: false });
  const ref = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const doneTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sticky quote bar appears once the hero has scrolled out above the viewport.
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => {
      const next = !e.isIntersecting && e.boundingClientRect.top < 0;
      if (!next && ref.current?.contains(document.activeElement)) document.getElementById("plansH")?.focus();
      setShow(next);
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(doneTimer.current);
    },
    [],
  );

  const flash = (msg: string) => {
    setToast({ msg, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((x) => ({ ...x, on: false })), 2400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quoteText());
      setDone(true);
      flash(t.toastOk);
      clearTimeout(doneTimer.current);
      doneTimer.current = setTimeout(() => setDone(false), 2000);
    } catch {
      flash(t.toastFail);
    }
  };

  const p = current;
  const pr = price(p);
  const meta = p.limits
    ? fill(t.quoteMeta, {
        contacts: n0.format(p.limits.contacts),
        messages: n0.format(p.limits.messages),
        users: p.limits.users,
      })
    : t.quoteMetaEnt;
  const sub = pr && S.cycle === "year" && p.thb ? fill(t.quoteSubYear, { perMonth: money(pr.perMonth) }) : pr ? t.exVat : "";

  return (
    <>
      <div
        ref={ref}
        className={`quote${show ? " show" : ""}`}
        id="quote"
        role="region"
        aria-label={t.quoteRegion}
        inert={!show}
      >
        <div className="wrap">
          <div>
            <div className="quote-name">{fill(t.quoteName, { name: p.name })}</div>
            <div className="quote-meta">{meta}</div>
          </div>
          <div className="quote-price">
            <b>{pr ? `${amount(p)} ${per()}` : t.contactSales}</b>
            <small>{sub}</small>
          </div>
          <button type="button" className={`btn btn-primary${done ? " done" : ""}`} onClick={copy}>
            <svg className="i">
              <use href="#p8-i-copy" />
            </svg>
            <span className="long">{done ? t.copied : t.copyLong}</span>
            <span className="short">{t.copyShort}</span>
          </button>
        </div>
      </div>
      <div className={`toast${toast.on ? " show" : ""}`} role="status" aria-live="polite">
        {toast.msg}
      </div>
    </>
  );
}
