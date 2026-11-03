# Diseño

## Referencias

| Referencia | Qué se toma | Qué NO se toma |
| --- | --- | --- |
| [Video 1 — "DayDream"](https://media.inspora.design/posts/8ce4439d-c915-44d9-9331-a94d55c26bdb.mp4) | Efectos de scroll: hero que se aleja/desvanece, texto que se enciende palabra por palabra, grilla de proyectos con parallax por columna, CTA final que crece | El cielo azul y las nubes |
| [Video 2 — peces ASCII](https://media.inspora.design/posts/e94af9b5-7301-4ab3-95f1-7068d60eed96.mp4) | Fondo: peces/tiburones en arte ASCII (baldosas con glifos `.:;tX%S8@`) nadando sobre una grilla tenue, con un halo central | El input de búsqueda, "what's on your mind?" y el botón History |
| [minhpham.design](https://minhpham.design/) | Fondo casi negro, texto beige, un solo acento naranja, tipografía display enorme en mayúsculas, lente naranja que revela texto alternativo bajo el cursor, cursor personalizado, listas grandes con relleno al hacer scroll, rieles laterales | Pantalla de carga y botón **START** (descartados a pedido del usuario), sonido, 3D |

## Tokens

Definidos en `src/app/globals.css` y expuestos a Tailwind con `@theme inline`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#0d0d0d` | Fondo |
| `--fg` | `#d1c7b7` | Texto principal (beige) |
| `--muted` | `#a8a093` | Texto secundario, etiquetas |
| `--faint` | `#4a4640` | Texto "apagado" antes de rellenarse con el scroll |
| `--line` | `fg` al 10% | Bordes y separadores |
| `--accent` | `#ff5a36` | Naranja: lente, cursor, palabras clave, hovers |
| `--fish-*` | — | Colores que lee el canvas del fondo; `--fish-alpha` regula su intensidad |

Clases utilitarias:

- `.display`: League Spartan 700, mayúsculas, interlineado 0.86. Para titulares.
- `.label`: Geist Mono 12px, mayúsculas, tracking amplio. Para `[01] — Sección`.
- `.glass`: superficie translúcida con blur.

Fuentes: **League Spartan** (display), **Geist** (texto), **Geist Mono** (etiquetas).

## Efectos

| Efecto | Dónde | Archivo |
| --- | --- | --- |
| Fauna ASCII + grilla + halo | Fondo fijo. **Tiburones**: columna *follow-the-leader* con onda enmascarada en el tercio trasero (nado thunniforme), frecuencia de coletazo según velocidad; acechan el cursor con **PSO** (anillo alrededor del cursor, pbest + lbest en anillo). **Tortugas**: caparazón y aletas que reman. **Pulpos**: propulsión a chorro, tentáculos que se cierran/abren. Dibujo suavizado (splat bilineal) sin parpadeo; un clic dispersa a todos | `ascii-ocean.tsx` |
| Lente que revela texto | Hero (`<h1>` "Full Stack · Backend & Cloud" → "Código que llega a producción") y contacto | `reveal.tsx` |
| Cursor naranja | Global. Crece con la etiqueta "VER" sobre las tarjetas de proyecto | `cursor.tsx` |
| Hero que se aleja | Al hacer scroll baja, se encoge y se desvanece | `hero.tsx` |
| Palabras que se encienden | Párrafo "Sobre mí" | `about.tsx` |
| Relleno izquierda→derecha | Lista "Lo que hago" | `services.tsx` |
| Título que se desliza + parallax por columna | Proyectos | `work.tsx` |
| Escalonado al entrar | Experiencia, cifras y tarjetas | `experience.tsx`, `about.tsx`, `work.tsx` |
| Estado activo del nav | Raya naranja junto a la sección visible | `header.tsx` |

Todos los efectos se apagan o quedan estáticos con `prefers-reduced-motion: reduce`.
El cursor y el lente interactivo solo se activan con mouse o trackpad. En pantallas
táctiles el lente aparece al tocar y se cierra solo.

## Orden de secciones

`[01] Sobre mí` (+ cifras) → `[02] Experiencia` (trayectoria, freelance aparte, educación, competencias) → `[03] Enfoque` → `[04] Proyectos` (+ link a GitHub) → `[05] Contacto` (WhatsApp, Gmail, LinkedIn)

## Notas para RRHH

- El rol se muestra igual en title, meta, hero, OG image y riel lateral: **Full Stack Developer · Backend · Automatización · Cloud**.
- La fauna se atenúa (máscara) en la columna central de escritorio y bajan a 45% en móvil para no competir con el texto.
- `opengraph-image.tsx` genera la vista previa 1200×630 al compartir el link.
- No se publica el CV en PDF ni el nivel MCER de inglés (decisión del usuario).

## Fauna del fondo (`ascii-ocean.tsx`)

Referencias de técnica: animación de peces por vértices de Godot (onda `cos(time + body)` con
máscara `smoothstep` hacia la cola + leve pivot), cinemática de nado thunniforme (la velocidad
cambia la frecuencia del coletazo, no la amplitud; la fase se acumula) y columnas
*follow-the-leader* con restricción de distancia y de ángulo.

PSO de los tiburones: función objetivo `((d − R)/R)² + 1.2·Σ amontonamiento`, pbest reevaluado
cada cuadro (entorno dinámico), lbest de los 2 vecinos, `r1/r2` renovados cada 0.5–1 s para
no temblar. La velocidad PSO solo fija la dirección deseada; giro y aceleración siguen limitados.
Parámetros en la constante `PSO`.
