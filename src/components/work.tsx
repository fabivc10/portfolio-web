"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useMedia } from "@/lib/use-media";
import { Carousel } from "./carousel";
import { LedTicker } from "./led-ticker";
import { projects, type Project } from "@/data/projects";

const ease = [0.22, 1, 0.36, 1] as const;

const imageClass =
  "object-cover object-top opacity-80 grayscale-[0.85] transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-100 group-hover:grayscale-0";

function Card({ project, index }: { project: Project; index: number }) {
  const href = project.url ?? project.repo;
  const link = href
    ? { href, target: "_blank", rel: "noreferrer", "data-cursor": "view", "data-cursor-label": "Ver" }
    : null;
  const [first] = project.images;

  return (
    <motion.article
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease, delay: (index % 2) * 0.08 }}
      className="group min-w-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface-solid ring-1 ring-line">
        {project.images.length > 1 ? (
          // Varias capturas: carrusel (sus botones no pueden ir dentro de un enlace)
          <Carousel images={project.images} name={project.name} className={imageClass} />
        ) : (
          <a {...link} tabIndex={-1} aria-hidden className="absolute inset-0">
            <Image
              src={first}
              alt={`Captura de ${project.name}`}
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className={imageClass}
              priority={index < 2}
            />
          </a>
        )}
      </div>
      <LedTicker items={project.tags} />
      <a {...link} className="mt-4 block">
        {project.kind && <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{project.kind}</p>}
        <h3 className="display pt-[0.1em] text-[1.9rem] transition-colors duration-300 group-hover:text-accent">
          {project.name}
        </h3>
        <p className="mt-2 max-w-md text-[16px] leading-relaxed text-muted">{project.summary}</p>
      </a>
      {project.links && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border border-fg/20 px-3.5 py-1.5 text-[14px] text-fg/85 transition-colors hover:border-accent hover:text-accent"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

function Column({ items, offset, y }: { items: Project[]; offset: number; y?: MotionValue<number> }) {
  return (
    <motion.div style={y ? { y } : undefined} className="flex flex-col gap-16 md:gap-24">
      {items.map((p, i) => (
        <Card key={p.slug} project={p} index={i * 2 + offset} />
      ))}
    </motion.div>
  );
}

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const desktop = useMedia("(min-width: 768px)");
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yRight = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const parallax = desktop && !reduce;

  // El título se desliza horizontalmente mientras entra en pantalla
  const { scrollYProgress: tp } = useScroll({ target: titleRef, offset: ["start end", "end start"] });
  const titleX = useTransform(tp, [0, 1], reduce ? ["0%", "0%"] : ["12%", "-18%"]);

  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <section id="work" className="relative scroll-mt-20 overflow-x-clip px-5 pb-32 pt-24 sm:px-8">
      <div ref={titleRef} className="mx-auto mb-14 max-w-6xl overflow-hidden">
        <p className="label mb-4">[04] — Proyectos</p>
        <motion.h2
          style={{ x: titleX }}
          className="display whitespace-nowrap pt-[0.1em] text-[clamp(2.8rem,9vw,7.5rem)]"
        >
          Proyectos<span className="text-accent">.</span>
        </motion.h2>
      </div>

      <div ref={ref} className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2 md:gap-10">
        {desktop ? (
          <>
            <Column items={left} offset={0} y={parallax ? yLeft : undefined} />
            <Column items={right} offset={1} y={parallax ? yRight : undefined} />
          </>
        ) : (
          projects.map((p, i) => <Card key={p.slug} project={p} index={i} />)
        )}
      </div>

    </section>
  );
}
