import type Lenis from "lenis";

/** Puente entre Lenis (smooth-scroll.tsx) y el resto de la UI (menú móvil). */
let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

/** Bloquea/desbloquea el scroll de la página (menú abierto). */
export function lockScroll(lock: boolean) {
  document.documentElement.classList.toggle("scroll-locked", lock);
  if (lock) lenis?.stop();
  else lenis?.start();
}

/** Lleva a una sección (`#id`) respetando el header fijo. */
export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ block: "start" });
  history.replaceState(null, "", hash);
}
