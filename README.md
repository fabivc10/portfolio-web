# portfolio-web

Portfolio de **Fabián Vargas**: Cloud Engineer en Costa Rica, Python & Go.

Página única con peces ASCII nadando de fondo, un lente naranja que revela texto
oculto bajo el cursor y secciones que se animan con el scroll.

## Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build
```

Requiere Node 20+ y pnpm.

## Editar contenido

Todo el texto editable está en [`src/data/projects.ts`](src/data/projects.ts).
Para agregar un proyecto, sigue [docs/PROJECTS.md](docs/PROJECTS.md).

## Diseño

Las referencias, los tokens y los efectos están en [docs/DESIGN.md](docs/DESIGN.md).

## Deploy en Vercel

1. Sube el repo a GitHub (`fabivc10/portfolio-web`).
2. En Vercel, **Add New → Project** e importa el repo. Next.js se detecta solo; no hacen falta variables de entorno.
3. Cada push a `main` despliega a producción.

También se puede desplegar desde la terminal con `vercel --prod`.

## Para agentes de IA

Ver [AGENT.md](AGENT.md).

## Licencia

MIT
