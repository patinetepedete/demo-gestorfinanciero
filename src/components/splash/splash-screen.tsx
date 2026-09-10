"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }

    const exitTimer = setTimeout(() => setPhase("out"), 1100);
    const doneTimer = setTimeout(() => setPhase("done"), 1550);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-paper transition-opacity duration-500 ${
        phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="10" y="34" width="10" height="20" rx="2" className="splash-bar splash-bar-1" fill="var(--color-olive)" />
        <rect x="27" y="22" width="10" height="32" rx="2" className="splash-bar splash-bar-2" fill="var(--color-gold)" />
        <rect x="44" y="10" width="10" height="44" rx="2" className="splash-bar splash-bar-3" fill="var(--color-accent)" />
      </svg>
      <span className="splash-text font-heading text-xl tracking-wide text-ink">
        Gestor de Finanzas
      </span>
    </div>
  );
}
