/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { hasLocale } from "@/lib/i18n";
import { content } from "./content";
import { HeroStage } from "./HeroStage";
import { Icon } from "./icons";
import { MapScene } from "./MapScene";
import { CharacterCast, NavHeader, OfficeShowcase, StatusCard, TemplatePicker } from "./widgets";
import "./space8.css";

const MARK = "/products/space8/mark.png";

export async function generateMetadata({ params }: PageProps<"/[lang]/space8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = content[lang];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { languages: { en: "/en/space8", th: "/th/space8" } },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/space8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = content[lang];
  const plans = [
    { p: c.pricing.standard, rec: true, talk: false, href: "#start" },
    { p: c.pricing.premium, rec: false, talk: false, href: "#start" },
    { p: c.pricing.custom, rec: false, talk: true, href: "#faq" },
  ];
  const stepTags = ["y", "b", "g"];
  const flowIcons = ["door", "mic", "sparkles"] as const;

  return (
    <div className="p-space8">
      <NavHeader>
        <div className="wrap">
          <a className="brand" href="#top" aria-label={c.nav.homeLabel}>
            <img src={MARK} alt="" />
            Space8
          </a>
          <a className="news" href="#brain">
            {c.nav.news}
          </a>
          <nav className="nav-links" aria-label={c.nav.menuLabel}>
            <a href="#office">{c.nav.links.office}</a>
            <a href="#templates">{c.nav.links.templates}</a>
            <a href="#pricing">{c.nav.links.pricing}</a>
            <a href="#faq">{c.nav.links.faq}</a>
          </nav>
          <div className="nav-cta">
            <LangSwitch lang={lang} path="/space8" />
            <a className="btn btn-sm btn-ghost login" href="#start">
              {c.nav.login}
            </a>
            <a className="btn btn-sm btn-ink" href="#start">
              {c.nav.cta}
            </a>
          </div>
        </div>
      </NavHeader>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1>
                {c.hero.h1a}
                <span className="accent-word">{c.hero.h1accent}</span>
                {c.hero.h1b}
              </h1>
              <p className="lede">{c.hero.lede}</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#start">
                  {c.hero.ctaPrimary}
                </a>
                <a className="btn btn-ghost" href="#office">
                  {c.hero.ctaTour}
                </a>
              </div>
              <ul className="facts">
                {c.hero.facts.map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <HeroStage t={c.stage} scene={c.scene} />
          </div>

          <div className="wrap strip">
            <p>{c.strip.title}</p>
            <div className="logos">
              <span>
                <Icon name="calendar" />
                Google Calendar
              </span>
              <span>
                <Icon name="sparkles" />
                Meet8
              </span>
              <span>
                <Icon name="message" />
                Collab8
              </span>
              <span>
                <Icon name="lock" />
                Google Workspace
              </span>
            </div>
          </div>
        </section>

        <section className="sec" id="office">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{c.office.eyebrow}</span>
              <h2>{c.office.h2}</h2>
              <p className="lede">{c.office.lede}</p>
            </div>
            <OfficeShowcase t={c.office} scene={c.scene} />
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>{c.compare.h2}</h2>
              <p className="lede">{c.compare.lede}</p>
            </div>
            <div className="compare">
              <div className="cmp old">
                <div className="cmp-body">
                  <div className="cmp-title">
                    <span className="ic">
                      <Icon name="users" />
                    </span>
                    {c.compare.oldTitle}
                  </div>
                  <ul>
                    {c.compare.oldItems.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="cal" aria-hidden="true">
                  <div className="hrs">
                    <span>09:00</span>
                    <span>10:00</span>
                    <span>11:00</span>
                    <span>12:00</span>
                  </div>
                  <div className="col">
                    <div className="ev" style={{ top: 6, height: 92 }}>
                      {c.compare.events[0]}
                    </div>
                    <div className="ev hot" style={{ top: 114, height: 42 }}>
                      {c.compare.events[1]}
                    </div>
                    <div className="ev" style={{ top: 162, height: 42 }}>
                      {c.compare.events[2]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cmp new">
                <div className="cmp-body">
                  <div className="cmp-title">
                    <img src={MARK} alt="" />
                    {c.compare.newTitle}
                  </div>
                  <ul>
                    {c.compare.newItems.map(([a, em, b], i) => (
                      <li key={i}>
                        {a}
                        {em ? <em>{em}</em> : null}
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="cmp-map">
                  <MapScene
                    view={[410, 520, 520, 300]}
                    strings={c.scene}
                    ariaLabel={c.compare.sceneLabel}
                    cast="duo"
                    fill
                    talking={{ id: "mind", key: "duo" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{c.focus.eyebrow}</span>
              <h2>{c.focus.h2}</h2>
              <p className="lede">{c.focus.lede}</p>
            </div>
            <div className="cards3">
              <article className="card">
                <div className="mini">
                  <span className="ghost-chip">
                    <Icon name="ghost" />
                    {c.focus.ghostChip}
                  </span>
                  <div className="mini-ghost" aria-hidden="true">
                    <span className="gst" style={{ backgroundPosition: "-64px -128px" }} />
                    <span className="gst g" style={{ backgroundPosition: "-256px 0" }} />
                    <span className="gst" style={{ backgroundPosition: "-448px -192px" }} />
                  </div>
                  <span className="kbd">
                    {c.focus.press} <kbd>G</kbd>
                  </span>
                </div>
                <h3>{c.focus.ghostTitle}</h3>
                <p>{c.focus.ghostBody}</p>
              </article>
              <article className="card">
                <div className="mini">
                  <div className="talk-card">
                    <div className="talk-avs" aria-hidden="true">
                      <span style={{ backgroundPosition: "0% 20%" }} />
                      <span style={{ backgroundPosition: "0% 40%" }} />
                      <span style={{ backgroundPosition: "0% 100%" }} />
                    </div>
                    <b>{c.focus.talkLine}</b>
                    <div className="talk-btns">
                      <span>
                        <Icon name="lock" />
                        {c.focus.talkPrivate}
                      </span>
                      <span>
                        <Icon name="users" />
                        {c.focus.talkPeople}
                      </span>
                    </div>
                  </div>
                </div>
                <h3>{c.focus.talkTitle}</h3>
                <p>{c.focus.talkBody}</p>
              </article>
              <article className="card">
                <div className="mini">
                  <StatusCard statuses={c.focus.statuses} notes={c.focus.notes} />
                </div>
                <h3>{c.focus.statusTitle}</h3>
                <p>{c.focus.statusBody}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="sec" id="templates">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{c.templates.eyebrow}</span>
              <h2>{c.templates.h2}</h2>
              <p className="lede">{c.templates.lede}</p>
            </div>
            <TemplatePicker t={c.templates} />
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <div className="avs">
              <div className="avs-copy">
                <span className="eyebrow" style={{ justifySelf: "start" }}>
                  {c.avatars.eyebrow}
                </span>
                <h2>{c.avatars.h2}</h2>
                <p>{c.avatars.body}</p>
                <ul className="slots">
                  {c.avatars.slots.map((s, i) => (
                    <li key={s}>
                      <b>{String(i + 1).padStart(2, "0")}</b>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <CharacterCast names={c.scene.n} />
            </div>
          </div>
        </section>

        <section className="sec" id="brain">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{c.brain.eyebrow}</span>
              <h2>{c.brain.h2}</h2>
              <p className="lede">{c.brain.lede}</p>
            </div>
            <div className="duo">
              <article className="card">
                <span className="pill ok">
                  <Icon name="check" />
                  {c.brain.recPill}
                </span>
                <h3>{c.brain.recTitle}</h3>
                <p>{c.brain.recBody}</p>
                <div className="flow">
                  {c.brain.flow.map((f, i) => (
                    <div key={f.title}>
                      <Icon name={flowIcons[i]} />
                      <b>{f.title}</b>
                      {f.body}
                    </div>
                  ))}
                </div>
                <p className="fine">{c.brain.recFine}</p>
              </article>
              <article className="card">
                <span className="pill part">
                  <Icon name="sparkles" />
                  {c.brain.agentPill}
                </span>
                <h3>{c.brain.agentTitle}</h3>
                <p>{c.brain.agentBody}</p>
                <div className="vis">
                  {(["private", "visible", "shared"] as const).map((k) => (
                    <div key={k}>
                      <code>{k}</code>
                      <span>{c.brain.vis[k]}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="sec" id="start">
          <div className="wrap">
            <div className="start">
              <div className="start-copy">
                <span className="eyebrow">{c.start.eyebrow}</span>
                <h2>{c.start.h2}</h2>
                <p className="lede">{c.start.lede}</p>
                <a className="btn btn-primary" href="#pricing">
                  {c.start.cta}
                </a>
              </div>
              <div className="steps">
                {c.start.steps.map((s, i) => (
                  <div className="step" key={s.title}>
                    <span className={`tagc ${stepTags[i]}`}>{s.tag}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                ))}
                <div className="foot">
                  <a className="btn btn-ghost" href="#pricing">
                    {c.start.seePlans}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sec" id="pricing">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{c.pricing.eyebrow}</span>
              <h2>{c.pricing.h2}</h2>
              <p className="lede">{c.pricing.lede}</p>
            </div>
            <div className="plans">
              {plans.map(({ p, rec, talk, href }) => (
                <article className={"plan" + (rec ? " rec" : "")} key={p.name}>
                  {rec ? <span className="badge">{c.pricing.recommended}</span> : null}
                  <div>
                    <h3>{p.name}</h3>
                    <p className="for">{p.for}</p>
                  </div>
                  {talk ? (
                    <div className="price talk">
                      <b>{p.price}</b>
                    </div>
                  ) : (
                    <div className="price">
                      <b>{p.price}</b>
                      <span>{c.pricing.perPerson}</span>
                    </div>
                  )}
                  <ul>
                    {p.items.map((x) => (
                      <li key={x}>
                        <Icon name="check" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <a className={"btn " + (rec ? "btn-primary" : "btn-ghost")} href={href}>
                    {p.cta}
                  </a>
                </article>
              ))}
            </div>
            <p className="note">
              <b>{c.pricing.noteBold}</b>
              {c.pricing.noteRest}
            </p>
          </div>
        </section>

        <section className="sec" id="faq">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">{c.faq.eyebrow}</span>
              <h2>{c.faq.h2}</h2>
            </div>
            <div className="faq">
              {c.faq.items.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    {f.q}
                    <span className="chev">
                      <Icon name="chev" />
                    </span>
                  </summary>
                  <div className="ans">
                    {f.a.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            <div className="help">
              <span>{c.faq.help}</span>
              <a className="btn btn-sm btn-ghost" href="#start">
                {c.faq.helpCta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="closing">
        <div className="closing-in">
          <div className="closing-hero">
            <h2>{c.closing.h2}</h2>
            <p className="lede">{c.closing.lede}</p>
            <a className="btn btn-primary" href="#start">
              {c.closing.cta}
            </a>
          </div>
          <div className="foot-grid">
            <div className="foot-brand">
              <a className="brand" href="#top">
                <img src={MARK} alt="" />
                Space8
              </a>
              <p>{c.closing.byline}</p>
            </div>
            <div>
              <h4>{c.closing.product}</h4>
              <ul>
                <li>
                  <a href="#office">{c.closing.productLinks.office}</a>
                </li>
                <li>
                  <a href="#templates">{c.closing.productLinks.templates}</a>
                </li>
                <li>
                  <a href="#pricing">{c.closing.productLinks.pricing}</a>
                </li>
                <li>
                  <a href="#brain">{c.closing.productLinks.brain}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>{c.closing.helpTitle}</h4>
              <ul>
                <li>
                  <a href="#faq">{c.closing.helpLinks.faq}</a>
                </li>
                <li>
                  <a href="#start">{c.closing.helpLinks.start}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>BE8</h4>
              <ul>
                <li>
                  <a href="#brain">Meet8</a>
                </li>
                <li>
                  <a href="#top">Collab8</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="copy">
            <span>{c.closing.copyright}</span>
            <span>{c.closing.sample}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
