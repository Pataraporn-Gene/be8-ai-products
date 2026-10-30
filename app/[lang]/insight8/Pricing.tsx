"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Insight8Content, MatrixCell } from "./content";
import {
  DEFAULT_CFG,
  PLAN_KEY,
  PLAN_NAMES,
  fill,
  fmt,
  money,
  moneyQ,
  reprice,
  setupFee,
  type Cfg,
  type PlanId,
  type PlanKey,
  type Priced,
} from "./pricing-model";

/* ---------- shared state ---------- */

type Ctx = {
  t: Insight8Content;
  cfg: Cfg;
  plan: PlanId;
  setPlan: (p: PlanId) => void;
  priced: Record<PlanKey, Priced>;
};

const PricingCtx = createContext<Ctx | null>(null);
function usePricing() {
  const c = useContext(PricingCtx);
  if (!c) throw new Error("Insight8 pricing islands must render inside <PricingProvider>");
  return c;
}

const isPlan = (v: unknown): v is PlanId => v === "standard" || v === "premium" || v === "customize";

// Prices use the source's default cost model; the internal pricing bar and cost drawer are not part of this page.
const PRICED = reprice(DEFAULT_CFG);

/** Holds the selected plan and renders the page wrapper (`.p-insight8`). */
export function PricingProvider({ t, children }: { t: Insight8Content; children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>("premium");
  const [loaded, setLoaded] = useState(false);

  // Restore the saved plan after hydration so server and first client render match.
  useEffect(() => {
    let nextPlan: PlanId | null = null;
    try {
      const s = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
      if (s && isPlan(s.plan)) nextPlan = s.plan;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    if (nextPlan) setPlan(nextPlan);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify({ plan }));
    } catch {}
  }, [loaded, plan]);

  const value: Ctx = { t, cfg: DEFAULT_CFG, plan, setPlan, priced: PRICED };
  return (
    <PricingCtx.Provider value={value}>
      <div className="p-insight8">{children}</div>
    </PricingCtx.Provider>
  );
}

/* ---------- small price-dependent bits of static sections ---------- */

export function CurrencyCode() {
  const { cfg } = usePricing();
  return <span>{cfg.cur}</span>;
}

export function FootCurrency() {
  const { t, cfg } = usePricing();
  return <span>{cfg.cur === "USD" ? t.footer.curUsd : t.footer.curThb}</span>;
}

/* ---------- plan cards ---------- */

function withQty(tpl: string, q: number): ReactNode {
  if (!tpl.includes("{q}")) return tpl;
  const [a, b] = tpl.split("{q}");
  return (
    <span>
      {a}
      <span>{fmt(q)}</span>
      {b}
    </span>
  );
}

