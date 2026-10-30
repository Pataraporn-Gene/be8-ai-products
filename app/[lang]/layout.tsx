import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { BackToSolutions } from "@/components/BackToSolutions";
import "../globals.css";

// Brand variable fonts from the Beryl8 Design System.
const interTight = localFont({
  src: "../fonts/InterTight-VariableFont_wght.ttf",
  variable: "--font-inter-tight",
  weight: "100 900",
});
const inter = localFont({
  src: "../fonts/Inter-VariableFont_opsz_wght.ttf",
  variable: "--font-inter",
  weight: "100 900",
});
const notoThai = localFont({
  src: "../fonts/NotoSansThai-VariableFont_wdth_wght.ttf",
  variable: "--font-noto-thai",
  weight: "100 900",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.siteTitle,
    description: dict.siteDescription,
    alternates: { languages: { en: "/en", th: "/th" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${interTight.variable} ${inter.variable} ${notoThai.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}
        <BackToSolutions />
      </body>
    </html>
  );
}
