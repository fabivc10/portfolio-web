import { techIcons } from "@/lib/tech-icons";

/** Estilos de panel que se alternan, como los anuncios de una valla perimetral de estadio */
const PANELS = ["bg-accent text-accent-ink", "bg-bg text-accent", "bg-fg text-bg", "bg-bg text-fg"];

/** Mínimo de paneles por vuelta, para que la tira nunca quede con hueco en tarjetas anchas */
const MIN = 8;

function Row({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0">
      {items.map((t, i) => {
        const icon = techIcons[t];
        return (
          <li
            key={i}
            className={`led-panel flex h-full shrink-0 items-center gap-2 border-r-2 border-bg px-4 font-display text-[15px] font-bold uppercase leading-none tracking-wide ${PANELS[i % PANELS.length]}`}
          >
            {icon && (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                <path d={icon} />
              </svg>
            )}
            {t}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Tira LED con las tecnologías de un proyecto (ícono + nombre) que corre de derecha a
 * izquierda. Se pausa con el puntero; estática con prefers-reduced-motion.
 */
export function LedTicker({ items }: { items: string[] }) {
  const loop = Array.from({ length: Math.ceil(MIN / items.length) }, () => items).flat();
  return (
    <div role="marquee" aria-label={`Tecnologías: ${items.join(", ")}`} className="led-board relative mt-2 h-9 w-full overflow-hidden rounded-sm bg-bg">
      <div className="led-track flex h-full w-max">
        <Row items={loop} />
        <Row items={loop} hidden />
      </div>
    </div>
  );
}
