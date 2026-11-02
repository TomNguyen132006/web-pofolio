import Image from "next/image";
import type { IconType } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa6";
import ResumeModal from "@/components/ResumeModal";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";
// The photo lives in assets/ (outside public/), so it is imported as a module.
// Next.js reads its width/height at build time and generates the blur placeholder.
import photo from "@/assets/6a9508f2-272a-41dc-9946-def0a84a2015.jpg";

// ✏️ Social icons shown next to "View Resume". Add, remove or reorder entries here.
// `external: true` opens the link in a new tab.
const socials: {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
}[] = [
  { label: "GitHub", href: profile.github, icon: FaGithub, external: true },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    icon: FaLinkedin,
    external: true,
  },
  { label: "Email", href: `mailto:${profile.email}`, icon: FaEnvelope },
];

export default function About() {
  return (
    // Full-width maroon band. The bottom edge is cut on a slant:
    // the right side ends 6vw above the left. pb makes room so the cut never hides content.
    <section
      id="about"
      aria-labelledby="about-heading"
      className="overflow-x-clip bg-linear-to-br from-primary to-primary-light pt-16 pb-[calc(6vw_+_4rem)] text-white [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_6vw),0_100%)] md:pt-24"
    >
      <div className="wrap">
        <Reveal>
          <h2
            id="about-heading"
            className="text-center text-4xl font-bold tracking-wide uppercase sm:text-5xl"
          >
            About me
          </h2>
        </Reveal>

        {/* One column on phones (photo on top), two columns from md (768px) up.
            Scroll animation: photo slides in from the left, text from the right a beat later, icons last. */}
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal from="left">
            <Image
              src={photo}
              alt={`Portrait of ${profile.name}`}
              placeholder="blur"
              sizes="(min-width: 768px) 24rem, 90vw"
              className="mx-auto aspect-square w-full max-w-sm rounded-lg object-cover object-[50%_25%] shadow-2xl"
            />
          </Reveal>
          <Reveal from="right" delay={150}>
            {/* ✏️ Edit your bio here. */}
            <p className="text-lg">
              Hi, I&apos;m Tom! I&apos;m a Computer Science and Applied Mathematics student at Missouri State
              University, graduating in May 2028. I like turning ideas into software that actually works, even if it
              takes a few tries to get there.
            </p>
            <p className="mt-4 text-lg">
              Outside of class, I build side projects with web and AI tools, like a machine learning fitness tracker
              and a security review CLI. I&apos;m still learning a lot, especially about AI systems and LLM-powered
              agents, and I try to ask questions and learn from the people around me along the way.
            </p>
            {/* Button and icons share a row from sm (640px) up. On phones the icons drop below the button,
                centered under it: w-fit shrinks the box to the button's width so items-center lines them up. */}
            <div className="mt-8 flex w-fit flex-col items-center gap-8 sm:flex-row sm:gap-6">
              <ResumeModal />
              <Reveal delay={450}>
                <ul className="flex items-center gap-5">
                  {socials.map(({ label, href, icon: Icon, external }) => (
                    <li key={label}>
                      <a
                        href={href}
                        aria-label={label}
                        {...(external && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                        className="block text-white transition-transform duration-200 hover:scale-125 focus-visible:outline-white"
                      >
                        <Icon aria-hidden className="size-7" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
