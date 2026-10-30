"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";
import type { TourKey } from "./content";

/* ---------- theme: light by default, dark only when the viewer picks it ---------- */

type Theme = "light" | "dark";
const THEME_KEY = "v8-theme";
const THEME_EVENT = "v8-theme-change";

function readTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribeTheme(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(THEME_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(THEME_EVENT, cb);
  };
}

const useTheme = () => useSyncExternalStore(subscribeTheme, readTheme, () => "light" as Theme);

/** Page wrapper: carries the scoped class and the data-theme the CSS keys dark mode on. */
export function ThemeRoot({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <div className="p-voice8" data-theme={theme}>
      {children}
    </div>
  );
}

export function ThemeButton({ ariaLabel, title }: { ariaLabel: string; title: string }) {
  const theme = useTheme();
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  return (
    <button type="button" className="theme-btn" aria-label={ariaLabel} title={title} onClick={toggle}>
      <svg className="i sun">
        <use href="#v8-i-sun" />
      </svg>
      <svg className="i moon">
        <use href="#v8-i-moon" />
      </svg>
    </button>
  );
}

/** Locale pill that follows the page theme (header turns dark with the toggle). */
export function ThemedLangSwitch({ lang, path }: { lang: Locale; path: string }) {
  const theme = useTheme();
  return <LangSwitch lang={lang} path={path} dark={theme === "dark"} />;
}

/* ---------- mock screens are authored at real Studio size; scale each to its box ---------- */

export function Fit({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const s = el.clientWidth / w;
      if (s > 0) setScale(s);
    };
    // ResizeObserver fires once on observe, which covers the initial fit.
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(fit);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", fit);
    const id = requestAnimationFrame(fit);
    return () => {
      window.removeEventListener("resize", fit);
      cancelAnimationFrame(id);
    };
  }, [w]);

  return (
    <div ref={ref} className="fit" style={{ "--ar": `${w}/${h}` } as CSSProperties}>
      <div className="fit-in" style={{ width: w, height: h, transform: scale > 0 ? `scale(${scale})` : undefined }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- 4-step tour ---------- */

type TourText = { h: string; p: string; list: string[] };

export function Tour({
  ariaLabel,
  steps,
  tour,
  media,
}: {
  ariaLabel: string;
  steps: Record<TourKey, string>;
  tour: Record<TourKey, TourText>;
  media: Record<TourKey, ReactNode>;
}) {
  const keys = Object.keys(steps) as TourKey[];
  const [sc, setSc] = useState<TourKey>("design");
  const t = tour[sc];

  return (
    <>
      <div className="steps" role="tablist" aria-label={ariaLabel}>
        {keys.map((k, i) => (
          <button
            key={k}
            type="button"
            className="step"
            role="tab"
            id={`s-${k}`}
            aria-selected={sc === k}
            aria-controls="tour"
            onClick={() => setSc(k)}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            <b>{steps[k]}</b>
          </button>
        ))}
      </div>
      <div className="tour" id="tour" role="tabpanel" aria-labelledby={`s-${sc}`}>
        <div>
          <h3>{t.h}</h3>
          <p>{t.p}</p>
          <ul className="tickli">
            {t.list.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="tour-media">
          {keys.map((k) => (
            <div key={k} hidden={k !== sc}>
              {media[k]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
