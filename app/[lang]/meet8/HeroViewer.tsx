"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Fx, prefersReducedMotion } from "./Fx";
import type { Screen, ScreenKey } from "./content";

type Props = { screens: Screen[]; tabsLabel: string; alt: string; urlHost: string };

/** "Take a look" screen switcher: sliding tab indicator, cross-fading screenshot, auto-advance that stops on first click. */
export function HeroViewer({ screens, tabsLabel, alt, urlHost }: Props) {
  const [cur, setCur] = useState<ScreenKey>(screens[0].key);
  const [shown, setShown] = useState<ScreenKey>(screens[0].key);
  const [swap, setSwap] = useState(false);

  const curRef = useRef(cur);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef<Partial<Record<ScreenKey, HTMLButtonElement | null>>>({});
  const indRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const placeIndicator = useCallback(() => {
    const b = tabRefs.current[curRef.current];
    const ind = indRef.current;
    if (!b || !ind) return;
    ind.style.width = b.offsetWidth + "px";
    ind.style.transform = `translateX(${b.offsetLeft}px)`;
  }, []);

  const show = useCallback((k: ScreenKey) => {
    if (k === curRef.current) return;
    curRef.current = k;
    setCur(k);
    setSwap(true);
    if (swapTimer.current) clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => {
      setShown(k);
      // A cached image may already be complete, in which case onLoad might not fire.
      requestAnimationFrame(() => {
        if (imgRef.current?.complete) setSwap(false);
      });
    }, 220);
  }, []);

  useLayoutEffect(placeIndicator, [cur, placeIndicator]);

  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    screens.forEach((s) => {
      const im = new Image();
      im.src = `/products/meet8/${s.img}`;
    });
    if (!prefersReducedMotion()) {
      timer.current = setInterval(() => {
        const keys = screens.map((s) => s.key);
        show(keys[(keys.indexOf(curRef.current) + 1) % keys.length]);
      }, 4500);
    }
    return () => {
      window.removeEventListener("resize", placeIndicator);
      if (timer.current) clearInterval(timer.current);
      if (swapTimer.current) clearTimeout(swapTimer.current);
    };
  }, [screens, show, placeIndicator]);

  const onTab = (k: ScreenKey) => {
    show(k);
    if (timer.current) clearInterval(timer.current);
  };

  const s = screens.find((x) => x.key === shown) ?? screens[0];

  return (
    <Fx className="hv-stage" reveal={0}>
      <div className="hv-tabs" role="tablist" aria-label={tabsLabel}>
        <span className="hv-ind" ref={indRef} aria-hidden="true"></span>
        {screens.map((x) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            aria-selected={x.key === cur}
            ref={(el) => {
              tabRefs.current[x.key] = el;
            }}
            onClick={() => onTab(x.key)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <figure className="shot hero-main hv-shot">
        <div className="shot-bar">
          <i></i>
          <i></i>
          <i></i>
          <span>{urlHost + s.url}</span>
        </div>
        <img
          ref={imgRef}
          className={swap ? "swap" : undefined}
          src={`/products/meet8/${s.img}`}
          alt={alt}
          width={1280}
          height={640}
          onLoad={() => setSwap(false)}
        />
      </figure>
    </Fx>
  );
}
