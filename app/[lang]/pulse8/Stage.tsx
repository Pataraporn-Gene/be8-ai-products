"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Fixed-size mockup scaled to fit its box. The wrapper keeps the mockup's
 * aspect ratio; the inner stage is scaled with the --s custom property.
 */
export function Stage({
  w,
  h,
  label,
  stageStyle,
  children,
}: {
  w: number;
  h: number;
  label: string;
  stageStyle?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > 0) setScale(el.clientWidth / w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={ref} className="stage-wrap" role="img" aria-label={label} style={{ aspectRatio: `${w} / ${h}` }}>
      <div
        className="stage"
        aria-hidden="true"
        style={{ width: w, height: h, ...stageStyle, ["--s" as string]: scale } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
