"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = { id: string; panelId: string; label: ReactNode };

/** Tablist with arrow-key / Home / End support, matching the source script. */
export function Tabs({
  tabs,
  panels,
  ariaLabel,
  listClassName,
  headClassName,
  panelClassName,
}: {
  tabs: Tab[];
  panels: ReactNode[];
  ariaLabel: string;
  listClassName: string;
  headClassName?: string;
  panelClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = ({ ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i } as Record<string, number>)[e.key];
    if (d === undefined) return;
    e.preventDefault();
    const next = (i + d + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    setActive(next);
  };

  const list = (
    <div className={listClassName} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={t.id}
          aria-controls={t.panelId}
          aria-selected={i === active}
          tabIndex={i === active ? 0 : -1}
          onClick={() => setActive(i)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {headClassName ? <div className={headClassName}>{list}</div> : list}
      {tabs.map((t, i) => (
        <div
          key={t.panelId}
          role="tabpanel"
          id={t.panelId}
          aria-labelledby={t.id}
          className={panelClassName}
          hidden={i !== active}
        >
          {panels[i]}
        </div>
      ))}
    </>
  );
}
