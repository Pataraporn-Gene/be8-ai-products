"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* One shared IntersectionObserver for every scroll-reveal element (same options as the source). */
let revealIO: IntersectionObserver | null = null;
const revealCallbacks = new Map<Element, () => void>();

function observeReveal(el: Element, cb: () => void) {
  if (!("IntersectionObserver" in window)) {
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  }
  if (!revealIO) {
    revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          revealCallbacks.get(en.target)?.();
          revealCallbacks.delete(en.target);
          revealIO?.unobserve(en.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
  }
  revealCallbacks.set(el, cb);
  revealIO.observe(el);
  return () => {
    revealCallbacks.delete(el);
    revealIO?.unobserve(el);
  };
}

type FxProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Scroll reveal (.rv to .rv.in) with this transition delay in seconds. */
  reveal?: number;
  [prop: string]: unknown;
};

/**
 * Element wrapper with a short scroll reveal.
 */
export function Fx({ as = "div", className = "", style, children, reveal, ...rest }: FxProps) {
  // Legacy decorative props are accepted but ignored.
  delete rest.glow;
  delete rest.magnetic;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const revealOn = reveal !== undefined;

  useEffect(() => {
    if (!revealOn || !ref.current) return;
    return observeReveal(ref.current, () => setShown(true));
  }, [revealOn]);

  const cls = [className, revealOn && "rv", revealOn && shown && "in"].filter(Boolean).join(" ");
  const st = revealOn ? ({ ...style, "--d": `${reveal}s` } as CSSProperties) : style;

  const Tag = as;
  return (
    <Tag
      {...rest}
      ref={ref}
      className={cls || undefined}
      style={st}
    >
      {children}
    </Tag>
  );
}
