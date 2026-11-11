import Image from "next/image";

/** Products that have supplied logo files in /public/logos/<id>/.  */
const WORDMARK_ASPECT: Record<string, number> = {
  meet8: 1922 / 499,
  agent8: 2415 / 499,
  voice8: 2202 / 499,
  insight8: 2843 / 499,
  connect8: 3292 / 499,
  space8: 2131 / 499,
  pulse8: 2093 / 499,
  collab8: 2692 / 499,
  ask8: 1500 / 499,
  signature8: 3739 / 499,
  data8: 1941 / 499,
};

export const hasProductLogo = (id: string) => id in WORDMARK_ASPECT;

/**
 * A product's own logo. `wordmark` is the name (page headers), `symbol` is the icon (catalog cards).
 * Both the light-background and dark-background files are rendered; CSS in globals.css shows the
 * right one, and follows any ancestor that sets data-theme="dark".
 */
export function ProductLogo({
  id,
  kind,
  alt,
  height = 28,
  priority = false,
}: {
  id: string;
  kind: "wordmark" | "symbol";
  alt: string;
  height?: number;
  priority?: boolean;
}) {
  const width = kind === "symbol" ? height : Math.round(height * (WORDMARK_ASPECT[id] ?? 4));
  // A parent can resize the logo by setting --b8-logo-h; the prop is the default.
  const common = { width, height, priority, style: { height: `var(--b8-logo-h, ${height}px)`, width: "auto" } };
  return (
    <>
      <Image
        src={`/logos/${id}/${kind}-light.png`}
        alt={alt}
        className="b8-logo b8-logo-light"
        {...common}
      />
      <Image
        src={`/logos/${id}/${kind}-dark.png`}
        alt=""
        aria-hidden
        className="b8-logo b8-logo-dark"
        {...common}
      />
    </>
  );
}
