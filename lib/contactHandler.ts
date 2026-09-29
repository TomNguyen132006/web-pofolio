// The logic behind POST /api/contact. Verification and sending are passed in,
// so tests can use fakes and the route can use the real Gmail and ZeroBounce.
import { normalizeContact, subjectFor, validateContact } from "./contact.ts";
import type { ContactErrors, ContactInput } from "./contact.ts";
import type { VerifyResult } from "./verifyEmail.ts";

export type Mail = { subject: string; text: string; replyTo: string };

export type ContactDeps = {
  verify: (email: string) => Promise<VerifyResult>;
  send: (mail: Mail) => Promise<void>;
};

export type ContactResponseBody =
  | { ok: true }
  | { ok: false; errors: ContactErrors; suggestion?: string }
  | { ok: false; error: string };

type ContactResponse = { status: 200 | 400 | 500; body: ContactResponseBody };

export async function handleContact(raw: unknown, deps: ContactDeps): Promise<ContactResponse> {
  // Bots fill in every field, including the hidden "website" one. Pretend it worked.
  const website = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>).website : undefined;
  if (typeof website === "string" && website.trim() !== "") {
    return { status: 200, body: { ok: true } };
  }

  const input = normalizeContact(raw);
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return { status: 400, body: { ok: false, errors } };
  }

  const verdict = await deps.verify(input.email);
  if (!verdict.ok) {
    const body: ContactResponseBody = verdict.suggestion
      ? { ok: false, errors: { email: verdict.message }, suggestion: verdict.suggestion }
      : { ok: false, errors: { email: verdict.message } };
    return { status: 400, body };
  }

  try {
    await deps.send({ subject: subjectFor(input.name), text: formatBody(input), replyTo: input.email });
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error("[contact] Failed to send email:", (err as Error).message);
    return { status: 500, body: { ok: false, error: "Couldn't send your message." } };
  }
}

function formatBody({ name, email, message }: ContactInput): string {
  return `Name: ${name}\nEmail: ${email}\n\n${message}\n`;
}
