// Fuente única de verdad para el contenido del portfolio.
// Para agregar un proyecto: añade un objeto a `projects` y (opcional) su captura en /public/projects.

export type Project = {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  /** URL del deploy en producción. Omitir si aún no hay deploy. */
  url?: string;
  /** Repo público en GitHub. Omitir si el repo es privado. */
  repo?: string;
  /** Ruta dentro de /public. Sin imagen se muestra un placeholder ASCII. */
  image?: string;
  status?: "live" | "wip";
  year: string;
  /** Contexto para RRHH: trabajo, cliente, freelance… */
  kind?: string;
  /** Enlaces extra (tiendas de apps, etc.). Se muestran debajo de la tarjeta. */
  links?: { label: string; url: string }[];
};

export type Job = {
  company: string;
  /** Sitio de la empresa, para que RRHH pueda verificarla */
  companyUrl?: string;
  role: string;
  period: string;
  mode?: string;
  points: string[];
};

export const profile = {
  name: "Fabián Vargas",
  fullName: "José Fabián Vargas Cascante",
  role: "Full Stack Developer",
  focus: "Backend · Automatización · Cloud",
  degree: "Ingeniero en Computación (TEC)",
  stack: "Node.js · TypeScript · Python",
  location: "Costa Rica",
  github: "https://github.com/fabivc10",
  githubUser: "fabivc10",
  linkedin: "https://www.linkedin.com/in/favargasc10",
  email: "favargasc10@gmail.com",
  phone: "+506 8585-9875",
  /** Número en formato internacional sin signos, para wa.me */
  whatsapp: "50685859875",
};

const greeting = "Hola Fabián, vi tu portfolio y me gustaría conversar contigo.";

