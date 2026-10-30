import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Bot,
  Brain,
  ChartColumn,
  Check,
  Map,
  Megaphone,
  Phone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { products, type Product, type ProductIcon } from "@/lib/products";
import type { Dictionary, Locale } from "@/lib/i18n";

const icons: Record<ProductIcon, LucideIcon> = {
  brain: Brain,
  bot: Bot,
  phone: Phone,
  chart: ChartColumn,
  workflow: Workflow,
  map: Map,
  megaphone: Megaphone,
};

// Lucide at the brand stroke weight.
const STROKE = 1.75;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <header className="glass sticky top-0 z-20 border-b border-line1">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <Image src="/beryl8-logo.svg" alt="Beryl8" width={36} height={28} priority />
            <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-fg1">AI Products</span>
          </Link>
          <nav aria-label={dict.langLabel} className="flex items-center rounded-full border border-line2 bg-bg1 p-1">
            {locales.map((code) => (
              <Link
                key={code}
                href={`/${code}`}
                hrefLang={code}
                aria-current={code === lang ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.04em] transition-colors duration-200 ease-standard ${
                  code === lang ? "bg-navy text-white" : "text-fg3 hover:text-cyan-700"
                }`}
              >
                {code}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,rgba(0,184,212,0.08)_0%,transparent_70%)]"
          />
          <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-20 sm:pb-20 sm:pt-28">
            <p className="eyebrow">{dict.eyebrow}</p>
            <h1 className="mt-4 max-w-[920px] font-display text-[40px] font-medium leading-[1.08] tracking-[-0.028em] text-fg1 sm:text-[56px] lg:text-[72px]">
              {dict.heroLead} <span className="text-accent">{dict.heroAccent}</span>
            </h1>
            <p className="mt-6 max-w-[720px] text-lg leading-relaxed text-fg3 sm:text-xl">{dict.heroBody}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-24">
          <div className="flex items-baseline justify-between gap-4 border-t border-line1 pb-8 pt-10">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-fg1">{dict.productsHeading}</h2>
            <span className="text-[13px] text-fg3">{dict.productCount(products.length)}</span>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} lang={lang} dict={dict} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="bg-navy text-white">
        <div className="mx-auto max-w-[1280px] px-6 pb-9 pt-14">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-start sm:justify-between">
            <Image src="/beryl8-logo-white.png" alt="Beryl8" width={45} height={32} />
            <p className="max-w-[420px] text-[13.5px] leading-relaxed text-white/60">{dict.footerAbout}</p>
          </div>
          <div className="flex flex-wrap justify-between gap-3 pt-7 text-xs text-white/50">
            <span>{dict.copyright}</span>
            <span>{dict.footerNote}</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function ProductCard({ product, lang, dict }: { product: Product; lang: Locale; dict: Dictionary }) {
  const isLive = product.linkType === "live";
  const Icon = icons[product.icon];

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-soft hoverable group flex w-full flex-col p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-cyan-50 text-cyan-700">
          <Icon size={20} strokeWidth={STROKE} aria-hidden />
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isLive ? "bg-green-50 text-green-700" : "bg-bg2 text-fg3"
          }`}
        >
          {isLive && <span className="size-1.5 rounded-full bg-green-600" aria-hidden />}
          {isLive ? dict.live : dict.mockup}
        </span>
      </div>

      <p className="eyebrow mt-6 text-cyan-700">
        {String(product.number).padStart(2, "0")} · {product.category[lang]}
      </p>
      <h3 className="mt-2 font-display text-[26px] font-medium leading-tight tracking-[-0.015em] text-fg1">
        {product.name}
      </h3>
      <p className="mt-3 font-display text-base font-medium leading-snug text-fg1">{product.tagline[lang]}</p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-fg3">{product.description[lang]}</p>

      <ul className="mt-5 flex flex-col gap-2.5 border-t border-line1 pt-5">
        {product.features.map((feature) => (
          <li key={feature.en} className="flex gap-2.5 text-[13.5px] text-fg2">
            <Check size={16} strokeWidth={STROKE} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            {feature[lang]}
          </li>
        ))}
      </ul>

      <span className="mt-auto inline-flex items-center gap-1 pt-7 text-sm font-medium text-cyan-700">
        {isLive ? dict.openSite : dict.openMockup}
        <ArrowUpRight
          size={16}
          strokeWidth={STROKE}
          className="transition-transform duration-200 ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </a>
  );
}
