/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";
import { content } from "./content";
import {
  BuyBar,
  CompareTable,
  CurrencyCode,
  FootCurrency,
  PlanCards,
  PricingProvider,
  ScrollProgress,
} from "./Pricing";
import { ScreenSwitcher, Tour } from "./Showcase";
import "./insight8.css";

const IMG = "/products/insight8/";

export async function generateMetadata({ params }: PageProps<"/[lang]/insight8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en/insight8", th: "/th/insight8" } },
  };
}

const CASE_ICONS = [
  <svg key="0" viewBox="0 0 24 24" strokeWidth="1.75">
    <path d="M4 19V10M10 19V5M16 19v-6M22 19H2"></path>
  </svg>,
  <svg key="1" viewBox="0 0 24 24" strokeWidth="1.75">
    <path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1"></path>
    <circle cx="12" cy="14" r="5"></circle>
  </svg>,
  <svg key="2" viewBox="0 0 24 24" strokeWidth="1.75">
    <ellipse cx="12" cy="6" rx="7" ry="3"></ellipse>
    <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path>
  </svg>,
  <svg key="3" viewBox="0 0 24 24" strokeWidth="1.75">
    <path d="M4 5h16v11H8l-4 4z"></path>
    <path d="M8 9h8M8 12h5"></path>
  </svg>,
];

const TRUST_ICONS = [
  <svg key="0" viewBox="0 0 24 24" strokeWidth="1.75">
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"></path>
  </svg>,
  <svg key="1" viewBox="0 0 24 24" strokeWidth="1.75">
    <ellipse cx="12" cy="6" rx="7" ry="3"></ellipse>
    <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"></path>
    <path d="M3 3l18 18"></path>
  </svg>,
  <svg key="2" viewBox="0 0 24 24" strokeWidth="1.75">
    <rect x="4" y="10" width="16" height="11" rx="2"></rect>
    <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
  </svg>,
  <svg key="3" viewBox="0 0 24 24" strokeWidth="1.75">
    <path d="M9 12l2 2 4-4"></path>
    <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"></path>
  </svg>,
];

