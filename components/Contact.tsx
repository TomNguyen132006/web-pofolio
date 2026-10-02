import ArrowLink from "@/components/ArrowLink";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="wrap section-pad">
      <FadeIn>
        <div className="grid gap-10 rounded-3xl border border-border bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          <div className="min-w-0">
            <Reveal>
              <p className="font-mono text-xs tracking-widest text-accent uppercase">Contact</p>
              <h2 id="contact-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Let&apos;s talk
              </h2>
            </Reveal>
            <p className="mt-4 max-w-md text-muted">{profile.contactLine}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <li className="min-w-0">
                <ArrowLink href={`mailto:${profile.email}`} external={false} className="break-all">
                  {profile.email}
                </ArrowLink>
              </li>
              <li>
                <ArrowLink href={profile.github}>GitHub</ArrowLink>
              </li>
              <li>
                <ArrowLink href={profile.linkedin}>LinkedIn</ArrowLink>
              </li>
            </ul>
          </div>
          <div className="min-w-0">
            <ContactForm fallbackEmail={profile.email} />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
