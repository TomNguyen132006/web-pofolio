import Image from "next/image";
import ButtonLink from "@/components/ButtonLink";
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
            alt={project.imageAlt ?? `Screenshot of ${project.name}`}
            fill
            sizes="(min-width: 1024px) 550px, 100vw"
            className={`${
              project.imageFit === "contain" ? "object-contain p-4 sm:p-6" : "object-cover"
            } transition-transform duration-300 motion-safe:group-hover:scale-[1.02]`}
          />
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center font-mono text-5xl font-medium text-chip-fg">
            {initials(project.name)}
          </div>
        )}
        {/* Sits in the bottom padding of the image box, so the card layout doesn't change. */}
        {project.imageCredit && (
          <p className="absolute right-3 bottom-1.5 text-[11px] text-muted">{project.imageCredit}</p>
        )}
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <h3 className="text-2xl font-bold tracking-tight break-words">{project.name}</h3>
        <p className="mt-3 text-muted">{project.description}</p>

        <p className="mt-5 font-mono text-xs tracking-widest text-accent uppercase">{project.learnedLabel ?? "What I learned"}</p>
        <p className="mt-2">{project.learned}</p>

        <ul aria-label="Tech used" className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </ul>

        {/* Live Demo → Details → GitHub. Demo and Details only render when their URL is set. */}
        <div className="mt-6 flex flex-wrap gap-3 lg:mt-auto lg:pt-6">
          {project.demoUrl && (
            <ButtonLink href={project.demoUrl} variant="filled">
              Live Demo
            </ButtonLink>
          )}
          {project.detailsUrl && <ButtonLink href={project.detailsUrl}>Details</ButtonLink>}
          <ButtonLink href={project.github}>GitHub</ButtonLink>
        </div>
      </div>
    </article>
  );
}
