type Props = { id: string; label: string; title: string };

export default function SectionHeading({ id, label, title }: Props) {
  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-accent uppercase">{label}</p>
      <h2 id={id} className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
