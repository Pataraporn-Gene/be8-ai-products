/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";
import { getMeet8Content, type Cell } from "./content";
import { Fx } from "./Fx";
import { HeroViewer } from "./HeroViewer";
import { HeroVisual, ScrollProgress } from "./ScrollFx";
import { Tour } from "./Tour";
import { BuyBar, CountUp, CountUpGrid, PlanButton, PlanProvider, PlansSection } from "./Pricing";
import "./meet8.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/meet8">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getMeet8Content(lang);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { languages: { en: "/en/meet8", th: "/th/meet8" } },
  };
}

/** s-head reveal delays: (index of .s-head on the source page % 4) × 0.09s; the hidden trust section held index 5. */
const HEAD_D = { tryit: 0, features: 0.09, more: 0.18, cases: 0.27, plans: 0, spec: 0.18, faq: 0.27 };
const d = (i: number) => (i % 4) * 0.09;

function CellView({ v, yes, no }: { v: Cell; yes: string; no: string }) {
  if (v === true)
    return (
      <>
        <span className="tick" aria-hidden="true"></span>
        <span className="sr">{yes}</span>
      </>
    );
  if (v === false)
    return (
      <>
        <span className="dash" aria-hidden="true"></span>
        <span className="sr">{no}</span>
      </>
    );
  return <>{v}</>;
}

