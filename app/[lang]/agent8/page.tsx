import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { LangSwitch } from "@/components/LangSwitch";
import { hasLocale } from "@/lib/i18n";
import { getAgent8Content } from "./content";
import { Dock, HowTabs, PickButton, PlanCard, PlanProvider, SubNav } from "./interactive";
import "./agent8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/agent8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getAgent8Content(lang);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { languages: { en: "/en/agent8", th: "/th/agent8" } },
  };
}

/* ---------- Small render helpers ---------- */

const Ck = () => <Check size={16} strokeWidth={1.75} aria-hidden="true" />;

function Ticks({ items, className = "ticks" }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((t) => (
        <li key={t}>
          <Ck />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Bar({ path }: { path: string }) {
  return (
    <div className="bar">
      <i />
      <i />
      <i />
      <span>{path}</span>
    </div>
  );
}

/** Renders `backtick` segments as <code>. */
function rich(text: string): ReactNode {
  return text.split("`").map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="ic" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
        {children}
      </svg>
    </span>
  );
}

/* ---------- Non-localized mock data (identifiers, numbers) ---------- */

const waterfall = [
  { lvl: "", k: "req", label: "req", name: "chat/completions", left: 0, width: 100, bar: "", ms: "5.92s" },
  { lvl: "l1", k: "grd", label: "guard", name: "pii_mask", left: 0, width: 3, bar: "grd", ms: "9ms" },
  { lvl: "l1", k: "ag", label: "agent", name: "support-assistant", left: 2, width: 97, bar: "ag", ms: "5.81s" },
  { lvl: "l2", k: "gen", label: "gen", name: "claude-sonnet", left: 3, width: 22, bar: "gen", ms: "1.30s" },
  { lvl: "l2", k: "tool", label: "tool", name: "claims.get_status", left: 26, width: 9, bar: "tool", ms: "512ms" },
  { lvl: "l2", k: "gen", label: "gen", name: "claude-sonnet", left: 36, width: 21, bar: "gen", ms: "1.24s" },
  { lvl: "l2", k: "tool", label: "tool", name: "claims.get_documents", left: 58, width: 12, bar: "tool", ms: "698ms" },
  { lvl: "l2", k: "gen", label: "gen", name: "claude-sonnet", left: 71, width: 27, bar: "gen", ms: "1.61s" },
];

const suiteData = [
  { chip: "11/12", width: 92, cost: "$0.42" },
  { chip: "6/6", width: 100, cost: "$0.18" },
];

const runs = [
  { agent: "support-assistant", mode: "sync", chip: "g", status: "succeeded", cost: "$0.031" },
  { agent: "support-assistant", mode: "async", chip: "w", status: "waiting_approval", cost: "$0.018" },
  { agent: "invoice-checker", mode: "async", chip: "", status: "running", cost: "$0.009" },
  { agent: "invoice-checker", mode: "eval", chip: "g", status: "succeeded", cost: "$0.024" },
  { agent: "hr-faq", mode: "sync", chip: "r", status: "failed", cost: "$0.002" },
];

const versions = [
  { v: "v4", tests: "11/12", chip: "w", status: "draft" },
  { v: "v3", tests: "12/12", chip: "g", status: "published" },
  { v: "v2", tests: "10/12", chip: "n", status: "retired" },
  { v: "v1", tests: "8/10", chip: "n", status: "retired" },
];

const evalData = [
  { checks: ["tool_called", "contains"], pass: true },
  { checks: ["llm_judge 0.82"], pass: true },
  { checks: ["tool_not_called"], pass: false },
  { checks: ["json_valid", "max_cost_usd"], pass: true },
];

const keys = [
  { key: "app-callcenter", team: "customer-service", width: 41, warn: false, rpm: "120" },
  { key: "app-invoice", team: "finance", width: 86, warn: true, rpm: "60" },
  { key: "app-hr-portal", team: "people", width: 23, warn: false, rpm: "60" },
  { key: "dev-sandbox", team: "platform", width: 9, warn: false, rpm: "20" },
];

const traces = [
  { time: "14:32:08", who: "support-assistant v3", src: "api", chip: "g", status: "ok", cost: "$0.031" },
  { time: "14:31:55", who: "gpt-mini", src: "api", chip: "r", status: "guardrail_blocked", cost: "$0.000" },
  { time: "14:31:40", who: "invoice-checker v7", src: "eval", chip: "g", status: "ok", cost: "$0.024" },
  { time: "14:31:12", who: "support-assistant v4", src: "simulation", chip: "g", status: "ok", cost: "$0.057" },
];

const costBars = [
  { m: "claude-sonnet", width: 100, v: "$1,204" },
  { m: "gpt-mini", width: 48, v: "$583" },
  { m: "gemini-flash", width: 31, v: "$372" },
  { m: "embed-small", width: 13, v: "$159" },
];

const seals = [["RLS"], ["KEY", "VAULT"], ["HMAC"], ["3", "ROLES"]];

const chip = (variant: string) => (variant ? `chip ${variant}` : "chip");

export default async function Page({ params }: PageProps<"/[lang]/agent8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getAgent8Content(lang);
  const h = c.how;

  const panels: ReactNode[] = [
    /* 01 Build */
    <>
      <div>
        <h3>{h.build.h3}</h3>
        <p className="sub">{h.build.sub}</p>
        <Ticks items={h.build.ticks} />
      </div>
      <div className="screen" role="img" aria-label={h.build.aria}>
        <Bar path="console.agent8 / builder" />
        <div className="pane" style={{ gap: 16 }}>
          <div className="msg">
            <span className="av">{h.build.userAv}</span>
            <div>
              <div className="who">
                {h.build.userName}
                <small>builder</small>
              </div>
              {h.build.userText}
            </div>
          </div>
          <div className="msg">
            <span className="av ai">A8</span>
            <div>
              <div className="who">Agent Builder</div>
              {h.build.aiBefore} <b>claims.update_status</b> {h.build.aiAfter}
              {h.build.logs.map((l) => (
                <div className="tl" key={l}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>,
    /* 02 Test */
    <>
      <div>
        <h3>{h.test.h3}</h3>
        <p className="sub">{h.test.sub}</p>
        <Ticks items={h.test.ticks} />
      </div>
      <div className="screen" role="img" aria-label={h.test.aria}>
        <Bar path="console.agent8 / agents / support-assistant / v4" />
        <div className="pane">
          <div className="row">
            <div className="t1">{h.test.title}</div>
            <span className="chip g">{h.test.chip}</span>
          </div>
          {h.test.suites.map((s, i) => (
            <div className="box" key={s.name}>
              <div className="row">
                <b>{s.name}</b>
                <span className="chip g">{suiteData[i].chip}</span>
              </div>
              <div className="meter">
                <i style={{ width: `${suiteData[i].width}%` }} />
              </div>
              <div className="row t2">
                <span>{s.line}</span>
                <span>{suiteData[i].cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>,
    /* 03 Call */
    <>
      <div>
        <h3>{h.call.h3}</h3>
        <p className="sub">{rich(h.call.sub)}</p>
        <Ticks items={h.call.ticks} />
      </div>
      <pre className="code" aria-label={h.call.codeAria}>
        <span className="k2">from</span>
        {" openai "}
        <span className="k2">import</span>
        {" OpenAI\n\nclient = OpenAI(\n    base_url="}
        <span className="s">{'"https://gateway.agent8.example/v1"'}</span>
        {",\n    api_key=AGENT8_VIRTUAL_KEY,\n)\n\nresp = client.chat.completions.create(\n    model="}
        <span className="s">{'"agent:support-assistant"'}</span>
        {",\n    messages=[{"}
        <span className="s">{'"role"'}</span>
        {": "}
        <span className="s">{'"user"'}</span>
        {",\n               "}
        <span className="s">{'"content"'}</span>
        {": "}
        <span className="s">{`"${h.call.codeUser}"`}</span>
        {"}],\n)\n"}
        <span className="c"># resp.agent8 holds run_id, status, trace_id, version</span>
        {"\n"}
        <span className="c">{`# header X-Agent8-Cost-Usd: ${h.call.codeCost}`}</span>
      </pre>
    </>,
    /* 04 Review */
    <>
      <div>
        <h3>{h.review.h3}</h3>
        <p className="sub">{h.review.sub}</p>
        <Ticks items={h.review.ticks} />
      </div>
      <div className="screen" role="img" aria-label={h.review.aria}>
        <Bar path="console.agent8 / runs" />
        <div className="pane">
          <table className="mini">
            <thead>
              <tr>
                <th>{h.review.heads[0]}</th>
                <th>{h.review.heads[1]}</th>
                <th>{h.review.heads[2]}</th>
                <th className="num">{h.review.heads[3]}</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r, i) => (
                <tr key={i}>
                  <td className="m">{r.agent}</td>
                  <td>{r.mode}</td>
                  <td>
                    <span className={chip(r.chip)}>{r.status}</span>
                  </td>
                  <td className="num">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>,
  ];

  const a = c.agent;
  const g = c.gateway;
  const o = c.observation;
  const p = c.plans;

  return (
    <div className="p-agent8">
      <PlanProvider>
        <header className="top">
          <div className="wrap">
            <a className="brand" href="#top">
              <span className="brand-mark" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="4.8" r="2.9" fill="none" stroke="currentColor" strokeWidth="1.75" />
                  <circle cx="8" cy="11.4" r="3.3" fill="none" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </span>
              AGENT8
            </a>
            <nav aria-label={c.aria.mainNav}>
              <a href="#features">{c.nav.features}</a>
              <a href="#uses">{c.nav.uses}</a>
              <a href="#plans">{c.nav.plans}</a>
              <a href="#faq">{c.nav.help}</a>
            </nav>
            <div className="lang-switch">
              <LangSwitch lang={lang} path="/agent8" />
            </div>
          </div>
        </header>

        <main id="top">
          {/* Hero */}
          <section className="hero">
            <div className="wrap">
              <div className="hero-copy">
                <span className="eyebrow cy">AGENT8 · AGENT PLATFORM</span>
                <h1>
                  {c.hero.h1Lead} <em>{c.hero.h1Em}</em>
                </h1>
                <p className="lede">{c.hero.lede}</p>
                <div className="cta">
                  <a className="btn fill" href="#features">
                    {c.hero.ctaPrimary}
                  </a>
                  <a className="btn" href="#plans">
                    {c.hero.ctaSecondary}
                  </a>
                </div>
                <Ticks items={c.hero.ticks} />
              </div>

              <div className="stage">
                <span className="live">
                  <i />
                  Trace · agent:support-assistant
                </span>
                <div className="screen" role="img" aria-label={c.hero.screenAria}>
                  <Bar path="console.agent8 / observation / traces" />
                  <div className="pane">
                    <div className="row">
                      <div>
                        <div className="t1">{c.hero.traceTitle}</div>
                        <div className="t2">support-assistant v3 · key app-callcenter · source api</div>
                      </div>
                      <span className="chip g">succeeded</span>
                    </div>
                    <div className="tiles">
                      {c.hero.tiles.map((t) => (
                        <div className="tile" key={t.l}>
                          <b>{t.v}</b>
                          <small>{t.l}</small>
                        </div>
                      ))}
                    </div>
                    <div className="box">
                      {waterfall.map((w, i) => (
                        <div className={w.lvl ? `wf ${w.lvl}` : "wf"} key={i}>
                          <span className="nm">
                            <span className={`k ${w.k}`}>{w.label}</span>
                            <span>{w.name}</span>
                          </span>
                          <span className="trk">
                            <b className={w.bar || undefined} style={{ left: `${w.left}%`, width: `${w.width}%` }} />
                          </span>
                          <span className="ms">{w.ms}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="screen float" role="img" aria-label={c.hero.floatAria}>
                  <div className="pane" style={{ gap: 9 }}>
                    <div className="row">
                      <b style={{ fontSize: 13.5 }}>app-callcenter</b>
                      <span className="chip">virtual key</span>
                    </div>
                    <div className="t2">{c.hero.floatBudget}</div>
                    <div className="meter">
                      <i style={{ width: "41%" }} />
                    </div>
                    <dl className="kv">
                      <dt>{c.hero.floatTeam}</dt>
                      <dd>customer-service</dd>
                      <dt>Agent</dt>
                      <dd>support-assistant</dd>
                      <dt>Limit</dt>
                      <dd>120 RPM</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust strip */}
          <section className="trust">
            <div className="wrap">
              <ul>
                {c.trust.items.map((t) => (
                  <li key={t.b}>
                    <b>{t.b}</b>
                    <span>{t.s}</span>
                  </li>
                ))}
              </ul>
              <p className="note">{c.trust.note}</p>
            </div>
          </section>

          <SubNav
            ariaLabel={c.aria.subnav}
            links={[
              { id: "how", label: c.subnav.how },
              { id: "features", label: c.subnav.features },
              { id: "uses", label: c.subnav.uses },
              { id: "plans", label: c.subnav.plans },
              { id: "specs", label: c.subnav.specs },
              { id: "faq", label: c.subnav.faq },
            ]}
          />

          {/* How it works */}
          <section className="section" id="how">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow th">{h.eyebrow}</span>
                <h2>{h.h2}</h2>
              </div>
              <HowTabs
                ariaLabel={h.tablistAria}
                tabs={h.tabs.map((t, i) => ({ n: `0${i + 1}`, t }))}
                panels={panels}
              />
            </div>
          </section>

          {/* Features: Agent */}
          <section className="section" id="features">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow">AI AGENT</span>
                <h2>{a.h2}</h2>
                <p>{a.p}</p>
              </div>

              <div className="bento">
                <article className="cell span2">
                  <span className="ey">{a.versions.ey}</span>
                  <h3>{a.versions.h3}</h3>
                  <p>{a.versions.p}</p>
                  <div className="screen shot" role="img" aria-label={a.versions.aria}>
                    <Bar path="console.agent8 / agents / support-assistant / versions" />
                    <div className="pane">
                      <table className="mini">
                        <thead>
                          <tr>
                            {a.versions.heads.map((hd) => (
                              <th key={hd}>{hd}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {versions.map((v, i) => (
                            <tr key={v.v}>
                              <td className="m">{v.v}</td>
                              <td>{a.versions.notes[i]}</td>
                              <td>{v.tests}</td>
                              <td>
                                <span className={chip(v.chip)}>{v.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
                <article className="cell">
                  <span className="ey">{a.approval.ey}</span>
                  <h3>{a.approval.h3}</h3>
                  <p>{a.approval.p}</p>
                  <div className="screen shot" role="img" aria-label={a.approval.aria}>
                    <div className="pane">
                      <div className="appr">
                        <div className="row">
                          <b style={{ fontSize: 12.5 }}>claims.update_status</b>
                          <span className="chip w">pending</span>
                        </div>
                        <pre>{'{ "claim_id": "C-20931",\n  "status": "need_documents" }'}</pre>
                        <div className="t2">{a.approval.expires}</div>
                        <div className="acts">
                          <span className="y">{a.approval.approve}</span>
                          <span>{a.approval.reject}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div className="bento">
                <article className="cell pad">
                  <Icon>
                    <rect x="3" y="3" width="14" height="5" rx="1.5" />
                    <rect x="3" y="12" width="14" height="5" rx="1.5" />
                    <path d="M6 5.5h.01M6 14.5h.01" />
                  </Icon>
                  <h4>{a.small[0].h4}</h4>
                  <p>{a.small[0].p}</p>
                </article>
                <article className="cell pad">
                  <Icon>
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 6v4l2.5 2" />
                  </Icon>
                  <h4>{a.small[1].h4}</h4>
                  <p>{a.small[1].p}</p>
                </article>
                <article className="cell pad">
                  <Icon>
                    <path d="M4 4h12v9H8l-4 3z" />
                    <path d="M7.5 8.5h5" />
                  </Icon>
                  <h4>{a.small[2].h4}</h4>
                  <p>{a.small[2].p}</p>
                </article>
              </div>

              <div className="bento">
                <article className="cell span2">
                  <span className="ey">{a.eval.ey}</span>
                  <h3>{a.eval.h3}</h3>
                  <p>{a.eval.p}</p>
                  <div className="screen shot" role="img" aria-label={a.eval.aria}>
                    <Bar path="console.agent8 / evals / regression / run 38" />
                    <div className="pane">
                      <table className="mini">
                        <thead>
                          <tr>
                            <th>{a.eval.heads[0]}</th>
                            <th>{a.eval.heads[1]}</th>
                            <th className="num">{a.eval.heads[2]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {evalData.map((r, i) => (
                            <tr key={i}>
                              <td>{a.eval.rows[i]}</td>
                              <td>
                                {r.checks.map((ck, j) => (
                                  <span key={ck}>
                                    {j > 0 && " "}
                                    <span className="chip n">{ck}</span>
                                  </span>
                                ))}
                              </td>
                              <td className="num">
                                <span className={r.pass ? "chip g" : "chip r"}>
                                  {r.pass ? a.eval.pass : a.eval.fail}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
                <article className="cell pad">
                  <span className="ey">{a.checks.ey}</span>
                  <h3>{a.checks.h3}</h3>
                  <Ticks items={a.checks.ticks} />
                </article>
              </div>
            </div>
          </section>

          {/* Features: Gateway */}
          <section className="section">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow">AI GATEWAY</span>
                <h2>{g.h2}</h2>
                <p>{g.p}</p>
              </div>
              <div className="bento">
                <article className="cell span2">
                  <span className="ey">{g.keys.ey}</span>
                  <h3>{g.keys.h3}</h3>
                  <p>{g.keys.p}</p>
                  <div className="screen shot" role="img" aria-label={g.keys.aria}>
                    <Bar path="console.agent8 / gateway / keys" />
                    <div className="pane">
                      <table className="mini">
                        <thead>
                          <tr>
                            <th>{g.keys.heads[0]}</th>
                            <th>{g.keys.heads[1]}</th>
                            <th style={{ width: "34%" }}>{g.keys.heads[2]}</th>
                            <th className="num">{g.keys.heads[3]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keys.map((k) => (
                            <tr key={k.key}>
                              <td className="m">{k.key}</td>
                              <td>{k.team}</td>
                              <td>
                                <div className="meter">
                                  <i className={k.warn ? "w" : undefined} style={{ width: `${k.width}%` }} />
                                </div>
                              </td>
                              <td className="num">{k.rpm}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
                <article className="cell">
                  <span className="ey">{g.guard.ey}</span>
                  <h3>{g.guard.h3}</h3>
                  <p>{g.guard.p}</p>
                  <div className="screen shot" role="img" aria-label={g.guard.aria}>
                    <div className="pane">
                      <div className="box">
                        <div className="t2">{g.guard.inLabel}</div>
                        <div>
                          {g.guard.intro} <span className="pii">{g.guard.name}</span> {g.guard.idLabel}{" "}
                          <span className="pii">1-1037-02xxx-xx-x</span> {g.guard.phoneLabel}{" "}
                          <span className="pii">081-234-xxxx</span>
                        </div>
                      </div>
                      <div className="box">
                        <div className="t2">{g.guard.outLabel}</div>
                        <div>
                          {g.guard.intro} {g.guard.name} {g.guard.idLabel}{" "}
                          <span className="mask">[TH_NATIONAL_ID]</span> {g.guard.phoneLabel}{" "}
                          <span className="mask">[PHONE]</span>
                        </div>
                      </div>
                      <div className="row">
                        <span className="t2">pii_mask · input</span>
                        <span className="chip g">{g.guard.count}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <div className="bento">
                <article className="cell pad">
                  <Icon>
                    <path d="M7 6l-4 4 4 4M13 6l4 4-4 4" />
                  </Icon>
                  <h4>{g.small[0].h4}</h4>
                  <p>{g.small[0].p}</p>
                </article>
                <article className="cell pad">
                  <Icon>
                    <circle cx="6" cy="10" r="2.5" />
                    <circle cx="14" cy="5" r="2.5" />
                    <circle cx="14" cy="15" r="2.5" />
                    <path d="M8.3 9l3.4-2.6M8.3 11l3.4 2.6" />
                  </Icon>
                  <h4>{g.small[1].h4}</h4>
                  <p>{g.small[1].p}</p>
                </article>
                <article className="cell pad">
                  <Icon>
                    <path d="M10 3l6 2.5v4.2c0 3.6-2.5 6.3-6 7.3-3.5-1-6-3.7-6-7.3V5.5z" />
                  </Icon>
                  <h4>{g.small[2].h4}</h4>
                  <p>{g.small[2].p}</p>
                </article>
              </div>
            </div>
          </section>

          {/* Features: Observation */}
          <section className="section">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow">OBSERVATION</span>
                <h2>{o.h2}</h2>
                <p>{o.p}</p>
              </div>
              <div className="bento">
                <article className="cell span2">
                  <span className="ey">{o.trace.ey}</span>
                  <h3>{o.trace.h3}</h3>
                  <p>{o.trace.p}</p>
                  <div className="screen shot" role="img" aria-label={o.trace.aria}>
                    <Bar path="console.agent8 / observation / traces" />
                    <div className="pane">
                      <div className="row">
                        <span className="seg">
                          <span className="on">{o.trace.segAll}</span>
                          <span>api</span>
                          <span>test</span>
                          <span>eval</span>
                          <span>simulation</span>
                        </span>
                        <span className="t2">{o.trace.count}</span>
                      </div>
                      <table className="mini">
                        <thead>
                          <tr>
                            <th>{o.trace.heads[0]}</th>
                            <th>{o.trace.heads[1]}</th>
                            <th>{o.trace.heads[2]}</th>
                            <th>{o.trace.heads[3]}</th>
                            <th className="num">{o.trace.heads[4]}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {traces.map((t) => (
                            <tr key={t.time}>
                              <td className="m">{t.time}</td>
                              <td className="m">{t.who}</td>
                              <td>{t.src}</td>
                              <td>
                                <span className={chip(t.chip)}>{t.status}</span>
                              </td>
                              <td className="num">{t.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>
                <article className="cell">
                  <span className="ey">{o.cost.ey}</span>
                  <h3>{o.cost.h3}</h3>
                  <p>{o.cost.p}</p>
                  <div className="screen shot" role="img" aria-label={o.cost.aria}>
                    <div className="pane">
                      <span className="seg">
                        {o.cost.seg.map((s, i) => (
                          <span key={s} className={i === 1 ? "on" : undefined}>
                            {s}
                          </span>
                        ))}
                      </span>
                      {costBars.map((b) => (
                        <div className="hb" key={b.m}>
                          <span className="m">{b.m}</span>
                          <span className="trk">
                            <b style={{ left: 0, width: `${b.width}%` }} />
                          </span>
                          <span className="v">{b.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
              <div className="bento">
                <article className="cell pad">
                  <Icon>
                    <ellipse cx="10" cy="5" rx="6" ry="2.5" />
                    <path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" />
                  </Icon>
                  <h4>{o.small[0].h4}</h4>
                  <p>{o.small[0].p}</p>
                </article>
                <article className="cell pad">
                  <Icon>
                    <circle cx="10" cy="7" r="3" />
                    <path d="M4 17c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5" />
                  </Icon>
                  <h4>{o.small[1].h4}</h4>
                  <p>{o.small[1].p}</p>
                </article>
                <article className="cell pad">
                  <Icon>
                    <path d="M5 3h7l3 3v11H5z" />
                    <path d="M8 9h4M8 12h4" />
                  </Icon>
                  <h4>{o.small[2].h4}</h4>
                  <p>{o.small[2].p}</p>
                </article>
              </div>
            </div>
          </section>

          {/* Use cases */}
          <section className="section" id="uses">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow th">{c.uses.eyebrow}</span>
                <h2>{c.uses.h2}</h2>
              </div>
              <div className="uses">
                <article className="use">
                  <Icon>
                    <rect x="3" y="3" width="6" height="6" rx="1.5" />
                    <rect x="11" y="3" width="6" height="6" rx="1.5" />
                    <rect x="3" y="11" width="6" height="6" rx="1.5" />
                    <path d="M14 11v6M11 14h6" />
                  </Icon>
                  <h4>{c.uses.items[0].h4}</h4>
                  <p>{c.uses.items[0].p}</p>
                </article>
                <article className="use">
                  <Icon>
                    <path d="M4 4h12v9H8l-4 3z" />
                    <path d="M7 8h6M7 10.5h4" />
                  </Icon>
                  <h4>{c.uses.items[1].h4}</h4>
                  <p>{c.uses.items[1].p}</p>
                </article>
                <article className="use">
                  <Icon>
                    <circle cx="10" cy="10" r="7" />
                    <path d="M6.5 10.2l2.4 2.3 4.6-4.8" />
                  </Icon>
                  <h4>{c.uses.items[2].h4}</h4>
                  <p>{c.uses.items[2].p}</p>
                </article>
                <article className="use">
                  <Icon>
                    <rect x="4" y="9" width="12" height="8" rx="2" />
                    <path d="M7 9V6.5a3 3 0 016 0V9" />
                  </Icon>
                  <h4>{c.uses.items[3].h4}</h4>
                  <p>{c.uses.items[3].p}</p>
                </article>
              </div>
            </div>
          </section>

          {/* Packages */}
          <section className="section" id="plans">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow th">{p.eyebrow}</span>
                <h2>{p.h2}</h2>
                <p>{p.p}</p>
              </div>

              <div className="plans">
                <PlanCard plan="Gateway">
                  <div>
                    <div className="name">Gateway</div>
                    <div className="big">{p.gateway.big}</div>
                    <p className="for">{p.gateway.for}</p>
                  </div>
                  <PickButton plan="Gateway" className="btn">
                    {p.gateway.btn}
                  </PickButton>
                  <hr />
                  <div>
                    <div className="inc">{p.gateway.inc}</div>
                    <Ticks items={p.gateway.ticks} />
                  </div>
                </PlanCard>

                <PlanCard plan="Agent" rec>
                  <span className="badge">{p.agent.badge}</span>
                  <div>
                    <div className="name">Agent</div>
                    <div className="big">{p.agent.big}</div>
                    <p className="for">{p.agent.for}</p>
                  </div>
                  <a className="btn fill" href="#demo">
                    {c.bookDemo}
                  </a>
                  <hr />
                  <div>
                    <div className="inc">{p.agent.inc}</div>
                    <Ticks items={p.agent.ticks} />
                  </div>
                </PlanCard>

                <PlanCard plan="Dedicated">
                  <div>
                    <div className="name">Dedicated</div>
                    <div className="big cy">{p.dedicated.big}</div>
                    <p className="for">{p.dedicated.for}</p>
                  </div>
                  <PickButton plan="Dedicated" className="btn">
                    {p.dedicated.btn}
                  </PickButton>
                  <hr />
                  <div>
                    <div className="inc">{p.dedicated.inc}</div>
                    <Ticks items={p.dedicated.ticks} />
                  </div>
                </PlanCard>
              </div>
              <p className="plans-note">{p.note}</p>

              <h2 className="cmp-h">{p.cmpH}</h2>
              <div className="tscroll">
                <table className="cmp">
                  <thead>
                    <tr>
                      <th></th>
                      <th>
                        <span className="pn">Gateway</span>
                        <span className="pp">{p.cmpHead.gatewayPp}</span>
                        <PickButton plan="Gateway" className="btn sm">
                          {p.cmpHead.gatewayBtn}
                        </PickButton>
                      </th>
                      <th className="hl">
                        <span className="pn">Agent</span>
                        <span className="pp">{p.cmpHead.agentPp}</span>
                        <a className="btn sm fill" href="#demo">
                          {c.bookDemo}
                        </a>
                      </th>
                      <th>
                        <span className="pn">Dedicated</span>
                        <span className="pp">{p.cmpHead.dedicatedPp}</span>
                        <PickButton plan="Dedicated" className="btn sm">
                          {p.cmpHead.dedicatedBtn}
                        </PickButton>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.cmpRows.map((row) =>
                      row.group ? (
                        <tr className="g" key={row.label}>
                          <td>{row.label}</td>
                          <td></td>
                          <td className="hl"></td>
                          <td></td>
                        </tr>
                      ) : (
                        <tr key={row.label}>
                          <td>{row.label}</td>
                          {(row.cells ?? []).map((cell, i) => {
                            const isText = cell !== "y" && cell !== "x";
                            const cls = [i === 1 && "hl", isText && "t"].filter(Boolean).join(" ") || undefined;
                            return (
                              <td key={i} className={cls}>
                                {cell === "y" ? (
                                  <span className="y"><Check size={18} strokeWidth={1.75} aria-label="Included" /></span>
                                ) : cell === "x" ? (
                                  <span className="x"><Minus size={18} strokeWidth={1.75} aria-label="Not included" /></span>
                                ) : (
                                  cell
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="section">
            <div className="wrap">
              <div className="head">
                <span className="eyebrow th">{c.security.eyebrow}</span>
                <h2>{c.security.h2}</h2>
              </div>
              <div className="seals">
                {c.security.seals.map((s, i) => (
                  <article className="seal" key={s.h4}>
                    <span className="disc">
                      <span>
                        {seals[i].map((line, j) => (
                          <span key={line}>
                            {j > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </span>
                    </span>
                    <h4>{s.h4}</h4>
                    <p>{s.p}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Specs */}
          <section className="section" id="specs">
            <div className="wrap">
              <div className="head">
                <h2>{c.specs.h2}</h2>
              </div>
              <dl className="specs">
                {c.specs.items.map((s) => (
                  <div key={s.dt}>
                    <dt>{s.dt}</dt>
                    <dd>{rich(s.dd)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* FAQ */}
          <section className="section" id="faq">
            <div className="wrap">
              <div className="head">
                <h2>{c.faq.h2}</h2>
              </div>
              <div className="faq">
                {c.faq.items.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Demo */}
          <section className="section" id="demo">
            <div className="wrap">
              <div className="demo">
                <div>
                  <h2>{c.demo.h2}</h2>
                  <p>{c.demo.p}</p>
                </div>
                <ol>
                  {c.demo.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="wrap">
            <span>{c.footer.copy}</span>
            <span>{c.footer.note}</span>
          </div>
        </footer>

        <Dock
          ariaLabel={c.aria.dock}
          descs={p.desc}
          priceLabel={c.dock.priceLabel}
          price={c.dock.price}
          cta={c.bookDemo}
        />
      </PlanProvider>
    </div>
  );
}
