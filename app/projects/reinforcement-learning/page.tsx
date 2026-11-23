import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/content";

// Code walkthrough for the Q-Learning Maze Agent card's "Details" button.
// It follows the q-grid.mp4 explainer video and the code in 2D/maze-input/2DGrid.py.
// The GitHub and demo links come from data/content.ts, so they stay in sync with the card.
const PROJECT_NAME = "Q-Learning Maze Agent";

export const metadata: Metadata = {
  title: `${PROJECT_NAME} | ${profile.name}`,
  description:
    "A walkthrough of the Python code behind a Q-learning agent that learns to solve a 3×3 grid maze, with an explainer video.",
};

type Block = { title: string; code: string; points: string[] };

// Excerpts of 2DGrid.py, shortened to the lines the video highlights.
const blocks: Block[] = [
  {
    title: "The environment: class Grid2D",
    code: `class Grid2D:
    def __init__(self, rows, cols, walls, traps):
        ...

    def reset(self):
        self.pos = (0, 0)
        return self.pos`,
    points: [
      "Grid2D takes the grid size, a set of wall cells and a set of trap cells.",
      "reset() puts the agent back on cell (0, 0) at the start of every episode.",
      "step(action) takes one of four actions: 0 = left, 1 = right, 2 = up, 3 = down.",
    ],
  },
  {
    title: "step(): walls, traps and rewards",
    code: `x = max(x, 0);  y = max(y, 0)
x = min(self.rows - 1, x)
y = min(self.cols - 1, y)

if (x, y) not in self.walls:
    self.pos = (x, y)
done = self.pos == (self.rows - 1, self.cols - 1)
if done:
    reward = 10
elif self.pos in self.traps:
    reward = -10
else:
    reward = -1
return (self.pos, reward, done)`,
    points: [
      "Bumping into the edge: x and y are clamped to the grid with max and min, so the agent stays where it is.",
      "Wall: if the cell it wants to enter is in walls, self.pos is not updated, so it stays put, just like at the edge.",
      "Goal: reaching the last cell sets done = True and gives reward +10.",
      "Trap: standing in a trap gives -10, much worse than a normal step, but the episode keeps going.",
      "Every other step costs -1, which is what pushes the agent toward short paths.",
    ],
  },
  {
    title: "Setup: parameters and the Q-table",
    code: `env = Grid2D(3, 3, {(1, 2)}, {(1, 1)})   # wall on (1,2), trap on (1,1)
alpha = 0.5
gamma = 0.9
EPSILON = 0.7

Q_table = {}
for row in range(env.rows):
    for col in range(env.cols):
        Q_table[row, col] = [0] * 4`,
    points: [
      "The example maze is 3×3 with a wall on cell (1, 2) and a trap on cell (1, 1). The goal is (2, 2).",
      "alpha is the learning rate: how much to believe new information. If a cell is worth 0 and the new target is 10, alpha = 0.5 moves it to 5. Alpha = 1 jumps to 10, and alpha = 0.1 only moves it to 1.",
      "gamma is the discount: how much future reward matters. With gamma = 0.9, a reward 10 one step away is worth 9 now. Gamma near 0 only cares about right now, and gamma near 1 plans far ahead.",
      "epsilon = 0.7 means 70% of moves are random exploration.",
      "The Q-table holds 4 numbers per cell, one for each action. They all start at 0.",
    ],
  },
  {
    title: "choose_action: explore or exploit",
    code: `def choose_action(r_state, c_state, epsilon):
    if random.random() < epsilon:
        return random.randint(0, 3)          # explore
    else:
        best = max(Q_table[r_state, c_state])
        return Q_table[r_state, c_state].index(best)   # exploit`,
    points: [
      "With probability epsilon it picks a random action from 0 to 3.",
      "Otherwise it takes the action with the biggest Q-value for the current cell.",
      "At the start every Q is 0, so every action ties, and index() returns the first one: 0 = left. That is why an untrained agent keeps walking into the wall.",
    ],
  },
  {
    title: "The training loop",
    code: `for episode in range(episodes):
    r_state, c_state = env.reset()
    done = False
    steps = 0
    while not done and steps < max_steps:
        action = choose_action(r_state, c_state, EPSILON)
        (next_r, next_c), reward, done = env.step(action)
        update_q(r_state, c_state, action, reward, next_r, next_c, done)
        r_state, c_state = next_r, next_c
        steps += 1`,
    points: [
      "Every episode starts by putting the agent back on (0, 0), then runs until it reaches the goal or hits the step limit.",
      "Each step: choose an action with epsilon = 0.7, take it, and get the new cell, the reward and done.",
      "Then update_q learns from the step that just happened, and the agent moves on to the new cell.",
      "The number of episodes grows with the maze size, so a bigger maze gets more training.",
    ],
  },
  {
    title: "update_q: the Q-learning update",
    code: `def update_q(r_state, c_state, action, reward, next_r, next_c, done):
    if done:
        target = reward
    else:
        target = reward + gamma * max(Q_table[next_r, next_c])
    Q_table[r_state, c_state][action] += alpha * (
        target - Q_table[r_state, c_state][action]
    )`,
    points: [
      "At the goal the target is just the reward, because nothing comes after it.",
      "Otherwise target = reward + gamma × the best Q of the next cell. A step into the trap has reward -10, so those actions sink very low.",
      "New Q = old Q + alpha × (target - old Q): move the old value a fraction alpha toward the target.",
      "Worked example from the video: the first time the agent reaches the goal from cell (2,1) going right, Q = 0 + 0.5 × (10 - 0) = 5.0.",
    ],
  },
  {
    title: "run_greedy: a test run with no randomness",
    code: `def run_greedy():
    r_state, c_state = env.reset()
    done = False
    path = [(0, 0)]
    steps = 0
    while not done and steps < max_steps:
        action = choose_action(r_state, c_state, 0)   # epsilon = 0
        (r_state, c_state), reward, done = env.step(action)
        path.append((r_state, c_state))
        steps += 1
    return path, steps`,
    points: [
      "It runs one episode with epsilon = 0: no learning, no randomness, only the best Q in each cell.",
      "It records the path and the number of steps, so you can see what the agent has really learned after each episode.",
    ],
  },
];

