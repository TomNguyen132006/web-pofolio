// ✏️ Edit this file to update your portfolio. Nothing else needs to change.
// Screenshots go in public/projects/ and are referenced as "/projects/file.png".
// Replace public/resume.pdf to update your resume.

export type Project = {
  name: string;
  description: string; // 1–2 sentences
  learned: string; // 1 sentence
  tech: string[];
  github: string;
  demo?: string; // optional: link is hidden if missing
  image?: string; // optional: initials placeholder if missing
};

export type Profile = {
  name: string;
  title: string;
  logo: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  contactLine: string;
};

export type Skills = {
  languages: string[];
  frameworks: string[];
  cloudAI: string[];
};

export const profile: Profile = {
  name: "Your Name",
  title: "Computer science student building software & AI tools.",
  logo: "yourname.dev",
  email: "you@example.com",
  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-username",
  resume: "/resume.pdf",
  contactLine: "I'm open to software engineering and AI internships. Send me a message, or reach me directly:",
};

export const projects: Project[] = [
  {
    name: "Study Buddy AI",
    description: "A web app that turns lecture notes into practice quiz questions using a large language model.",
    learned: "How to design prompts, stream responses to the UI, and handle API rate limits.",
    tech: ["Python", "FastAPI", "React", "OpenAI API"],
    github: "https://github.com/your-username/study-buddy",
    demo: "https://study-buddy.example.com",
  },
  {
    name: "Campus Eats",
    description: "A food ordering app for students, with accounts, a menu, and order tracking.",
    learned: "Authentication, relational database design, and deploying a full-stack app.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    github: "https://github.com/your-username/campus-eats",
  },
  {
    name: "Digit Classifier",
    description: "A convolutional neural network that recognizes handwritten digits, with a small drawing demo.",
    learned: "Training loops, overfitting, and how data augmentation improves accuracy.",
    tech: ["Python", "PyTorch", "NumPy"],
    github: "https://github.com/your-username/digit-classifier",
  },
];

export const skills: Skills = {
  languages: ["Python", "TypeScript", "JavaScript", "Java", "SQL"],
  frameworks: ["React", "Next.js", "FastAPI", "Tailwind CSS", "PyTorch"],
  cloudAI: ["AWS", "Vercel", "Docker", "OpenAI API", "Git"],
};