export function PlanCards() {
  const { t, cfg, plan, setPlan, priced } = usePricing();
  const P = t.plans;
  const setup = setupFee(cfg);
  const usd = cfg.cur === "USD";

  const priceCard = (k: PlanKey) => {
    const copy = P[k];
    const rec = k === "premium";
    return (
      <article key={k} className={"pc" + (rec ? " rec" : "")} aria-current={plan === k}>
        {rec && <span className="pc-tag">{P.recTag}</span>}
        <h3 className="pc-name">{PLAN_NAMES[k]}</h3>
        <div className="pc-price num">
          <b>{money(cfg, priced[k].year)}</b>
          <span>{P.perYear}</span>
        </div>
        <p className="pc-sub num">{fill(P.monthly, { x: money(cfg, priced[k].month) })}</p>
        <p className="pc-sub num">{setup ? fill(P.setup, { x: money(cfg, setup) }) : ""}</p>
        <p className="pc-for">{copy.for}</p>
        <button type="button" className={"btn " + (rec ? "btn-primary" : "btn-ghost")} onClick={() => setPlan(k)}>
          {copy.btn}
        </button>
        <ul className="pc-list">
          <li className="lbl">{copy.lbl}</li>
          {copy.list.map((x, i) => (
            <li key={i}>{withQty(x, priced[k].q)}</li>
          ))}
        </ul>
      </article>
    );
  };

  const note =
    (usd ? fill(P.note.usd, { r: cfg.usd }) : P.note.thb) +
    P.note.vat +
    (cfg.ai === "included" ? P.note.serverIncl : P.note.serverExcl) +
    (setup ? fill(P.note.setup, { x: money(cfg, setup) }) : "") +
    P.note.draft;

  return (
    <>
      <div className="pc-grid">
        {priceCard("standard")}
        {priceCard("premium")}
        <article className="pc" aria-current={plan === "customize"}>
          <h3 className="pc-name">Customize</h3>
          <div className="pc-price ask">
            <b>{P.contact}</b>
          </div>
          <p className="pc-for">{P.customize.for}</p>
          <button type="button" className="btn btn-ghost" onClick={() => setPlan("customize")}>
            {P.customize.btn}
          </button>
          <ul className="pc-list">
            <li className="lbl">{P.customize.lbl}</li>
            {P.customize.list.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </article>
      </div>
      <p className="pc-note">{note}</p>
    </>
  );
}

/* ---------- comparison table ---------- */

export function CompareTable() {
  const { t, cfg, setPlan, priced } = usePricing();
  const C = t.compare;

  const cell = (v: MatrixCell): ReactNode => {
    if (v === true)
      return (
        <>
          <span className="tick" aria-hidden="true"></span>
          <span className="sr">{C.has}</span>
        </>
      );
    if (v === false)
      return (
        <>
          <span className="dash" aria-hidden="true"></span>
          <span className="sr">{C.hasNot}</span>
        </>
      );
    if (v.startsWith("q:")) return fill(C.q, { n: fmt(priced[v.slice(2) as PlanKey].q) });
    if (v.startsWith("extra:"))
      return <span className="num">{fill(C.extra, { x: moneyQ(cfg, priced[v.slice(6) as PlanKey].extra) })}</span>;
    return v;
  };
  const head = (k: PlanKey) => fill(C.head, { y: money(cfg, priced[k].year), m: money(cfg, priced[k].month) });

  return (
    <div className="ct-wrap">
      <table className="ct" id="pz">
        <colgroup>
          <col className="c-f" />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr">{C.featureSr}</span>
            </th>
            <th scope="col">
              <span className="ct-n">Standard</span>
              <span className="ct-p num">{head("standard")}</span>
              <button type="button" className="ct-b" onClick={() => setPlan("standard")}>
                {C.select}
              </button>
            </th>
            <th scope="col" className="prem">
              <span className="ct-n">Premium</span>
              <span className="ct-p num">{head("premium")}</span>
              <button type="button" className="ct-b acc" onClick={() => setPlan("premium")}>
                {C.select}
              </button>
            </th>
            <th scope="col">
              <span className="ct-n">Customize</span>
              <span className="ct-p">{t.plans.contact}</span>
              <button type="button" className="ct-b" onClick={() => setPlan("customize")}>
                {C.contact}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {C.rows.map((r, i) =>
            "g" in r ? (
              <tr key={i} className="g">
                <th scope="rowgroup" colSpan={2}>
                  {r.g}
                </th>
                <td className="prem"></td>
                <td></td>
              </tr>
            ) : (
              <tr key={i}>
                <th scope="row">
                  {r.l}
                  {r.beta && (
                    <>
                      {" "}
                      <span className="beta">Beta</span>
                    </>
                  )}
                </th>
                <td>{cell(r.s)}</td>
                <td className="prem">{cell(r.p)}</td>
                <td className="cusv">{cell(r.c ?? r.p)}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- buy bar ---------- */

export function BuyBar() {
  const { t, cfg, plan, priced } = usePricing();
  const B = t.bar;
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setup = setupFee(cfg);

  // the buy bar appears only once the pricing section is on screen
  useEffect(() => {
    const plans = document.getElementById("plans");
    if (!plans) return;
    const sync = () => setShow(plans.getBoundingClientRect().top < window.innerHeight * 0.7);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const summary = () => {
    if (plan === "customize") return t.summary.custom;
    const p = priced[plan];
    return fill(t.summary.main, {
      name: PLAN_NAMES[plan],
      y: money(cfg, p.year),
      m: money(cfg, p.month),
      q: fmt(p.q),
      x: moneyQ(cfg, p.extra),
      setup: setup ? fill(t.summary.setup, { x: money(cfg, setup) }) : "",
      server: cfg.ai === "included" ? t.summary.serverIncl : t.summary.serverExcl,
    });
  };

  const copy = () => {
    const text = summary();
    const done = (m: string) => {
      setMsg(m);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        timer.current = null;
        setMsg(null);
      }, 2400);
    };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
      done(ok ? B.copied : B.copyFail);
    };
    try {
      navigator.clipboard.writeText(text).then(() => done(B.copied), fallback);
    } catch {
      fallback();
    }
  };

  const p = plan === "customize" ? null : priced[plan];
  return (
    <div className={"bar" + (show ? " show" : "")} role="region" aria-label={B.aria}>
      <div className="wrap">
        <div className="bar-l">
          <span className="bar-name">
            <span className="bar-brand">Insight8 Studio · </span>
            <span>{PLAN_NAMES[plan]}</span>
          </span>
          <span className="bar-meta num">{p ? fill(B.meta, { q: fmt(p.q) }) : B.customMeta}</span>
        </div>
        <div className="bar-price num">
          {p ? (
            <>
              <span>{B.priceLbl}</span>
              <b>{fill(B.perYear, { x: money(cfg, p.year) })}</b>
              <span>{fill(B.avg, { x: money(cfg, p.month) })}</span>
              {setup ? <span>{fill(B.setup, { x: money(cfg, setup) })}</span> : null}
            </>
          ) : (
            <b>{B.contact}</b>
          )}
        </div>
        <button className="btn btn-primary" type="button" onClick={copy}>
          {msg ?? B.copy}
        </button>
      </div>
    </div>
  );
}

/* ---------- scroll progress ---------- */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="sprog" ref={ref} aria-hidden="true"></div>;
}
