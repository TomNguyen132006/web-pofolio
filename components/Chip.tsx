export default function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-full bg-chip-bg px-2.5 py-1 font-mono text-xs text-chip-fg">{children}</li>;
}
