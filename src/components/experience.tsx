"use client";

import { motion } from "motion/react";
import { coreSkills, education, experience, freelance, skills, type Job } from "@/data/projects";

const ease = [0.22, 1, 0.36, 1] as const;

function JobRow({ job }: { job: Job }) {
  return (
    <>
      <div>
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-accent">{job.period}</p>
        <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
        {job.companyUrl ? (
          <a href={job.companyUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
            {job.company} <span className="text-[0.7em] text-muted">↗</span>
          </a>
        ) : (
          job.company
        )}
      </p>
        {job.mode && <p className="mt-1 text-[14px] text-muted">{job.mode}</p>}
      </div>
      <div>
        <h3 className="text-[19px] font-semibold leading-snug text-fg">{job.role}</h3>
        <ul className="mt-4 space-y-2.5">
          {job.points.map((p) => (
            <li key={p} className="prose-body flex gap-3">
              <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/** Trayectoria laboral, educación y stack: la sección pensada para RRHH. */
export function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-20 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="label mb-4">[02] — Experiencia</p>
        <h2 className="display mb-12 pt-[0.1em] text-[clamp(2.6rem,7vw,5.5rem)]">
          Trayectoria<span className="text-accent">.</span>
        </h2>

        <ol className="border-b border-line">
          {experience.map((job, i) => (
            <motion.li
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.06, ease }}
              className="grid gap-4 border-t border-line bg-bg/70 py-9 backdrop-blur-[2px] md:grid-cols-[260px_1fr] md:gap-10"
            >
              <JobRow job={job} />
            </motion.li>
          ))}
        </ol>

        <div className="mt-6 grid gap-4 rounded-sm border border-dashed border-fg/20 bg-bg/70 p-6 md:grid-cols-[260px_1fr] md:gap-10">
          <JobRow job={freelance} />
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-[260px_1fr] md:gap-10">
          <div>
            <p className="label mb-4">Educación</p>
            <p className="font-display text-xl font-semibold leading-tight">{education.degree}</p>
            <p className="mt-2 text-[15px] text-muted">
              <a href={education.schoolUrl} target="_blank" rel="noreferrer" className="text-fg underline decoration-fg/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
                {education.school} ↗
              </a>{" "}
              · {education.year}
            </p>
            <ul className="mt-5 space-y-2 text-[15px] leading-relaxed text-muted">
              <li>
                <a href={education.membershipUrl} target="_blank" rel="noreferrer" className="text-fg underline decoration-fg/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
                  {education.membership} ↗
                </a>
                <span className="block">{education.membershipNote}</span>
              </li>
              <li>{education.english}</li>
              <li>{education.certs}</li>
            </ul>
          </div>
          <div>
            <p className="label mb-3">Competencias técnicas</p>
            <p className="mb-5 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-muted">
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" /> Uso diario
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-fg/40" /> Con experiencia
              </span>
            </p>
            <dl className="space-y-4">
              {skills.map((s) => (
                <div key={s.group} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <dt className="pt-1.5 text-[14px] font-medium text-fg/80">{s.group}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {s.items.map((it) => {
                      const core = coreSkills.includes(it);
                      return (
                        <span
                          key={it}
                          className={`rounded-full px-3 py-1 text-[14px] ${
                            core
                              ? "border border-accent/70 bg-accent/10 font-medium text-fg"
                              : "border border-fg/15 bg-bg/70 text-fg/75"
                          }`}
                        >
                          {it}
                          {core && <span className="sr-only"> (uso diario)</span>}
                        </span>
                      );
                    })}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
