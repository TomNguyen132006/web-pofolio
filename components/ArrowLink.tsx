type Props = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
};

// Accent link with an underline and a → that nudges right on hover. The underline
// makes links recognizable even though the accent is close in hue to the body text.
export default function ArrowLink({ href, children, external = true, className = "" }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-[3px] transition-colors duration-200 hover:decoration-accent ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}