const stuckRows = [
  { when: "Before learning", result: "Q is 0 everywhere, so every action ties and the first one (left) wins: the agent bumps into the wall." },
  { when: "After episodes 1 and 2", result: "At (0, 0) the least negative direction is still left, a wall. The agent stands still for 50 steps." },
  { when: "After episodes 3 and 4", result: "Q at (0, 0) and (0, 1) has changed, so the agent gets one cell further each time, then hits another wall." },
  { when: "After episode 5", result: "It walks (0,0) → (1,0) → (2,0) → (2,1) → (2,2) in 4 steps, around the trap and the wall." },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
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
          <p className="mt-4 text-lg text-muted">
            A walkthrough of the Python code (<code>2DGrid.py</code>) behind the agent, following the explainer video
            below.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl && (
              <ButtonLink href={project.demoUrl} variant="filled">
                Play the Maze
              </ButtonLink>
            )}
            <ButtonLink href={project.github}>GitHub</ButtonLink>
          </div>

          <video
            className="mt-8 w-full rounded-2xl border border-border"
            controls
            preload="metadata"
            poster="/videos/q-grid-poster.jpg"
          >
            <source src="/videos/q-grid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <Section title="Code walkthrough">
            <ol className="space-y-6">
              {blocks.map((b, i) => (
                <li key={b.title} className="rounded-2xl border border-border px-4 py-4 sm:px-6">
                  <h3 className="font-semibold">
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary align-middle text-sm text-on-primary">
                      {i + 1}
                    </span>
                    {b.title}
                  </h3>
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-4 text-sm leading-relaxed">
                    <code>{b.code}</code>
                  </pre>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-muted marker:text-accent">
                    {b.points.map((p) => (
                      <li key={p} className="break-words">
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Why is the agent stuck in the first episodes?">
            <p className="mb-4 text-muted">
              The test run from <code>run_greedy</code> after each training episode shows how the Q-table slowly turns
              into a route.
            </p>
            <ul className="space-y-3">
              {stuckRows.map((r) => (
                <li key={r.when} className="rounded-2xl border border-border px-4 py-4 sm:px-6">
                  <strong className="font-semibold">{r.when}</strong>
                  <p className="mt-1 text-muted">{r.result}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              After 200 episodes it picks the best Q in every cell and the policy points away from the trap and toward
              the goal. Nobody told the agent where the goal is: it learned only from reward.
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}
