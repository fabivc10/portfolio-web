"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMedia } from "@/lib/use-media";

/**
 * Cursor personalizado: punto naranja que sigue al puntero.
 * - Sobre [data-cursor="view"] crece y muestra una etiqueta (data-cursor-label).
 * - Sobre [data-cursor="reveal"] se oculta: el componente <Reveal> dibuja su propio círculo.
 * Sólo se activa con puntero fino (mouse/trackpad).
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const enabled = useMedia("(hover: hover) and (pointer: fine)");
  const [mode, setMode] = useState<"default" | "view" | "reveal" | "link">("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as Element | null)?.closest?.("[data-cursor], a, button");
      if (!el) return setMode("default");
      const m = el.getAttribute("data-cursor");
      if (m === "view" || m === "reveal") {
        setMode(m);
        setLabel(el.getAttribute("data-cursor-label") ?? "");
      } else {
        setMode("link");
      }
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 92 : mode === "link" ? 34 : mode === "reveal" ? 0 : 12;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100]"
    >
      <motion.div
        animate={{ width: size, height: size, opacity: mode === "reveal" ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
          mode === "link" ? "border border-accent bg-accent/10" : "bg-accent"
        }`}
      >
        {mode === "view" && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {label || "Ver"}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
