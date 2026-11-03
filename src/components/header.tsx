"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { contact, profile } from "@/data/projects";
import { lockScroll, scrollToHash } from "@/lib/scroll";

const links = [
  { href: "#about", label: "Sobre mí" },
  { href: "#experience", label: "Experiencia" },
  { href: "#work", label: "Proyectos" },
  { href: "#contact", label: "Contacto" },
];

const social = [
  { href: profile.github, label: "GitHub" },
  { href: profile.linkedin, label: "LinkedIn" },
  { href: contact.whatsapp, label: "WhatsApp" },
];

export function Header() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // Sección activa: la última cuyo inicio ya pasó el 45% de la pantalla (una sola a la vez).
  // Al llegar al final de la página gana la última (Contacto), aunque no alcance esa línea.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = "";
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = `#${s.id}`;
      if (atEnd && sections.length) current = `#${sections[sections.length - 1].id}`;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Menú móvil: la página se encoge y se corre a la izquierda (CSS: html.menu-open main)
  useEffect(() => {
    const html = document.documentElement;
    const main = document.querySelector("main");
    if (open) html.style.setProperty("--menu-oy", `${window.scrollY + window.innerHeight / 2}px`);
    // Al cerrar, el recorte se mantiene hasta que la página vuelve a su tamaño (0.8 s en CSS)
    let closing = 0;
    html.classList.remove("menu-closing");
    if (!open && html.classList.contains("menu-open")) {
      html.classList.add("menu-closing");
      closing = window.setTimeout(() => html.classList.remove("menu-closing"), 800);
    }
    html.classList.toggle("menu-open", open);
    if (main) main.inert = open;
    lockScroll(open);
    if (!open) return () => window.clearTimeout(closing);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    // Espera a que la página vuelva a su sitio (y se quite el recorte) antes de desplazarse
    window.setTimeout(() => scrollToHash(href), 820);
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-end px-5 pt-5 sm:px-8"
    >
      {/* Escritorio: nav flotante */}
      <nav aria-label="Secciones" className="glass pointer-events-auto hidden flex-col items-end gap-1 rounded-lg px-4 py-3 md:flex">
        {links.map((l) => {
          const on = active === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              aria-current={on ? "location" : undefined}
              className={`flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors hover:text-fg ${
                on ? "text-accent" : "text-fg/65"
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

      {/* Móvil: botón "Menú +" que se vuelve "×" */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className={`pointer-events-auto relative z-10 flex h-9 items-center justify-center gap-2 overflow-hidden rounded-full bg-fg font-mono text-[12px] uppercase tracking-[0.16em] text-bg transition-[width,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
          open ? "w-9 px-0" : "w-[92px] px-4"
        }`}
      >
        <span className={`whitespace-nowrap transition-opacity duration-300 ${open ? "w-0 opacity-0" : "opacity-100"}`}>
          Menú
        </span>
        <span
          aria-hidden
          className={`text-[16px] leading-none transition-transform duration-500 motion-reduce:transition-none ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>

      {/* Toque fuera del panel: cierra */}
      {open && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="pointer-events-auto fixed inset-y-0 left-0 w-[28vw] md:hidden"
        />
      )}

      <aside
        id="mobile-menu"
        aria-label="Navegación"
        aria-hidden={!open}
        inert={!open}
        className={`mobile-menu pointer-events-auto fixed inset-y-0 right-0 flex w-[72vw] flex-col px-6 pb-10 pt-24 md:hidden ${
          open ? "is-open" : ""
        }`}
      >
        <p className="label mb-6">Navegación</p>
        <nav aria-label="Secciones" className="flex flex-col gap-1">
          {links.map((l, i) => {
            const on = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                aria-current={on ? "location" : undefined}
                style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
                className={`menu-item group flex items-center text-[clamp(1.6rem,8vw,2.2rem)] leading-tight transition-colors ${
                  on ? "text-accent" : "text-fg hover:text-accent"
                }`}
              >
                <span
                  aria-hidden
                  className={`overflow-hidden transition-[width,margin] duration-300 ${
                    on ? "mr-2 w-4" : "mr-0 w-0 group-hover:mr-2 group-hover:w-4"
                  }`}
                >
                  –
                </span>
                {l.label}
              </a>
            );
          })}
        </nav>
        <span className="my-7 h-px w-full bg-line" />
        <ul className="flex flex-col gap-2">
          {social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-[14px] text-muted transition-colors hover:text-accent">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="label mt-auto">{profile.location}</p>
      </aside>
    </motion.header>
  );
}
