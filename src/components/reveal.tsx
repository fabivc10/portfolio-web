"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Efecto "lente" naranja: un círculo que sigue al cursor y revela un texto
 * alternativo debajo. `children` es la capa base y `alt` la capa revelada;
 * ambas deben compartir el mismo layout (`className`) para alinearse.
 * En pantallas táctiles el círculo aparece al tocar y se cierra solo.
 */
export function Reveal({
  children,
  alt,
  className = "",
  radius = 170,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  alt: React.ReactNode;
  className?: string;
  radius?: number;
  /** Etiqueta de la capa base (p. ej. "h1" para el titular principal) */
  as?: "div" | "h1" | "h2";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30 });
  const sy = useSpring(y, { stiffness: 260, damping: 30 });
  const r = useSpring(0, { stiffness: 200, damping: 24 });
  const clip = useMotionTemplate`circle(${r}px at ${sx}px ${sy}px)`;

  // Táctil: el lente aparece donde se toca y se cierra solo (sin animarse por su cuenta,
  // para que el titular se lea completo en móvil)
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(hide.current), []);
  const tap = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    const rect = ref.current!.getBoundingClientRect();
    x.jump(e.clientX - rect.left);
    y.jump(e.clientY - rect.top);
    sx.jump(e.clientX - rect.left);
    sy.jump(e.clientY - rect.top);
    r.set(radius * 0.8);
    clearTimeout(hide.current);
    hide.current = setTimeout(() => r.set(0), 1400);
  };

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      data-cursor="reveal"
      onPointerMove={move}
      onPointerDown={tap}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = ref.current!.getBoundingClientRect();
        x.jump(e.clientX - rect.left);
        y.jump(e.clientY - rect.top);
        sx.jump(e.clientX - rect.left);
        sy.jump(e.clientY - rect.top);
        r.set(radius);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && r.set(0)}
      // El padding da espacio al círculo para no cortarse en el borde del texto;
      // el margen negativo compensa para no alterar el layout.
      style={{ margin: -radius }}
      className="relative"
    >
      <Tag className={className} style={{ padding: radius }}>
        {children}
      </Tag>
      <motion.div
        aria-hidden
        style={{ clipPath: clip, WebkitClipPath: clip, padding: radius }}
        className={`pointer-events-none absolute inset-0 bg-accent text-accent-ink ${className}`}
      >
        {alt}
      </motion.div>
    </div>
  );
}
