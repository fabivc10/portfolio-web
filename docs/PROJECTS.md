# Proyectos

Todo el contenido vive en [`src/data/projects.ts`](../src/data/projects.ts).

## Inventario actual

| Proyecto | Deploy | Repo | Estado |
| --- | --- | --- | --- |
| CREV Link (empleador, con enlaces a Google Play / App Store) | [link.crev.cr](https://link.crev.cr) | privado | live |
| Billing Sync | [billing-sync.vercel.app](https://billing-sync.vercel.app) | privado | live |
| Nathaly | [web-nathaly.vercel.app](https://web-nathaly.vercel.app) | privado | live |
| Grading App | [grading-app-bay.vercel.app](https://grading-app-bay.vercel.app) | [fabivc10/grading-app](https://github.com/fabivc10/grading-app) | live |
| CertStudy (`test-app`) | [test-app-three-beta-31.vercel.app](https://test-app-three-beta-31.vercel.app) | [fabivc10/test-app](https://github.com/fabivc10/test-app) | live |

La sección "Más en GitHub" se quitó (los repos no tenían descripción); queda un link al perfil bajo Proyectos. Fiscal Bridge se quitó hasta tener contenido.
`valeria-birthday` se dejó fuera a propósito porque es personal.

## Agregar un proyecto

1. Agrega un objeto a `projects`:

   ```ts
   {
     slug: "mi-proyecto",
     name: "Mi Proyecto",
     summary: "Una o dos líneas: qué problema resuelve.",
     tags: ["Web app", "API"],          // 2–3, se muestran en mayúsculas
     url: "https://mi-proyecto.vercel.app",
     repo: "https://github.com/fabivc10/mi-proyecto", // solo si es público
     image: "/projects/mi-proyecto.png",              // opcional
     status: "live",                                  // o "wip"
     year: "2026",
   }
   ```

2. Sin `image`, la tarjeta muestra un placeholder ASCII con la etiqueta "En desarrollo".
3. La grilla alterna columnas: los índices pares van a la izquierda y los impares a la derecha (con más parallax).

## Generar la captura

Formato: PNG de 1440×900, mostrando el viewport superior del sitio.

```bash
google-chrome --headless=new --hide-scrollbars --window-size=1440,900 \
  --virtual-time-budget=8000 \
  --screenshot=public/projects/mi-proyecto.png https://mi-proyecto.vercel.app
```

Las capturas se ven en escala de grises y recuperan el color al pasar el cursor.
