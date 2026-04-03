import { useEffect, useState } from 'react'

const sections = [
  { id: 'hero', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Tech Stack' },
]

const experiences = [
  {
    title: 'Backend / Cloud Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    badge: 'productive',
    bullets: [
      'Architected and deployed microservices on AWS using Spring Boot and Java 17.',
      'Reduced system latency by 40% through Redis caching and SQL optimization.',
      'Established CI/CD pipelines using GitHub Actions and Docker containers.',
    ],
    tags: ['Java', 'AWS', 'Spring Boot', 'Docker'],
  },
  {
    title: 'Data Engineer',
    company: 'DataStream Corp',
    period: '2021 - 2022',
    badge: 'analyst',
    bullets: [
      'Engineered end-to-end data pipelines using Python and Apache Airflow.',
      'Migrated legacy on-prem databases to PostgreSQL on AWS RDS.',
      'Optimized ETL processes resulting in a 35% faster data ingestion rate.',
    ],
    tags: ['Python', 'ETL', 'PostgreSQL', 'Data Pipelines'],
  },
  {
    title: 'Freelance Software Engineer',
    company: 'Independent',
    period: '2020 - 2021',
    badge: 'freelance',
    bullets: [
      'Developed full-stack web applications using React and Spring Boot for SMEs.',
      'Implemented secure REST APIs with OAuth2 authentication.',
    ],
    tags: ['React', 'TypeScript', 'REST'],
  },
]

const projects = [
  {
    eyebrow: 'Productive',
    title: 'EV Charger Monitoring Platform',
    description:
      'A high-performance cloud platform designed to monitor EV charging stations in real-time. Leverages a microservices architecture to process telemetry data and provide actionable insights.',
    tags: ['Java', 'Spring Boot', 'React', 'Docker', 'PostgreSQL'],
    visual: 'safe',
    reverse: false,
    primary: 'Live Demo',
    secondary: 'GitHub',
  },
  {
    eyebrow: 'Side Project',
    title: 'Cloud Microservices API',
    description:
      'Scalable REST API architecture designed for high availability and low latency. Ensuring 99.99% uptime for enterprise clients.',
    tags: ['Spring Boot', 'AWS ECS/ECR', 'Docker Hub', 'Redis'],
    visual: 'micro',
    reverse: true,
    primary: 'Live Demo',
    secondary: 'GitHub',
  },
  {
    eyebrow: 'Freelance',
    title: 'Data Pipeline Dashboard',
    description:
      'A comprehensive dashboard for processing and visualizing large volumes of data. Built with Python for ETL and integrated with cloud storage for seamless data flow.',
    tags: ['Python', 'Pandas', 'AWS Lambda', 'React Charts'],
    visual: 'data',
    reverse: false,
    primary: 'Download',
    secondary: 'GitHub',
  },
]

const stackGroups = [
  { title: 'Backend', items: ['Java', 'Spring Boot', 'REST APIs'] },
  { title: 'Cloud', items: ['AWS', 'Docker', 'Kubernetes'] },
  { title: 'Frontend', items: ['React', 'TypeScript'] },
  { title: 'Database', items: ['PostgreSQL', 'SQL'] },
  { title: 'Data Eng', items: ['Python', 'Pipelines'] },
]

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page-shell">
      <aside className="side-rail">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            className={`rail-item ${activeSection === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
          >
            <span className="rail-dot" />
            <span className="rail-label">{label}</span>
          </button>
        ))}
      </aside>

      <main className="page">
        <section className="hero" id="hero">
          <div className="hero-copy">
            <span className="eyebrow">Computer engineer</span>
            <h1>Cloud &amp; Data Engineer</h1>
            <p>
              Computer Engineer specialized in Java, Spring Boot, AWS, Docker,
              Python, React and Data Engineering.
            </p>
            <p>
              Building scalable cloud systems, high-performance APIs,
              microservices, and robust data solutions for real-world impact.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                Download CV
              </a>
              <a className="icon-button" href="#projects" aria-label="GitHub">
                gh
              </a>
              <a className="icon-button" href="#projects" aria-label="Close">
                x
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card">
              <div className="hero-card-grid" />
              <div className="hero-card-glow" />
              <span className="hero-mini-icon hero-mini-icon-a" />
              <span className="hero-mini-icon hero-mini-icon-b" />
              <span className="hero-mini-icon hero-mini-icon-c" />
              <div className="cloud-shape">
                <span className="cloud-main" />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section section-block" id="about">
          <div className="section-label-group">
            <span className="eyebrow">The architect</span>
            <h2>Mastering Complexity</h2>
          </div>
          <div className="about-copy">
            <p>
              I specialize in building the invisible infrastructure that powers
              modern digital experiences. With deep expertise in Java, Spring
              Boot, and AWS, I design systems that aren&apos;t just functional,
              but resilient and infinitely scalable.
            </p>
            <p>
              My focus lies at the intersection of <strong>Cloud Native
              Microservices</strong> and <strong>Robust Data Pipelines</strong>.
              Whether it&apos;s containerizing applications with Docker,
              orchestrating with Kubernetes, or managing complex datasets with
              Python and PostgreSQL, I prioritize clean architecture and
              high-performance engineering.
            </p>
          </div>
        </section>

        <section className="section-block" id="experience">
          <div className="section-header">
            <div>
              <span className="eyebrow">Career path</span>
              <h2>Professional Experience</h2>
            </div>
            <p>Designing and implementing systems for enterprise-grade environments.</p>
          </div>

          <div className="experience-list">
            {experiences.map((item) => (
              <article className="experience-card" key={item.title}>
                <div className="experience-head">
                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      {item.company} - {item.period}
                    </p>
                  </div>
                  <span className={`badge badge-${item.badge}`}>{item.badge}</span>
                </div>

                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="projects">
          <div className="section-header section-header-stack">
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2>Featured Projects</h2>
            </div>
          </div>

          <div className="projects-list">
            {projects.map((project) => (
              <article
                className={`project-card ${project.reverse ? 'project-card-reverse' : ''}`}
                key={project.title}
              >
                <div className={`project-visual project-visual-${project.visual}`}>
                  {project.visual === 'safe' && (
                    <>
                      <span className="safe-mark" />
                      <span className="safe-word">SAFE FO WORK</span>
                    </>
                  )}
                  {project.visual === 'micro' && (
                    <>
                      <span className="micro-title">MICROSERVICES</span>
                      <span className="micro-subtitle">PROJWISE WORK</span>
                      <span className="micro-note">- Safe work</span>
                    </>
                  )}
                  {project.visual === 'data' && <span className="data-core" />}
                </div>

                <div className="project-copy">
                  <span className="eyebrow eyebrow-inline">{project.eyebrow}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="hero-actions project-actions">
                    <a className="button button-secondary" href="#footer">
                      {project.primary}
                    </a>
                    <a className="button button-dark" href="#footer">
                      {project.secondary}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block stack-section" id="stack">
          <div className="stack-header">
            <span className="eyebrow">Tech stack</span>
            <h2>Technical Arsenal</h2>
          </div>

          <div className="stack-grid">
            {stackGroups.map((group) => (
              <article className="stack-card" key={group.title}>
                <div className="stack-icon" />
                <h3>{group.title}</h3>
                <div className="tag-row">
                  {group.items.map((item) => (
                    <span className="tag tag-bright" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer" id="footer">
        <span>ARCHITECT.IO</span>
        <div className="footer-links">
          <a href="#projects">GitHub</a>
          <a href="#projects">LinkedIn</a>
          <a href="#projects">Documentation</a>
          <a href="#projects">Privacy</a>
        </div>
        <span>&copy; 2024 Cloud Architect Portfolio. Built for scale.</span>
      </footer>
    </div>
  )
}

export default App
