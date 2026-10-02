import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/content";

// Short write-up for the Machine Learning Fitness Tracker card's "Details" button.
// The Live Demo and GitHub links come from data/content.ts, so they stay in sync with the card.
const PROJECT_NAME = "Machine Learning Fitness Tracker";

export const metadata: Metadata = {
  title: `${PROJECT_NAME} | ${profile.name}`,
  description: "Results, limitations and credits for my barbell exercise classifier and rep counter.",
};

const results = [
  { test: "Split by set (unseen sets)", mine: "94.95%", paper: "98.51%" },
  { test: "Unseen person (leave-one-participant-out)", mine: "94.85%", paper: "85.43%" },
  { test: "Rep counting error", mine: "12.3%", paper: "~5%" },
];

const sourceRepo = "https://github.com/daveebbelaar/tracking-barbell-exercises";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function FitnessTrackerPage() {
  const project = projects.find((p) => p.name === PROJECT_NAME);
  if (!project) notFound();

  return (
    <>
      <main className="wrap section-pad">
        <article className="mx-auto max-w-3xl leading-relaxed">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-[3px] transition-colors duration-200 hover:decoration-accent"
          >
            <span aria-hidden>←</span> Back to projects
          </Link>

          <h1 className="mt-8 text-4xl font-bold tracking-tight break-words sm:text-5xl">{PROJECT_NAME}</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <ButtonLink href={project.demoUrl} variant="filled">
                Live Demo
              </ButtonLink>
            )}
            <ButtonLink href={project.github}>GitHub</ButtonLink>
          </div>

          <Section title="Why I built this">
            <p>
              This was my first machine learning project. I wanted to learn how a full ML pipeline works by building one, so
              I followed Dave Ebbelaar&apos;s tutorial and then kept going on my own. I liked the idea because it&apos;s
              easy to lose count of reps during a workout, and a wrist sensor that counts for you could make logging
              workouts automatic.
            </p>
          </Section>

          <Section title="Results">
            {/* Scrolls sideways on very narrow phones instead of squashing the columns. */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm sm:text-base">
                <thead className="bg-surface">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">How I tested</th>
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">My result</th>
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Original paper</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.test} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 font-normal">{row.test}</th>
                      <td className="px-4 py-3 font-mono tabular-nums">{row.mine}</td>
                      <td className="px-4 py-3 font-mono text-muted tabular-nums">{row.paper}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Limitations">
            <ul className="list-disc space-y-3 pl-5 marker:text-accent">
              <li>
                Random splits make the model look better than it is. Splitting the data row by row gave 99.79%, but rows a
                fraction of a second apart end up in both the training and test sets. When I tested on whole sets the model
                had never seen, accuracy dropped to about 95%.
              </li>
              <li>
                People move differently. On new people the model averaged about 95%, but for two of the five participants it
                was only about 87%. Five people is a small dataset, so I can&apos;t say how well it works for everyone.
              </li>
              <li>
                Rep counting is the weakest part. My counter counts peaks for every exercise and gets about 12% of reps
                wrong, compared to about 5% in the original paper. Also, the &quot;true&quot; rep counts come from the set
                type (heavy = 5, medium = 10), not from someone counting each rep.
              </li>
            </ul>
          </Section>

          <Section title="Credits">
            <p>
              Data, original approach and exercise illustration: Dave Ebbelaar —{" "}
              <a
                href={sourceRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium break-all text-accent underline decoration-accent/40 underline-offset-[3px] transition-colors duration-200 hover:decoration-accent"
              >
                {sourceRepo}
              </a>
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}
