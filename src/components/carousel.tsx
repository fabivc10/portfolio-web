"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Shot } from "@/data/projects";

const DELAY = 4500; // ms por imagen

/**
 * Carrusel de capturas: avanza solo cada DELAY ms y se pausa con el puntero encima o con
 * el foco dentro. Sin autoplay con prefers-reduced-motion.
 */
export function Carousel({ images, name, className }: { images: Shot[]; name: string; className: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const go = (d: number) => setI((n) => (n + d + images.length) % images.length);

  // Se reinicia en cada cambio de imagen: tras un clic en < > el siguiente paso espera DELAY completo
  useEffect(() => {
    if (reduce || paused) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % images.length), DELAY);
    return () => window.clearTimeout(t);
  }, [i, paused, reduce, images.length]);

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Capturas de ${name}`}
      className="absolute inset-0"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((shot, k) => (
        <Image
          key={shot.src}
          src={shot.src}
          alt={`${name}: ${shot.label}`}
          aria-hidden={k !== i}
          fill
          sizes="(min-width: 768px) 560px, 100vw"
          className={`${className} ${k === i ? "" : "!opacity-0"}`}
          priority={k === 0}
        />
      ))}

      {/* Controles discretos en la esquina: ‹ Arquitectura · 1/4 › */}
      <div className="absolute bottom-3 right-3 flex items-center rounded-full bg-bg/60 ring-1 ring-line backdrop-blur-md">
        {[
          { d: -1, label: "Captura anterior", path: "M10 3 5 8l5 5" },
          { d: 1, label: "Captura siguiente", path: "m6 3 5 5-5 5" },
        ].map((b) => (
          <button
            key={b.d}
            type="button"
            onClick={() => go(b.d)}
            aria-label={b.label}
            className={`flex h-8 w-8 items-center justify-center text-fg/70 transition-colors hover:text-accent focus-visible:text-accent ${
              b.d < 0 ? "order-first" : "order-last"
            }`}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d={b.path} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
        <p aria-live="polite" className="px-1 text-[12px] tabular-nums text-fg/85">
          {images[i].label}
          <span className="text-fg/45">
            {" "}
            · {i + 1}/{images.length}
          </span>
        </p>
      </div>
    </div>
  );
}
