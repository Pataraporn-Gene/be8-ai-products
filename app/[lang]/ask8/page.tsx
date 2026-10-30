/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { hasLocale } from "@/lib/i18n";
import { content } from "./content";
import { DemoTour, ScreenSwitcher } from "./Interactive";
import "./ask8.css";

const IMG = "/products/ask8/";

export async function generateMetadata({ params }: PageProps<"/[lang]/ask8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en/ask8", th: "/th/ask8" } },
  };
}

const CASE_ICONS = [
  <path key="0" d="M3 5h18l-7 8v6l-4 2v-8z" />,
  <path key="1" d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6zM9 12l2 2 4-4" />,
  <g key="2">
    <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </g>,
  <path key="3" d="M4 20h16M6 16V9l6-5 6 5v7M10 16v-4h4v4" />,
];

export default async function Page({ params }: PageProps<"/[lang]/ask8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];
  const eb = "eyebrow" + (lang === "th" ? " th" : "");

  return (
    <div className="p-ask8">
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Ask8">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="#0A1F2E" />
              <path d="M9 11.5h10a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-5l-3.5 3v-3H9a2 2 0 0 1-2-2v-4.5a2 2 0 0 1 2-2z" fill="none" stroke="#00C4D6" strokeWidth="1.75" strokeLinejoin="round" />
            </svg>
            Ask8
          </a>
          <nav className="menu" aria-label={t.header.menuAria}>
            <a href="#tryit">{t.header.menu.tryit}</a>
            <a href="#demo">{t.header.menu.demo}</a>
            <a href="#more">{t.header.menu.more}</a>
            <a href="#custom">{t.header.menu.custom}</a>
          </nav>
          <div className="top-tools">
            <LangSwitch lang={lang} path="/ask8" />
          </div>
        </div>
      </header>

      <main id="top">
        <div className="wrap">
          <section className="hero">
            <div className="hero-copy">
              <p className={eb}>{t.hero.eyebrow}</p>
              <h1>
                {t.hero.h1} <em>{t.hero.h1em}</em>
              </h1>
              <p className="lead">{t.hero.lead}</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#demo">
                  {t.hero.cta1}
                </a>
                <a className="btn btn-ghost" href="#tryit">
                  {t.hero.cta2}
                </a>
              </div>
              <ul className="mini">
                {t.hero.mini.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="hero-visual">
              <figure className="shot hero-main">
                <div className="shot-bar">
                  <i />
                  <i />
                  <i />
                  <span>{t.hero.shotUrl}</span>
                </div>
                <img src={IMG + "recap.jpg"} width={2880} height={1800} alt={t.hero.heroAlt} />
              </figure>
              <figure className="float-card">
                <figcaption>{t.hero.floatCap}</figcaption>
                <img src={IMG + "answer-card.jpg"} width={780} height={570} alt={t.hero.floatAlt} />
              </figure>
              <span className="float-pill">
                <i aria-hidden="true" />
                <span>{t.hero.pill}</span>
              </span>
            </div>
          </section>

          <div className="facts">
            {t.facts.map((f) => (
              <div className="fact" key={f.b}>
                <b>{f.b}</b>
                <span>{f.span}</span>
              </div>
            ))}
          </div>
          <p className="shot-note">{t.shotNote}</p>
        </div>

        <div className="mq wrap" aria-hidden="true">
          <ul className="mq-track" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {t.marquee.concat(t.marquee).map((x, i) => (
              <li key={i} style={{ display: "contents" }}>
                <span className={i >= t.marquee.length ? "dup" : undefined}>{x}</span>
              </li>
            ))}
          </ul>
        </div>

        <section className="hv-sec wrap" id="tryit">
          <div className="s-head">
            <p className={eb}>{t.tryit.eyebrow}</p>
            <h2>{t.tryit.h2}</h2>
            <p>{t.tryit.p}</p>
          </div>
          <ScreenSwitcher t={t.tryit} />
        </section>

        <nav className="tabs" aria-label={t.sectionNav.aria}>
          <div className="wrap">
            <a href="#demo">{t.sectionNav.demo}</a>
            <a href="#more">{t.sectionNav.more}</a>
            <a href="#custom">{t.sectionNav.custom}</a>
          </div>
        </nav>

        <section className="section wrap" id="demo">
          <div className="s-head">
            <p className={eb}>{t.demo.eyebrow}</p>
            <h2>{t.demo.h2}</h2>
            <p>{t.demo.p}</p>
          </div>
          <DemoTour lang={lang} t={t.demo} />
          <p className="demo-note">{t.demo.note}</p>
        </section>

        <section className="section wrap" id="more">
          <div className="s-head">
            <p className={eb}>{t.more.eyebrow}</p>
            <h2>{t.more.h2}</h2>
          </div>
          <div className="bento">
            <article className="card c-during">
              <div>
                <p className="k">{t.more.during.k}</p>
                <h3>{t.more.during.h}</h3>
                <p>{t.more.during.p}</p>
              </div>
              <div className="card-media">
                <img src={IMG + "answer-card.jpg"} width={780} height={570} alt={t.more.during.alt} />
              </div>
            </article>
            <article className="card c-after">
              <div>
                <p className="k">{t.more.after.k}</p>
                <h3>{t.more.after.h}</h3>
                <p>{t.more.after.p}</p>
              </div>
              <div className="card-media">
                <img src={IMG + "answer.jpg"} width={780} height={1858} alt={t.more.after.alt} />
              </div>
            </article>
            <article className="card c-before">
              <div>
                <p className="k">{t.more.before.k}</p>
                <h3>{t.more.before.h}</h3>
                <p>{t.more.before.p}</p>
              </div>
              <div className="card-media">
                <img src={IMG + "prep-ask.jpg"} width={1008} height={746} alt={t.more.before.alt} />
              </div>
            </article>
          </div>
        </section>

        <section className="section wrap" id="custom">
          <div className="s-head">
            <p className={eb}>{t.custom.eyebrow}</p>
            <h2>{t.custom.h2}</h2>
            <p>{t.custom.p}</p>
          </div>
          <div className="cases">
            {t.custom.items.map((c, i) => (
              <article className="case" key={c.h}>
                <span className="case-ico" aria-hidden="true">
                  <svg className="i" viewBox="0 0 24 24">
                    {CASE_ICONS[i]}
                  </svg>
                </span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="wrap foot">
          <span>{t.footer.copy}</span>
          <span>{t.shotNote}</span>
        </footer>
      </main>
    </div>
  );
}
