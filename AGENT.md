# AGENT.md

Guía para agentes de IA (Claude Code, Copilot, Cursor, etc.) que trabajen en este repo.

## Qué es

Portfolio personal de **Fabián Vargas** (Cloud Engineer · Python & Go · Costa Rica).
Una sola página, estática, desplegada en Vercel. Muestra sus proyectos desplegados
y sus repos públicos de GitHub ([@fabivc10](https://github.com/fabivc10)).

## Stack

- **Next.js 16** (App Router, `cacheComponents` activado) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (tokens en `src/app/globals.css` vía `@theme inline`)
- **motion** (`motion/react`) para animaciones ligadas al scroll
- **lenis** para scroll suave
- Gestor de paquetes: **pnpm**

> ⚠️ Next.js 16 tiene cambios incompatibles con versiones anteriores. Antes de usar
> una API de Next, revisa la guía en `node_modules/next/dist/docs/`.

## Comandos

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint     # debe quedar en 0 errores
pnpm build    # debe compilar como página estática (○ /)
```

Corre siempre `pnpm lint && pnpm build` antes de dar un cambio por terminado.

## Estructura

```
src/
  app/
    layout.tsx        # fuentes, metadata, fondo, cursor, scroll suave
    page.tsx          # orden de las secciones
    opengraph-image.tsx # vista previa 1200×630 al compartir el link
    globals.css       # tokens de diseño + utilidades (.label, .display, .glass)
  components/
    ascii-ocean.tsx   # fondo: tiburones (PSO), tortugas y pulpos ASCII sobre una grilla
    reveal.tsx        # "lente" naranja que revela un texto alternativo
    cursor.tsx        # cursor personalizado (solo puntero fino)
    smooth-scroll.tsx # Lenis
    header.tsx        # nav flotante (desktop) y menú lateral "Menú +" (móvil: la página se encoge a la izquierda)
    side-rail.tsx
    hero.tsx, about.tsx, experience.tsx, services.tsx, work.tsx, contact.tsx
    carousel.tsx      # carrusel de capturas con timer y botones < > (proyectos con varias imágenes)
    led-ticker.tsx    # tira LED tipo valla de estadio con las tecnologías de cada proyecto
  data/projects.ts    # TODO el contenido editable (perfil, contacto, cifras, experiencia, skills, proyectos)
  lib/use-media.ts    # hook de media query (useSyncExternalStore)
  lib/scroll.ts       # puente con Lenis: bloquear scroll y navegar a #secciones
  lib/tech-icons.ts   # íconos (simple-icons) por nombre de tecnología
public/projects/      # capturas de los proyectos (1440×900)
docs/                 # DESIGN.md y PROJECTS.md
```

## Reglas

1. **El contenido vive en `src/data/projects.ts`.** No hardcodees textos de proyectos en los componentes.
2. **No inventes datos.** Stack, clientes, métricas o fechas de un proyecto solo si el usuario los confirmó o salen del sitio/repo.
3. **No enlaces repos privados.** `billing-sync`, `web-nathaly` y `fiscal-bridge` son privados: solo llevan `url` (deploy), sin `repo`.
4. **Sin pantalla de carga ni botón "START".** El usuario lo rechazó explícitamente: la página entra directo al contenido.
5. **Sin input de búsqueda ni "what's on your mind?".** Del video de referencia del fondo solo se toma la animación de fauna ASCII.
6. **Respeta `prefers-reduced-motion`.** Cada efecto nuevo necesita su versión estática (ver `useReducedMotion` en hero/work).
7. **Efectos de cursor solo con `(hover: hover) and (pointer: fine)`.** En táctil, `Reveal` muestra el círculo al tocar y lo cierra solo (no deambula: tapaba el titular en móvil).
8. **Estado de UI con media queries:** usa `useMedia()` y no `setState` dentro de `useEffect` (el lint de React lo marca como error).
9. **Tema oscuro único.** Colores solo vía tokens CSS (`bg`, `fg`, `muted`, `faint`, `line`, `accent`…); no uses hex sueltos en componentes.
10. **Fauna:** los tiburones acechan el cursor y acuden al último clic/toque; tortugas y pulpos huyen de los tiburones dentro de un radio circular (`FLEE`). Donde dos animales se traslapan la celda se tiñe de naranja.
11. El canvas del fondo está en `-z-10`: **no le pongas `background` a `body`**, o lo tapa. El fondo va en `html`.

## Idioma

Toda la UI y la documentación están en **español**. Los identificadores del código van en inglés.

## Deploy

Vercel, framework preset Next.js, sin variables de entorno. Ver `README.md`.
