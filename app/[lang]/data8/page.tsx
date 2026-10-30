import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { hasLocale } from "@/lib/i18n";
import { content } from "./content";
import "./data8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/data8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en/data8", th: "/th/data8" } },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/data8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];
  const eb = "eyebrow" + (lang === "th" ? " th" : "");
  const m = t.mock;

  return (
    <div className="p-data8">
      <header className="top">
        <div className="wrap">
          <Link className="brand" href={`/${lang}`}>
            <span className="brand-mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#00C4D6" strokeWidth="1.5">
                <ellipse cx="8" cy="4" rx="5" ry="2" />
                <path d="M3 4v4c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8v4c0 1.1 2.2 2 5 2s5-.9 5-2V8" />
              </svg>
            </span>
            Data8
          </Link>
          <nav className="menu" aria-label={t.header.menuAria}>
            <a href="#flow">{t.header.menu.flow}</a>
            <a href="#modules">{t.header.menu.modules}</a>
            <a href="#trust">{t.header.menu.trust}</a>
            <a href="#faq">{t.header.menu.faq}</a>
          </nav>
          <span className="top-right">
            <LangSwitch lang={lang} path="/data8" />
          </span>
        </div>
      </header>

      <main>
        <div className="wrap">
          <section className="hero">
            <div className="hero-copy">
              <p className={eb}>{t.hero.eyebrow}</p>
              <h1>
                {t.hero.h1} <em>{t.hero.h1em}</em>
              </h1>
              <p className="lead">{t.hero.lead}</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#flow">
                  {t.hero.cta1}
                </a>
                <a className="btn btn-ghost" href="#modules">
                  {t.hero.cta2}
                </a>
              </div>
              <ul className="mini">
                {t.hero.mini.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <figure className="app" aria-label={m.note}>
              <div className="app-head">
                <b>{m.title}</b>
                <span className="rs">{m.ruleset}</span>
                <span className="ok">{m.status}</span>
              </div>
              <div className="nums">
                <div>
                  <small>{m.before}</small>
                  <b>5,400</b>
                </div>
                <div>
                  <small>{m.after}</small>
                  <b>3,400</b>
                </div>
                <div>
                  <small>{m.rate}</small>
                  <b>37%</b>
                </div>
              </div>
              <div className="recs">
                {m.rows.map((r) => (
                  <div className="rec" key={r.src + r.name}>
                    <span>{r.src}</span>
                    <div>
                      <b>{r.name}</b>
                      <em>{r.key}</em>
                    </div>
                  </div>
                ))}
              </div>
              <div className="uni">{m.unified}</div>
            </figure>
          </section>

          <div className="facts">
            {t.facts.map((f) => (
              <div className="fact" key={f.b}>
                <b>{f.b}</b>
                <span>{f.span}</span>
              </div>
            ))}
          </div>
          <p className="shot-note">{m.note}</p>
        </div>

        <section className="section wrap" id="flow">
          <div className="s-head">
            <p className={eb}>{t.flow.eyebrow}</p>
            <h2>{t.flow.h2}</h2>
          </div>
          <ol className="flow">
            {t.flow.steps.map((s, i) => (
              <li key={s.h}>
                <span className="n">{i + 1}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wrap" id="demo">
          <div className="s-head">
            <p className={eb}>{t.demo.eyebrow}</p>
            <h2>{t.demo.h2}</h2>
            <p>{t.demo.lead}</p>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>{t.demo.head.what}</th>
                <th>{t.demo.head.result}</th>
              </tr>
            </thead>
            <tbody>
              {t.demo.rows.map((r) => (
                <tr key={r.what}>
                  <td>{r.what}</td>
                  <td>{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tnote">{t.demo.note}</p>
        </section>

        <section className="section wrap" id="modules">
          <div className="s-head">
            <p className={eb}>{t.modules.eyebrow}</p>
            <h2>{t.modules.h2}</h2>
          </div>
          <div className="grid3">
            {t.modules.groups.map((g) => (
              <article className="card" key={g.h}>
                <h3>{g.h}</h3>
                <p>{g.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section dark" id="trust">
          <div className="wrap">
            <div className="s-head">
              <p className={eb}>{t.trust.eyebrow}</p>
              <h2>{t.trust.h2}</h2>
            </div>
            <div className="grid2">
              {t.trust.items.map((f) => (
                <article className="card" key={f.h}>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap" id="spec">
          <div className="s-head">
            <h2>{t.spec.h2}</h2>
          </div>
          <dl className="spec">
            {t.spec.rows.map((r) => (
              <div key={r.dt}>
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
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="wrap foot">
          <span>{t.footer.copy}</span>
        </footer>
      </main>
    </div>
  );
}
