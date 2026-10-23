import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/content";

// Short write-up for the SecureReview card's "Details" button.
// The GitHub link comes from data/content.ts, so it stays in sync with the card.
const PROJECT_NAME = "SecureReview: AI Merge Request Scanner";

export const metadata: Metadata = {
  title: `${PROJECT_NAME} | ${profile.name}`,
  description: "Why I built SecureReview, the tech behind it, and how well it caught security issues.",
};

const techStack = [
  { name: "Node.js", role: "runs the CLI tool" },
  { name: "Commander.js", role: "handles the terminal commands and options" },
  { name: "GitLab REST API", role: "reads the code changes in each merge request" },
  { name: "Gemini 3.8 Flash", role: "AI review that explains issues and suggests fixes" },
  { name: "Jest", role: "automated tests, written before the code (TDD)" },
  { name: "marked + DOMPurify", role: "safely render the AI's Markdown answers in the web demo" },
];

// The "How It Works" flow: input → local analysis → output.
const steps = [
  {
    key: "input",
    title: "1. You give it code",
    text: "Paste code into the web demo, or point the CLI at a GitLab merge request or a diff file on your computer.",
  },
  {
    key: "local",
    title: "2. Local analysis",
    text: "Security rules check every added line on your own device, looking for secrets, SQL injection, weak logins, and more.",
  },
  {
    key: "output",
    title: "3. Findings and explanations",
    text: "You get each issue with its file, line, and risk level, plus an AI explanation of why it matters and how to fix it.",
  },
];

// One line per result; the source (testing / survey) stays with each number.
const results = [
  {
    key: "caught",
    text: (
      <>
        Caught <strong className="font-semibold">85 of 100</strong> planted security issues in testing
      </>
    ),
  },
  {
    key: "speed",
    text: (
      <>
        Scans finish in <strong className="font-semibold">under 3 seconds</strong>
      </>
    ),
  },
  {
    key: "survey",
    text: (
      <>
        Survey of <strong className="font-semibold">20</strong> coding association members: about{" "}
        <strong className="font-semibold">60%</strong> fewer manual review steps and about{" "}
        <strong className="font-semibold">40%</strong> less review time
      </>
    ),
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function SecureReviewPage() {
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

          <Section title="The Problem">
            <div className="space-y-4">
              <p>
                Every team wants good code review. A second pair of eyes catches the mistakes that cause real damage: a
                password left in the code, a database query that lets attackers read every user&apos;s data, or a page
                that forgets to check who is logged in. AI tools can now do this kind of review quickly, and they are
                often very good at explaining what went wrong.
              </p>
              <p>
                But there is a catch. To get an AI review, you usually have to paste your code into someone
                else&apos;s service. For many developers that is not allowed. Company code, client projects, and
                anything containing keys or passwords should not be copied to an outside server, where it might be
                stored, logged, or seen by people who should never have access to it. The very code that most needs a
                security review is often the code you are least allowed to share.
              </p>
              <p>
                So developers are stuck choosing between a better review and keeping their code private. What they
                really need is both: expert feedback on security problems, without sending their source code anywhere
                else.
              </p>
            </div>
          </Section>

          <Section title="Results">
            {/* Same frame, row lines and padding as the Fitness Tracker results table, without a header row. */}
            {/* The bullet sits on the inner div so it stays inside the frame instead of being clipped. */}
            <ul className="overflow-hidden rounded-2xl border border-border marker:text-accent">
              {results.map((item) => (
                <li key={item.key} className="list-none border-t border-border px-3 py-3 first:border-t-0 sm:px-4">
                  <div className="ml-5 list-item list-disc break-words">{item.text}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="How It Works">
            <div className="space-y-4">
              <p>
                SecureReview splits the job in two. Finding problems happens on your own device. Explaining them is
                where the AI helps, and it never needs to see your code to do that.
              </p>
              <p className="rounded-2xl border border-accent/40 bg-accent/5 px-4 py-3 text-lg font-semibold">
                Your code never leaves your device for the AI. Gemini only sees a short description of each problem.
              </p>
            </div>

            <ol className="mt-6 grid gap-3 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.key} className="rounded-2xl border border-border px-4 py-4">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 break-words">{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 space-y-4">
              <p>
                First, you enter code that might be vulnerable. In the web demo you paste it into a text box. With the
                command-line tool you point it at a GitLab merge request, or at a diff file saved on your computer.
              </p>
              <p>
                Next, SecureReview runs its security rules locally. They look only at the lines a change adds and flag
                patterns like hardcoded passwords and API keys, SQL queries built from user input, and weak login
                checks. In the demo this all happens inside your browser, and the page is blocked from making any
                network requests at all.
              </p>
              <p>
                Then, for each finding, SecureReview writes a safe summary: the issue type, risk level, file name, and
                line number, with the risky code removed. Only that summary goes to Gemini 3.8 Flash. An automated test
                runs the real scan and checks every request sent to Gemini to make sure no source code is inside.
              </p>
              <p>
                Finally, you get the results: each problem, where it is, how serious it is, and an explanation from the
                AI of why it matters and how to fix it. On a merge request, the report can be posted as a comment so
                the whole team sees it.
              </p>
              <p className="text-muted">
                A note on the demo: it never calls Gemini live. Its AI Review panel shows answers recorded earlier with
                the CLI&apos;s real code path, using Gemini 3.5 Flash Lite, and says so on the page.
              </p>
            </div>
          </Section>

          <Section title="Why I built this">
            <p>
              This was my first AI project, built for an AI hackathon. I learned test-driven development (writing tests
              before code), and working on it helped me communicate and split work with my team much better.
            </p>
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
