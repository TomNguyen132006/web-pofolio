"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/content";

// The homepage shows these first, in this order; "See more" reveals the rest.
const FEATURED = ["Lecturesque", "Q-Learning Maze Agent", "Machine Learning Fitness Tracker"];

const featured = FEATURED.map((name) => projects.find((p) => p.name === name)).filter((p) => p !== undefined);
const others = projects.filter((p) => !FEATURED.includes(p.name));

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? [...featured, ...others] : featured;

  return (
    <section id="projects" aria-labelledby="projects-heading" className="wrap section-pad">
      <Reveal>
        <SectionHeading id="projects-heading" label="Projects" title="Things I've built" />
      </Reveal>
      <div className="mt-12 flex flex-col gap-8 lg:gap-12">
        {visible.map((project, i) => (
          <FadeIn key={project.name}>
            <ProjectCard project={project} imageRight={i % 2 === 0} />
          </FadeIn>
        ))}
      </div>
      {others.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center justify-center rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-[background-color,color] duration-200 hover:bg-primary hover:text-on-primary"
          >
            {showAll ? "Show less" : "See more"}
          </button>
        </div>
      )}
    </section>
  );
}
