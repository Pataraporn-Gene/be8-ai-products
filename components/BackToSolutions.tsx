"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Calculator } from "lucide-react";
import { hasLocale } from "@/lib/i18n";
import { isPriced } from "@/lib/pricing";

/** Product pages that already pin a bar to the bottom edge; the buttons sit above it. */
const PAGES_WITH_BOTTOM_BAR = new Set(["meet8", "insight8", "agent8", "pulse8"]);

const LABEL = { en: "Back to AI Solutions", th: "กลับไปหน้าโซลูชัน AI" } as const;
const ESTIMATE = { en: "Estimate price", th: "คำนวณราคา" } as const;

/** Floating exit from a product page to the catalog, plus a shortcut into the calculator with this product added. */
export function BackToSolutions() {
  const [, lang, product] = usePathname().split("/");
  // The calculator has its own header links and a bottom bar on mobile.
  if (!lang || !hasLocale(lang) || !product || product === "calculator") return null;

  return (
    <div className="b8-float" data-raised={PAGES_WITH_BOTTOM_BAR.has(product) ? "true" : undefined}>
      {isPriced(product) && (
        <Link href={`/${lang}/calculator?add=${product}`} className="b8-back b8-estimate">
          <Calculator size={16} strokeWidth={1.75} aria-hidden />
          {ESTIMATE[lang]}
        </Link>
      )}
      <Link href={`/${lang}`} className="b8-back">
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
        {LABEL[lang]}
      </Link>
    </div>
  );
}