export default async function Page({ params }: PageProps<"/[lang]/insight8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];
  // Thai eyebrows drop the uppercase tracking, as in the source.
  const eb = "eyebrow" + (lang === "th" ? " th" : "");

  return (
    <PricingProvider t={t}>
        <header className="top">
          <div className="wrap">
            <a className="brand" href="#top">
              <span className="brand-mark" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M3 13V9M8 13V5M13 13V3" stroke="var(--cyan-400)" strokeWidth="1.75" strokeLinecap="round"></path>
                </svg>
              </span>
              Insight8 Studio
            </a>
            <nav className="menu" aria-label={t.header.menuAria}>
              <a href="#features">{t.header.menu.features}</a>
              <a href="#cases">{t.header.menu.cases}</a>
              <a href="#plans">{t.header.menu.plans}</a>
              <a href="#faq">{t.header.menu.faq}</a>
            </nav>
            <span className="top-right">
              <CurrencyCode />
              <LangSwitch lang={lang} path="/insight8" dark={false} />
            </span>
          </div>
        </header>

        <main id="top">
          <div className="wrap">
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">{t.hero.eyebrow}</p>
                <h1>
                  {t.hero.h1} <em>{t.hero.h1em}</em>
                </h1>
                <p className="lead">{t.hero.lead}</p>
                <div className="cta-row">
                  <a className="btn btn-primary" href="#features">
                    {t.hero.cta1}
                  </a>
                  <a className="btn btn-ghost" href="#plans">
                    {t.hero.cta2}
                  </a>
                </div>
                <ul className="mini">
                  {t.hero.mini.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="hero-visual">
                <figure className="shot hero-main">
                  <img src={IMG + "hero-dash.jpg"} alt={t.hero.dashAlt} width={910} height={755} />
                </figure>
                <figure className="float-card">
                  <figcaption>{t.hero.floatCap}</figcaption>
                  <img src={IMG + "hero-ask.jpg"} alt={t.hero.askAlt} width={550} height={136} />
                </figure>
                <span className="float-pill">
                  <i aria-hidden="true"></i>
                  {t.hero.pill}
                </span>
              </div>
            </section>

            <div className="facts">
              {t.facts.map((f, i) => (
                <div className="fact" key={i}>
                  <b>{f.b}</b>
                  <span>{f.span}</span>
                </div>
              ))}
            </div>
            <p className="shot-note">{t.shotNote}</p>
          </div>

          <div className="mq" aria-hidden="true">
            <div className="mq-track">
              {t.marquee.concat(t.marquee).map((x, i) => (
                <span key={i} className={i >= t.marquee.length ? "dup" : undefined}>
                  {x}
                </span>
              ))}
            </div>
          </div>
          <ScrollProgress />

          <section className="hv-sec wrap" id="tryit">
            <div className="s-head">
              <p className={eb}>{t.tryit.eyebrow}</p>
              <h2>{t.tryit.h2}</h2>
            </div>
            <ScreenSwitcher screens={t.tryit.screens} tabsAria={t.tryit.tabsAria} />
          </section>

          <nav className="tabs" aria-label={t.sectionNav.aria}>
            <div className="wrap">
              <a href="#features">{t.sectionNav.features}</a>
              <a href="#cases">{t.sectionNav.cases}</a>
              <a href="#plans">{t.sectionNav.plans}</a>
              <a href="#spec">{t.sectionNav.spec}</a>
              <a href="#faq">{t.sectionNav.faq}</a>
            </div>
          </nav>

          <section className="section wrap" id="features">
            <div className="s-head">
              <p className={eb}>{t.features.eyebrow}</p>
              <h2>{t.features.h2}</h2>
            </div>
            <Tour steps={t.features.steps} stepsAria={t.features.stepsAria} />
          </section>

          <section className="section wrap" id="more">
            <div className="s-head">
              <p className={eb}>{t.more.eyebrow}</p>
              <h2>{t.more.h2}</h2>
            </div>
            <div className="bento">
              <article className="card c-chat">
                <div>
                  <p className="k">{t.more.chat.k}</p>
                  <h3>{t.more.chat.h}</h3>
                  <p>{t.more.chat.p}</p>
                </div>
                <div className="card-media">
                  <img src={IMG + "bento-chat.jpg"} alt={t.more.chat.alt} width={740} height={235} />
                </div>
              </article>
              <article className="card c-pulse">
                <div>
                  <p className="k">{t.more.pulse.k}</p>
                  <h3>{t.more.pulse.h}</h3>
                  <p>{t.more.pulse.p}</p>
                </div>
                <div className="card-media">
                  <img src={IMG + "bento-pulse.jpg"} alt={t.more.pulse.alt} width={392} height={746} />
                </div>
              </article>
              <article className="card c-conn">
                <div>
                  <p className="k">{t.more.conn.k}</p>
                  <h3>{t.more.conn.h}</h3>
                  <p>{t.more.conn.p}</p>
                </div>
                <div className="card-media">
                  <img src={IMG + "bento-conn.jpg"} alt={t.more.conn.alt} width={838} height={440} />
                </div>
              </article>
            </div>
          </section>

          <section className="section wrap" id="cases">
            <div className="s-head">
              <h2>{t.cases.h2}</h2>
            </div>
            <div className="cases">
              {t.cases.items.map((c, i) => (
                <article className="case" key={i}>
                  <span className="case-ico" aria-hidden="true">
                    {CASE_ICONS[i]}
                  </span>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section wrap" id="plans">
            <div className="s-head">
              <p className={eb}>{t.plans.eyebrow}</p>
              <h2>{t.plans.h2}</h2>
              <p>{t.plans.p}</p>
            </div>
            <PlanCards />

            <div className="s-head ct-head">
              <h2>{t.compare.h2}</h2>
              <p className="ct-hint">{t.compare.hint}</p>
            </div>
            <CompareTable />
          </section>

          <section className="section wrap" id="trust">
            <div className="s-head">
              <p className={eb}>{t.trust.eyebrow}</p>
              <h2>{t.trust.h2}</h2>
            </div>
            <div className="trust">
              {t.trust.items.map((x, i) => (
                <div key={i}>
                  <i aria-hidden="true">{TRUST_ICONS[i]}</i>
                  <b>{x.b}</b>
                  <span>{x.span}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="section wrap" id="spec">
            <div className="s-head">
              <h2>{t.spec.h2}</h2>
            </div>
            <dl className="spec">
              {t.spec.rows.map((r, i) => (
                <div key={i}>
                  <dt>{r.dt}</dt>
                  <dd>{r.dd}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="section wrap" id="faq">
            <div className="s-head">
              <h2>{t.faq.h2}</h2>
            </div>
            <div className="faq">
              {t.faq.items.map((f, i) => (
                <details key={i} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <footer className="wrap foot">
            <span>
              {t.footer.copy}
            </span>
            <FootCurrency />
          </footer>
        </main>

      <BuyBar />
    </PricingProvider>
  );
}
