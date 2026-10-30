import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { hasLocale } from "@/lib/i18n";
import { content } from "./content";
import "./collab8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/collab8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { languages: { en: "/en/collab8", th: "/th/collab8" } },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/collab8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];
  const eb = "eyebrow" + (lang === "th" ? " th" : "");
  const c = t.chat;

  return (
    <div className="p-collab8">
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M2.5 4.5h8v6h-4l-2.5 2v-2h-1.5zM11.5 6.5h2v5h-1.5v1.5l-2-1.5h-2"
                  fill="none"
                  stroke="#00C4D6"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Collab8
          </a>
          <nav className="menu" aria-label={t.header.menuAria}>
            <a href="#how">{t.header.menu.how}</a>
            <a href="#features">{t.header.menu.features}</a>
            <a href="#control">{t.header.menu.control}</a>
            <a href="#faq">{t.header.menu.faq}</a>
          </nav>
          <span className="top-right">
            <LangSwitch lang={lang} path="/collab8" />
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
                <a className="btn btn-primary" href="#how">
                  {t.hero.cta1}
                </a>
                <a className="btn btn-ghost" href="#control">
                  {t.hero.cta2}
                </a>
              </div>
              <ul className="mini">
                {t.hero.mini.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <figure className="app" aria-label={c.mock}>
              <div className="app-side" aria-hidden="true">
                <b>{c.org}</b>
                <small>{c.rooms}</small>
                <span className="on"># hr-helpdesk</span>
                <span># finance-ops</span>
                <span># project-atlas</span>
                <small>{c.agents}</small>
                <span>benefits-agent</span>
                <span>expense-agent</span>
              </div>
              <div className="app-main">
                <div className="app-head">
                  <b>{c.room}</b>
                  <span>{c.topic}</span>
                </div>
                <div className="msgs">
                  {c.messages.map((m) => (
                    <div className={`msg ${m.role}`} key={m.who + m.text}>
                      <i aria-hidden="true">{m.who.slice(0, 1).toUpperCase()}</i>
                      <div>
                        <b>
                          {m.who}
                          {m.role === "agent" && <em>AI</em>}
                        </b>
                        <p>{m.text}</p>
                        {"chip" in m && m.chip ? <span className="chip">{m.chip}</span> : null}
                      </div>
                    </div>
                  ))}
                  <div className="approval">
                    <span className="tag">{c.approval.tag}</span>
                    <b>{c.approval.title}</b>
                    <p>{c.approval.file}</p>
                    <p>{c.approval.dest}</p>
                    <div className="acts">
                      <span className="a-yes">{c.approval.approve}</span>
                      <span className="a-alt">{c.approval.session}</span>
                      <span className="a-alt">{c.approval.deny}</span>
                    </div>
                  </div>
                </div>
                <div className="composer">{c.composer}</div>
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
          <p className="shot-note">{c.mock}</p>
        </div>

        <section className="section wrap" id="how">
          <div className="s-head">
            <p className={eb}>{t.how.eyebrow}</p>
            <h2>{t.how.h2}</h2>
          </div>
          <ol className="steps">
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

        <section className="section dark" id="control">
          <div className="wrap">
            <div className="s-head">
              <p className={eb}>{t.control.eyebrow}</p>
              <h2>{t.control.h2}</h2>
              <p>{t.control.lead}</p>
            </div>
            <div className="grid3">
              {t.control.items.map((f) => (
                <article className="card" key={f.h}>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap" id="roles">
          <div className="s-head">
            <h2>{t.roles.h2}</h2>
          </div>
          <dl className="spec">
            {t.roles.rows.map((r) => (
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
