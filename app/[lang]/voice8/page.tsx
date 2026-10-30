import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { content, type Voice8Content, type TourKey } from "./content";
import { SPRITE_DEFS, type IconName } from "./sprite";
import { Fit, ThemeButton, ThemedLangSwitch, ThemeRoot, Tour } from "./client";
import "./voice8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/voice8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = content[lang];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { languages: { en: "/en/voice8", th: "/th/voice8" } },
  };
}

/* ---------- small building blocks for the Studio replicas ---------- */

function I({ n, style, className }: { n: IconName; style?: CSSProperties; className?: string }) {
  return (
    <svg className={className ? `i ${className}` : "i"} style={style} aria-hidden="true">
      <use href={`#v8-i-${n}`} />
    </svg>
  );
}

const RAIL: IconName[] = ["user", "plug", "mic", "call", "hash", "chart", "puzzle", "rocket"];

function Rail({ on, count, extras = false }: { on: number; count: number; extras?: boolean }) {
  return (
    <div className="st-rail" aria-hidden="true">
      <div className="brand8">
        <svg>
          <use href="#v8-eight" />
        </svg>
      </div>
      {RAIL.slice(0, count).map((n, i) => (
        <span key={n} className={i === on ? "st-ri on" : "st-ri"}>
          <I n={n} />
        </span>
      ))}
      {extras && (
        <>
          <span className="sp" />
          <span className="st-ri">
            <I n="moon" />
          </span>
          <span className="st-ri">
            <I n="gear" />
          </span>
          <span className="st-ri">
            <I n="help" />
          </span>
        </>
      )}
    </div>
  );
}

function ShotBar({ children }: { children: ReactNode }) {
  return (
    <div className="shot-bar">
      <i />
      <i />
      <i />
      <span>{children}</span>
    </div>
  );
}

function Node({
  left,
  top,
  title,
  desc,
  start,
  sel,
  noTop,
}: {
  left: number;
  top: number;
  title: string;
  desc: string;
  start?: boolean;
  sel?: boolean;
  noTop?: boolean;
}) {
  const cls = ["st-node", start && "start", sel && "sel"].filter(Boolean).join(" ");
  return (
    <div className={cls} style={{ left, top }}>
      {!start && !noTop && <span className="st-h t" />}
      <div className="nh">
        <span className="st-chipi">
          <I n={start ? "play" : "clip"} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="st-eb">{start ? "Start Node" : "Instruction"}</div>
          <div className="tt">{title}</div>
        </div>
      </div>
      <div className="sm">{desc}</div>
      <span className="st-h b" />
    </div>
  );
}

function TestHead() {
  return (
    <>
      <div className="st-ph">
        <div>
          <div className="st-eb">Test</div>
          <div style={{ fontSize: 13, color: "var(--s-fg3)" }}>Connected</div>
        </div>
        <span style={{ display: "flex", gap: 4 }}>
          <span className="st-x">
            <I n="rotate" />
          </span>
          <span className="st-x">
            <I n="x" />
          </span>
        </span>
      </div>
      <div className="st-pills">
        <span className="st-pill on">
          <I n="wave" />
          Live call
        </span>
        <span className="st-pill off">
          <I n="msg" />
          Chat
        </span>
      </div>
    </>
  );
}

function ToolCall() {
  return (
    <span className="st-tool">
      <I n="chev" />
      <I n="wrench" />
      <b>get_parcel_status</b>
      <span style={{ color: "var(--s-fg4)" }}>api</span>
      <span className="num">320ms</span>
    </span>
  );
}

function LiveBar() {
  return (
    <div className="st-live">
      <i />
      <span>Listening — typing is disabled in voice mode.</span>
      <span className="st-btn dan">End call</span>
    </div>
  );
}

function Dot() {
  return <span className="d" />;
}

/* ---------- tour media (one per step) ---------- */

