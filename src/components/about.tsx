"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { highlights } from "@/data/projects";

type Token = { w: string; accent?: boolean };

// Párrafo principal: cada palabra pasa de apagada a encendida con el scroll.
const words = (t: string, accent = false): Token[] => t.split(" ").map((w) => ({ w, accent }));
const statement: Token[] = [
  ...words("Full stack con enfoque en backend, automatización y cloud. Me importa que los sistemas"),
  ...words("funcionen en producción:", true),
  ...words("logs, causa raíz y despliegues automatizados, no solo entregar features."),
];

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.3, 1]);
  return (
    <motion.span style={{ opacity }} className={token.accent ? "text-accent" : undefined}>
      {token.w}
    </motion.span>
  );
}

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.45"] });
  const n = statement.length;

  return (
    <section id="about" className="relative scroll-mt-20 overflow-x-clip px-5 py-28 sm:px-8 sm:py-36">
      <div ref={ref} className="mx-auto max-w-5xl">
        <p className="label mb-8">[01] — Sobre mí</p>
        <p className="flex flex-wrap gap-x-[0.26em] font-display text-[clamp(1.7rem,3.8vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.02em]">
          {statement.map((t, i) => (
            <Word key={i} token={t} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 2) / n)]} />
          ))}
        </p>
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-bg/85 p-5 sm:p-7"
            >
              <dt className="order-2 mt-4 text-[16px] font-semibold text-fg">{h.label}</dt>
              <dd className="display order-1 pt-[0.1em] text-[clamp(2.4rem,5vw,3.6rem)] text-accent">{h.value}</dd>
              <dd className="order-3 mt-1.5 text-[14px] leading-snug text-muted">{h.detail}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
