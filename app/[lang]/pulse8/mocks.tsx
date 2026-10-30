import type { CSSProperties } from "react";
import type { Pulse8Content } from "./content";

/** Inline style string from the source markup -> React style object (keeps the mockups 1:1). */
export function sx(s: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of s.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    if (!prop) continue;
    const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[key] = decl.slice(i + 1).trim();
  }
  return out as CSSProperties;
}

export function I({ n, style }: { n: string; style?: CSSProperties }) {
  return (
    <svg className="i" style={style}>
      <use href={`#p8-i-${n}`} />
    </svg>
  );
}

type SideKey = keyof Pulse8Content["side"]["items"];
const NAV: [keyof Pulse8Content["side"]["groups"] | "", [SideKey, string][]][] = [
  ["", [["home", "home"], ["search", "search"]]],
  ["plan", [["campaigns", "cal"]]],
  ["send", [["email", "mail"], ["messaging", "msg"], ["journeys", "route"], ["automations", "flow"]]],
  ["content", [["content", "layers"], ["pages", "layout"]]],
  ["customers", [["audience", "users"], ["sales", "brief"]]],
  ["measure", [["insights", "chart"]]],
];

/** App sidebar inside the mock screens. */
export function Side({ on, t }: { on: SideKey; t: Pulse8Content["side"] }) {
  return (
    <div className="side">
      <div className="side-org">
        <i>P8</i>
        <div>
          <b>Pulse8</b>
          <small>{t.org}</small>
        </div>
      </div>
      <div className="side-new">
        <I n="plus" />
        {t.create}
      </div>
      {NAV.map(([h, items]) => (
        <div key={h || "top"} style={{ display: "contents" }}>
          {h ? <div className="side-h">{t.groups[h]}</div> : null}
          {items.map(([k, ic]) => (
            <a key={k} className={k === on ? "on" : ""}>
              <I n={ic} />
              {t.items[k]}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}

const NODE_POS = [
  { style: "left:16px;top:158px", cls: "", icon: "layout" },
  { style: "left:196px;top:158px", cls: "", icon: "mail" },
  { style: "left:376px;top:158px", cls: "wait", icon: "clock" },
  { style: "left:556px;top:158px", cls: "", icon: "split", pick: true },
  { style: "left:736px;top:64px;width:150px", cls: "line", icon: "msg" },
  { style: "left:736px;top:252px;width:150px", cls: "sms", icon: "phone" },
];

/** Journey canvas contents (the source's <template id="tpl-canvas">). */
export function JourneyNodes({ t, sel = false }: { t: Pulse8Content["canvas"]; sel?: boolean }) {
  return (
    <>
      <svg className="links" viewBox="0 0 900 380" aria-hidden="true">
        <path d="M172 190H196" />
        <path d="M352 190H376" />
        <path d="M532 190H556" />
        <path d="M712 190C724 190 724 96 736 96" />
        <path d="M712 190C724 190 724 284 736 284" />
        <text x="716" y="128">
          {t.opened}
        </text>
        <text x="716" y="262">
          {t.notOpened}
        </text>
      </svg>
      {NODE_POS.map((n, i) => {
        const node = t.nodes[i];
        const numeric = i !== 3;
        return (
          <div key={i} className={`node${sel && n.pick ? " sel" : ""}`} style={sx(n.style)}>
            <span className={`node-t${n.cls ? " " + n.cls : ""}`}>
              <I n={n.icon} />
              {node.type}
            </span>
            <b>{node.title}</b>
            <small className={numeric ? "num" : undefined}>{node.meta}</small>
          </div>
        );
      })}
    </>
  );
}

/** Daily sends bar chart (deterministic sample data, same formula as the source). */
export function Bars() {
  const rects = [];
  for (let d = 0; d < 30; d++) {
    const v = 40 + ((d * 37) % 23) * 3 + (d % 7 === 3 ? 55 : 0) + (d === 10 || d === 24 ? 40 : 0);
    rects.push(
      <rect key={d} x={7 + d * 28.4} y={140 - v} width="16" height={v} rx="3" fill={d % 7 === 3 ? "#00b8d4" : "#c9d3dc"} />,
    );
  }
  return (
    <svg width="100%" height="150" viewBox="0 0 860 150" preserveAspectRatio="none">
      {rects}
      <line x1="0" y1="140.5" x2="860" y2="140.5" stroke="#e6eaef" />
    </svg>
  );
}

export function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="ticks">
      {items.map((x) => (
        <li key={x}>
          <I n="check" />
          {x}
        </li>
      ))}
    </ul>
  );
}
