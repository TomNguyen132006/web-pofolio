import FadeIn from "@/components/FadeIn";
import { profile } from "@/data/content";

export default function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative isolate -mt-16 overflow-hidden pt-16">
      {/* Soft glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 -z-10 size-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
      />
      <div className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center py-24">
        <FadeIn y={16}>
          <p className="font-mono text-sm text-muted">Hi, I&apos;m</p>
        </FadeIn>
        <FadeIn y={16} delay={0.08}>
          <h1 className="mt-3 text-5xl font-bold tracking-[-0.03em] break-words sm:text-6xl lg:text-7xl">
            {profile.name}
            <span className="text-accent">.</span>
          </h1>
        </FadeIn>
        <FadeIn y={16} delay={0.16}>
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">{profile.title}</p>
        </FadeIn>
        <FadeIn y={16} delay={0.24}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity duration-200 hover:opacity-90"
            >
              Resume
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
