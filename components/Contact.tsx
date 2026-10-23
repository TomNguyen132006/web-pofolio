import Image from "next/image";
import type { IconType } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone } from "react-icons/fa6";
import FadeIn from "@/components/FadeIn";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";
// Same portrait as the About section; Next.js reads its size at build time.
import photo from "@/assets/6a9508f2-272a-41dc-9946-def0a84a2015.jpg";

// Lines printed on the card. `term` is read by screen readers in place of the icon.
const details: { term: string; text: string; href: string; icon: IconType }[] = [
  { term: "Phone", text: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`, icon: FaPhone },
  { term: "Email", text: profile.email, href: `mailto:${profile.email}`, icon: FaEnvelope },
];

// Buttons under the details; both open in a new tab.
const socials: { label: string; href: string; icon: IconType }[] = [
  { label: "GitHub", href: profile.github, icon: FaGithub },
  { label: "LinkedIn", href: profile.linkedin, icon: FaLinkedin },
];

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="wrap section-pad">
      <FadeIn>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="font-mono text-xs tracking-widest text-primary uppercase">Contact</p>
            <h2 id="contact-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s talk
            </h2>
          </Reveal>
          <p className="mt-4 text-muted">{profile.contactLine}</p>

          <div className="mt-8 flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <Image
              src={photo}
              alt={`Portrait of ${profile.name}`}
              placeholder="blur"
              sizes="8rem"
              className="size-[120px] shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <h3 className="text-2xl font-bold tracking-tight break-words text-fg">{profile.name}</h3>
              <p className="mt-1 text-muted">{profile.title}</p>
              {/* Printed on the card like a real business card: always visible, and still tappable. */}
              <dl className="mt-4 space-y-1.5">
                {details.map(({ term, text, href, icon: Icon }) => (
                  <div key={term} className="flex items-center gap-2.5">
                    <dt className="sr-only">{term}</dt>
                    <dd className="flex min-w-0 items-center gap-2.5">
                      <Icon aria-hidden className="shrink-0 text-primary" />
                      <a href={href} className="font-medium break-all hover:underline">
                        {text}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-[background-color,color] duration-200 hover:bg-primary hover:text-on-primary"
                    >
                      <Icon aria-hidden />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
