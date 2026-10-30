"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Hand } from "lucide-react";
import type { PersonId, SceneStrings, StatusId } from "./content";

type Dir = "down" | "left" | "right" | "up";
/** [x, y, waitMs?] in map pixels (the courtyard map is 1280×1024). */
type Waypoint = [number, number, number?];
type CastMember = {
  id: PersonId;
  row: number;
  st: StatusId;
  me?: boolean;
  speed?: number;
  path: Waypoint[];
  face?: Dir;
};
type Actor = {
  c: CastMember;
  el: HTMLDivElement;
  spr: HTMLDivElement;
  x: number;
  y: number;
  i: number;
  wait: number;
  dir: Dir;
  step: number;
  t: number;
  moving: boolean;
  override: [number, number, number, Dir] | null;
};

export type SceneMode = "status" | "wave" | "near" | "zone";
type BubbleKey = "wave" | "near" | "duo";

const CELL = 76;
const DIRS: Record<Dir, number> = { down: 0, left: 3, right: 6, up: 9 };
const ST: Record<StatusId, string> = { free: "var(--b8-green)", busy: "var(--b8-red)", meet: "var(--cyan-500)", away: "var(--neutral-400)" };

const MAIN_CAST: CastMember[] = [
  { id: "me", row: 0, st: "free", me: true, path: [[600, 690]], face: "up" },
  { id: "mind", row: 1, st: "free", speed: 62, path: [[470, 350, 1800], [810, 350], [820, 690, 900], [700, 700], [470, 690, 1400]] },
  { id: "boss", row: 2, st: "busy", path: [[150, 415]], face: "right" },
  { id: "prae", row: 3, st: "free", speed: 48, path: [[1000, 320, 2400], [1000, 640], [1120, 650, 2600], [1100, 420]] },
  { id: "guy", row: 4, st: "meet", path: [[590, 250]], face: "up" },
  { id: "fon", row: 5, st: "meet", path: [[745, 190]], face: "left" },
  { id: "tee", row: 2, st: "meet", path: [[540, 190]], face: "right" },
  { id: "nam", row: 1, st: "away", path: [[275, 600]], face: "left" },
  { id: "ploy", row: 3, st: "busy", path: [[275, 415]], face: "left" },
];
// compare section: two people talking in the plaza while Boss walks laps
const DUO_CAST: CastMember[] = [
  { id: "me", row: 0, st: "free", me: true, path: [[620, 690]], face: "right" },
  { id: "mind", row: 1, st: "free", path: [[710, 690]], face: "left" },
  { id: "boss", row: 2, st: "busy", speed: 55, path: [[470, 600, 1500], [470, 760], [850, 760, 1500], [850, 600]] },
];

function draw(a: Actor) {
  const col = DIRS[a.dir] + (a.moving ? 1 + (a.step % 2) : 0);
  a.spr.style.backgroundPosition = `${-col * CELL}px ${-a.c.row * CELL}px`;
  a.el.style.transform = `translate(${a.x}px,${a.y}px)`;
  a.el.style.zIndex = String(Math.round(a.y));
}

function tick(a: Actor, dt: number) {
  const target = a.override || a.c.path[a.i % a.c.path.length];
  if (a.wait > 0) {
    a.wait -= dt;
    a.moving = false;
    return;
  }
  const dx = target[0] - a.x,
    dy = target[1] - a.y,
    d = Math.hypot(dx, dy);
  if (d < 2) {
    a.moving = false;
    if (a.override) {
      if (a.override[3]) a.dir = a.override[3];
      return;
    }
    if (a.c.path.length > 1) {
      a.wait = target[2] || 300;
      a.i++;
    } else if (a.c.face) a.dir = a.c.face;
    return;
  }
  const v = ((a.c.speed || 60) * dt) / 1000,
    m = Math.min(v, d);
  a.x += (dx / d) * m;
  a.y += (dy / d) * m;
  a.moving = true;
  a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  a.t += dt;
  if (a.t > 170) {
    a.t = 0;
    a.step++;
  }
}

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Props = {
  /** Visible window of the map: x, y, width, height in map pixels. */
  view: [number, number, number, number];
  strings: SceneStrings;
  ariaLabel: string;
  cast?: "main" | "duo";
  /** Fill the parent instead of using the view's aspect ratio. */
  fill?: boolean;
  /** Overlay mode driven by the office feature list (undefined = no overlays). */
  mode?: SceneMode;
  /** Actor that talks from the start (compare scene). */
  talking?: { id: PersonId; key: BubbleKey };
};

