"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type PointerEvent,
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
  /** Scroll reveal (.rv → .rv.in) with this transition delay in seconds. */
  reveal?: number;
  /** Cursor spotlight (.glow with --mx/--my). */
  glow?: boolean;
  /** Magnetic hover for .btn elements (skipped with reduced motion). */
  magnetic?: boolean;
  [prop: string]: unknown;
};

/**
 * Element wrapper for the source page's motion layer: scroll reveal, cursor spotlight
 * and magnetic buttons, each bound to this element's own ref.
 */
export function Fx({ as = "div", className = "", style, children, reveal, glow, magnetic, ...rest }: FxProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const revealOn = reveal !== undefined;

  useEffect(() => {
    if (!revealOn || !ref.current) return;
    return observeReveal(ref.current, () => setShown(true));
  }, [revealOn]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    if (glow) {
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    }
    if (magnetic && !prefersReducedMotion()) {
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px,${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
    }
  };
  const onPointerLeave = (e: PointerEvent<HTMLElement>) => {
    if (magnetic) e.currentTarget.style.transform = "";
  };

  const cls = [className, glow && "glow", revealOn && "rv", revealOn && shown && "in"].filter(Boolean).join(" ");
  const st = revealOn ? ({ ...style, "--d": `${reveal}s` } as CSSProperties) : style;

  const Tag = as;
  return (
    <Tag
      {...rest}
      ref={ref}
      className={cls || undefined}
      style={st}
      onPointerMove={glow || magnetic ? onPointerMove : undefined}
      onPointerLeave={magnetic ? onPointerLeave : undefined}
    >
      {children}
    </Tag>
  );
}
