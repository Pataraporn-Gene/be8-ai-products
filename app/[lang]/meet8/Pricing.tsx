"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { Fx, prefersReducedMotion } from "./Fx";
import { isPlanKey, type BarPlan, type PlanKey } from "./content";

/* ---------- selected plan, persisted like the source (localStorage "sb-pricing-v4") ---------- */

const KEY = "sb-pricing-v4";
const DEFAULT_PLAN: PlanKey = "premium";
let memPlan: PlanKey | null = null;
const listeners = new Set<() => void>();

function readPlan(): PlanKey {
  if (memPlan) return memPlan;
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s && isPlanKey(s.plan)) return s.plan;
  } catch {}
  return DEFAULT_PLAN;
}
function writePlan(p: PlanKey) {
  memPlan = p;
  try {
    localStorage.setItem(KEY, JSON.stringify({ plan: p }));
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

type Ctx = {
  plan: PlanKey;
  select: (p: PlanKey) => void;
  sent: boolean;
  markSent: () => void;
  plansRef: RefObject<HTMLElement | null>;
};
const PlanCtx = createContext<Ctx | null>(null);
const usePlan = () => {
  const c = useContext(PlanCtx);
  if (!c) throw new Error("PlanProvider missing");
  return c;
};

export function PlanProvider({ children }: { children: ReactNode }) {
  const plan = useSyncExternalStore(subscribe, readPlan, () => DEFAULT_PLAN);
  const [sent, setSent] = useState(false);
  const sentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plansRef = useRef<HTMLElement | null>(null);

  const select = useCallback((p: PlanKey) => {
    if (sentTimer.current) clearTimeout(sentTimer.current);
    setSent(false);
    writePlan(p);
  }, []);
  const markSent = useCallback(() => {
    setSent(true);
    if (sentTimer.current) clearTimeout(sentTimer.current);
    sentTimer.current = setTimeout(() => setSent(false), 2400);
  }, []);
  useEffect(
    () => () => {
      if (sentTimer.current) clearTimeout(sentTimer.current);
    },
    [],
  );

  return <PlanCtx.Provider value={{ plan, select, sent, markSent, plansRef }}>{children}</PlanCtx.Provider>;
}

/** The #plans section; the buy bar watches its position. */
export function PlansSection({ children }: { children: ReactNode }) {
  const { plansRef } = usePlan();
  return (
    <section className="section wrap" id="plans" ref={plansRef}>
      {children}
    </section>
  );
}

/** Any [data-plan] button from the source: selects that plan. */
export function PlanButton({ plan, className, children }: { plan: PlanKey; className: string; children: ReactNode }) {
  const { select } = usePlan();
  const isBtn = className.split(" ").includes("btn");
  return (
    <Fx as="button" type="button" className={className} magnetic={isBtn} onClick={() => select(plan)}>
      {children}
    </Fx>
  );
}

/** Sticky buy bar: shows from the pricing section down and mirrors the selected plan. */
export function BuyBar({ label, plans }: { label: string; plans: Record<PlanKey, BarPlan> }) {
  const { plan, sent, markSent, plansRef } = usePlan();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sync = () => {
      const el = plansRef.current;
      if (el) setShow(el.getBoundingClientRect().top < window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    const id = requestAnimationFrame(sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      cancelAnimationFrame(id);
    };
  }, [plansRef]);

  const p = plans[plan];
  return (
    <div className={show ? "bar show" : "bar"} role="region" aria-label={label}>
      <div className="wrap">
        <div className="bar-l">
          <span className="bar-name">{p.name}</span>
          <span className="bar-meta num">{p.meta}</span>
        </div>
        <div className="bar-price num">
          {p.priceLabel && <span>{p.priceLabel}</span>}
          <b>{p.price}</b>
          {p.monthly && <span>{p.monthly}</span>}
        </div>
        <Fx as="button" className="btn btn-primary" type="button" magnetic onClick={markSent}>
          {sent ? p.sent : p.cta}
        </Fx>
      </div>
    </div>
  );
}

/* ---------- count-up of the headline prices when the cards scroll into view ---------- */

const CountCtx = createContext<number | null>(null);

export function CountUpGrid({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((en) => en.isIntersecting)) {
          setStart(performance.now());
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <CountCtx.Provider value={start}>
      <div className="pc-grid" ref={ref}>
        {children}
      </div>
    </CountCtx.Provider>
  );
}

export function CountUp({ text }: { text: string }) {
  const start = useContext(CountCtx);
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const m = text.match(/^(\D*)([\d,]+)(.*)$/);
    if (start === null || !m || prefersReducedMotion()) return;
    const to = parseInt(m[2].replace(/,/g, ""), 10);
    let id = 0;
    const step = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start) / 1400));
      const e = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        setDisplay(m[1] + Math.round(to * e).toLocaleString("en-US") + m[3]);
        id = requestAnimationFrame(step);
      } else setDisplay(text);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [start, text]);
  return <>{display}</>;
}
