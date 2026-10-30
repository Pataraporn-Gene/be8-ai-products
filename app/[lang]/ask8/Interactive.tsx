"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { DEMO, DEMO_KEYS, SCREEN_URL, SRC_TYPE, type Ask8Content, type DemoKey, type ScreenKey, type SrcType } from "./content";

const IMG = "/products/ask8/";
const SCREENS: { key: ScreenKey; file: string; w: number; h: number }[] = [
  { key: "recap", file: "recap.jpg", w: 2880, h: 1800 },
  { key: "answer", file: "answer.jpg", w: 780, h: 1858 },
  { key: "prep", file: "prep.jpg", w: 2880, h: 1800 },
];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Arrow keys move between the tabs of a tablist. */
function arrowNav(keys: string[], current: string, pick: (k: string) => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = keys[(keys.indexOf(current) + d + keys.length) % keys.length];
    pick(next);
    (e.currentTarget.querySelector(`[data-k="${next}"]`) as HTMLElement | null)?.focus();
  };
}

/* ---------- Meet8 screens switcher ---------- */

export function ScreenSwitcher({ t }: { t: Ask8Content["tryit"] }) {
  const [cur, setCur] = useState<ScreenKey>("recap");
  const [auto, setAuto] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ w: 0, x: 0 });

  const measure = useCallback(() => {
    const b = tabsRef.current?.querySelector<HTMLElement>(`[data-k="${cur}"]`);
    if (b) setInd({ w: b.offsetWidth, x: b.offsetLeft });
  }, [cur]);
  useLayoutEffect(measure, [measure, t]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!auto || reducedMotion()) return;
    const id = setInterval(() => {
      setCur((c) => SCREENS[(SCREENS.findIndex((s) => s.key === c) + 1) % SCREENS.length].key);
    }, 4500);
    return () => clearInterval(id);
  }, [auto]);

  const pick = (k: string) => {
    setAuto(false);
    setCur(k as ScreenKey);
  };

  return (
    <div className="hv-stage">
      <div
        className="hv-tabs"
        role="tablist"
        aria-label={t.tabsAria}
        ref={tabsRef}
        onKeyDown={(e) => arrowNav(SCREENS.map((s) => s.key), cur, pick)(e)}
      >
        <span className="hv-ind" aria-hidden="true" style={{ width: ind.w, transform: `translateX(${ind.x}px)` }} />
        {SCREENS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            data-k={s.key}
            aria-selected={cur === s.key}
            tabIndex={cur === s.key ? 0 : -1}
            onClick={() => pick(s.key)}
          >
            {t.tabs[s.key]}
          </button>
        ))}
      </div>
      <figure className="shot hv-shot">
        <div className="shot-bar">
          <i />
          <i />
          <i />
          <span>{SCREEN_URL[cur]}</span>
        </div>
        <div className="pics">
          {SCREENS.map((s) => (
            <img
              key={s.key}
              className={cur === s.key ? "on" : undefined}
              src={IMG + s.file}
              width={s.w}
              height={s.h}
              alt={t.alts[s.key]}
            />
          ))}
        </div>
      </figure>
    </div>
  );
}

/* ---------- department demo ---------- */

type SrcState = "" | "reading" | "cited" | "skip";

const ICON: Record<SrcType, ReactNode> = {
  policy: <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6z" />,
  faq: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" />
    </>
  ),
  doc: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />,
  product: <path d="m21 8-9-5-9 5 9 5zM3 8v8l9 5 9-5V8" />,
  record: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 4v16" />
    </>
  ),
  transcript: <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />,
  file: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4" />,
};

function Cited({ text }: { text: string }) {
  const parts = text.split(/\{(\d)\}/);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <span key={i} className="cite">{p}</span> : p))}
    </>
  );
}

