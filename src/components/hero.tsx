"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { contact, profile } from "@/data/projects";
import { Reveal } from "./reveal";

const ease = [0.22, 1, 0.36, 1] as const;

const base = ["Full Stack", "Backend", "& Cloud"];
const alt = ["Código", "que llega a", "producción"];

const lines = "display flex flex-col items-center text-center text-[clamp(2.8rem,min(10vw,13svh),8.5rem)]";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.9]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh flex-col items-center overflow-x-clip justify-center px-4 pb-24 pt-28">
      <motion.div style={{ y, opacity, scale }} className="flex flex-col items-center">
        <motion.p {...fade(0.1)} className="label mb-6 text-center text-fg/80">
          {profile.name} · {profile.location}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.3, delay: 0.2, ease }}
        >
          <Reveal
            as="h1"
            className={lines}
            radius={90}
            alt={alt.map((l) => (
              <span key={l}>{l}</span>
            ))}
          >
            <span className="sr-only">
              {profile.name}, {profile.role} con enfoque en {profile.focus}.{" "}
            </span>
            {base.map((l, i) => (
              <span key={l} className={i === 0 ? undefined : "text-accent"}>
                {l}
              </span>
            ))}
          </Reveal>
        </motion.div>

        <motion.p {...fade(0.6)} className="mt-8 max-w-2xl text-center text-[17px] leading-relaxed text-fg/85 sm:text-lg">
          Diseñé el servidor OCPP que hoy opera <strong className="font-semibold text-fg">450+ estaciones de carga</strong> en{" "}
          <strong className="font-semibold text-fg">10+ países</strong>. Más de 3 años construyendo y operando APIs,
          integraciones y despliegues en producción.
        </motion.p>
        <motion.p {...fade(0.7)} className="mt-3 text-center font-mono text-[13px] tracking-[0.08em] text-muted">
          {profile.degree} · Incorporado al CPIC · {profile.stack}
        </motion.p>

        <motion.div {...fade(0.8)} className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href="#work"
            className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            Ver proyectos
          </a>
          <a
            href="#contact"
            className="rounded-full border border-fg/30 bg-bg/60 px-6 py-3 text-[15px] font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Contacto
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fg/30 bg-bg/60 px-6 py-3 text-[15px] font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn ↗
          </a>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fg/30 bg-bg/60 px-6 py-3 text-[15px] font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            WhatsApp ↗
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
