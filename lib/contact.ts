// Contact form rules, shared by the browser (instant feedback) and the server (the real gate).

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = { name: 100, messageMin: 10, messageMax: 2000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMAIL_MAX = 254;

export function normalizeContact(raw: unknown): ContactInput {
  const fields = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return { name: text(fields.name), email: text(fields.email), message: text(fields.message) };
}

export function validateContact({ name, email, message }: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (message.length < LIMITS.messageMin) {
    errors.message = `Message should be at least ${LIMITS.messageMin} characters.`;
  } else if (message.length > LIMITS.messageMax) {
    errors.message = `Message must be ${LIMITS.messageMax} characters or fewer.`;
  }

  return errors;
}

export function subjectFor(name: string): string {
  return `Portfolio message from ${name.replace(/[\r\n]+/g, " ")}`;
}
