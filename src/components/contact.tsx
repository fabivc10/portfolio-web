"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { contact, profile } from "@/data/projects";
import { Reveal } from "./reveal";

const big = "display flex flex-col items-center text-center text-[clamp(2.2rem,10.5vw,9.5rem)]";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section ref={ref} id="contact" className="relative flex min-h-svh scroll-mt-20 flex-col overflow-x-clip px-5 pt-32 sm:px-8">
      <motion.div style={{ y, opacity }} className="flex flex-1 flex-col items-center justify-center">
        <p className="label mb-8">[05] — Contacto</p>
        <Reveal
          className={big}
          radius={110}
          alt={
            <>
              <span>Con gusto</span>
              <span>conversamos</span>
            </>
          }
        >
          <span>Hablemos</span>
          <span className="text-accent">de tu equipo</span>
        </Reveal>
        <p className="mt-10 max-w-xl text-center text-[18px] leading-relaxed text-fg/85">
          Abierto a oportunidades como desarrollador full stack, con enfoque en backend, automatización y cloud.
        </p>
        <div className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-full bg-accent px-7 py-4 text-[16px] font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.4 9.4 0 0 1 9.43 9.44c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.3 11.3 0 0 0 12.05.72C5.79.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.3 11.3 0 0 0 5.43 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02" />
            </svg>
            WhatsApp
          </a>
          <a
            href={contact.gmail}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-full border border-fg/30 bg-bg/60 px-7 py-4 text-[16px] font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3.5 6 8.5 7 8.5-7" />
            </svg>
            Gmail
          </a>
        </div>

        <dl className="mt-10 grid w-full max-w-xl gap-x-8 gap-y-4 text-center sm:grid-cols-2 sm:text-left">
          <div>
            <dt className="label">Correo</dt>
            <dd className="mt-1 text-[17px]">
              <a href={contact.mailto} className="underline-offset-4 hover:text-accent hover:underline">
                {profile.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label">Teléfono / WhatsApp</dt>
            <dd className="mt-1 text-[17px]">
              <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-accent hover:underline">
                {profile.phone}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fg/25 px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fg/25 px-5 py-2.5 text-[15px] font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Más código en GitHub ↗
          </a>
        </div>
      </motion.div>
      <footer className="label mt-16 flex flex-wrap justify-between gap-2 border-t border-line py-6">
        <span>© 2026 {profile.fullName}</span>
        <span>{profile.location}</span>
      </footer>
    </section>
  );
}
