import Image from "next/image";
import ArrowLink from "@/components/ArrowLink";
import Chip from "@/components/Chip";
import type { Project } from "@/data/content";

// "Study Buddy AI" -> "SB"
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

type Props = { project: Project; imageRight: boolean };

export default function ProjectCard({ project, imageRight }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_24px_-16px_rgba(43,34,29,0.35)] transition-[translate,box-shadow] duration-300 hover:shadow-[0_20px_40px_-20px_rgba(43,34,29,0.45)] motion-safe:hover:-translate-y-1 lg:grid lg:grid-cols-2">
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-chip-bg lg:aspect-auto lg:min-h-80 ${
          imageRight ? "lg:order-last" : ""
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(min-width: 1024px) 550px, 100vw"
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
          />
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center font-mono text-5xl font-medium text-chip-fg">
            {initials(project.name)}
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <h3 className="text-2xl font-bold tracking-tight break-words">{project.name}</h3>
        <p className="mt-3 text-muted">{project.description}</p>

        <p className="mt-5 font-mono text-xs tracking-widest text-accent uppercase">What I learned</p>
        <p className="mt-2">{project.learned}</p>

        <ul aria-label="Tech used" className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 lg:mt-auto lg:pt-6">
          <ArrowLink href={project.github}>GitHub</ArrowLink>
          {project.demo && <ArrowLink href={project.demo}>Live demo</ArrowLink>}
        </div>
      </div>
    </article>
  );
}
