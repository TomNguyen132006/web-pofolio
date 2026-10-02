import FadeIn from "@/components/FadeIn";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/content";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="wrap section-pad">
      <Reveal>
        <SectionHeading id="projects-heading" label="Projects" title="Things I've built" />
      </Reveal>
      <div className="mt-12 flex flex-col gap-8 lg:gap-12">
        {projects.map((project, i) => (
          <FadeIn key={project.name}>
            <ProjectCard project={project} imageRight={i % 2 === 0} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
