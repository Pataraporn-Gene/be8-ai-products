import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Brain,
  ChartColumn,
  Check,
  Database,
  Map,
  Megaphone,
  MessageCircleQuestion,
  MessagesSquare,
  PenLine,
  Phone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { LangSwitch } from "@/components/LangSwitch";
import { ProductLogo, hasProductLogo } from "@/components/ProductLogo";
import { getDictionary, hasLocale } from "@/lib/i18n";
import type { Dictionary, Locale } from "@/lib/i18n";
import { products, type Product, type ProductIcon } from "@/lib/products";
import { homeContent, siteUrl } from "./home-content";
import "./home.css";

const icons: Record<ProductIcon, LucideIcon> = {
  brain: Brain,
  bot: Bot,
  phone: Phone,
  chart: ChartColumn,
  workflow: Workflow,
  map: Map,
  megaphone: Megaphone,
  chat: MessagesSquare,
  ask: MessageCircleQuestion,
  database: Database,
  signature: PenLine,
};

// Lucide at the brand stroke weight.
const STROKE = 1.75;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = homeContent[lang];

  return (
    <div className="b8-home flex flex-1 flex-col">
      <section className="hero">
        <Image src="/home/banner.webp" alt="" fill priority sizes="100vw" className="hero-img" />
        <header className="hdr">
          <a className="hdr-logo" href={siteUrl(lang, "/home")} aria-label="Beryl8">
            <Image src="/home/logo-white.svg" alt="Beryl8" width={92} height={73} priority />
          </a>
          <nav className="hdr-nav" aria-label={lang === "th" ? "เมนูหลัก" : "Main menu"}>
            {t.nav.map((item) => (
              <a key={item.path} href={siteUrl(lang, item.path)}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hdr-right">
            <LangSwitch lang={lang} dark />
            <a className="pill" href={siteUrl(lang, "/contact-us")}>
              {t.contactNav}
            </a>
          </div>
        </header>

        <nav className="crumbs" aria-label={t.breadcrumbAria}>
          <ol>
            <li>
              <a href={siteUrl(lang, "/home")}>{t.crumbs.home}</a>
            </li>
            <li>
              <a href={siteUrl(lang, "/technology/partners")}>{t.crumbs.technology}</a>
            </li>
            <li aria-current="page">{t.crumbs.current}</li>
          </ol>
        </nav>
        <h1>{t.title}</h1>
      </section>

      <main>
        <section className="intro">
          <h2>{t.introHeading()}</h2>
          <p className="intro-lead">{t.introLead}</p>
          <p className="intro-body">{dict.heroBody}</p>
        </section>

        <ul className="grid">
          {products.map((product) => (
            <li key={product.id}>
              <SolutionCard product={product} lang={lang} dict={dict} />
            </li>
          ))}
        </ul>
      </main>

      <section className="band">
        <Image src="/home/contact.webp" alt="" fill sizes="100vw" className="band-img" />
        <div className="band-in">
          <div className="band-copy">
            <h2>{t.cta.heading}</h2>
            <p>{t.cta.body}</p>
            <ul>
              {t.cta.points.map((point) => (
                <li key={point}>
                  <Check size={18} strokeWidth={STROKE} aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <a className="pill" href={siteUrl(lang, "/contact-us")}>
              {t.cta.button}
            </a>
          </div>
        </div>
      </section>

      <footer className="ftr">
        <div className="ftr-in">
          <div className="ftr-brand">
            <a className="ftr-logo" href={siteUrl(lang, "/home")} aria-label="Beryl8">
              <Image src="/home/logo-white.svg" alt="Beryl8" width={92} height={73} />
            </a>
            <p className="ftr-about">{dict.footerAbout}</p>
          </div>
          <ul>
            <li>
              <a href={siteUrl(lang, "/home")}>{t.footer.home}</a>
            </li>
            {t.nav.slice(0, 3).map((item) => (
              <li key={item.path}>
                <a href={siteUrl(lang, item.path)}>{item.label}</a>
              </li>
            ))}
          </ul>
          <ul>
            {t.nav.slice(3).map((item) => (
              <li key={item.path}>
                <a href={siteUrl(lang, item.path)}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href={siteUrl(lang, "/contact-us")}>{t.footer.contact}</a>
            </li>
          </ul>
          <div className="ftr-news">
            <h3>{t.footer.newsHeading}</h3>
            <p>{t.footer.newsBody}</p>
            <a className="pill" href={siteUrl(lang, "/investor-relations/news-subscription")}>
              {t.footer.subscribe}
            </a>
          </div>
        </div>
        <div className="ftr-bar">
          <span>
            {dict.copyright} {dict.footerNote}
          </span>
          <a href={siteUrl(lang, "/cookie-policy")}>{t.footer.legal}</a>
        </div>
      </footer>
    </div>
  );
}

function SolutionCard({ product, lang, dict }: { product: Product; lang: Locale; dict: Dictionary }) {
  const isLive = product.linkType === "live";
  const Icon = icons[product.icon];

  const body = (
    <>
      {hasProductLogo(product.id) ? (
        <span className="sol-ico sol-ico--logo">
          <ProductLogo id={product.id} kind="symbol" alt={product.name} height={109} />
        </span>
      ) : (
        <span className="sol-ico">
          <Icon size={52} strokeWidth={1.5} aria-hidden />
        </span>
      )}
      <div>
        <p className="sol-cat">{product.category[lang]}</p>
        <h3>
          {product.name}
          {isLive && (
            <span className="sol-tag">
              <i aria-hidden />
              {dict.live}
            </span>
          )}
        </h3>
        <p>{product.description[lang]}</p>
        <span className="sol-go">
          {isLive ? dict.openSite : dict.openPage}
          <ArrowRight size={16} strokeWidth={STROKE} aria-hidden />
        </span>
      </div>
    </>
  );

  return isLive ? (
    <a href={product.url} target="_blank" rel="noopener noreferrer" className="sol">
      {body}
    </a>
  ) : (
    <Link href={`/${lang}${product.url}`} className="sol">
      {body}
    </Link>
  );
}