function tourMedia(m: Voice8Content["mock"]): Record<TourKey, ReactNode> {
  return {
    design: (
      <figure className="shot">
        <ShotBar>/agents/parcel-status · Edit node</ShotBar>
        <Fit w={900} h={580}>
          <div className="st">
            <div className="st-body">
              <div className="st-canvas">
                <svg className="edges" aria-hidden="true">
                  <path className="e" d="M210 40 V118" />
                  <path className="e" d="M210 224 V290" />
                </svg>
                <Node left={100} top={118} sel title={m.nodeCheck} desc={m.nodeCheckDesc} />
                <div className="st-cond" style={{ left: 210, top: 258 }}>
                  {m.condDone}
                </div>
                <div className="st-panel" style={{ width: 480 }}>
                  <div className="st-ph">
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="st-chipi">
                        <I n="clip" />
                      </span>
                      <span>
                        <span className="st-eb" style={{ display: "block" }}>
                          Instruction
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Edit node</span>
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="st-sw">
                        <i />
                        End call
                      </span>
                      <span className="st-sw on">
                        <i />
                        Transfer to human
                      </span>
                      <span className="st-sw">
                        <i />
                        Keypad entry
                      </span>
                      <span className="st-x">
                        <I n="x" />
                      </span>
                    </span>
                  </div>
                  <div className="st-pb">
                    <div className="st-field">
                      <span className="st-label">Node name</span>
                      <span className="st-input">{m.nodeCheck}</span>
                    </div>
                    <div className="st-field">
                      <span className="st-label">Description</span>
                      <span className="st-input">{m.editDesc}</span>
                    </div>
                    <div className="st-field">
                      <span className="st-label">Instruction</span>
                      <span className="st-input" style={{ minHeight: 150, lineHeight: 1.6 }}>
                        {m.instruction[0]}
                        <span className="st-var">{"{{tracking_number}}"}</span>
                        {m.instruction[1]}
                        <span className="st-var">{"{{customer_name}}"}</span>
                        {m.instruction[2]}
                      </span>
                    </div>
                  </div>
                  <div className="st-pf">
                    <span className="st-btn dan" style={{ marginRight: "auto" }}>
                      <I n="trash" />
                      Delete
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        color: "var(--s-success-text)",
                      }}
                    >
                      <I n="check" style={{ width: 12, height: 12 }} />
                      Saved
                    </span>
                    <span className="st-btn sec">Back</span>
                    <span className="st-btn pri">Save node</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fit>
      </figure>
    ),
    know: (
      <figure className="shot">
        <ShotBar>/agents/parcel-status/knowledge</ShotBar>
        <Fit w={900} h={580}>
          <div className="st">
            <div className="st-main">
              <div className="st-topnav">
                <span className="st-back">
                  <I n="back" />
                  Agents
                </span>
                <span className="st-name">{m.agentName}</span>
                <span className="st-tabs">
                  <span>Flow</span>
                  <span className="on">Knowledge</span>
                  <span>Tools</span>
                  <span>Set</span>
                </span>
                <span className="st-tr">
                  <span className="st-chip ok">
                    <Dot />
                    Saved
                  </span>
                </span>
              </div>
              <div className="st-page">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div>
                    <div className="st-eb">Retrieval</div>
                    <h4 className="st-h1">Knowledge</h4>
                    <p className="st-desc" style={{ fontSize: 13 }}>
                      Connect text, PDFs, Markdown files, or Google Sheets. Content is chunked, embedded, and stored for
                      this agent.
                    </p>
                  </div>
                  <span className="st-btn pri">
                    <I n="plus" />
                    Add knowledge
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {(
                    [
                      ["file", "PDF · 48 chunks"],
                      ["sheet", "Google Sheet · 12 chunks"],
                      ["file", "Markdown · 21 chunks"],
                      ["type", "Text · 3 chunks"],
                    ] as [IconName, string][]
                  ).map(([icon, meta], i) => (
                    <div key={meta} className="st-card st-kc">
                      <span className="kf">
                        <I n={icon} />
                      </span>
                      <div>
                        <div className="nm">{m.knowledge[i]}</div>
                        <div className="mt">{meta}</div>
                      </div>
                      <span className="kb">···</span>
                    </div>
                  ))}
                </div>
                <div className="st-sec" style={{ marginTop: 24 }}>
                  Tools
                </div>
                <div className="st-card" style={{ marginTop: 8 }}>
                  <table className="st-tbl">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Endpoint</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600 }}>get_parcel_status</td>
                        <td>
                          <span className="st-chip">API</span>
                        </td>
                        <td style={{ color: "var(--s-fg3)" }}>
                          <b style={{ color: "var(--s-accent-text)" }}>GET</b>{" "}
                          {"api.example.co.th/parcels/{{tracking_number}}"}
                        </td>
                        <td>
                          <span className="st-btn sec" style={{ height: 26 }}>
                            Test
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>create_ticket</td>
                        <td>
                          <span className="st-chip">MCP · OAuth</span>
                        </td>
                        <td style={{ color: "var(--s-fg3)" }}>CRM MCP server</td>
                        <td>
                          <span className="st-chip ok">
                            <Dot />
                            Enabled
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Fit>
      </figure>
    ),
    test: (
      <figure className="shot">
        <ShotBar>/agents/parcel-status · Test · Live call</ShotBar>
        <Fit w={900} h={580}>
          <div className="st">
            <div className="st-body">
              <div className="st-canvas">
                <svg className="edges" aria-hidden="true">
                  <path className="e on" d="M200 150 V230" />
                  <path className="e" d="M200 336 V420" />
                </svg>
                <Node left={90} top={44} noTop title={m.nodeVerify} desc={m.nodeVerifyDesc} />
                <Node left={90} top={230} sel title={m.nodeCheck} desc={m.nodeCheckDesc} />
                <div className="st-panel" style={{ width: 400 }}>
                  <TestHead />
                  <div className="st-vars">
                    <span>
                      <b>CallerNumber</b>: 08x-xxx-4417
                    </span>
                    <span>
                      <b>tracking_number</b>: TH241055831
                    </span>
                    <span>
                      <b>customer_name</b>: {m.customerName}
                    </span>
                  </div>
                  <div className="st-msgs">
                    <span className="st-sys">
                      {m.stepPrefix}
                      {m.nodeVerify}
                    </span>
                    <span className="st-bub">{m.testGreeting}</span>
                    <span className="st-bub u">{m.testUser}</span>
                    <span className="st-sys">
                      {m.stepPrefix}
                      {m.nodeCheck}
                    </span>
                    <span className="st-bub">{m.checking}</span>
                    <ToolCall />
                    <span className="st-bub">{m.testAnswer}</span>
                  </div>
                  <LiveBar />
                </div>
              </div>
            </div>
          </div>
        </Fit>
      </figure>
    ),
    live: (
      <figure className="shot">
        <ShotBar>/inbound-call</ShotBar>
        <Fit w={900} h={580}>
          <div className="st">
            <Rail on={4} count={6} />
            <div className="st-main">
              <div className="st-page">
                <div className="st-eb">Telephony</div>
                <h4 className="st-h1">Inbound Call</h4>
                <p className="st-desc">Route each phone number to an agent. Callers can hear an IVR menu first.</p>
                <div className="st-card">
                  <table className="st-tbl">
                    <thead>
                      <tr>
                        <th>Phone number</th>
                        <th>Agent</th>
                        <th>IVR menu</th>
                        <th>Description</th>
                        <th>Concurrent</th>
                        <th>Tags</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="num" style={{ fontWeight: 600 }}>
                          02-xxx-1100
                        </td>
                        <td>{m.agentName}</td>
                        <td>
                          <span className="st-chip ac">{m.ivrMain}</span>
                        </td>
                        <td style={{ color: "var(--s-fg3)" }}>{m.lineGeneral}</td>
                        <td className="num">2</td>
                        <td>
                          <span className="st-chip">Inbound</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="num" style={{ fontWeight: 600 }}>
                          02-xxx-1200
                        </td>
                        <td>{m.agentClaims}</td>
                        <td style={{ color: "var(--s-fg4)" }}>—</td>
                        <td style={{ color: "var(--s-fg3)" }}>{m.lineClaims}</td>
                        <td className="num">0</td>
                        <td>
                          <span className="st-chip">Inbound</span> <span className="st-chip">Outbound</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span
                            className="st-input"
                            style={{ display: "inline-block", minHeight: 0, padding: "6px 10px", color: "var(--s-fg4)" }}
                          >
                            020966904
                          </span>
                        </td>
                        <td>
                          <span className="st-sel" style={{ minWidth: 130, color: "var(--s-fg4)" }}>
                            Choose an agent
                            <I n="down" />
                          </span>
                        </td>
                        <td>
                          <span className="st-sel" style={{ minWidth: 100, color: "var(--s-fg4)" }}>
                            None
                            <I n="down" />
                          </span>
                        </td>
                        <td style={{ color: "var(--s-fg4)" }}>Optional</td>
                        <td></td>
                        <td>
                          <span className="st-btn pri" style={{ height: 28 }}>
                            Add
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="st-card" style={{ marginTop: 14, padding: "14px 16px", display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <b>IVR · {m.ivrMain}</b>
                    <span className="st-chip">Thai</span>
                  </div>
                  <span style={{ color: "var(--s-fg2)" }}>{m.ivrGreeting}</span>
                  <span style={{ display: "flex", gap: 6 }}>
                    <span className="st-chip ac">1 → {m.agentName}</span>
                    <span className="st-chip">0 → {m.ivrStaff}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Fit>
      </figure>
    ),
  };
}