export function DemoTour({ lang, t }: { lang: Locale; t: Ask8Content["demo"] }) {
  const [key, setKey] = useState<DemoKey>("hr");
  const [typed, setTyped] = useState(DEMO.hr.q[lang]);
  const [waiting, setWaiting] = useState(false);
  const [states, setStates] = useState<SrcState[]>(() => DEMO.hr.src.map((s) => (s.c ? "cited" : "skip")));
  const run = useRef(0);
  const auto = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef(key);
  const playRef = useRef<(k: DemoKey) => void>(() => {});

  const settle = useCallback(
    (k: DemoKey) => {
      run.current++;
      setKey(k);
      keyRef.current = k;
      setTyped(DEMO[k].q[lang]);
      setWaiting(false);
      setStates(DEMO[k].src.map((s) => (s.c ? "cited" : "skip")));
    },
    [lang],
  );

  const play = useCallback(
    (k: DemoKey) => {
      if (reducedMotion()) return settle(k);
      const id = ++run.current;
      const e = DEMO[k];
      const q = e.q[lang];
      setKey(k);
      keyRef.current = k;
      setTyped("");
      setWaiting(true);
      setStates(e.src.map(() => ""));
      const alive = () => id === run.current;
      const scan = (j: number) => {
        if (!alive()) return;
        if (j >= e.src.length) {
          setWaiting(false);
          if (auto.current) {
            setTimeout(() => {
              if (alive() && auto.current) playRef.current(DEMO_KEYS[(DEMO_KEYS.indexOf(k) + 1) % DEMO_KEYS.length]);
            }, 4500);
          }
          return;
        }
        setStates((s) => s.map((v, i) => (i === j ? "reading" : v)));
        setTimeout(() => {
          if (!alive()) return;
          setStates((s) => s.map((v, i) => (i === j ? (e.src[j].c ? "cited" : "skip") : v)));
          scan(j + 1);
        }, 700);
      };
      let i = 0;
      const type = () => {
        if (!alive()) return;
        if (i <= q.length) {
          setTyped(q.slice(0, i++));
          setTimeout(type, 28);
        } else setTimeout(() => scan(0), 250);
      };
      type();
    },
    [lang, settle],
  );
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  // Language change: show the current example settled in the new language.
  useEffect(() => {
    settle(keyRef.current);
  }, [lang, settle]);

  // Start the autoplay once the demo scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion() || !("IntersectionObserver" in window)) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (ents) => {
        if (!ents[0].isIntersecting) return;
        timer = setTimeout(() => auto.current && play("it"), 1500);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [play]);

  const pick = (k: string) => {
    auto.current = false;
    play(k as DemoKey);
  };
  const e = DEMO[key];
  const status = (c: number, s: SrcState) =>
    s === "reading" ? t.checking : s === "cited" ? t.source + c : s === "skip" ? t.notUsed : "";

  return (
    <>
      <div className="steps" role="tablist" aria-label={t.tabsAria} onKeyDown={(e) => arrowNav(DEMO_KEYS, key, pick)(e)}>
        {DEMO_KEYS.map((k, i) => (
          <button
            key={k}
            type="button"
            className="step"
            role="tab"
            data-k={k}
            aria-selected={key === k}
            tabIndex={key === k ? 0 : -1}
            onClick={() => pick(k)}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            <b>{t.tabs[k]}</b>
          </button>
        ))}
      </div>
      <div className="tour" role="tabpanel" ref={rootRef}>
        <div>
          <h3>{e.h[lang]}</h3>
          <p>{e.p[lang]}</p>
          <ul className="tour-list">
            {e.src.map((s) => (
              <li key={s.n.en}>
                {s.n[lang]} · {SRC_TYPE[s.t][lang]}
              </li>
            ))}
          </ul>
        </div>
        <div className="tour-media">
          <div className="demo">
            <div className="askbox">
              <svg className="i" viewBox="0 0 24 24">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
              </svg>
              <span className="q">
                <span>{typed}</span>
                <i className="caret" aria-hidden="true" />
              </span>
              <span className="send" aria-hidden="true">
                <svg className="i" viewBox="0 0 24 24">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </span>
            </div>
            <div className={`answer${waiting ? " wait" : ""}`} aria-live="polite">
              <div className="answer-h">
                <span className="eyebrow">{t.answer}</span>
                <span className="ex">{t.example}</span>
              </div>
              <p>
                {waiting ? (
                  <span className="dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <Cited text={e.a[lang]} />
                )}
              </p>
            </div>
            <ol className="srcs">
              {e.src.map((s, i) => (
                <li key={s.n.en} className={states[i] || undefined}>
                  <span className="fi">
                    <svg className="i" viewBox="0 0 24 24">
                      {ICON[s.t]}
                    </svg>
                  </span>
                  <span className="tx">
                    <span className="ty">{SRC_TYPE[s.t][lang]}</span>
                    <span className="nm">{s.n[lang]}</span>
                  </span>
                  <span className="st">{status(s.c, states[i])}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
