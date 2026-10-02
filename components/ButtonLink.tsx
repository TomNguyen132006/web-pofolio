import Link from "next/link";

type Props = { href: string; variant?: "filled" | "outline"; children: React.ReactNode };

// Pill buttons used on project cards and project pages. Both variants have a 2px border
// so they are exactly the same size. "filled" matches the Hero / Contact buttons
// (maroon gradient, fades on hover); "outline" fills with maroon on hover.
// Links to other sites open in a new tab; links to pages on this site ("/projects/...") stay in the same tab.
export default function ButtonLink({ href, variant = "outline", children }: Props) {
  const look =
    variant === "filled"
      ? "border-transparent bg-linear-to-r from-primary to-primary-light text-on-primary hover:opacity-90"
      : "border-primary text-primary hover:bg-primary hover:text-on-primary";
  const className = `inline-flex items-center justify-center rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-[opacity,background-color,color] duration-200 ${look}`;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