export default async function Page({ params }: PageProps<"/[lang]/meet8">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getMeet8Content(lang);
  const { plans: pl, compare: cmp } = c;

  return (
    <div className="p-meet8">
      <PlanProvider>
        <header className="top">
          <div className="wrap">
            <Link className="brand" href={`/${lang}`}>
              <span className="brand-mark" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M3 4.5h10M3 8h7M3 11.5h4" stroke="#00C4D6" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {c.brand}
            </Link>
            <nav className="menu" aria-label={c.menuLabel}>
              {c.menu.map((m) => (
                <a key={m.href} href={m.href}>
                  {m.label}
                </a>
              ))}
            </nav>
            <div className="top-right">
              <LangSwitch lang={lang} path="/meet8" dark={false} />
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
                  <Fx as="a" className="btn btn-primary" href="#features" magnetic>
                    {c.hero.ctaPrimary}
                  </Fx>
                  <Fx as="a" className="btn btn-ghost" href="#plans" magnetic>
                    {c.hero.ctaSecondary}
                  </Fx>
                </div>
                <ul className="mini">
                  {c.hero.mini.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <HeroVisual
                shotUrl={c.hero.shotUrl}
                mainAlt={c.hero.mainAlt}
                floatCaption={c.hero.floatCaption}
                floatAlt={c.hero.floatAlt}
                pill={c.hero.pill}
              />
            </section>

            <div className="facts">
              {c.facts.map((f, i) => (
                <Fx key={f.b} className="fact" reveal={d(i)} glow>
                  <b>{f.b}</b>
                  <span>{f.span}</span>
                </Fx>
              ))}
            </div>
            <p className="shot-note">{c.shotNote}</p>
          </div>

          <div className="mq" aria-hidden="true">
            <div className="mq-track">
              {[...c.marquee, ...c.marquee].map((x, i) => (
                <span key={i}>{x}</span>
              ))}
            </div>
          </div>
          <ScrollProgress />

          <section className="hv-sec wrap" id="tryit">
            <Fx className="s-head" reveal={HEAD_D.tryit}>
              <p className="eyebrow">{c.tryit.eyebrow}</p>
              <h2>{c.tryit.h2}</h2>
            </Fx>
            <HeroViewer
              screens={c.tryit.screens}
              tabsLabel={c.tryit.tabsLabel}
              alt={c.tryit.alt}
              urlHost={c.tryit.urlHost}
            />
          </section>

          <nav className="tabs" aria-label={c.tabsLabel}>
            <div className="wrap">
              {c.tabs.map((t) => (
                <a key={t.href} href={t.href}>
                  {t.label}
                </a>
              ))}
            </div>
          </nav>

          <section className="section wrap" id="features">
            <Fx className="s-head" reveal={HEAD_D.features}>
              <p className="eyebrow">{c.features.eyebrow}</p>
              <h2>{c.features.h2}</h2>
            </Fx>
            <Tour steps={c.features.steps} stepsLabel={c.features.stepsLabel} urlHost={c.features.urlHost} />
          </section>

          <section className="section wrap" id="more">
            <Fx className="s-head" reveal={HEAD_D.more}>
              <p className="eyebrow">{c.more.eyebrow}</p>
              <h2>{c.more.h2}</h2>
            </Fx>
            <div className="bento">
              <Fx as="article" className="card c-chat" reveal={d(0)} glow>
                <div>
                  <p className="k">{c.more.chat.k}</p>
                  <h3>{c.more.chat.h3}</h3>
                  <p>{c.more.chat.p}</p>
                </div>
                <div className="card-media">
                  <img src="/products/meet8/chat-close.jpg" alt={c.more.chat.alt} width={850} height={300} />
                </div>
              </Fx>
              <Fx as="article" className="card c-prep" reveal={d(1)} glow>
                <div>
                  <p className="k">{c.more.prep.k}</p>
                  <h3>{c.more.prep.h3}</h3>
                  <p>{c.more.prep.p}</p>
                </div>
                <div className="card-media">
                  <img src="/products/meet8/prep-close.jpg" alt={c.more.prep.alt} width={702} height={820} />
                </div>
              </Fx>
              <Fx as="article" className="card c-access" reveal={d(2)} glow>
                <div>
                  <p className="k">{c.more.access.k}</p>
                  <h3>{c.more.access.h3}</h3>
                  <p>{c.more.access.p}</p>
                </div>
                <div className="card-media">
                  <img src="/products/meet8/meetings-close.jpg" alt={c.more.access.alt} width={1232} height={574} />
                </div>
              </Fx>
            </div>
          </section>

          <section className="section wrap" id="cases">
            <Fx className="s-head" reveal={HEAD_D.cases}>
              <h2>{c.cases.h2}</h2>
            </Fx>
            <div className="cases">
              {c.cases.items.map((it, i) => (
                <Fx as="article" key={i} className="case" reveal={d(i)} glow>
                  <span className="case-ico" aria-hidden="true">
                    {CASE_ICONS[i]}
                  </span>
                  <h3>{it.h3}</h3>
                  <p>{it.p}</p>
                </Fx>
              ))}
            </div>
          </section>

          <PlansSection>
            <Fx className="s-head" reveal={HEAD_D.plans}>
              <p className="eyebrow">{pl.eyebrow}</p>
              <h2>{pl.h2}</h2>
              <p>{pl.p}</p>
            </Fx>
            <CountUpGrid>
              <Fx as="article" className="pc" reveal={d(0)} glow>
                <h3 className="pc-name">Standard</h3>
                <div className="pc-price num">
                  <b>
                    <CountUp text={pl.standard.price} />
                  </b>
                  <span>{pl.perYear}</span>
                </div>
                <p className="pc-sub num">{pl.standard.sub}</p>
                <p className="pc-for">{pl.standard.for}</p>
                <PlanButton plan="standard" className="btn btn-ghost">
                  {pl.standard.cta}
                </PlanButton>
                <ul className="pc-list">
                  <li className="lbl">{pl.standard.listLabel}</li>
                  {pl.standard.list.map((x) => (
                    <li key={x}>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </Fx>
              <Fx as="article" className="pc rec" reveal={d(1)} glow>
                <span className="pc-tag">{pl.premium.tag}</span>
                <h3 className="pc-name">Premium</h3>
                <div className="pc-price num">
                  <b>
                    <CountUp text={pl.premium.price} />
                  </b>
                  <span>{pl.perYear}</span>
                </div>
                <p className="pc-sub num">{pl.premium.sub}</p>
                <p className="pc-for">{pl.premium.for}</p>
                <PlanButton plan="premium" className="btn btn-primary">
                  {pl.premium.cta}
                </PlanButton>
                <ul className="pc-list">
                  <li className="lbl">{pl.premium.listLabel}</li>
                  {pl.premium.list.map((x) => (
                    <li key={x}>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </Fx>
              <Fx as="article" className="pc cus" reveal={d(2)} glow>
                <h3 className="pc-name">Customize</h3>
                <div className="pc-price ask">
                  <b>{pl.customize.price}</b>
                </div>
                <p className="pc-for">{pl.customize.for}</p>
                <PlanButton plan="customize" className="btn btn-ghost">
                  {pl.customize.cta}
                </PlanButton>
                <ul className="pc-list">
                  <li className="lbl">{pl.customize.listLabel}</li>
                  {pl.customize.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Fx>
            </CountUpGrid>
            <p className="pc-note">{pl.note}</p>

            <Fx as="h3" className="ct-h" reveal={0}>
              {cmp.heading}
            </Fx>
            <Fx className="ct-wrap" reveal={0}>
              <table className="ct">
                <colgroup>
                  <col className="c-f" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr">{cmp.featureCol}</span>
                    </th>
                    <th scope="col">
                      <span className="ct-n">Standard</span>
                      <span className="ct-p num">
                        {cmp.std.year}
                        <br />
                        {cmp.std.month}
                      </span>
                      <PlanButton plan="standard" className="ct-b">
                        {cmp.std.cta}
                      </PlanButton>
                    </th>
                    <th scope="col" className="prem">
                      <span className="ct-n">Premium</span>
                      <span className="ct-p num">
                        {cmp.prem.year}
                        <br />
                        {cmp.prem.month}
                      </span>
                      <PlanButton plan="premium" className="ct-b fill">
                        {cmp.prem.cta}
                      </PlanButton>
                    </th>
                    <th scope="col">
                      <span className="ct-n">Customize</span>
                      <span className="ct-p">{cmp.cus.price}</span>
                      <PlanButton plan="customize" className="ct-b">
                        {cmp.cus.cta}
                      </PlanButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.rows.map((r, i) =>
                    "group" in r ? (
                      <tr className="g" key={i}>
                        <th scope="rowgroup" colSpan={2}>
                          {r.group}
                        </th>
                        <td className="prem"></td>
                        <td></td>
                      </tr>
                    ) : (
                      <tr key={i}>
                        <th scope="row">
                          {r.label}
                          {r.beta && (
                            <>
                              {" "}
                              <span className="beta">{cmp.beta}</span>
                            </>
                          )}
                        </th>
                        <td>
                          <CellView v={r.std} yes={cmp.yes} no={cmp.no} />
                        </td>
                        <td className="prem">
                          <CellView v={r.prem} yes={cmp.yes} no={cmp.no} />
                        </td>
                        <td className="cusv">
                          <CellView v={r.cus} yes={cmp.yes} no={cmp.no} />
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </Fx>
          </PlansSection>

          <section className="section wrap" id="spec">
            <Fx className="s-head" reveal={HEAD_D.spec}>
              <h2>{c.spec.h2}</h2>
            </Fx>
            <dl className="spec">
              {c.spec.items.map((s, i) => (
                <Fx key={s.dt} reveal={d(i)}>
                  <dt>{s.dt}</dt>
                  <dd>{s.dd}</dd>
                </Fx>
              ))}
            </dl>
          </section>

          <section className="section wrap" id="faq">
            <Fx className="s-head" reveal={HEAD_D.faq}>
              <h2>{c.faq.h2}</h2>
            </Fx>
            <div className="faq">
              {c.faq.items.map((f, i) => (
                <Fx as="details" key={f.q} reveal={d(i)} open={i === 0 ? true : undefined}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </Fx>
              ))}
            </div>
          </section>

          <footer className="wrap foot">
            <span>{c.footer.left}</span>
            <span>{c.footer.right}</span>
          </footer>
        </main>

        <BuyBar label={c.bar.label} plans={c.bar.plans} />
      </PlanProvider>
    </div>
  );
}

const CASE_ICONS = [
  <svg key="client" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="12" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>,
  <svg key="internal" viewBox="0 0 24 24">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M15 14.5c3 0 6 1.5 6 4.5" />
  </svg>,
  <svg key="interview" viewBox="0 0 24 24">
    <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>,
  <svg key="voice" viewBox="0 0 24 24">
    <path d="M4 12h2l2-6 4 12 3-9 2 3h3" />
  </svg>,
];
