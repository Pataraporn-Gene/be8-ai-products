import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import Script from "next/script";
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
        {/* Comment8 feedback widget: must load from the Comment8 origin, do not bundle or proxy. */}
        <Script
          async
          src="https://comment8-129368942455.asia-southeast1.run.app/widget.js"
          data-comment8="cp_9e86bc53dd29945b03ddf94546d02d7e"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
