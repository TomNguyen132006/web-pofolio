import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/content";

// Short write-up for the Q-Learning Maze Agent card's "Details" button.
// The GitHub and demo links come from data/content.ts, so they stay in sync with the card.
const PROJECT_NAME = "Q-Learning Maze Agent";

export const metadata: Metadata = {
  title: `${PROJECT_NAME} | ${profile.name}`,
  description:
    "How a tabular Q-learning agent learns to solve a grid maze, and the browser game I built so anyone can draw a maze and watch it learn.",
};

const problems = [
  "Reinforcement learning is usually taught through equations, and I could not tell if I understood them until I made something run.",
  "I wanted to see an agent go from random wandering to a smart route, not just read that it can.",
  "Libraries hide the learning loop. I wanted to write the environment, the Q-table and the update rule by hand.",
];

const results = [
  "A 1D corridor agent that finds the shortest path (4 steps in a 5-cell corridor) by its second training episode.",
  "A 2D maze agent in Python that reads any maze from a text file, with walls and traps, and checks that a path exists.",
  "It trains for as many episodes as the maze needs, then prints the final greedy path and a policy grid of arrows.",
  "A browser game where you draw your own maze, tune alpha, gamma and epsilon, and watch the Q-table fill in live.",
  "An explainer video for each version, so the idea can be understood without reading code.",
];

const steps = [
  { title: "Observe the state", text: "The agent is in a grid cell, for example (0, 0). That cell is its state." },
  {
    title: "Choose an action",
    text: "With probability epsilon it tries a random direction (explore). Otherwise it takes the direction with the highest Q-value for that cell (exploit).",
  },
  {
    title: "The environment responds",
    text: "The maze moves the agent unless a wall blocks it, then returns the new cell and a reward: +10 at the goal, -10 on a trap, -1 for every other step. The -1 pushes the agent to find short paths.",
  },
  {
    title: "Update the Q-table",
    text: "Q(s, a) moves toward reward + gamma × max Q(next state), by a step of size alpha. This is the Q-learning update, and it is how the goal's reward slowly spreads backwards along the path.",
  },
  {
    title: "Repeat",
    text: "Run many episodes from the start cell. Afterwards, the greedy path (epsilon = 0) follows the best Q-value in each cell, and the policy grid shows one arrow per cell.",
  },
];

const techStack = [
  { name: "Python (standard library only)", role: "the maze environment, Q-table and Q-learning loop, with no Gym, NumPy or ML framework" },
  { name: "Plain HTML, CSS and JavaScript", role: "the maze-editor game, a single page with the same Q-learning algorithm re-implemented for the browser" },
  { name: "Vercel", role: "hosts the playable maze game" },
  { name: "Node.js render scripts and Python audio mixing", role: "build the explainer videos in the q-corridor and q-grid folders" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-3 pl-5 marker:text-accent">
      {items.map((item) => (
        <li key={item} className="break-words">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ReinforcementLearningPage() {
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
          <p className="mt-4 text-lg text-muted">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <ButtonLink href={project.demoUrl} variant="filled">
                Play the Maze
              </ButtonLink>
            )}
            <ButtonLink href={project.github}>GitHub</ButtonLink>
          </div>

          <Section title="The Problem">
            <BulletList items={problems} />
          </Section>

          <Section title="Results">
            <BulletList items={results} />
          </Section>

          <Section title="How It Works">
            <p className="mb-4 text-muted">
              Q-learning keeps a table with one score per (cell, direction) pair. The agent plays the loop below until
              the scores tell it where to go.
            </p>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-border px-4 py-4 sm:px-6">
                  <h3 className="font-semibold">
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary align-middle text-sm text-on-primary">
                      {i + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Why I chose this for my portfolio">
            <div className="space-y-4">
              <p>
                I wanted to learn reinforcement learning by building it, not by calling a library. So I started with the
                smallest possible world, a five-cell corridor, and wrote the environment, the Q-table and the update
                rule myself. Watching the agent&apos;s first episode wander for 50 steps and its second walk straight to
                the goal made the idea click.
              </p>
              <p>
                The 2D maze made me think about the details tutorials skip: what happens when the agent walks into a
                wall, how many steps an episode should be allowed, why a bigger grid needs more episodes, and how to
                reject a maze that has no path from start to goal.
              </p>
              <p>
                I then rebuilt the same algorithm in JavaScript as a game, so other people can change alpha, gamma and
                epsilon and see what each one does. Explaining it that way, and in a video, showed me which parts I
                understood and which I had only memorized.
              </p>
              <p>
                It is a small project and it only covers tabular Q-learning. But it is the base I want to build on
                toward deep Q-networks and policy gradients, and it is the kind of ML fundamentals I hope to use in an
                AI or ML internship.
              </p>
            </div>
          </Section>

          <Section title="Tech Stack">
            <ul className="list-disc space-y-3 pl-5 marker:text-accent">
              {techStack.map((item) => (
                <li key={item.name} className="break-words">
                  <strong className="font-semibold">{item.name}</strong>: {item.role}
                </li>
              ))}
            </ul>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}
