// ✏️ Edit this file to update your portfolio. Nothing else needs to change.
// Screenshots go in public/projects/ and are referenced as "/projects/file.png".
// Replace public/resume.pdf to update your resume.

export type Project = {
  name: string;
  description: string; // 1–2 sentences
  learned: string; // 1 sentence
  learnedLabel?: string; // optional: heading above "learned" (default "What I learned")
  tech: string[];
  github: string;
  demoUrl?: string; // optional: "Live Demo" button is hidden if missing or ""
  detailsUrl?: string; // optional: "Details" button is hidden if missing or "". Usually a page on this site ("/projects/my-app", opens in the same tab)
  image?: string; // optional: initials placeholder if missing
  imageAlt?: string; // optional: defaults to "Screenshot of <name>"
  imageFit?: "cover" | "contain"; // optional: "contain" shows the whole image with padding (default "cover")
  imageCredit?: string; // optional: small caption under the image, e.g. "Illustration: Jane Doe"
};

export type Profile = {
  name: string;
  title: string;
  logo: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  photo: string; // headshot in public/
  contactLine: string;
};

export type Skills = {
  languages: string[];
  frameworks: string[];
  cloudAI: string[];
};

export const profile: Profile = {
  name: "Hoang Nguyen",
  title: "Computer Science and Applied Mathematics student",
  logo: "",
  email: "minhtamnguyenhoang664468@gmail.com",
  github: "https://github.com/TomNguyen132006",
  linkedin: "https://www.linkedin.com/in/hoang-nguyen-994a8b313",
  resume: "/resume.pdf",
  photo: "/profile.jpg",
  contactLine: "I'm open to software engineering and AI internships. Send me a message, or reach me directly:",
};

export const projects: Project[] = [
  {
    name: "Machine Learning Fitness Tracker",
    description: "A machine learning pipeline that turns wearable accelerometer and gyroscope data into barbell exercise predictions and automatic rep counts.",
    learnedLabel: "Goal",
    learned:
      "Develop a Python pipeline that processes and visualizes motion sensor data, then trains a model to classify barbell exercises and count repetitions.",
    tech: ["Python", "Pandas", "scikit-learn", "SciPy", "Matplotlib"],
    github: "https://github.com/TomNguyen132006/MachineLearningFitnessTrack",
    demoUrl: "https://tomnguyen132006.github.io/MachineLearningFitnessTrack/demo/",
    detailsUrl: "/projects/fitness-tracker", // page: app/projects/fitness-tracker/page.tsx
    image: "/projects/ml-fitness-card.png",
    imageAlt:
      "Illustrations of the five barbell exercises the model classifies: bench press, deadlift, overhead press, barbell row, squat",
    imageFit: "contain",
    imageCredit: "Illustration: Dave Ebbelaar",
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
