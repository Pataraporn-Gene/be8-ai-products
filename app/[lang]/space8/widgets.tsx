"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { MapSrc, PersonId, SceneStrings, Space8Content } from "./content";
import { Icon, type IconName } from "./icons";
import { MapScene, type SceneMode } from "./MapScene";

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- sticky nav: border appears once the page scrolls ---------- */
export function NavHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"nav" + (scrolled ? " scrolled" : "")} id="nav">
      {children}
    </header>
  );
}

/* ---------- office showcase: feature list drives the map overlays ---------- */
const FEATURES: { mode: SceneMode; icon: IconName }[] = [
  { mode: "status", icon: "usercheck" },
  { mode: "wave", icon: "hand" },
  { mode: "near", icon: "radio" },
  { mode: "zone", icon: "door" },
];

export function OfficeShowcase({ t, scene }: { t: Space8Content["office"]; scene: SceneStrings }) {
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (prefersReduced()) return;
    let visible = true;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
    });
    if (boxRef.current) io.observe(boxRef.current);
    let autoI = 0;
    autoRef.current = setInterval(() => {
      if (!visible) return;
      autoI = (autoI + 1) % FEATURES.length;
      setActive(autoI);
    }, 6500);
    return () => {
      clearInterval(autoRef.current);
      io.disconnect();
    };
  }, []);

  const pick = (i: number) => {
    clearInterval(autoRef.current);
    setActive(i);
  };

  return (
    <div className="office" ref={boxRef}>
      <MapScene view={[0, 0, 1280, 1024]} strings={scene} ariaLabel={t.sceneLabel} mode={FEATURES[active].mode} />
      <div className="feature-list">
        {FEATURES.map((f, i) => (
          <button key={f.mode} type="button" className="fi" aria-pressed={i === active} onClick={() => pick(i)}>
            <span className="ic">
              <Icon name={f.icon} />
            </span>
            <span>
              <b>{t.features[i].title}</b>
              <small>{t.features[i].body}</small>
            </span>
          </button>
        ))}
        <a className="btn btn-primary" href="#start">
          {t.cta}
        </a>
      </div>
    </div>
  );
}

/* ---------- status chips in the focus card ---------- */
const STATUS_COLORS = ["#30db72", "#f26473", "#8490a5"];
const NOTE_ICONS: IconName[] = ["smile", "headphones", "logout"];

export function StatusCard({ statuses, notes }: { statuses: string[]; notes: string[] }) {
  const [cur, setCur] = useState(1);
  return (
    <div className="status-wrap">
      <div className="status-row">
        {statuses.map((s, i) => (
          <button
            key={i}
            type="button"
            style={{ "--c": STATUS_COLORS[i] } as CSSProperties}
            aria-pressed={i === cur}
            onClick={() => setCur(i)}
          >
            {s}
          </button>
        ))}
      </div>
      <span className="status-note">
        <Icon name={NOTE_ICONS[cur]} />
        {notes[cur]}
      </span>
    </div>
  );
}

/* ---------- template map picker ---------- */
const MAPS: MapSrc[] = ["courtyard", "shophouse", "garden", "transit", "atlas"];
const mapUrl = (m: MapSrc) => `/products/space8/${m}.webp`;
const mapRatio = (m: MapSrc) => (m === "courtyard" ? "1280/1024" : "1280/896");

export function TemplatePicker({ t }: { t: Space8Content["templates"] }) {
  const [pressed, setPressed] = useState<MapSrc>("courtyard");
  const [shown, setShown] = useState<MapSrc>("courtyard");
  const [dim, setDim] = useState(false);
  const latest = useRef<MapSrc>("courtyard");

  const choose = (m: MapSrc) => {
    setPressed(m);
    latest.current = m;
    setDim(true);
    const im = new Image();
    im.onload = () => {
      if (latest.current !== m) return;
      setShown(m);
      setDim(false);
    };
    im.src = mapUrl(m);
  };

  return (
    <div className="tpl">
      <div className="tpl-side">
        <div className="tpl-list">
          {MAPS.map((m) => (
            <button key={m} type="button" className="tpl-btn" aria-pressed={pressed === m} onClick={() => choose(m)}>
              <b>{t.maps[m].name}</b>
              <small>{t.maps[m].size}</small>
            </button>
          ))}
        </div>
        <div className="ai-note">
          <Icon name="sparkles" />
          <span>{t.aiNote}</span>
        </div>
      </div>
      <div className="tpl-view">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mapUrl(shown)}
          alt={t.alt[shown]}
          style={{ aspectRatio: mapRatio(shown), opacity: dim ? 0.2 : 1 }}
        />
      </div>
    </div>
  );
}

/* ---------- avatar cast: each one walks in place, turning ---------- */
const CAST_NAMES: PersonId[] = ["ton", "mind", "boss", "prae", "guy", "fon"];
const walkerPos = (wf: number, r: number) => {
  const seq = [0, 1, 0, 2];
  const dir = [0, 6, 9, 3][Math.floor((wf / 16 + r) % 4)];
  const col = dir + seq[wf % 4];
  return `${(col / 11) * 100}% ${r * 20}%`;
};

export function CharacterCast({ names }: { names: Record<PersonId, string> }) {
  const walkers = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (prefersReduced()) return;
    let wf = 0;
    const id = setInterval(() => {
      wf++;
      walkers.current.forEach((w, r) => {
        if (w) w.style.backgroundPosition = walkerPos(wf, r);
      });
    }, 220);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="cast">
      {CAST_NAMES.map((n, r) => (
        <figure key={n}>
          <div
            className="walker"
            ref={(node) => {
              walkers.current[r] = node;
            }}
            style={{ backgroundPosition: walkerPos(0, r) }}
          />
          <figcaption>{names[n]}</figcaption>
        </figure>
      ))}
    </div>
  );
}
