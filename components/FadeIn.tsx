import Reveal from "@/components/Reveal";

type Props = {
  children: React.ReactNode;
  delay?: number; // seconds
  y?: number; // px it slides up from
  className?: string;
};

// Fades in and slides up the first time it scrolls into view.
// Same visible-by-default behavior as Reveal: readable without JavaScript.
export default function FadeIn({ children, delay = 0, y = 24, className }: Props) {
  return (
    <Reveal once distance={y} delay={delay * 1000} className={className}>
      {children}
    </Reveal>
  );
}
