import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/content";

// Short write-up for the AI Narrator card's "Details" button.
// The GitHub link comes from data/content.ts, so it stays in sync with the card.
const PROJECT_NAME = "AI Narrator";

export const metadata: Metadata = {
  title: `${PROJECT_NAME} | ${profile.name}`,
  description: "How Narrator turns a manuscript into an audiobook on your own server, with a real recorded sample.",
};

const techStack = [
  { name: "Next.js 16 + React 19", role: "the author studio: bookshelf, upload form, listening room" },
  { name: "Better Auth + SQLite", role: "accounts, sessions, books and the narration queue, all in one local database file" },
  { name: "Python + Piper TTS", role: "the open-source voice that turns each chapter into speech, on the CPU" },
  { name: "FFmpeg", role: "joins the chapters into one downloadable MP3" },
  { name: "Docker Compose", role: "runs the web app and the narration worker side by side" },
];

// What the sample below was made from. The numbers are measured from the actual recording.
const sample = {
  words: 222,
  length: "1:10",
  chapters: [
    {
      title: "Chapter One. The Lighthouse.",
      text: "On the last night of autumn, Mara climbed the long spiral stairs of the old lighthouse for the very first time. Her grandfather had kept the lamp for forty years, and now the keys were hers. The wind pulled at the door, and the sea rolled below like a sleeping animal. Each step echoed in the cold stone, and every window showed a little more of the darkening sky. At the top, she lit the great lamp, and a golden beam swept across the black water. Somewhere out there, a ship turned toward the light, and Mara felt, for the first time, that she belonged to this place.",
    },
    {
      title: "Chapter Two. The Letter.",
      text: "In the morning, Mara found a letter tucked inside the logbook. The paper was yellow, and the ink had faded to the colour of tea. If you are reading this, it began, then the lamp is yours, and so is the secret. She read the line twice, her heart beating fast. Outside, gulls circled the tower and the tide crept slowly over the rocks. The letter spoke of a small door behind the staircase, and of a key that her grandfather had never let anyone see. Mara folded the paper, took a deep breath, and went down the stairs to look for what he had hidden.",
    },
  ],
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// One workflow step: number + title + text, then a drawn mock of that screen.
// The mocks are illustrations (not live screenshots) and are read by screen readers through `label`.
function Step({
  n,
  title,
  text,
  label,
  children,
}: {
  n: number;
  title: string;
  text: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-border px-4 py-5 sm:px-6">
      <h3 className="text-lg font-semibold">
        <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary align-middle text-sm text-on-primary">
          {n}
        </span>
        {title}
      </h3>
      <p className="mt-2 text-muted">{text}</p>
      <div role="img" aria-label={label} className="mt-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div aria-hidden>{children}</div>
      </div>
    </li>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm break-words">{value}</div>
    </div>
  );
}

function Bar({ percent, done }: { percent: number; done?: boolean }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-chip-bg">
      <div className={`h-full rounded-full ${done ? "bg-success" : "bg-primary"}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

// Queue rows for step 3. A snapshot of the states a job moves through.
const queue = [
  { name: "Chapter 1. The Lighthouse", state: "Done", percent: 100, done: true },
  { name: "Chapter 2. The Letter", state: "Narrating… 60%", percent: 60, done: false },
  { name: "Combine into MP3", state: "Waiting", percent: 0, done: false },
];

export default function NarratorPage() {
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
                Live Demo
              </ButtonLink>
            )}
            <ButtonLink href={project.github}>GitHub</ButtonLink>
          </div>
          {project.demoUrl && (
            <p className="mt-4 text-sm text-muted">
              Demo login: <code className="rounded bg-chip-bg px-1.5 py-0.5 font-mono text-chip-fg">testuser</code> /{" "}
              <code className="rounded bg-chip-bg px-1.5 py-0.5 font-mono text-chip-fg">123456</code>. This is a
              shared test account, so please only upload sample text, not a private manuscript.
            </p>
          )}

          <Section title="Overview">
            <div className="space-y-4">
              <p>
                Turning a manuscript into an audiobook usually means paying a narrator or a text-to-speech service,
                and uploading the whole book to someone else&apos;s servers to do it. For an author with an unpublished
                book, that is both a cost and a privacy risk.
              </p>
              <p>
                Narrator keeps the whole job on the author&apos;s own server. The account, the manuscript and the audio
                all stay there, and the narration engine is open source, so there is no per-minute fee and no outside
                API key.
              </p>
            </div>
          </Section>

          <Section title="How It Works">
            <p>
              An author signs up, uploads a manuscript, and a background worker narrates it one chapter at a time. The
              four steps below follow that path. Steps 1 to 3 are drawn illustrations of each screen. Step 4 is real.
            </p>

            <ol className="mt-6 space-y-4">
              <Step
                n={1}
                title="Sign up"
                text="Email and password, with hashed passwords and sessions you can revoke. Accounts live in a local SQLite file, so there is no hosted login service."
                label="Illustration of the sign-up form with name, email and password fields and a Create account button."
              >
                <div className="mx-auto max-w-sm space-y-3">
                  <Field label="Name" value="Mara Quinn" />
                  <Field label="Email" value="mara@example.com" />
                  <Field label="Password" value="••••••••••" />
                  <div className="rounded-full bg-linear-to-r from-primary to-primary-light px-4 py-2.5 text-center text-sm font-semibold text-on-primary">
                    Create account
                  </div>
                </div>
              </Step>

              <Step
                n={2}
                title="Upload a manuscript"
                text="TXT, DOCX or a text-based PDF. Chapter and Part headings are kept, and the author reviews the details and the narrator before starting."
                label={`Illustration of the upload step showing a file named the-lighthouse.txt, with 2 chapters and ${sample.words} words, and the narrator LJ selected.`}
              >
                <div className="space-y-3">
                  <div className="rounded-xl border-2 border-dashed border-primary/40 bg-bg px-4 py-6 text-center">
                    <p className="font-mono text-sm break-words">the-lighthouse.txt</p>
                    <p className="mt-1 text-sm text-muted">2 chapters · {sample.words} words</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted">Narrator:</span>
                    <span className="rounded-full bg-chip-bg px-3 py-1 font-medium text-chip-fg">LJ (English)</span>
                  </div>
                  <div className="rounded-full bg-linear-to-r from-primary to-primary-light px-4 py-2.5 text-center text-sm font-semibold text-on-primary">
                    Create my audiobook
                  </div>
                </div>
              </Step>

              <Step
                n={3}
                title="Watch the queue"
                text="The job is saved in the database. Progress only moves when a chapter's audio has actually been written, so the bars are honest, and a crashed worker resumes where it left off."
                label="Illustration of the queue: Chapter 1 done, Chapter 2 narrating at 60 percent, combining into MP3 waiting."
              >
                <ul className="space-y-4">
                  {queue.map((row) => (
                    <li key={row.name}>
                      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                        <span className="font-medium break-words">{row.name}</span>
                        <span className={row.done ? "text-success" : "text-muted"}>{row.state}</span>
                      </div>
                      <Bar percent={row.percent} done={row.done} />
                    </li>
                  ))}
                </ul>
              </Step>

              <li className="rounded-2xl border border-accent/40 bg-accent/5 px-4 py-5 sm:px-6">
                <h3 className="text-lg font-semibold">
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary align-middle text-sm text-on-primary">
                    4
                  </span>
                  Listen and download
                </h3>
                <p className="mt-2 text-muted">
                  Press play. This is a real recording made on my computer from the two chapters shown below, using
                  Narrator&apos;s own narration script and the LJ voice. {sample.words} words, about {sample.length}.
                </p>
                <audio
                  controls
                  preload="metadata"
                  src="/audio/narrator-sample.mp3"
                  className="mt-4 w-full"
                  aria-label="Sample narration of two short chapters, about one minute ten seconds"
                >
                  Your browser does not support audio playback.{" "}
                  <a href="/audio/narrator-sample.mp3" className="text-accent underline">
                    Download the sample MP3
                  </a>
                  .
                </audio>
                <p className="mt-2 text-sm text-muted">
                  <a href="/audio/narrator-sample.mp3" download className="text-accent underline underline-offset-[3px]">
                    Download the MP3
                  </a>
                </p>

                <details className="mt-5 rounded-xl border border-border bg-bg px-4 py-3">
                  <summary className="cursor-pointer font-medium">Read the text that was narrated</summary>
                  <div className="mt-3 space-y-4 text-sm">
                    {sample.chapters.map((chapter) => (
                      <div key={chapter.title}>
                        <h4 className="font-semibold">{chapter.title}</h4>
                        <p className="mt-1">{chapter.text}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            </ol>
          </Section>

          <Section title="Under the Hood">
            <div className="space-y-4">
              <p>
                The web app and the narration worker are separate processes that share one data folder. Each chapter is
                narrated in its own run, writing audio to disk as it goes, so a long book never has to fit in memory.
                When every chapter is done, FFmpeg joins them into one MP3, and the author can also download a ZIP of
                the individual chapters.
              </p>
              <p className="text-muted">
                Steps 1 to 3 are drawn, not live: this site is hosted separately from a Narrator server, so
                the portfolio plays a pre-recorded sample instead of running the queue.
              </p>
            </div>
          </Section>

          <Section title="Why I chose this for my portfolio">
            <div className="space-y-4">
              <p>
                This project is special because it was my first hackathon ever. I teamed up with two seniors who had
                way more experience than me (I was just a sophomore), and we literally just jumped in because it
                sounded fun and we wanted to learn something new.
              </p>
              <p>
                What I remember most wasn&apos;t the final product. It was the learning pace. Working alongside seniors,
                I had to figure things out quickly. I asked a lot of questions, made mistakes, and learned from
                watching how they approached problems. We split the work: I focused on the frontend and UI/UX while
                they handled the heavier backend and DevOps work. But honestly, we all jumped in to help wherever
                needed.
              </p>
              <p>
                Hackathons move fast, and as the least experienced person on the team, I had to stay focused and
                communicate what I was struggling with. That taught me more about teamwork and asking for help than any
                solo project could.
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
