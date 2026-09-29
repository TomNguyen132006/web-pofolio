import { profile } from "@/data/content";

export default function Footer() {
  return (
    <footer className="wrap">
      <p className="border-t border-border py-8 text-sm text-muted">
        © {new Date().getFullYear()} {profile.name} · Built with Next.js
      </p>
    </footer>
  );
}