export const contact = {
  whatsapp: `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(greeting)}`,
  gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${encodeURIComponent("Contacto desde tu portfolio")}`,
  mailto: `mailto:${profile.email}`,
};

/** Cifras rápidas para RRHH (salen del CV). */
export const highlights = [
  { value: "3+", label: "Años en producción", detail: "Backend, APIs e integraciones desde 2023" },
  { value: "450+", label: "Estaciones de carga", detail: "Operan sobre el servidor OCPP que diseñé" },
  { value: "10+", label: "Países", detail: "Red CREV Link en Latinoamérica" },
  { value: "3", label: "Plataformas", detail: "CREV, Coricar y Grupo Purdy sobre mi arquitectura" },
];

export const experience: Job[] = [
  {
    company: "CREV Latam",
    companyUrl: "https://crevlatam.com",
    role: "Desarrollador Backend (contrato)",
    period: "may. 2026 – oct. 2026",
    mode: "Medio tiempo · Remoto",
    points: [
      "Diseñé y desarrollé desde cero una API REST (Node.js/Express) para integrar la facturación de CREV con la Factura Electrónica en Línea (FEL) de la SAT de Guatemala.",
      "Eliminé los pasos manuales del pase a producción automatizando el despliegue con Docker.",
      "Operé el servicio en servidores Linux y resolví incidentes con análisis de logs.",
    ],
  },
  {
    company: "PC Shops",
    role: "Administrador de Bases de Datos y Servidores",
    period: "jul. 2025 – sep. 2026",
    mode: "Tiempo completo",
    points: [
      "Automaticé el procesamiento de información recibida por correo con tareas programadas y microservicios en Express.js y Python, con acceso a buzones vía OAuth 2.0.",
      "Administré y mantuve las bases de datos SQL Server y MySQL de la operación diaria.",
      "Investigué fallas en producción con análisis de logs y corregí su causa raíz.",
      "Realicé pruebas (QA) y di soporte técnico a usuarios.",
    ],
  },
  {
    company: "CREV Latam",
    companyUrl: "https://crevlatam.com",
    role: "Desarrollador Backend y Full Stack",
    period: "sep. 2023 – jun. 2025",
    points: [
      "Lideré la arquitectura del servidor OCPP (TypeScript/Express) de CREV Link: 450+ estaciones en 10+ países, base de las plataformas de Coricar y Grupo Purdy.",
      "Construí la capa en tiempo real con WebSocket, MQTT y APIs REST para clientes web y móviles (Android e iOS).",
      "Protegí la API con JWT y RBAC, y optimicé MongoDB con índices y paginación.",
      "Monté CI/CD con GitHub Actions y Azure DevOps, imágenes Docker y servicios orquestados con Kubernetes.",
      "Desarrollé el cliente web en React y Next.js: login, cuentas y roles, control remoto de cargadores y KPIs en tiempo real.",
      "Ejecuté pruebas funcionales y de regresión, y diagnostiqué incidentes reportados por clientes hasta resolverlos.",
    ],
  },
];

/** Trabajo independiente, en paralelo a los empleos de arriba. */
export const freelance: Job = {
  company: "Proyectos independientes",
  role: "Ingeniero de Software freelance · en paralelo",
  period: "sep. 2024 – actualidad",
  points: [
    "Software a la medida para pequeños negocios y docentes: levanto requerimientos, diseño la arquitectura, desarrollo y despliego.",
    "Grading App: aplicación para docentes (React, Tauri, SQLite) con versionado automático del esquema de base de datos.",
    "Nathaly: sitio de reservas para un negocio de turismo boutique (Angular, Supabase), con precio final al instante.",
  ],
};

export const education = {
  school: "Instituto Tecnológico de Costa Rica (TEC)",
  schoolUrl: "https://www.tec.ac.cr",
  degree: "Bachillerato en Ingeniería en Computación",
  year: "2024",
  membership: "Colegio de Profesionales en Informática y Computación (CPIC)",
  membershipUrl: "https://cpic.or.cr",
  membershipNote: "Incorporado desde 2025",
  english: "Inglés intermedio profesional",
  certs: "En curso: Microsoft AZ-104 · Cisco CCNA 200-301",
};

/** Tecnologías que domino a diario; se resaltan dentro de `skills`. El resto: con experiencia. */
export const coreSkills = ["TypeScript", "C# / .NET", "Node.js", "Express", "APIs REST", "SQL Server", "MySQL", "Docker", "Azure", "Linux", "React"];

export const skills: { group: string; items: string[] }[] = [
  { group: "Lenguajes", items: ["TypeScript", "JavaScript", "Python", "C# / .NET", "Java"] },
  { group: "Backend", items: ["Node.js", "Express", "APIs REST", "Microservicios", "WebSocket", "MQTT"] },
  { group: "Frontend", items: ["React", "Next.js"] },
  { group: "Datos", items: ["SQL Server", "MySQL", "PostgreSQL", "MongoDB"] },
  { group: "Cloud / DevOps", items: ["Docker", "Kubernetes", "Azure", "AWS", "GitHub Actions", "Azure DevOps"] },
  { group: "Servidores", items: ["Linux", "Windows Server", "Análisis de logs"] },
  { group: "Seguridad", items: ["JWT", "OAuth 2.0", "RBAC"] },
];

export const projects: Project[] = [
  {
    slug: "crev-link",
    name: "CREV Link",
    summary:
      "Diseñé la arquitectura del servidor OCPP que conecta 450+ estaciones de carga en 10+ países con las apps web, Android e iOS mediante WebSocket, MQTT y APIs REST.",
    tags: ["Node.js", "TypeScript", "MQTT"],
    kind: "Trabajo · CREV",
    url: "https://link.crev.cr",
    status: "live",
    year: "2023",
    links: [
      { label: "CREV · Google Play", url: "https://play.google.com/store/apps/details?id=crev.cr" },
      { label: "Coricar · Google Play", url: "https://play.google.com/store/apps/details?id=coricar.com" },
      { label: "Coricar · App Store", url: "https://apps.apple.com/cr/app/coricar/id6739074843" },
    ],
  },
  {
    slug: "billing-sync",
    name: "Billing Sync",
    summary:
      "Desarrollé un SaaS que localiza comprobantes fiscales en Gmail y Outlook vía OAuth, extrae XML/PDF y los consolida en un dashboard operativo.",
    tags: ["SaaS", "OAuth", "Dashboard"],
    url: "https://billing-sync.vercel.app",
    image: "/projects/billing-sync.png",
    status: "live",
    year: "2026",
  },
  {
    slug: "web-nathaly",
    name: "Nathaly",
    summary:
      "Sitio de reservas para un negocio de turismo boutique en Costa Rica: villas, tours y transporte con precio final al instante, en varios idiomas.",
    tags: ["Angular", "Supabase", "i18n"],
    kind: "Cliente",
    url: "https://web-nathaly.vercel.app",
    image: "/projects/web-nathaly.png",
    status: "live",
    year: "2026",
  },
  {
    slug: "grading-app",
    name: "Grading App",
    summary:
      "Aplicación para docentes: calificaciones, asistencia y adecuaciones, con versionado automático del esquema de base de datos para proteger los datos.",
    tags: ["React", "Tauri", "SQLite"],
    kind: "Freelance",
    url: "https://grading-app-bay.vercel.app",
    repo: "https://github.com/fabivc10/grading-app",
    image: "/projects/grading-app.png",
    status: "live",
    year: "2026",
  },
  {
    slug: "certstudy",
    name: "CertStudy",
    summary:
      "Plataforma de práctica para certificaciones (AWS SAA, Cisco CCNA): exámenes simulados con temporizador y labs guiados.",
    tags: ["React", "TypeScript"],
    url: "https://test-app-three-beta-31.vercel.app",
    repo: "https://github.com/fabivc10/test-app",
    image: "/projects/certstudy.png",
    status: "live",
    year: "2026",
  },
];
