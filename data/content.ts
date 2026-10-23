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
  initials?: string; // optional: placeholder text when there's no image (default: first letters of the first two words)
  imageAlt?: string; // optional: defaults to "Screenshot of <name>"
  imageFit?: "cover" | "contain"; // optional: "contain" shows the whole image with padding (default "cover")
  imageCredit?: string; // optional: small caption under the image, e.g. "Illustration: Jane Doe"
};

export type Profile = {
  name: string;
  title: string;
  logo: string;
  email: string;
  phone: string; // shown on the Contact card; the tel: link strips spaces and punctuation
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
  phone: "+1 (417) 227-8756",
  github: "https://github.com/TomNguyen132006",
  linkedin: "https://www.linkedin.com/in/hoang-nguyen-994a8b313",
  resume: "/resume.pdf",
  photo: "/profile.jpg",
  contactLine: "I'm open to software engineering and AI internships. Here's my card, reach out any way you like:",
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
    name: "SecureReview: AI Merge Request Scanner",
    description:
      "Developers want expert security review but can't share private code with an outside AI. SecureReview checks merge requests on your own machine, then asks Gemini 3.8 Flash to explain the findings. Your code is never sent to the AI.",
    learnedLabel: "Goal",
    learned:
      "Catch common security mistakes like hardcoded secrets, SQL injection, and missing authorization before code gets merged.",
    tech: ["Node.js", "Commander.js", "Jest", "Gemini API", "GitLab API"],
    github: "https://github.com/TomNguyen132006/secure-review",
    demoUrl: "https://tomnguyen132006.github.io/secure-review/", // GitHub Pages deploy of demo/ in that repo
    detailsUrl: "/projects/secure-review", // page: app/projects/secure-review/page.tsx
    image: "/images/secure-review-cover.png",
    imageAlt:
      "Line illustration of a laptop protected by a security shield, connected to code, cloud, bug and search icons",
    imageFit: "contain",
    initials: "SR",
  },
  {
    name: "AI Narrator",
    description: "Turn manuscripts into audiobooks locally. No API costs, privacy-first narration.",
    learnedLabel: "Goal",
    learned:
      "Let an author upload a manuscript and get a finished audiobook, with narration generated on their own server instead of a paid text-to-speech service.",
    tech: ["Next.js", "React", "Python", "Piper TTS", "SQLite"],
    demoUrl: "https://narrator-eight.vercel.app", // Vercel frontend; falls back to the public /demo/library preview without a backend
    github: "https://github.com/Zelun-He/Narrator",
    detailsUrl: "/projects/narrator", // page: app/projects/narrator/page.tsx
    image: "/images/narrator-cover.svg",
    imageAlt:
      "Line illustration of an open book with sound waves rising from its pages, connected to a manuscript, a play button, headphones and a speaker",
    imageFit: "contain",
    initials: "AN",
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
