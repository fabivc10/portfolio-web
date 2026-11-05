// Fuente única de verdad para el contenido del portfolio.
// Para agregar un proyecto: añade un objeto a `projects` y su captura en /public/projects.

export type Project = {
  slug: string;
  name: string;
  summary: string;
  /** Tecnologías: se muestran en la tira LED de la tarjeta (íconos en lib/tech-icons.ts) */
  tags: string[];
  /** URL del deploy en producción. Omitir si aún no hay deploy. */
  url?: string;
  /** Repo público en GitHub. Omitir si el repo es privado. */
  repo?: string;
  /** Capturas 1440×900 dentro de /public/projects. Con más de una se muestra un carrusel. */
  images: Shot[];
  /** Detalle técnico (cómo funciona por dentro). Solo datos verificables en el código o el CV. */
  details?: string[];
  /** Contexto para RRHH: trabajo, cliente, freelance… */
  kind?: string;
  /** Enlaces extra (tiendas de apps, etc.). Se muestran debajo de la tarjeta. */
  links?: { label: string; url: string }[];
};

export type Shot = {
  src: string;
  /** Qué muestra la captura: se usa en el texto alternativo y en el control del carrusel */
  label: string;
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
  { value: "3+", label: "Años de experiencia", detail: "Desarrollo backend y full stack desde sep. 2023" },
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
    mode: "Medio tiempo · Remoto · en paralelo a PC Shops",
    points: [
      "Diseñé y desarrollé desde cero una API REST (Node.js/Express) para integrar la facturación de CREV con la Factura Electrónica en Línea (FEL) de la SAT de Guatemala.",
      "Eliminé los pasos manuales del pase a producción automatizando el despliegue con Docker.",
      "Operé el servicio en servidores Linux y resolví incidentes con análisis de logs.",
    ],
  },
  {
    company: "PC Shops",
    role: "Desarrollador Backend y Administrador de Sistemas",
    period: "jul. 2025 – sep. 2026",
    mode: "Híbrido",
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
      "Monitoreé la plataforma con Prometheus y Grafana (consumo de recursos y actividad de los cargadores) y analicé logs de los dispositivos IoT para corregir incidentes reportados por clientes.",
      "Ejecuté pruebas funcionales y de regresión antes de cada liberación.",
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
    "Billing Sync: herramienta que extrae comprobantes electrónicos del correo vía OAuth 2.0 y los consolida para exportar a Excel.",
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

/** Lo que uso a diario (4–5, defendible en entrevista); se resalta dentro de `skills`. El resto: con experiencia. */
export const coreSkills = ["Node.js", "TypeScript", "Express", "PostgreSQL", "Docker"];

export const skills: { group: string; items: string[] }[] = [
  { group: "Lenguajes", items: ["TypeScript", "JavaScript", "Python", "C# / .NET", "Java"] },
  { group: "Backend", items: ["Node.js", "Express", "ASP.NET Core", "Django", "APIs REST", "Microservicios", "WebSocket", "MQTT"] },
  { group: "Frontend", items: ["React", "Next.js", "Angular", "Tauri"] },
  { group: "Datos", items: ["SQL Server", "MySQL", "PostgreSQL", "MongoDB"] },
  { group: "Cloud / DevOps", items: ["Docker", "Kubernetes", "Azure", "AWS", "GitHub Actions", "Azure DevOps", "Prometheus", "Grafana"] },
  { group: "Servidores", items: ["Linux", "Windows Server", "Análisis de logs"] },
  { group: "Seguridad", items: ["JWT", "OAuth 2.0", "RBAC"] },
];

/** Ordenados por importancia: los de backend y producción primero, los personales al final. */
export const projects: Project[] = [
  {
    slug: "crev-link",
    name: "CREV Link",
    summary:
      "Plataforma de carga para vehículos eléctricos: servidor OCPP que conecta 450+ estaciones en 10+ países con las apps web, Android e iOS. Diseñé su arquitectura.",
    details: [
      "Mantiene las conexiones WebSocket concurrentes de los cargadores (protocolo OCPP).",
      "Expone APIs REST, WebSocket y MQTT para los clientes web y móviles, con JWT y RBAC.",
      "Nació de la ingeniería inversa de una plataforma heredada en Spring Boot; hoy la usan también Coricar y Grupo Purdy.",
      "Despliegue en Docker y Kubernetes con CI/CD; monitoreo con Prometheus y Grafana.",
    ],
    tags: ["Node.js", "TypeScript", "Express", "WebSocket", "MQTT", "MongoDB", "Docker", "Kubernetes"],
    kind: "Trabajo · CREV",
    url: "https://link.crev.cr",
    images: [
      { src: "/projects/crev-arch.png", label: "Arquitectura" },
      { src: "/projects/crev-web-v2.png", label: "Web app" },
      { src: "/projects/crev-app-v2.png", label: "App CREV" },
      { src: "/projects/coricar-app-v2.png", label: "App Coricar" },
    ],
    links: [
      { label: "CREV · Web app", url: "https://app.crevlatam.com" },
      { label: "CREV · Google Play", url: "https://play.google.com/store/apps/details?id=crev.cr" },
      { label: "Coricar · Google Play", url: "https://play.google.com/store/apps/details?id=coricar.com" },
      { label: "Coricar · App Store", url: "https://apps.apple.com/cr/app/coricar/id6739074843" },
    ],
  },
  {
    slug: "billing-sync",
    name: "Billing Sync",
    summary:
      "Herramienta que busca los comprobantes electrónicos en el correo, extrae sus datos fiscales y los consolida en un dashboard exportable a Excel.",
    details: [
      "Acceso al buzón de Gmail con OAuth 2.0; las URLs de callback se resuelven por ambiente (producción y previews).",
      "Búsqueda paginada por rango de fechas, ajustada para no perder comprobantes sin volverse lenta.",
      "Parser del XML de Hacienda como fuente principal, con el PDF como respaldo.",
      "Arquitectura por features (model, repository, service) y pruebas con Vitest.",
    ],
    tags: ["Next.js", "React", "TypeScript", "Zustand", "Tailwind CSS", "Vitest"],
    kind: "Freelance",
    url: "https://billing-sync.vercel.app",
    images: [{ src: "/projects/billing-sync.png", label: "Pantalla principal" }],
  },
  {
    slug: "web-nathaly",
    name: "Nathaly",
    summary:
      "Sitio de reservas para un negocio de turismo boutique en Costa Rica: villas, tours y transporte con precio final al instante, en varios idiomas.",
    tags: ["Angular", "TypeScript", "Supabase", "Tailwind CSS"],
    kind: "Freelance",
    url: "https://web-nathaly.vercel.app",
    images: [{ src: "/projects/web-nathaly.png", label: "Pantalla principal" }],
  },
  {
    slug: "grading-app",
    name: "Grading App",
    summary:
      "Aplicación para docentes: calificaciones, asistencia y adecuaciones, con versionado automático del esquema de base de datos para proteger los datos.",
    tags: ["React", "Tauri", "SQLite"],
    kind: "Freelance",
    url: "https://grading-app-bay.vercel.app",
    images: [{ src: "/projects/grading-app.png", label: "Pantalla principal" }],
  },
  {
    slug: "ev-charging-platform",
    name: "EV Charging Platform",
    summary:
      "CSMS para cargadores de vehículos eléctricos: recibe estaciones por OCPP 1.6J, 2.0.1 y 2.1 o MQTT y muestra cada sesión en un dashboard en tiempo real, con un cargador emulado en el navegador para probarlo sin hardware.",
    details: [
      "Backend hexagonal: una estrategia por versión de OCPP sobre la misma conexión OCPP-J; el núcleo de negocio no conoce el protocolo.",
      "Valida cada mensaje contra la especificación 1.6 (enumeraciones, tamaños CiString, dateTime) y responde el CALLERROR que corresponde.",
      "Smart Charging: perfiles de carga apilados (SetChargingProfile, GetCompositeSchedule) que el emulador aplica en tiempo real.",
      "El emulador sigue la spec: registro con BootNotification, máquina de estados del conector, cola de transacciones offline y MeterValues según su configuración.",
    ],
    tags: ["Node.js", "TypeScript", "Express", "WebSocket", "MQTT", "Zod", "React", "Zustand", "three.js", "Vite"],
    kind: "Proyecto personal",
    url: "https://electric-vehicle-platform-test.vercel.app",
    repo: "https://github.com/fabivc10/electric-vehicle-platform-test",
    images: [
      { src: "/projects/ev-platform-session.png", label: "Sesión de carga en vivo" },
      { src: "/projects/ev-platform-emulator.png", label: "Cargador emulado" },
      { src: "/projects/ev-platform-profiles.png", label: "Perfiles de carga (Smart Charging)" },
    ],
  },
  {
    slug: "certstudy",
    name: "CertStudy",
    summary:
      "Plataforma de práctica para certificaciones (AWS SAA, Cisco CCNA): exámenes simulados con temporizador y labs guiados.",
    tags: ["React", "TypeScript", "Vite", "React Router"],
    url: "https://test-app-three-beta-31.vercel.app",
    repo: "https://github.com/fabivc10/test-app",
    kind: "Proyecto personal",
    images: [{ src: "/projects/certstudy-exam.png", label: "Simulacro de examen en curso" }],
  },
];
