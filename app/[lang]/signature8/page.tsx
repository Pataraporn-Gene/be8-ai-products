import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { ProductLogo } from "@/components/ProductLogo";
import { hasLocale } from "@/lib/i18n";
import { content } from "./content";
import "./signature8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/signature8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en/signature8", th: "/th/signature8" } },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/signature8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];
  const eb = "eyebrow" + (lang === "th" ? " th" : "");
  const m = t.mock;

  return (
    <div className="p-signature8">
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="SIGNATURE8">
            <ProductLogo id="signature8" kind="wordmark" alt="SIGNATURE8" priority />
          </a>
          <nav className="menu" aria-label={t.header.menuAria}>
            <a href="#how">{t.header.menu.how}</a>
            <a href="#features">{t.header.menu.features}</a>
            <a href="#proof">{t.header.menu.proof}</a>
            <a href="#faq">{t.header.menu.faq}</a>
          </nav>
          <span className="top-right">
            <LangSwitch lang={lang} path="/signature8" />
          </span>
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
                <a className="btn btn-primary" href="#how">
                  {t.hero.cta1}
                </a>
                <a className="btn btn-ghost" href="#proof">
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
                <b>{m.file}</b>
                <span className="rs">{m.status}</span>
              </div>
              <div className="app-body">
                <div className="page" aria-hidden="true">
                  <h4>{m.docTitle}</h4>
                  {Array.from({ length: m.docLines }, (_, i) => (
                    <i key={i} />
                  ))}
                  <div className="sig">
                    <div className="sig-box">{m.fieldLabel}</div>
                    <div className="sig-line" />
                  </div>
                </div>
                <div className="side">
                  <h5>{m.panel}</h5>
                  {m.people.map((p, i) => (
                    <div className="who" key={p.n}>
                      <span className="no">{i + 1}</span>
                      <div>
                        <b>{p.n}</b>
                        <small>{p.role}</small>
                      </div>
                      <span className={`tag ${p.tone}`}>{p.state}</span>
                    </div>
                  ))}
                </div>
              </div>
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

        <section className="section wrap" id="how">
          <div className="s-head">
            <p className={eb}>{t.how.eyebrow}</p>
            <h2>{t.how.h2}</h2>
          </div>
          <ol className="flow">
            {t.how.steps.map((s, i) => (
              <li key={s.h}>
                <span className="n">{i + 1}</span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section wrap" id="features">
          <div className="s-head">
            <p className={eb}>{t.features.eyebrow}</p>
            <h2>{t.features.h2}</h2>
          </div>
          <div className="grid3">
            {t.features.items.map((f) => (
              <article className="card" key={f.h}>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section dark" id="proof">
          <div className="wrap">
            <div className="s-head">
              <p className={eb}>{t.proof.eyebrow}</p>
              <h2>{t.proof.h2}</h2>
              <p>{t.proof.lead}</p>
            </div>
            <div className="grid3">
              {t.proof.items.map((f) => (
                <article className="card" key={f.h}>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap" id="cases">
          <div className="s-head">
            <h2>{t.cases.h2}</h2>
          </div>
          <dl className="spec">
            {t.cases.rows.map((r) => (
              <div key={r.dt}>
                <dt>{r.dt}</dt>
                <dd>{r.dd}</dd>
              </div>
            ))}
          </dl>
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
