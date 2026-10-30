"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ScreenCopy, TourCopy } from "./content";

const IMG = "/products/insight8/";

/** Arrow keys move between tabs in a tablist (focus + select), like the source page. */
function useTabKeys<K extends string>(keys: K[], select: (k: K) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = refs.current.findIndex((b) => b === document.activeElement);
    if (i < 0) return;
    const n = (i + (e.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length;
    refs.current[n]?.focus();
    select(keys[n]);
    e.preventDefault();
  };
  return { refs, onKeyDown };
}

/* ---------- screen switcher ---------- */

const HV_KEYS = ["home", "studio", "author", "pulse"] as const;
type HvKey = (typeof HV_KEYS)[number];
const HV_IMG: Record<HvKey, string> = {
  home: "home.jpg",
  studio: "studio.jpg",
  author: "author.jpg",
  pulse: "pulse.jpg",
};

export function ScreenSwitcher({ screens, tabsAria }: { screens: Record<string, ScreenCopy>; tabsAria: string }) {
  const [sel, setSel] = useState<HvKey>("home");
  const [shown, setShown] = useState<HvKey>("home");
  const [swap, setSwap] = useState(false);
  const selRef = useRef<HvKey>("home");
  const imgRef = useRef<HTMLImageElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fade = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useRef(false);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const show = useCallback((k: HvKey) => {
    if (k === selRef.current) return;
    selRef.current = k;
    setSel(k);
    setSwap(true);
    if (fade.current) clearTimeout(fade.current);
    fade.current = setTimeout(
      () => {
        setShown(k);
        // cached images may already be complete once the new src is committed
        requestAnimationFrame(() => {
          if (imgRef.current?.complete) setSwap(false);
        });
      },
      reduce.current ? 0 : 200,
    );
  }, []);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    HV_KEYS.forEach((k) => {
      new Image().src = IMG + HV_IMG[k];
    });
    if (!reduce.current) {
      timer.current = setInterval(() => {
        show(HV_KEYS[(HV_KEYS.indexOf(selRef.current) + 1) % HV_KEYS.length]);
      }, 5000);
    }
    return () => {
      stop();
      if (fade.current) clearTimeout(fade.current);
    };
  }, [show, stop]);

  const pick = (k: HvKey) => {
    stop();
    show(k);
  };
  const { refs, onKeyDown } = useTabKeys([...HV_KEYS], pick);

  // rotation stops for good once someone points at or focuses the switcher
  return (
    <div className="hv-stage" onMouseEnter={stop} onFocus={stop} onTouchStart={stop}>
      <div className="hv-tabs" role="tablist" aria-label={tabsAria} onKeyDown={onKeyDown}>
        {HV_KEYS.map((k, i) => (
          <button
            key={k}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={"hv-t-" + k}
            aria-selected={sel === k}
            aria-controls="hv-panel"
            tabIndex={sel === k ? 0 : -1}
            onClick={() => pick(k)}
          >
            {screens[k].label}
          </button>
        ))}
      </div>
      <figure className="shot hv-shot" id="hv-panel" role="tabpanel" aria-labelledby={"hv-t-" + sel}>
        <img
          ref={imgRef}
          className={swap ? "swap" : undefined}
          src={IMG + HV_IMG[shown]}
          alt={screens[shown].alt}
          width={1280}
          height={780}
          onLoad={() => setSwap(false)}
          onError={() => setSwap(false)}
        />
      </figure>
      <p className="hv-cap">{screens[shown].cap}</p>
    </div>
  );
}

/* ---------- product tour ---------- */

const TOUR_KEYS = ["ask", "dash", "author", "govern"] as const;
type TourKey = (typeof TOUR_KEYS)[number];

export function Tour({ steps, stepsAria }: { steps: Record<string, TourCopy>; stepsAria: string }) {
  const [sc, setSc] = useState<TourKey>("ask");
  const { refs, onKeyDown } = useTabKeys([...TOUR_KEYS], setSc);
  const t = steps[sc];

  useEffect(() => {
    TOUR_KEYS.forEach((k) => {
      new Image().src = IMG + "tour-" + k + ".jpg";
    });
  }, []);

  return (
    <>
      <div className="steps" role="tablist" aria-label={stepsAria} onKeyDown={onKeyDown}>
        {TOUR_KEYS.map((k, i) => (
          <button
            key={k}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="step"
            role="tab"
            id={"s-" + k}
            aria-selected={sc === k}
            aria-controls="tour"
            tabIndex={sc === k ? 0 : -1}
            onClick={() => setSc(k)}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            <b>{steps[k].label}</b>
          </button>
        ))}
      </div>
      <div className="tour" id="tour" role="tabpanel" aria-labelledby={"s-" + sc}>
        <div>
          <h3>{t.h}</h3>
          <p>{t.p}</p>
          <ul>
            {t.list.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="tour-media">
          <figure className="shot">
            <img src={IMG + "tour-" + sc + ".jpg"} alt={t.alt} />
          </figure>
        </div>
      </div>
    </>
  );
}
