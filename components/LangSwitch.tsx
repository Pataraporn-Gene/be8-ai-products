import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n";

/**
 * EN / TH pill used by every page. `path` is the route without the locale,
 * e.g. "" for home or "/meet8" for a product page. Styling is inline so it
 * renders the same inside product pages that bring their own scoped CSS.
 */
export function LangSwitch({ lang, path = "", dark = false }: { lang: Locale; path?: string; dark?: boolean }) {
  return (
    <nav
      aria-label={lang === "th" ? "ภาษา" : "Language"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 3,
        borderRadius: 999,
        border: `1px solid ${dark ? "rgba(255,255,255,.16)" : "#DBE0E6"}`,
        background: dark ? "rgba(255,255,255,.04)" : "#fff",
        flex: "none",
      }}
    >
      {locales.map((code) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={`/${code}${path}`}
            hrefLang={code}
            aria-current={active ? "page" : undefined}
            style={{
              padding: "6px 11px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: ".04em",
              lineHeight: 1,
              textTransform: "uppercase",
              textDecoration: "none",
              background: active ? (dark ? "#fff" : "#0A1F2E") : "transparent",
              color: active ? (dark ? "#0A1F2E" : "#fff") : dark ? "rgba(255,255,255,.7)" : "#6B7682",
            }}
          >
            {code}
          </Link>
        );
      })}
    </nav>
  );
}
