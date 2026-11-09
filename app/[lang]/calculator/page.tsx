import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getCalcCopy } from "./copy";
import { Calculator } from "./Calculator";
import "./calculator.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/calculator">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const c = getCalcCopy(lang);
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { languages: { en: "/en/calculator", th: "/th/calculator" } },
  };
}

export default async function CalculatorPage({ params }: PageProps<"/[lang]/calculator">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <Calculator lang={lang} />;
}
