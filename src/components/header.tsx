"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/data/projects";

const links = [
  { href: "#about", label: "Sobre mí" },
  { href: "#experience", label: "Experiencia" },
  { href: "#work", label: "Proyectos" },
  { href: "#contact", label: "Contacto" },
];

export function Header() {
  const [active, setActive] = useState("");

  // Marca en el nav la sección que cruza la mitad del viewport
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
          else if (e.target.id === "about" && e.boundingClientRect.top > 0) setActive("");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 sm:px-8"
    >
      <a
        href="#top"
        aria-label={`${profile.name}, ir al inicio`}
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-fg font-display text-[15px] font-bold text-bg"
      >
        FV
      </a>
      <nav aria-label="Secciones" className="glass pointer-events-auto flex flex-col items-end gap-1 rounded-lg px-4 py-3">
        {links.map((l) => {
          const on = active === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              aria-current={on ? "location" : undefined}
              className={`flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors hover:text-fg ${
                on ? "text-fg" : "text-fg/65"
              }`}
            >
              <span
                aria-hidden
                className={`h-px bg-accent transition-all duration-300 ${on ? "w-4 opacity-100" : "w-0 opacity-0"}`}
              />
              {l.label}
            </a>
          );
        })}
      </nav>
    </motion.header>
  );
}
