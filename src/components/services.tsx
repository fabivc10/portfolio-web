"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const services = [
  {
    title: "Backend",
    note: "APIs REST y microservicios en Node.js, TypeScript y Python, diseñados para escalar.",
  },
  {
    title: "Automatización",
    note: "Si algo se hace dos veces a mano, probablemente debería ser un script.",
  },
  {
    title: "Cloud",
    note: "Deploys automatizados con Docker y CI/CD, y diagnóstico por logs para corregir fallas en producción.",
  },
  {
    title: "Web apps",
    note: "Dashboards y productos completos con React y Next.js, del primer commit al dominio.",
  },
];

function Row({ title, note, index }: { title: string; note: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.45"] });
  // Relleno de izquierda a derecha: el texto "se pinta" con el scroll
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const bg = useTransform(
    fill,
    (f) => `linear-gradient(90deg, var(--fg) ${f}, var(--faint) ${f})`,
  );

  return (
    <li ref={ref} className="grid gap-3 border-t border-line py-6 md:grid-cols-[minmax(0,1fr)_300px] md:items-end md:gap-10 md:py-8">
      <div className="flex min-w-0 items-baseline gap-5">
        <span className="font-mono text-[13px] text-muted">0{index + 1}</span>
        <motion.h3
          style={{ backgroundImage: bg }}
          className="display min-w-0 bg-clip-text pt-[0.14em] text-[clamp(2rem,6.4vw,5.5rem)] leading-[0.95] text-transparent [overflow-wrap:anywhere]"
        >
          {title}
        </motion.h3>
      </div>
      <p className="max-w-xs pl-9 text-[16px] leading-relaxed text-muted md:pl-0">{note}</p>
    </li>
  );
}

export function Services() {
  return (
    <section className="relative overflow-x-clip px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="label mb-10">[03] — Enfoque</p>
        <ul className="border-b border-line">
          {services.map((s, i) => (
            <Row key={s.title} {...s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
