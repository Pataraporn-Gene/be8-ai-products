import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { hasLocale } from "@/lib/i18n";
import { content } from "./content";
import { Bars, I, JourneyNodes, Side, sx, Ticks } from "./mocks";
import { CompareTable, FinePrint, FootCur, PlanCards, PricingProvider, QuoteBar } from "./Pricing";
import { SecNav } from "./SecNav";
import { Sprite } from "./Sprite";
import { Stage } from "./Stage";
import { Tabs } from "./Tabs";
import "./pulse8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/pulse8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en/pulse8", th: "/th/pulse8" } },
  };
}

const navy = { color: "var(--navy)" };

export default async function Page({ params }: PageProps<"/[lang]/pulse8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];
  const sc = t.screens;
  const how = t.how;
  const more = t.more;

  const journeyPanel = (
    <>
      <Stage w={1120} h={620} label={sc.journey.label}>
        <div className="win">
          <Side on="journeys" t={t.side} />
          <div className="main">
            <div className="main-h">
              <h5>{sc.journey.title}</h5>
              <span className="chip ok">{sc.journey.active}</span>
              <span className="chip">{sc.journey.version}</span>
              <span className="spacer" />
              <span className="mini-btn">
                <I n="zap" />
                {sc.journey.simulate}
              </span>
              <span className="mini-btn">{sc.journey.history}</span>
              <span className="mini-btn fill">{sc.journey.edit}</span>
            </div>
            <div style={sx("display:flex;gap:14px;flex:1;min-height:0")}>
              <div
                className="canvas"
                style={sx("position:relative;inset:auto;flex:1;border:1px solid var(--line);border-radius:14px;overflow:hidden")}
              >
                <div style={sx("position:absolute;left:0;top:96px;width:900px;height:380px;transform:scale(.68);transform-origin:0 0")}>
                  <div className="canvas" style={sx("background:none")}>
                    <JourneyNodes t={t.canvas} sel />
                  </div>
                </div>
              </div>
              <div className="card" style={sx("width:250px;display:flex;flex-direction:column;gap:12px")}>
                <div>
                  <span className="node-t">
                    <I n="split" />
                    {sc.journey.nodeType}
                  </span>
                  <h6 style={sx("margin-top:8px;font-size:15px")}>{sc.journey.question}</h6>
                </div>
                <dl className="kv" style={sx("grid-template-columns:90px 1fr")}>
                  <dt>{sc.journey.basedOn}</dt>
                  <dd>{sc.journey.basedOnVal}</dd>
                  <dt>{sc.journey.within}</dt>
                  <dd>{sc.journey.withinVal}</dd>
                </dl>
                <div style={sx("border-top:1px solid var(--line);padding-top:10px")}>
                  <div className="muted" style={sx("font-size:11.5px;margin-bottom:6px")}>
                    {sc.journey.last30}
                  </div>
                  <div style={sx("display:flex;justify-content:space-between")}>
                    <span>{sc.journey.openedLine}</span>
                    <b className="num" style={navy}>
                      4,154
                    </b>
                  </div>
                  <div style={sx("height:6px;border-radius:9px;background:var(--sunken);margin:5px 0 10px")}>
                    <div style={sx("width:34%;height:100%;border-radius:9px;background:var(--cyan)")} />
                  </div>
                  <div style={sx("display:flex;justify-content:space-between")}>
                    <span>{sc.journey.notOpenedSms}</span>
                    <b className="num" style={navy}>
                      8,071
                    </b>
                  </div>
                  <div style={sx("height:6px;border-radius:9px;background:var(--sunken);margin-top:5px")}>
                    <div style={sx("width:66%;height:100%;border-radius:9px;background:#9aa3ad")} />
                  </div>
                </div>
                <div style={sx("border-top:1px solid var(--line);padding-top:10px")} className="muted">
                  {sc.journey.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Stage>
      <p className="screens-cap">{sc.journey.caption}</p>
    </>
  );

  const em = sc.email;
  const emailPanel = (
    <>
      <Stage w={1120} h={620} label={em.label}>
        <div className="win">
          <Side on="email" t={t.side} />
          <div className="main">
            <div className="main-h">
              <h5>{em.title}</h5>
              <span className="chip">{em.draft}</span>
              <span className="spacer" />
              <span className="mini-btn">{em.sendTest}</span>
              <span className="mini-btn fill">{em.schedule}</span>
            </div>
            <div style={sx("display:grid;grid-template-columns:1.25fr 1fr;gap:14px")}>
              <div style={sx("display:grid;gap:14px;align-content:start")}>
                <div className="card">
                  <h6>{em.recipients}</h6>
                  <dl className="kv">
                    <dt>{em.segment}</dt>
                    <dd>{em.segmentVal}</dd>
                    <dt>{em.total}</dt>
                    <dd className="num">{em.totalVal}</dd>
                    <dt>{em.deliverable}</dt>
                    <dd className="num">
                      <b>{em.deliverableVal}</b> <span className="muted">{em.deliverableNote}</span>
                    </dd>
                    <dt>{em.type}</dt>
                    <dd>{em.typeVal}</dd>
                  </dl>
                </div>
                <div className="card">
                  <h6>{em.subjectH}</h6>
                  <div className="rule" style={sx("margin-bottom:7px")}>
                    <span className="chip cy">A</span>
                    {em.subjectA}
                  </div>
                  <div className="rule">
                    <span className="chip cy">B</span>
                    {em.subjectB}
                  </div>
                  <div className="muted" style={sx("margin-top:8px")}>
                    {em.decided}
                  </div>
                </div>
                <div className="card" style={sx("display:flex;align-items:center;gap:12px")}>
                  <div style={sx("width:34px;height:20px;border-radius:99px;background:var(--action);position:relative;flex:none")}>
                    <i style={sx("position:absolute;right:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff")} />
                  </div>
                  <div>
                    <b style={navy}>{em.stoTitle}</b>
                    <div className="muted">{em.stoBody}</div>
                  </div>
                </div>
              </div>
              <div className="card" style={sx("align-self:start")}>
                <h6>{em.checksH}</h6>
                {em.checks.map((c) => (
                  <div className="check-row" key={c}>
                    <I n="check" />
                    <span>{c}</span>
                  </div>
                ))}
                <div className="check-row">
                  <I n="alert" style={sx("color:var(--warn)")} />
                  <span>
                    {em.altWarn} <span className="muted">{em.altWarnNote}</span>
                  </span>
                </div>
                {em.checks2.map((c) => (
                  <div className="check-row" key={c}>
                    <I n="check" />
                    <span>{c}</span>
                  </div>
                ))}
                <div style={sx("margin-top:12px;padding:10px 12px;border-radius:10px;background:var(--wash);color:var(--action)")}>
                  {em.passed}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Stage>
      <p className="screens-cap">{em.caption}</p>
    </>
  );

  const ln = sc.line;
  const linePanel = (
    <>
      <Stage w={1120} h={620} label={ln.label}>
        <div className="win">
          <Side on="messaging" t={t.side} />
          <div className="main">
            <div className="main-h">
              <h5>{ln.title}</h5>
              <span className="chip" style={sx("background:#e6f9ec;color:#067a2f")}>
                {ln.chip}
              </span>
              <span className="chip warn">{ln.pending}</span>
              <span className="spacer" />
              <span className="mini-btn">{ln.preview}</span>
              <span className="mini-btn fill">{ln.requestApproval}</span>
            </div>
            <div style={sx("display:grid;grid-template-columns:300px 1fr;gap:18px")}>
              <div style={sx("background:#8ea6c8;border-radius:22px;padding:16px 14px;height:500px")}>
                <div style={sx("text-align:center;color:#fff;font-size:11.5px;margin-bottom:12px")}>{ln.oaName}</div>
                <div style={sx("width:236px;background:#fff;border-radius:16px;overflow:hidden")}>
                  <div
                    style={sx(
                      "height:128px;background:#0a1f2e;color:#fff;padding:16px;display:flex;flex-direction:column;justify-content:flex-end",
                    )}
                  >
                    <div style={sx("font:700 26px var(--display);letter-spacing:-.02em")}>11.11</div>
                    <div style={sx("font-size:12px;color:#9eeaf5")}>{ln.memberDay}</div>
                  </div>
                  <div style={sx("padding:12px 14px")}>
                    <b style={sx("font-size:15px;color:var(--navy)")}>{ln.offer}</b>
                    <div className="muted" style={sx("font-size:12px;margin-top:3px")}>
                      {ln.offerBody}
                    </div>
                  </div>
                  <div style={sx("padding:0 14px 14px")}>
                    <div
                      style={sx(
                        "height:36px;border-radius:9px;background:#06c755;color:#fff;font-weight:600;display:grid;place-items:center",
                      )}
                    >
                      {ln.getCoupon}
                    </div>
                  </div>
                </div>
                <div
                  style={sx(
                    "margin-top:150px;display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:#fff;border-radius:10px;overflow:hidden;font-size:11px;text-align:center;color:var(--navy)",
                  )}
                >
                  {ln.menu.map((m) => (
                    <div key={m} style={sx("padding:12px 0;background:#f2f4f7")}>
                      {m}
                    </div>
                  ))}
                </div>
              </div>
              <div style={sx("display:grid;gap:14px;align-content:start")}>
                <div className="card">
                  <h6>{ln.deliveryH}</h6>
                  <dl className="kv">
                    <dt>{ln.oa}</dt>
                    <dd>{ln.oaVal}</dd>
                    <dt>{ln.sendTo}</dt>
                    <dd>{ln.sendToVal}</dd>
                    <dt>{ln.deliverable}</dt>
                    <dd className="num">
                      <b>{ln.deliverableVal}</b> <span className="muted">{ln.deliverableNote}</span>
                    </dd>
                    <dt>{ln.sendAt}</dt>
                    <dd>{ln.sendAtVal}</dd>
                  </dl>
                </div>
                <div className="card">
                  <h6>{ln.richH}</h6>
                  <div className="muted">{ln.richBody}</div>
                </div>
                <div className="card">
                  <h6>{ln.approvalH}</h6>
                  <div style={sx("display:grid;gap:6px")}>
                    <div className="check-row" style={sx("border:0;padding:0")}>
                      <I n="check" />
                      <span>{ln.created}</span>
                    </div>
                    <div className="check-row" style={sx("border:0;padding:0")}>
                      <I n="clock" style={sx("color:var(--warn)")} />
                      <span>{ln.waiting}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Stage>
      <p className="screens-cap">{ln.caption}</p>
    </>
  );

  const rp = sc.reports;
  const tableRows = [
    ["96,410", "99.8%", "—", "5.1%", "112"],
    ["71,385", "98.2%", "31.4%", "3.6%", "164"],
    ["16,435", "99.5%", "—", "2.0%", "38"],
  ];
  const reportsPanel = (
    <>
      <Stage w={1120} h={620} label={rp.label}>
        <div className="win">
          <Side on="insights" t={t.side} />
          <div className="main">
            <div className="main-h">
              <h5>{rp.title}</h5>
              <span className="spacer" />
              {rp.chips.map((c, i) => (
                <span key={i} className={i === 0 || i === 4 ? "chip cy" : "chip"}>
                  {c}
                </span>
              ))}
            </div>
            <div style={sx("display:grid;grid-template-columns:repeat(5,1fr);gap:16px")}>
              {rp.kpis.map((k) => (
                <div key={k.k} style={sx("border-top:2px solid var(--navy);padding-top:8px")}>
                  <div className="muted" style={sx("font-size:11.5px")}>
                    {k.k}
                  </div>
                  <div className="num" style={sx("font:600 26px var(--display);color:var(--navy)")}>
                    {k.v}
                  </div>
                  {k.sub ? (
                    <div className="muted" style={sx("font-size:11px")}>
                      {k.sub}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="card" style={sx("padding-bottom:8px")}>
              <h6>{rp.daily}</h6>
              <Bars />
            </div>
            <div className="card" style={sx("padding:4px 6px")}>
              <table className="mt">
                <thead>
                  <tr>
                    {rp.head.map((h, i) => (
                      <th key={h} className={i ? "r" : undefined}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r, i) => (
                    <tr key={i}>
                      <td>{rp.channels[i]}</td>
                      {r.map((v, j) => (
                        <td key={j} className="r">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Stage>
      <p className="screens-cap">{rp.caption}</p>
    </>
  );

  const pad18 = { width: 560, height: 300, padding: 18 };

  const s1 = how.s1;
  const codes = [
    <code key="a">first_name</code>,
    <Fragment key="b">
      <code>phone</code> <span className="muted">→ +66812345678</span>
    </Fragment>,
    <code key="c">email</code>,
    <code key="d">subscription.email</code>,
  ];
  const step1 = (
    <>
      <div>
        <h3>{s1.h3}</h3>
        <p>{s1.p}</p>
        <Ticks items={s1.ticks} />
      </div>
      <Stage w={560} h={300} label={s1.label} stageStyle={pad18}>
        <div style={sx("display:flex;align-items:center;gap:8px;margin-bottom:12px")}>
          <I n="file" style={sx("color:var(--action)")} />
          <b style={navy}>members_nov.xlsx</b>
          <span className="chip">{s1.rows}</span>
        </div>
        <table className="mt">
          <thead>
            <tr>
              {s1.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s1.cols.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td className="muted">{c.ex}</td>
                <td>{codes[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={sx("display:flex;gap:8px;margin-top:14px")}>
          <span className="chip ok">{s1.added}</span>
          <span className="chip cy">{s1.updated}</span>
          <span className="chip warn">{s1.skipped}</span>
        </div>
      </Stage>
    </>
  );

  const s2 = how.s2;
  const step2 = (
    <>
      <div>
        <h3>{s2.h3}</h3>
        <p>{s2.p}</p>
        <Ticks items={s2.ticks} />
      </div>
      <Stage w={560} h={300} label={s2.label} stageStyle={{ ...pad18, ...sx("display:grid;gap:10px;align-content:start") }}>
        <div style={sx("display:flex;align-items:center;gap:8px")}>
          <b style={sx("color:var(--navy);font-size:14px")}>{s2.title}</b>
          <span className="spacer" />
          <span className="chip cy num">{s2.count}</span>
        </div>
        <div className="group">
          <div className="group-h">{s2.all}</div>
          {s2.rules.map((r) => (
            <div className="rule" key={r.f}>
              {r.f} <span className="op">{r.op}</span>
              <span className="val">{r.v}</span>
            </div>
          ))}
          <div className="group" style={sx("background:var(--canvas)")}>
            <div className="group-h">{s2.any}</div>
            {s2.anyRules.map((r) => (
              <div className="rule" key={r.v}>
                {r.f} <span className="op">{r.op}</span>
                <span className="val">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </Stage>
    </>
  );

  const s3 = how.s3;
  const step3 = (
    <>
      <div>
        <h3>{s3.h3}</h3>
        <p>{s3.p}</p>
        <Ticks items={s3.ticks} />
      </div>
      <Stage w={560} h={300} label={s3.label} stageStyle={pad18}>
        <div style={sx("display:flex;align-items:center;gap:8px;margin-bottom:14px")}>
          <I n="layers" style={sx("color:var(--action)")} />
          <b style={sx("color:var(--navy);font-size:14px")}>{s3.title}</b>
          <span className="spacer" />
          <span className="chip ok">
            <I n="lock" />
            {s3.approved}
          </span>
        </div>
        <div style={sx("display:grid;gap:0")}>
          {s3.events.map((e, i) => (
            <div
              key={i}
              style={sx("display:grid;grid-template-columns:28px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)")}
            >
              <span className={i === 2 ? "chip ok" : "chip"} style={sx("width:24px;padding:0;justify-content:center")}>
                {i + 1}
              </span>
              <span>
                <b style={navy}>{e.who}</b>
                {e.what}
              </span>
              <span className="muted">{e.when}</span>
            </div>
          ))}
        </div>
        <div style={sx("margin-top:14px;padding:10px 12px;border-radius:10px;background:var(--canvas)")}>
          {s3.usedIn[0]}
          <b style={navy}>{s3.usedIn[1]}</b>
          {s3.usedIn[2]}
          <b style={navy}>{s3.usedIn[3]}</b>
        </div>
      </Stage>
    </>
  );

  const s4 = how.s4;
  const valColor = ["color:var(--ok-ink)", "color:var(--ok-ink)", "", "color:var(--danger-ink)"];
  const chipCls = ["chip ok", "chip", "chip", "chip ok"];
  const step4 = (
    <>
      <div>
        <h3>{s4.h3}</h3>
        <p>{s4.p}</p>
        <Ticks items={s4.ticks} />
      </div>
      <Stage w={560} h={300} label={s4.label} stageStyle={pad18}>
        <b style={sx("color:var(--navy);font-size:14px")}>{s4.title}</b>
        <table className="mt" style={sx("margin-top:10px")}>
          <thead>
            <tr>
              <th>{s4.head[0]}</th>
              <th className="r">{s4.head[1]}</th>
              <th>{s4.head[2]}</th>
            </tr>
          </thead>
          <tbody>
            {s4.rows.map((r, i) => (
              <tr key={i}>
                <td>{r.t}</td>
                <td className="r" style={valColor[i] ? sx(valColor[i]) : undefined}>
                  {r.v}
                </td>
                <td>
                  <span className={chipCls[i]}>{r.c}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted" style={sx("margin-top:12px")}>
          {s4.note}
        </div>
      </Stage>
    </>
  );

  const eventChip = ["chip cy", "chip warn", "chip ok"];
  const swatch = ["#e8dccb", "#d6e4ea", "#ecebe4"];
  const caseIcons = ["mega", "route", "brief", "shield"];
  const secIcons = ["shield", "file", "lock", "key"];

  return (
    <div className="p-pulse8">
      <Sprite />
      <PricingProvider t={t.pricing}>
        <header className="site">
          <div className="wrap">
            <Link className="brand" href={`/${lang}`} id="top">
              <span className="brand-mark">
                <svg viewBox="0 0 24 24">
                  <use href="#p8-i-pulse" />
                </svg>
              </span>
              Pulse8
            </Link>
            <nav aria-label={t.header.navLabel}>
              <a href="#features">{t.header.nav.features}</a>
              <a href="#cases">{t.header.nav.cases}</a>
              <a href="#plans">{t.header.nav.plans}</a>
              <a href="#faq">{t.header.nav.faq}</a>
            </nav>
            <span className="site-meta">{t.header.meta}</span>
            <LangSwitch lang={lang} path="/pulse8" dark={false} />
          </div>
        </header>

        <main>
          <section className="hero" id="hero">
            <div className="wrap">
              <div>
                <h1>
                  {t.hero.title} <em>{t.hero.accent}</em>
                </h1>
                <p className="hero-lede">{t.hero.lede}</p>
                <div className="hero-cta">
                  <a className="btn btn-primary" href="#features">
                    {t.hero.ctaPrimary}
                  </a>
                  <a className="btn btn-outline" href="#plans">
                    {t.hero.ctaSecondary}
                  </a>
                </div>
                <Ticks items={t.hero.ticks} />
              </div>

              <div className="shot hero-shot">
                <span className="pill-float">{t.hero.pill}</span>
                <Stage w={700} h={380} label={t.hero.stageLabel}>
                  <div className="canvas">
                    <JourneyNodes t={t.canvas} />
                  </div>
                </Stage>
                <div className="check-float" aria-label={t.hero.checkLabel}>
                  <h4>{t.hero.checkTitle}</h4>
                  {t.hero.checks.map(([a, b, c]) => (
                    <div className="check-row" key={b}>
                      <I n="check" />
                      <span>
                        {a}
                        <b>{b}</b>
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="facts">
            <div className="wrap">
              <div className="facts-grid">
                {t.facts.map((f) => (
                  <div key={f.h}>
                    <h3>{f.h}</h3>
                    <p>{f.p}</p>
                  </div>
                ))}
              </div>
              <p className="footnote">{t.footnote}</p>
            </div>
          </div>

          <div className="marquee" aria-label={t.marquee.label}>
            <div className="marquee-track">
              <ul>
                {t.marquee.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <ul aria-hidden="true">
                {t.marquee.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* screens */}
          <section className="block" aria-labelledby="screensH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="screensH">{sc.h2}</h2>
              </div>
              <div className="shot screens">
                <Tabs
                  ariaLabel={sc.tablistLabel}
                  headClassName="screens-head"
                  listClassName="tabs"
                  tabs={[
                    { id: "t-j", panelId: "p-j", label: sc.tabs.j },
                    { id: "t-e", panelId: "p-e", label: sc.tabs.e },
                    { id: "t-l", panelId: "p-l", label: sc.tabs.l },
                    { id: "t-r", panelId: "p-r", label: sc.tabs.r },
                  ]}
                  panels={[journeyPanel, emailPanel, linePanel, reportsPanel]}
                />
              </div>
            </div>
          </section>

          <SecNav
            label={t.secnav.label}
            links={[
              { href: "#features", text: t.secnav.links.features },
              { href: "#cases", text: t.secnav.links.cases },
              { href: "#plans", text: t.secnav.links.plans },
              { href: "#security", text: t.secnav.links.security },
              { href: "#specs", text: t.secnav.links.specs },
              { href: "#faq", text: t.secnav.links.faq },
            ]}
          />

          {/* how it works */}
          <section className="block" id="features" aria-labelledby="howH" style={{ paddingTop: 80 }}>
            <div className="wrap">
              <div className="sec-h">
                <h2 id="howH">{how.h2}</h2>
              </div>
              <Tabs
                ariaLabel={how.tablistLabel}
                listClassName="steps-tabs"
                panelClassName="step-panel"
                tabs={how.steps.map((s, i) => ({
                  id: `t-s${i + 1}`,
                  panelId: `p-s${i + 1}`,
                  label: (
                    <>
                      <small>{`0${i + 1}`}</small>
                      {s}
                    </>
                  ),
                }))}
                panels={[step1, step2, step3, step4]}
              />
            </div>
          </section>

          {/* beyond sending */}
          <section className="block" aria-labelledby="moreH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="moreH">{more.h2}</h2>
              </div>
              <div className="bento">
                <article>
                  <h3>
                    <span>{more.sales.tag}</span>
                    {more.sales.h3}
                  </h3>
                  <p>{more.sales.p}</p>
                  <Stage w={640} h={250} label={more.sales.label} stageStyle={{ padding: 18 }}>
                    <div style={sx("display:flex;align-items:center;gap:8px;margin-bottom:12px")}>
                      <b style={sx("color:var(--navy);font-size:14px")}>{more.sales.title}</b>
                      <span className="chip cy">{more.sales.chip}</span>
                      <span className="spacer" />
                      <span className="mini-btn fill">{more.sales.send}</span>
                    </div>
                    <div style={sx("display:grid;grid-template-columns:1fr 220px;gap:14px")}>
                      <div>
                        <div className="muted" style={sx("font-size:11.5px;margin-bottom:5px")}>
                          {more.sales.noteLabel}
                        </div>
                        <div
                          style={sx(
                            "border:1px solid var(--cyan);box-shadow:0 0 0 3px var(--rule);border-radius:10px;padding:10px 12px;min-height:120px;color:var(--navy)",
                          )}
                        >
                          {more.sales.note}
                        </div>
                      </div>
                      <div style={sx("display:grid;gap:6px;align-content:start")}>
                        <div className="muted" style={sx("font-size:11.5px")}>
                          {more.sales.mine}
                        </div>
                        {more.sales.people.map((n) => (
                          <div className="rule" key={n}>
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Stage>
                </article>
                <article className="tall">
                  <h3>
                    <span>{more.web.tag}</span>
                    {more.web.h3}
                  </h3>
                  <p>{more.web.p}</p>
                  <Stage w={420} h={640} label={more.web.label} stageStyle={{ padding: 20 }}>
                    <div style={sx("display:flex;align-items:center;gap:8px")}>
                      <I n="globe" style={sx("color:var(--action)")} />
                      <b style={navy}>{more.web.title}</b>
                    </div>
                    <div style={sx("margin-top:10px;display:grid;gap:0")}>
                      {more.web.events.map((e, i) => (
                        <div key={i} style={sx("display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)")}>
                          <span className={eventChip[i]}>{e.k}</span>
                          <span style={navy}>{e.item}</span>
                          <span className="muted spacer">{e.when}</span>
                        </div>
                      ))}
                    </div>
                    <div style={sx("margin-top:22px;border:1px solid var(--line);border-radius:14px;padding:16px")}>
                      <div style={sx("text-align:center;font:600 16px var(--display);color:var(--navy)")}>{more.web.recTitle}</div>
                      <div style={sx("text-align:center;margin-top:6px")}>
                        <span className="chip cy">{more.web.recipe}</span>
                      </div>
                      <div style={sx("display:grid;gap:10px;margin-top:14px")}>
                        {more.web.products.map((p, i) => (
                          <div
                            key={i}
                            style={sx(
                              "display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:8px",
                            )}
                          >
                            <div style={{ height: 56, borderRadius: 9, background: swatch[i] }} />
                            <div>
                              <b style={navy}>{p.name}</b>
                              <div className="muted">{p.sub}</div>
                            </div>
                            <b className="num" style={navy}>
                              {p.price}
                            </b>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Stage>
                </article>
                <article>
                  <h3>
                    <span>{more.integ.tag}</span>
                    {more.integ.h3}
                  </h3>
                  <p>{more.integ.p}</p>
                  <Stage w={640} h={250} label={more.integ.label} stageStyle={{ padding: "14px 18px" }}>
                    <table className="mt">
                      <thead>
                        <tr>
                          {more.integ.head.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {more.integ.rows.map((r) => (
                          <tr key={r.n}>
                            <td>
                              <b>{r.n}</b>
                            </td>
                            <td className="muted">{r.u}</td>
                            <td>
                              <span className="chip ok">{more.integ.active}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Stage>
                </article>
              </div>
            </div>
          </section>

          {/* use cases */}
          <section className="block" id="cases" aria-labelledby="casesH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="casesH">{t.cases.h2}</h2>
              </div>
              <div className="cases">
                {t.cases.items.map((c, i) => (
                  <article key={c.h}>
                    <div className="ico">
                      <I n={caseIcons[i]} />
                    </div>
                    <h3>{c.h}</h3>
                    <p>{c.p}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* plans */}
          <section className="block" id="plans" aria-labelledby="plansH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="plansH" tabIndex={-1}>
                  {t.plans.h2}
                </h2>
                <p>{t.plans.p}</p>
              </div>
              <PlanCards />
              <FinePrint />

              <h3 className="compare-h">{t.plans.compareH}</h3>
              <div className="table-scroll">
                <CompareTable />
              </div>
            </div>
          </section>

          {/* security */}
          <section className="block" id="security" aria-labelledby="secH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="secH">{t.security.h2}</h2>
              </div>
              <div className="sec-grid">
                {t.security.items.map((s, i) => (
                  <div key={s.h}>
                    <span className="ico">
                      <I n={secIcons[i]} />
                    </span>
                    <div>
                      <h3>{s.h}</h3>
                      <p>{s.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* specs */}
          <section className="block" id="specs" aria-labelledby="specsH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="specsH">{t.specs.h2}</h2>
              </div>
              <dl className="specs">
                {t.specs.items.map(({ dt, dd: [a, code, b] }) => (
                  <div key={dt} style={{ display: "contents" }}>
                    <dt>{dt}</dt>
                    <dd>
                      {a}
                      {code ? <code>{code}</code> : null}
                      {b}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* faq */}
          <section className="block" id="faq" aria-labelledby="faqH">
            <div className="wrap">
              <div className="sec-h">
                <h2 id="faqH">{t.faq.h2}</h2>
              </div>
              <div className="faq">
                {t.faq.items.map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>
                      {f.q}
                      <I n="plus" />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="wrap">
            <span>{t.footer}</span>
            <span>
              <FootCur />
            </span>
          </div>
        </footer>

        <QuoteBar />
      </PricingProvider>
    </div>
  );
}
