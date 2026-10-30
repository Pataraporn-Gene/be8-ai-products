"use client";

import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { PlanKey } from "./content";

/* ---------- Plan selection (plan cards, comparison table, sticky dock) ---------- */

type PlanState = { plan: PlanKey; pick: (plan: PlanKey) => void };
const PlanContext = createContext<PlanState | null>(null);

function usePlan(): PlanState {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanKey>("Agent");
  return <PlanContext.Provider value={{ plan, pick: setPlan }}>{children}</PlanContext.Provider>;
}

/** Plan card that carries the `sel` class while its plan is selected. */
export function PlanCard({ plan, rec = false, children }: { plan: PlanKey; rec?: boolean; children: ReactNode }) {
  const { plan: selected } = usePlan();
  const cls = ["plan", rec && "rec", selected === plan && "sel"].filter(Boolean).join(" ");
  return <article className={cls}>{children}</article>;
}

export function PickButton({ plan, className, children }: { plan: PlanKey; className: string; children: ReactNode }) {
  const { pick } = usePlan();
  return (
    <button className={className} type="button" onClick={() => pick(plan)}>
      {children}
    </button>
  );
}

export function Dock({
  ariaLabel,
  descs,
  priceLabel,
  price,
  cta,
}: {
  ariaLabel: string;
  descs: Record<PlanKey, string>;
  priceLabel: string;
  price: string;
  cta: string;
}) {
  const { plan } = usePlan();
  return (
    <div className="dock" role="region" aria-label={ariaLabel}>
      <div className="wrap">
        <div>
          <div className="nm" aria-live="polite">
            AGENT8 · {plan}
          </div>
          <div className="ds">{descs[plan]}</div>
        </div>
        <div className="rt">
          <div className="pr">
            <small>{priceLabel}</small>
            <b>{price}</b>
          </div>
          <a className="btn fill" href="#demo">
            {cta}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- "How it works" tabs with arrow-key navigation ---------- */

export function HowTabs({
  ariaLabel,
  tabs,
  panels,
}: {
  ariaLabel: string;
  tabs: { n: string; t: string }[];
  panels: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const show = (i: number, focus: boolean) => {
    setActive(i);
    if (focus) refs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight") show((i + 1) % tabs.length, true);
    if (e.key === "ArrowLeft") show((i + tabs.length - 1) % tabs.length, true);
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, i) => (
          <button
            key={tab.n}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="tab"
            role="tab"
            id={`t${i + 1}`}
            aria-controls={`p${i + 1}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => show(i, false)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="n">{tab.n}</span>
            <span className="t">{tab.t}</span>
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div
          key={i}
          className="panel"
          role="tabpanel"
          id={`p${i + 1}`}
          aria-labelledby={`t${i + 1}`}
          hidden={i !== active}
        >
          {panel}
        </div>
      ))}
    </>
  );
}

/* ---------- Sticky section nav with active-section highlight ---------- */

export function SubNav({ ariaLabel, links }: { ariaLabel: string; links: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const ids = links.map((l) => l.id).join(",");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);

  return (
    <nav className="subnav" aria-label={ariaLabel}>
      <div className="wrap">
        {links.map((l) => (
          <a key={l.id} href={`#${l.id}`} className={current === l.id ? "on" : undefined}>
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