export function MapScene({ view, strings, ariaLabel, cast = "main", fill, mode, talking }: Props) {
  const [vx, vy, vw, vh] = view;
  const members = cast === "duo" ? DUO_CAST : MAIN_CAST;
  const sceneRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const actorEls = useRef<(HTMLDivElement | null)[]>([]);
  const actorsRef = useRef<Actor[]>([]);
  const modeRef = useRef<SceneMode | undefined>(mode);

  // Imperative core: fit-to-container scaling, visibility, and the walk loop.
  useEffect(() => {
    const el = sceneRef.current;
    const world = worldRef.current;
    if (!el || !world) return;
    const reduce = prefersReduced();
    const actors: Actor[] = members.map((c, idx) => {
      const node = actorEls.current[idx]!;
      const p = c.path[0];
      return {
        c,
        el: node,
        spr: node.querySelector(".spr") as HTMLDivElement,
        x: p[0],
        y: p[1],
        i: 0,
        wait: 0,
        dir: c.face || "down",
        step: 0,
        t: Math.random() * 400,
        moving: false,
        override: null,
      };
    });
    actorsRef.current = actors;
    if (talking) actors.find((a) => a.c.id === talking.id)?.el.classList.add("talking");

    const fit = () => {
      const w = el.clientWidth,
        h = el.clientHeight || (w * vh) / vw;
      const k = Math.max(w / vw, h / vh);
      const ox = vx - (w / k - vw) / 2,
        oy = vy - (h / k - vh) / 2;
      world.style.transform = `scale(${k}) translate(${-ox}px,${-oy}px)`;
      if (w > 0) world.setAttribute("data-fit", "");
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    let visible = true;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
    });
    io.observe(el);
    actors.forEach(draw);

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (visible) {
        const me = actors.find((a) => a.c.me);
        for (const a of actors) {
          if (!reduce) tick(a, dt);
          if (modeRef.current === "near" && me && !a.c.me) {
            a.el.classList.toggle("near", Math.hypot(a.x - me.x, a.y - me.y) < 170);
          }
          draw(a);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      actorsRef.current = [];
    };
    // The scene is built once per mount; view/cast are static for each instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setMode(): overlays, proximity ring placement, wave/near choreography.
  useEffect(() => {
    if (mode === undefined) return;
    modeRef.current = mode;
    const actors = actorsRef.current;
    const me = actors.find((a) => a.c.me),
      mind = actors.find((a) => a.c.id === "mind");
    actors.forEach((a) => {
      a.el.classList.remove("near", "emoting", "talking");
      a.override = null;
    });
    const ring = ringRef.current;
    if (me && ring) {
      Object.assign(ring.style, {
        left: me.x - 170 + "px",
        top: me.y - 170 - 20 + "px",
        width: "340px",
        height: "340px",
      });
    }
    let waveT: ReturnType<typeof setTimeout> | undefined;
    if (mode === "wave" && me && mind) {
      const reduce = prefersReduced();
      me.el.classList.add("emoting");
      mind.override = [me.x + 82, me.y, 0, "left"];
      if (reduce) {
        mind.x = me.x + 82;
        mind.y = me.y;
        mind.dir = "left";
      }
      waveT = setTimeout(() => mind.el.classList.add("talking"), reduce ? 0 : 2600);
    }
    if (mode === "near" && me && mind) me.el.classList.add("talking");
    return () => clearTimeout(waveT);
  }, [mode]);

  const bubbleFor = (id: PersonId): string => {
    if (talking && talking.id === id) return strings[talking.key];
    if (id === "mind" && mode === "wave") return strings.wave;
    if (id === "me" && mode === "near") return strings.near;
    return "";
  };

  const sceneClass =
    "scene" +
    (mode === "status" ? " show-status" : "") +
    (mode === "near" ? " show-near" : "") +
    (mode === "zone" ? " show-zone" : "");

  return (
    <div
      ref={sceneRef}
      className={sceneClass}
      aria-label={ariaLabel}
      style={fill ? undefined : { aspectRatio: `${vw}/${vh}` }}
    >
      <div ref={worldRef} className="world">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/products/space8/courtyard.webp" alt="" draggable={false} />
        <div ref={ringRef} className="ring" />
        <div className="zone" style={{ left: "452px", top: "48px", width: "378px", height: "238px" }}>
          <span className="zone-label">
            <span className="rd" />
            {strings.zone}
          </span>
        </div>
        {members.map((c, idx) => {
          const p = c.path[0];
          return (
            <div
              key={c.id}
              ref={(node) => {
                actorEls.current[idx] = node;
              }}
              className={"actor" + (c.me ? " me" : "")}
              style={{ transform: `translate(${p[0]}px,${p[1]}px)`, zIndex: Math.round(p[1]) }}
            >
              <div className="shadow" />
              <div
                className="spr"
                style={{ backgroundPosition: `${-DIRS[c.face || "down"] * CELL}px ${-c.row * CELL}px` }}
              />
              <div className="tag" style={{ "--st": ST[c.st] } as CSSProperties}>
                <span className="dot" />
                {strings.n[c.id]}
                <span className="st">· {strings.st[c.st]}</span>
              </div>
              <div className="emote"><Hand size={34} strokeWidth={1.75} aria-hidden="true" /></div>
              <div className="bubble">{bubbleFor(c.id)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
