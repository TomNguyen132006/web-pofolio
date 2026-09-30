import nodemailer from "nodemailer";
import { handleContact } from "@/lib/contactHandler";
import { createGmailSender } from "@/lib/gmail";
import { verifyEmail } from "@/lib/verifyEmail";

// Nodemailer needs the full Node.js runtime (not Edge).
export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => null);
  const { status, body } = await handleContact(raw, {
    verify: (email) => verifyEmail(email, { apiKey: process.env.ZEROBOUNCE_API_KEY }),
    send: createGmailSender(
      { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      (options) => nodemailer.createTransport(options),
    ),
  });
  return Response.json(body, { status });
}
