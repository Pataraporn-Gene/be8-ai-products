"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hasLocale } from "@/lib/i18n";

/** Product pages that already pin a bar to the bottom edge; the button sits above it. */
const PAGES_WITH_BOTTOM_BAR = new Set(["meet8", "insight8", "agent8", "pulse8"]);

const LABEL = { en: "Back to AI Solutions", th: "กลับไปโซลูชัน AI" } as const;

/** Floating exit from a product page to the catalog. Product logos no longer link home, so this is the way back. */
export function BackToSolutions() {
  const [, lang, product] = usePathname().split("/");
  if (!lang || !hasLocale(lang) || !product) return null;

  return (
    <Link
      href={`/${lang}`}
      className="b8-back"
      data-raised={PAGES_WITH_BOTTOM_BAR.has(product) ? "true" : undefined}
    >
      <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
      {LABEL[lang]}
    </Link>
  );
}
