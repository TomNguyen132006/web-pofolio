import Chip from "@/components/Chip";
import FadeIn from "@/components/FadeIn";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { skills } from "@/data/content";

const groups = [
  { title: "Languages", items: skills.languages },
  { title: "Frameworks", items: skills.frameworks },
  { title: "Cloud & AI", items: skills.cloudAI },
];

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="wrap section-pad">
      <Reveal>
        <SectionHeading id="skills-heading" label="Skills" title="What I work with" />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {groups.map((group, i) => (
          <FadeIn key={group.title} delay={i * 0.08} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-mono text-xs tracking-widest text-accent uppercase">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
