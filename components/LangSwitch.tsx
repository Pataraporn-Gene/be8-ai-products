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
        border: `1px solid ${dark ? "rgba(255,255,255,.16)" : "var(--line2)"}`,
        background: dark ? "rgba(255,255,255,.04)" : "var(--bg1)",
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
              lineHeight: 1,
              textDecoration: "none",
              transition: "background 180ms var(--ease-standard), color 180ms var(--ease-standard)",
              background: active ? (dark ? "#fff" : "var(--b8-navy-deep)") : "transparent",
              color: active ? (dark ? "var(--b8-navy-deep)" : "#fff") : dark ? "rgba(255,255,255,.7)" : "var(--fg3)",
            }}
          >
            {code.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
