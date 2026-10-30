"use client";

import { useEffect, useState } from "react";

/** Sticky section nav: highlights the current section and shows page scroll progress. */
export function SecNav({ label, links }: { label: string; links: { href: string; text: string }[] }) {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targets = links.map((l) => document.getElementById(l.href.slice(1)));
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
      const y = window.innerHeight * 0.35;
      let idx = -1;
      targets.forEach((t, i) => {
        if (t && t.getBoundingClientRect().top < y) idx = i;
      });
      setActive(idx);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [links]);

  return (
    <nav className="secnav" aria-label={label}>
      <span className="progress" style={{ width: `${progress}%` }} />
      <div className="wrap">
        {links.map((l, i) => (
          <a key={l.href} href={l.href} className={i === active ? "on" : undefined}>
            {l.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
