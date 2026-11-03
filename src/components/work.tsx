"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useMedia } from "@/lib/use-media";
import { Carousel } from "./carousel";
import { LedTicker } from "./led-ticker";
import { projects, type Project } from "@/data/projects";

const ease = [0.22, 1, 0.36, 1] as const;

// Capturas a todo color: un filtro gris sobre capturas claras las hacía ver lavadas
const imageClass =
  "object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]";

const chip =
  "inline-block rounded-full border border-fg/20 px-3.5 py-1.5 text-[14px] text-fg/85 transition-colors hover:border-accent hover:text-accent";

/** `wide`: ocupa todo el ancho (último proyecto cuando el total es impar), con la imagen a la izquierda */
function Card({ project, index, wide }: { project: Project; index: number; wide?: boolean }) {
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
      className={`group min-w-0 ${wide ? "md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center md:gap-10" : ""}`}
    >
      <div className="min-w-0">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface-solid ring-1 ring-line">
          {project.images.length > 1 ? (
            // Varias capturas: carrusel (sus botones no pueden ir dentro de un enlace)
            <Carousel images={project.images} name={project.name} className={imageClass} />
          ) : (
            <a {...link} tabIndex={-1} aria-hidden className="absolute inset-0">
              <Image
                src={first.src}
                alt={`${project.name}: ${first.label}`}
                fill
                sizes={wide ? "(min-width: 768px) 640px, 100vw" : "(min-width: 768px) 560px, 100vw"}
                className={imageClass}
                priority={index < 2}
              />
            </a>
          )}
        </div>
        <LedTicker items={project.tags} />
      </div>
      <div className="min-w-0">
        <a {...link} className={`block ${wide ? "mt-4 md:mt-0" : "mt-4"}`}>
          {project.kind && <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{project.kind}</p>}
          <h3 className="display pt-[0.1em] text-[1.9rem] transition-colors duration-300 group-hover:text-accent">
            {project.name}
          </h3>
          <p className="mt-2 max-w-md text-[16px] leading-relaxed text-muted">{project.summary}</p>
        </a>
        {project.details && (
          <ul className="mt-4 max-w-md space-y-1.5">
            {project.details.map((d) => (
              <li key={d} className="flex gap-2.5 text-[14px] leading-relaxed text-fg/75">
                <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        )}
        {/* Demo y código siempre explícitos; los repos privados se indican como tales */}
        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {project.url && (
            <li>
              <a href={project.url} target="_blank" rel="noreferrer" className={chip}>
                Demo ↗
              </a>
            </li>
          )}
          {project.repo ? (
            <li>
              <a href={project.repo} target="_blank" rel="noreferrer" className={chip}>
                Código ↗
              </a>
            </li>
          ) : (
            <li className="px-1 text-[13px] text-muted">Código privado</li>
          )}
          {project.links?.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer" className={chip}>
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
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

  // Con un total impar, el último va a todo el ancho debajo de las columnas: sin hueco en la grilla
  const odd = projects.length % 2 === 1;
  const paired = odd ? projects.slice(0, -1) : projects;
  const last = odd ? projects[projects.length - 1] : null;
  const left = paired.filter((_, i) => i % 2 === 0);
  const right = paired.filter((_, i) => i % 2 === 1);

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

      {desktop && last && (
        <div className="mx-auto mt-24 max-w-6xl">
          <Card project={last} index={projects.length - 1} wide />
        </div>
      )}
    </section>
  );
}
