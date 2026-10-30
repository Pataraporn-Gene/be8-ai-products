"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./Fx";

/** Calls fn on scroll, throttled to one animation frame, plus once on mount. */
function useRafScroll(fn: () => void) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    let ticking = false;
    const run = () => {
      fnRef.current();
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = requestAnimationFrame(run);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(id);
    };
  }, []);
}

/** Thin progress bar under the top edge that tracks page scroll. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useRafScroll(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
  });
  return <div className="sprog" ref={ref} aria-hidden="true" />;
}

type HeroVisualProps = {
  shotUrl: string;
  mainAlt: string;
  floatCaption: string;
  floatAlt: string;
  pill: string;
};

/** Hero screenshot with floating close-up; drifts with a light parallax near the top of the page. */
export function HeroVisual({ shotUrl, mainAlt, floatCaption, floatAlt, pill }: HeroVisualProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLElement>(null);
  useRafScroll(() => {
    const y = window.scrollY;
    if (prefersReducedMotion() || y >= 1200) return;
    if (visualRef.current) visualRef.current.style.translate = `0 ${y * 0.08}px`;
    if (floatRef.current) floatRef.current.style.translate = `0 ${-y * 0.06}px`;
  });

  return (
    <div className="hero-visual" ref={visualRef}>
      <figure className="shot hero-main">
        <div className="shot-bar">
          <i></i>
          <i></i>
          <i></i>
          <span>{shotUrl}</span>
        </div>
        <img src="/products/meet8/today.jpg" alt={mainAlt} width={1280} height={640} />
      </figure>
      <figure className="float-card" ref={floatRef}>
        <figcaption>{floatCaption}</figcaption>
        <img src="/products/meet8/actions-close.jpg" alt={floatAlt} width={754} height={296} />
      </figure>
      <span className="float-pill">
        <i aria-hidden="true"></i>
        {pill}
      </span>
    </div>
  );
}
