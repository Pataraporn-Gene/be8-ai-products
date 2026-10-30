"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Fx, prefersReducedMotion } from "./Fx";
import type { StepKey, TourStep } from "./content";

type Props = { steps: TourStep[]; stepsLabel: string; urlHost: string };

/** Four-step product tour: tab buttons swap the copy, checklist and screenshot. */
export function Tour({ steps, stepsLabel, urlHost }: Props) {
  const [sc, setSc] = useState<StepKey>(steps[0].key);
  const shotRef = useRef<HTMLElement>(null);
  const t = steps.find((s) => s.key === sc) ?? steps[0];

  useEffect(() => {
    steps.forEach((s) => {
      const im = new Image();
      im.src = `/products/meet8/${s.img}`;
    });
  }, [steps]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const shot = shotRef.current;
    if (!shot || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    shot.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    shot.style.transition = "transform .2s";
  };
  const onLeave = () => {
    if (shotRef.current) shotRef.current.style.transform = "";
  };

  return (
    <>
      <div className="steps" role="tablist" aria-label={stepsLabel}>
        {steps.map((s, i) => (
          <Fx
            key={s.key}
            as="button"
            type="button"
            className="step"
            role="tab"
            id={`s-${s.key}`}
            aria-selected={s.key === sc}
            reveal={(i % 4) * 0.09}
            glow
            onClick={() => setSc(s.key)}
          >
            <small>{s.num}</small>
            <b>{s.label}</b>
          </Fx>
        ))}
      </div>
      <Fx className="tour" role="tabpanel" aria-labelledby={`s-${t.key}`} reveal={0}>
        <div>
          <h3>{t.h}</h3>
          <p>{t.p}</p>
          <ul>
            {t.list.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="tour-media" onMouseMove={onMove} onMouseLeave={onLeave}>
          <figure className="shot" ref={shotRef}>
            <div className="shot-bar">
              <i></i>
              <i></i>
              <i></i>
              <span>{urlHost + t.url}</span>
            </div>
            <img src={`/products/meet8/${t.img}`} alt={t.alt} />
          </figure>
        </div>
      </Fx>
    </>
  );
}
