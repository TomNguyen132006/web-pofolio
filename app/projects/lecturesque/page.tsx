import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/content";

// Short write-up for the Lecturesque card's "Details" button.
// The GitHub and demo links come from data/content.ts, so they stay in sync with the card.
const PROJECT_NAME = "Lecturesque";

export const metadata: Metadata = {
  title: `${PROJECT_NAME} | ${profile.name}`,
  description:
    "How Lecturesque turns a lecture transcript into study notes and slides, with a judge model that checks every statement against the source.",
};

const problems = [
  "Students struggle to turn lectures into effective study materials.",
  "Manual note-taking misses key points and takes hours.",
  "Lectures contain visual and audio information that is hard to capture.",
  "There is no automated way to verify that study notes are accurate to the source.",
];

const results = [
  "Generates comprehensive study notes in Markdown format.",
  "Creates presentation slides (PPTX) from lectures.",
  "Produces timestamped transcripts linked to the original audio.",
  "A judge model verifies every statement against the lecture source.",
  "All citations include specific timestamps.",
];

const steps = [
  { title: "Upload", text: "Upload a lecture transcript as text, SRT or VTT." },
  { title: "Clean and organize", text: "Nemotron Nano cleans the transcript and organizes it by topic." },
  { title: "Generate", text: "Nemotron Super writes the notes and slides." },
  { title: "Fill the gaps", text: "Tavily web search fills in knowledge gaps the lecture left open." },
  { title: "Judge", text: "Nemotron Ultra judges each statement for accuracy against the source." },
  { title: "Output", text: "Notes, slides and transcript, all in timestamped format." },
];

const techStack = [
  { name: "Next.js, React, Tailwind CSS", role: "the frontend, deployed on Vercel" },
  { name: "Python + FastAPI", role: "the backend that runs the pipeline, deployed on Render" },
  { name: "NVIDIA Parakeet with NeMo and CUDA", role: "speech-to-text" },
  { name: "Nebius Nemotron models (Nano, Super, Ultra)", role: "the LLMs behind each pipeline stage" },
  { name: "Tavily API", role: "web search for filling knowledge gaps" },
  { name: "Custom judge model", role: "source verification for every generated statement" },
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

export default function LecturesquePage() {
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
          <p className="mt-2 text-sm text-muted">Built for the Nebius x NVIDIA Global AI Hackathon.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <ButtonLink href={project.demoUrl} variant="filled">
                Live Demo
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

          <Section title="Tech Stack">
            <ul className="list-disc space-y-3 pl-5 marker:text-accent">
              {techStack.map((item) => (
                <li key={item.name} className="break-words">
                  <strong className="font-semibold">{item.name}</strong>: {item.role}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Why I chose this for my portfolio">
            <div className="space-y-4">
              <p>
                I built Lecturesque with my team during the Nebius x NVIDIA Global AI Hackathon. Almost everything
                about it was new to me: NVIDIA&apos;s Nemotron models, FastAPI, and the idea of chaining several LLMs
                into one pipeline instead of making a single call.
              </p>
              <p>
                The hardest part was not any one model. It was integrating many of them: Nemotron Nano, Super and
                Ultra, Tavily web search and a FastAPI backend, all passing data to each other while keeping every
                timestamp intact. A bug in an early stage quietly broke everything after it, so we learned to test each
                stage on its own before trusting a full run.
              </p>
              <p>
                The judge model is the part I care about most. It is easy to get an LLM to write confident notes and
                much harder to know whether they are true. Checking every statement against the lecture source taught
                me that verification is its own piece of engineering.
              </p>
              <p>
                It was also a lesson in teamwork under a deadline. We split the pipeline into pieces, agreed on the
                data each stage hands to the next, and helped each other get unstuck on tools none of us had used
                before.
              </p>
            </div>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}