/* ---------- page ---------- */

export default async function Page({ params }: PageProps<"/[lang]/voice8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = content[lang];
  const m = c.mock;

  const logRows = [
    { phone: "08x-xxx-4417", result: m.results[0], time: "10:42", meta: "12 turns · $0.05", w: "55%", on: true },
    { phone: "09x-xxx-2051", result: m.results[1], time: "10:17", meta: "18 turns · $0.09", w: "100%" },
    { phone: "08x-xxx-7730", result: m.results[2], time: "09:55", meta: "6 turns · $0.02", w: "22%" },
  ];
  const featIcons: IconName[] = ["fwd", "hash", "msg", "timer", "help", "searchx", "type", "wave"];
  const caseIcons: IconName[] = ["pkg", "shield", "bell", "head"];
  const cell = (v: string | boolean) =>
    v === true ? (
      <>
        <span className="tick" aria-hidden="true" />
        <span className="sr">{c.plans.yes}</span>
      </>
    ) : v === false ? (
      <>
        <span className="dash" aria-hidden="true" />
        <span className="sr">{c.plans.no}</span>
      </>
    ) : (
      v
    );

  return (
    <ThemeRoot>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs dangerouslySetInnerHTML={{ __html: SPRITE_DEFS }} />
      </svg>

      <header className="top">
        <div className="wrap">
          <Link className="brand" href={`/${lang}`}>
            <svg aria-hidden="true">
              <use href="#v8-logo" />
            </svg>
            VOICE8
          </Link>
          <nav className="menu" aria-label={c.header.menuAria}>
            <a href="#features">{c.header.menu.features}</a>
            <a href="#phone">{c.header.menu.phone}</a>
            <a href="#cases">{c.header.menu.cases}</a>
            <a href="#plans">{c.header.menu.plans}</a>
            <a href="#faq">{c.header.menu.faq}</a>
          </nav>
          <div className="top-r">
            <ThemedLangSwitch lang={lang} path="/voice8" />
            <ThemeButton ariaLabel={c.header.themeAria} title={c.header.themeTitle} />
            <a className="btn btn-primary" href="#contact">
              {c.header.cta}
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="wrap">
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">{c.hero.eyebrow}</p>
              <h1>
                {c.hero.h1} <em>{c.hero.h1Em}</em>
              </h1>
              <p className="lead">{c.hero.lead}</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#features">
                  {c.hero.ctaPrimary}
                </a>
                <a className="btn btn-ghost" href="#plans">
                  {c.hero.ctaGhost}
                </a>
              </div>
              <ul className="tickli mini">
                {c.hero.ticks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="hero-visual">
              <figure className="shot">
                <ShotBar>studio.voice8-beryl8.com/agents/parcel-status</ShotBar>
                <Fit w={1180} h={700}>
                  <div className="st">
                    <Rail on={0} count={8} extras />
                    <div className="st-main">
                      <div className="st-topnav">
                        <span className="st-back">
                          <I n="back" />
                          Agents
                        </span>
                        <span className="st-name">{m.agentName}</span>
                        <span className="st-tabs">
                          <span className="on">Flow</span>
                          <span>Knowledge</span>
                          <span>Tools</span>
                          <span>Set</span>
                        </span>
                        <span className="st-tr">
                          <span className="st-tiny">All changes saved</span>
                          <span className="st-chip ok">
                            <Dot />
                            Saved
                          </span>
                          <span className="st-btn sec">Save</span>
                          <span className="st-btn sec">
                            <I n="play" />
                            Test
                          </span>
                        </span>
                      </div>
                      <div className="st-body">
                        <div className="st-side">
                          <div className="st-field">
                            <span className="st-label h">Agent name</span>
                            <span className="st-input">{m.agentName}</span>
                          </div>
                          <div className="st-field">
                            <span className="st-label h">Task overview</span>
                            <span className="st-input area">{m.taskOverview}</span>
                          </div>
                          <div className="st-field">
                            <span className="st-label h">Response style</span>
                            <span className="st-input area">{m.responseStyle}</span>
                          </div>
                          <span className="st-sec">Voice Engine</span>
                          <div className="st-engine">
                            <div className="h">
                              <span>
                                <span className="st-ico">
                                  <I n="flow" />
                                </span>
                                Pipeline
                              </span>
                              <I n="pencil" style={{ width: 14, height: 14, color: "var(--s-fg3)" }} />
                            </div>
                            <span style={{ fontWeight: 600, color: "var(--s-fg2)" }}>STT → LLM → TTS</span>
                            <span className="st-tiny" style={{ fontWeight: 600, color: "var(--s-fg3)" }}>
                              TH
                            </span>
                          </div>
                          <div className="st-field">
                            <span className="st-label">Transfer number</span>
                            <span className="st-input">02-xxx-1199</span>
                          </div>
                        </div>
                        <div className="st-canvas">
                          <svg className="edges" aria-hidden="true">
                            <path className="e" d="M394 140 V210" />
                            <path className="e on" d="M394 316 V360 Q394 372 382 372 H232 Q220 372 220 384 V470" />
                            <path className="e" d="M394 316 V360 Q394 372 406 372 H556 Q568 372 568 384 V470" />
                          </svg>
                          <Node left={284} top={36} start title="Start Node" desc={m.startMsg} />
                          <Node left={284} top={210} title={m.nodeVerify} desc={m.nodeVerifyDesc} />
                          <div className="st-cond" style={{ left: 220, top: 420 }}>
                            {m.condConfirmed}
                          </div>
                          <div className="st-cond" style={{ left: 568, top: 420 }}>
                            {m.condNoNumber}
                          </div>
                          <Node left={110} top={470} sel title={m.nodeCheck} desc={m.nodeCheckDesc} />
                          <Node left={458} top={470} title={m.nodeClose} desc={m.nodeCloseDesc} />
                          <span className="st-add" style={{ left: 209, top: 590 }}>
                            +
                          </span>
                          <span className="st-add" style={{ left: 557, top: 590 }}>
                            +
                          </span>
                          <div className="st-ctrl" aria-hidden="true">
                            <span>+</span>
                            <span>−</span>
                            <span>⤢</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fit>
              </figure>

              <div className="float-card" aria-label={c.hero.floatAria}>
                <Fit w={340} h={440}>
                  <div className="st" style={{ flexDirection: "column", background: "var(--s-bg1)" }}>
                    <TestHead />
                    <div className="st-vars">
                      <span>
                        <b>tracking_number</b>: TH241055831
                      </span>
                      <span>
                        <b>customer_name</b>: {m.customerName}
                      </span>
                    </div>
                    <div className="st-msgs">
                      <span className="st-sys">
                        {m.stepPrefix}
                        {m.nodeCheck}
                      </span>
                      <span className="st-bub u">{m.heroUser}</span>
                      <span className="st-bub">{m.checking}</span>
                      <ToolCall />
                      <span className="st-bub">{m.heroAnswer}</span>
                    </div>
                    <LiveBar />
                  </div>
                </Fit>
              </div>
              <span className="float-pill">
                <i aria-hidden="true" />
                {c.hero.floatPill}
              </span>
            </div>
          </section>

          <div className="facts">
            {c.facts.map((f) => (
              <div key={f.b} className="fact">
                <b>{f.b}</b>
                <span>{f.s}</span>
              </div>
            ))}
          </div>
          <p className="shot-note">{c.shotNote}</p>
        </div>

        <div className="mq" aria-hidden="true">
          <div className="mq-track">
            {[...c.marquee, ...c.marquee].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        <nav className="tabs" aria-label={c.tabs.aria}>
          <div className="wrap">
            <a href="#how">{c.tabs.how}</a>
            <a href="#features">{c.tabs.features}</a>
            <a href="#phone">{c.tabs.phone}</a>
            <a href="#cases">{c.tabs.cases}</a>
            <a href="#plans">{c.tabs.plans}</a>
            <a href="#spec">{c.tabs.spec}</a>
            <a href="#faq">{c.tabs.faq}</a>
          </div>
        </nav>

        <section className="section wrap" id="how">
          <div className="s-head">
            <p className="eyebrow">{c.how.eyebrow}</p>
            <h2>{c.how.h2}</h2>
            <p>{c.how.p}</p>
          </div>
          <div className="hub">
            <span className="beam l" aria-hidden="true" />
            <span className="beam r" aria-hidden="true" />
            <span className="beam d" aria-hidden="true" />
            <div className="cl left">
              <span className="hub-pill">{c.how.phonePill}</span>
              <div className="cl-ring">
                <I n="call" />
              </div>
              <div className="tile t1">
                <I n="server" />
                <span>Asterisk</span>
              </div>
              <div className="tile t2">
                <I n="network" />
                <span>SIP trunk</span>
              </div>
              <div className="tile t3">
                <I n="globe" />
                <span>Browser call</span>
              </div>
              <div className="tile t4">
                <I n="list" />
                <span>Batches</span>
              </div>
            </div>
            <div className="core" aria-label="VOICE8 by Beryl8">
              <span className="orbit" aria-hidden="true">
                <i />
                <i />
              </span>
              <div className="core-disc">
                <svg aria-hidden="true">
                  <use href="#v8-eight" />
                </svg>
              </div>
              <span className="core-cap">VOICE8 Agent</span>
            </div>
            <div className="cl right five">
              <span className="hub-pill">{c.how.knowledgePill}</span>
              <div className="cl-ring">
                <I n="book" />
              </div>
              <div className="tile t1">
                <I n="file" />
                <span>PDF</span>
              </div>
              <div className="tile t2">
                <I n="file" />
                <span>Markdown</span>
              </div>
              <div className="tile t3">
                <I n="sheet" />
                <span>Google Sheet</span>
              </div>
              <div className="tile t4">
                <I n="plug" />
                <span>API tools</span>
              </div>
              <div className="tile t5">
                <I n="puzzle" />
                <span>MCP</span>
              </div>
            </div>
            <div className="tray-wrap">
              <span className="hub-pill">Pipeline</span>
              <div className="tray">
                <div className="tile">
                  <I n="mic" />
                  <span>
                    STT
                    <br />
                    Gemini
                  </span>
                </div>
                <em aria-hidden="true">→</em>
                <div className="tile">
                  <I n="spark" />
                  <span>
                    LLM
                    <br />
                    Gemini
                  </span>
                </div>
                <em aria-hidden="true">→</em>
                <div className="tile">
                  <I n="wave" />
                  <span>
                    TTS
                    <br />
                    Gemini TTS
                  </span>
                </div>
                <div className="tile">
                  <I n="vol" />
                  <span>
                    {c.how.clonedVoice[0]}
                    <br />
                    {c.how.clonedVoice[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap" id="features">
          <div className="s-head">
            <p className="eyebrow">{c.features.eyebrow}</p>
            <h2>{c.features.h2}</h2>
          </div>
          <Tour
            ariaLabel={c.features.stepsAria}
            steps={c.features.steps}
            tour={c.features.tour}
            media={tourMedia(m)}
          />
        </section>

        <section className="section wrap" id="more">
          <div className="s-head">
            <p className="eyebrow">{c.more.eyebrow}</p>
            <h2>{c.more.h2}</h2>
          </div>
          <div className="bento">
            <article className="card c-wide">
              <div className="card-top">
                <div>
                  <p className="k">{c.more.analytics.k}</p>
                  <h3>{c.more.analytics.h3}</h3>
                </div>
                <p>{c.more.analytics.p}</p>
              </div>
              <div className="card-media">
                <Fit w={1140} h={620}>
                  <div className="st">
                    <Rail on={5} count={6} />
                    <div className="st-main">
                      <div className="st-page" style={{ padding: "28px 32px 0" }}>
                        <div className="st-eb">Insights</div>
                        <h4 className="st-h1">Conversation logs</h4>
                        <div style={{ display: "flex", gap: 6, margin: "6px 0 16px" }}>
                          <span className="st-chip ac">All</span>
                          {m.results.map((r) => (
                            <span key={r} className="st-chip">
                              {r}
                            </span>
                          ))}
                        </div>
                        <div className="st-stats">
                          <div className="st-stat">
                            <div className="l">Conversations</div>
                            <div className="v num">128</div>
                          </div>
                          <div className="st-stat">
                            <div className="l">Avg. turns</div>
                            <div className="v num">9.4</div>
                          </div>
                          <div className="st-stat">
                            <div className="l">Self-contained</div>
                            <div className="v num">81%</div>
                            <div className="hn">104 of 128</div>
                          </div>
                          <div className="st-stat">
                            <div className="l">Avg. response</div>
                            <div className="v num">—</div>
                            <div className="hn">per turn</div>
                          </div>
                          <div className="st-stat">
                            <div className="l">Spend</div>
                            <div className="v num">$7.12</div>
                            <div className="hn">model · judge · extractor · STT · TTS</div>
                          </div>
                          <div className="st-stat">
                            <div className="l">Avg $/min</div>
                            <div className="v num">$0.022</div>
                            <div className="hn">over 327.4 min</div>
                          </div>
                        </div>
                        <div className="st-split">
                          <div className="st-list">
                            <div className="st-grp">
                              <I n="down" />
                              <span style={{ flex: 1 }}>Today</span>
                              <span style={{ fontWeight: 400, color: "var(--s-fg4)" }}>3</span>
                            </div>
                            {logRows.map((r) => (
                              <div key={r.phone} className={r.on ? "st-row on" : "st-row"}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <b style={{ fontWeight: 500 }}>{r.phone}</b>
                                  <span className="st-chip">
                                    <I n="flow" />
                                    Pipeline
                                  </span>
                                  <span className="st-chip ac">{r.result}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <span className="st-tiny">{r.time}</span>
                                  <span style={{ fontSize: 11, color: "var(--s-fg3)" }} className="num">
                                    {r.meta}
                                  </span>
                                </div>
                                <div className="st-cost">
                                  <i style={{ width: r.w }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="st-card st-detail">
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <b style={{ fontWeight: 600 }}>08x-xxx-4417</b>
                              <span className="st-chip">
                                <I n="flow" />
                                Pipeline
                              </span>
                              <span className="st-tiny">Today 10:42</span>
                              <span style={{ fontSize: 11, color: "var(--s-fg3)" }} className="num">
                                2:14 · 12 turns
                              </span>
                              <span className="st-chip ok">
                                <I n="check" />
                                Contained
                              </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                              <div
                                className="st-card"
                                style={{ padding: "12px 14px", display: "grid", gap: 6, background: "var(--s-bg2)" }}
                              >
                                <span className="st-eb">Call result</span>
                                <b style={{ fontWeight: 600 }}>{m.results[0]}</b>
                                <span style={{ color: "var(--s-fg2)", fontSize: 12.5 }}>{m.callSummary}</span>
                              </div>
                              <div
                                className="st-card"
                                style={{ padding: "12px 14px", display: "grid", gap: 6, background: "var(--s-bg2)" }}
                              >
                                <span className="st-eb">Variables</span>
                                <div className="st-kv">
                                  <span>customer_name</span>
                                  <span>{m.customerName}</span>
                                  <span>tracking_number</span>
                                  <span className="num">TH241055831</span>
                                  <span>delivery_date</span>
                                  <span>{m.tomorrow}</span>
                                </div>
                              </div>
                            </div>
                            <div className="st-ev">
                              <span className="w a">Agent</span>
                              <span>{m.startMsg}</span>
                              <span className="w">Caller</span>
                              <span>{m.callerAsk}</span>
                              <span className="w a">Agent</span>
                              <span>{m.agentAsk}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fit>
              </div>
            </article>

            <article className="card">
              <div>
                <p className="k">{c.more.engine.k}</p>
                <h3>{c.more.engine.h3}</h3>
                <p>{c.more.engine.p}</p>
              </div>
              <div className="card-media">
                <Fit w={660} h={470}>
                  <div className="st" style={{ background: "var(--s-bg1)" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div className="st-mh">
                        Voice Engine
                        <span className="st-x">
                          <I n="x" />
                        </span>
                      </div>
                      <div className="st-mb">
                        <div className="st-eb">Engine mode</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div className="st-mode on">
                            <div className="h">
                              <span className="st-ico">
                                <I n="flow" />
                              </span>
                              Pipeline<span className="st-chip ac b">Customizable</span>
                            </div>
                            <div className="st-stage">
                              <span className="st-chip">STT</span>→<span className="st-chip">LLM</span>→
                              <span className="st-chip">TTS</span>
                            </div>
                          </div>
                          <div className="st-mode">
                            <div className="h">
                              <span className="st-ico">
                                <I n="box" />
                              </span>
                              Realtime<span className="st-chip b">Low latency</span>
                            </div>
                            <div className="st-stage">
                              <span className="st-chip">
                                <I n="wave" />
                                Native model
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="st-card" style={{ padding: "14px 16px", display: "grid", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                            <I n="flow" style={{ width: 15, height: 15 }} />
                            Components
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {(
                              [
                                ["STT", "Gemini 3.5 Transcribe"],
                                ["LLM", "Gemini"],
                                ["TTS", "Gemini TTS"],
                                ["Voice", m.brandVoice],
                              ] as const
                            ).map(([l, v]) => (
                              <div key={l} className="st-field">
                                <span className="st-label">{l}</span>
                                <span className="st-sel">
                                  {v}
                                  <I n="down" />
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="st-field">
                            <span className="st-label">Language</span>
                            <span className="st-sel" style={{ justifySelf: "start" }}>
                              Thai (th)
                              <I n="down" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fit>
              </div>
            </article>

            <article className="card">
              <div>
                <p className="k">{c.more.batches.k}</p>
                <h3>{c.more.batches.h3}</h3>
                <p>{c.more.batches.p}</p>
              </div>
              <div className="card-media">
                <Fit w={660} h={470}>
                  <div className="st">
                    <div className="st-main">
                      <div className="st-page" style={{ padding: "26px 28px" }}>
                        <div className="st-eb">Telephony</div>
                        <h4 className="st-h1" style={{ fontSize: 26 }}>
                          Outbound Call
                        </h4>
                        <div className="st-seg" style={{ marginTop: 8 }}>
                          <span>Single call</span>
                          <span className="on">Batches</span>
                        </div>
                        <div
                          className="st-card"
                          style={{
                            padding: "14px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 12,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <b>{m.batchName}</b>
                            <div style={{ fontSize: 11, color: "var(--s-fg3)" }}>
                              {m.agentName} · YaleCom · 08:00–20:00 · retry 2
                            </div>
                          </div>
                          <span className="st-prog">
                            <i style={{ width: "49%" }} />
                          </span>
                          <span className="num" style={{ fontSize: 12, color: "var(--s-fg3)" }}>
                            68 / 140
                          </span>
                          <span className="st-chip ac">
                            <Dot />
                            Running
                          </span>
                        </div>
                        <div className="st-card">
                          <table className="st-tbl">
                            <thead>
                              <tr>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Tries</th>
                                <th>Last call</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ["08x-xxx-1023", "ok", "answered", "1", "10:02"],
                                ["09x-xxx-5530", "warn", "no_answer", "2", "10:05"],
                                ["08x-xxx-8841", "warn", "busy", "1", "10:06"],
                                ["06x-xxx-0317", "bad", "invalid", "1", "10:08"],
                              ].map(([ph, tone, st, tries, last]) => (
                                <tr key={ph}>
                                  <td className="num">{ph}</td>
                                  <td>
                                    <span className={`st-chip ${tone}`}>
                                      <Dot />
                                      {st}
                                    </span>
                                  </td>
                                  <td className="num">{tries}</td>
                                  <td className="num" style={{ color: "var(--s-fg3)" }}>
                                    {last}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fit>
              </div>
            </article>
          </div>
        </section>

        <section className="section wrap" id="phone">
          <div className="s-head">
            <p className="eyebrow">{c.phone.eyebrow}</p>
            <h2>{c.phone.h2}</h2>
            <p>{c.phone.p}</p>
          </div>
          <div className="feats">
            {c.phone.feats.map((f, i) => (
              <article key={f.h} className="feat">
                <span className="fi">
                  <I n={featIcons[i]} />
                </span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" id="cases">
          <div className="s-head">
            <p className="eyebrow">{c.cases.eyebrow}</p>
            <h2>{c.cases.h2}</h2>
          </div>
          <div className="cases">
            {c.cases.items.map((it, i) => (
              <article key={it.h} className="case">
                <div className="case-h">
                  <span className="fi">
                    <I n={caseIcons[i]} />
                  </span>
                  <div>
                    <h3>{it.h}</h3>
                    <small>{it.sub}</small>
                  </div>
                </div>
                <ul className="tickli">
                  {it.ticks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="case-uses">
                  {it.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section wrap" id="plans">
          <div className="s-head">
            <p className="eyebrow">{c.plans.eyebrow}</p>
            <h2>{c.plans.h2}</h2>
            <span className="mock-flag">{c.plans.flag}</span>
          </div>
          <div className="pc-grid">
            <article className="pc">
              <h3 className="pc-name">Standard</h3>
              <div className="pc-price num">
                <b>฿ —</b>
                <span>{c.plans.perMonth}</span>
              </div>
              <p className="pc-sub">{c.plans.minutes}</p>
              <p className="pc-for">{c.plans.standard.for}</p>
              <a className="btn btn-ghost" href="#contact">
                {c.plans.contactSales}
              </a>
              <ul className="tickli">
                <li className="h">{c.plans.standard.head}</li>
                {c.plans.standard.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
            <article className="pc rec">
              <span className="pc-tag">{c.plans.recommended}</span>
              <h3 className="pc-name">Premium</h3>
              <div className="pc-price num">
                <b>฿ —</b>
                <span>{c.plans.perMonth}</span>
              </div>
              <p className="pc-sub">{c.plans.minutes}</p>
              <p className="pc-for">{c.plans.premium.for}</p>
              <a className="btn btn-primary" href="#contact">
                {c.plans.contactSales}
              </a>
              <ul className="tickli">
                <li className="h">{c.plans.premium.head}</li>
                {c.plans.premium.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
            <article className="pc">
              <h3 className="pc-name">Customize</h3>
              <div className="pc-price">
                <b style={{ fontSize: 22, color: "var(--tint-ink)" }}>{c.plans.contactSales}</b>
              </div>
              <p className="pc-sub">{c.plans.customize.sub}</p>
              <p className="pc-for">{c.plans.customize.for}</p>
              <a className="btn btn-ghost" href="#contact">
                {c.plans.contactSales}
              </a>
              <ul className="tickli">
                <li className="h">{c.plans.customize.head}</li>
                {c.plans.customize.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          </div>
          <p className="pc-note">{c.plans.note}</p>

          <h3 className="ct-h">{c.plans.compareH}</h3>
          <div className="ct-wrap">
            <table className="ct" id="ct">
              <colgroup>
                <col className="c-f" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr">{c.plans.featureSr}</span>
                  </th>
                  <th scope="col">
                    <span className="ct-n">Standard</span>
                    <span className="ct-p">{c.plans.priceLine}</span>
                  </th>
                  <th scope="col" className="prem">
                    <span className="ct-n">Premium</span>
                    <span className="ct-p">{c.plans.priceLine}</span>
                  </th>
                  <th scope="col">
                    <span className="ct-n">Customize</span>
                    <span className="ct-p">{c.plans.contactSales}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.plans.rows.map((r) => {
                  if (r.length === 1)
                    return (
                      <tr key={r[0]} className="g">
                        <th scope="rowgroup" colSpan={2}>
                          {r[0]}
                        </th>
                        <td className="prem"></td>
                        <td></td>
                      </tr>
                    );
                  const txt = typeof r[1] === "string";
                  return (
                    <tr key={r[0]}>
                      <th scope="row">{r[0]}</th>
                      <td className={txt ? "txt" : undefined}>{cell(r[1])}</td>
                      <td className={txt ? "prem txt" : "prem"}>{cell(r[2])}</td>
                      <td className={txt ? "txt" : undefined}>{cell(r[3])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section wrap" id="spec">
          <div className="s-head">
            <h2>{c.spec.h2}</h2>
          </div>
          <dl className="spec">
            {c.spec.rows.map((r) => (
              <div key={r.dt}>
                <dt>{r.dt}</dt>
                <dd>{r.dd}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section wrap" id="faq">
          <div className="s-head">
            <h2>{c.faq.h2}</h2>
          </div>
          <div className="faq">
            {c.faq.items.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className="cta-band" id="contact">
            <div>
              <h2>{c.cta.h2}</h2>
              <p>{c.cta.p}</p>
            </div>
            <a className="btn btn-primary" href="#plans">
              {c.cta.btn}
            </a>
          </div>
        </section>

        <footer className="wrap foot">
          <span>{c.footer.copy}</span>
          <span>{c.footer.note}</span>
        </footer>
      </main>
    </ThemeRoot>
  );
}
