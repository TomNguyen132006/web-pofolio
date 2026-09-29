import nodemailer from "nodemailer";
import { handleContact } from "@/lib/contactHandler";
import type { Mail } from "@/lib/contactHandler";
import { verifyEmail } from "@/lib/verifyEmail";

// Nodemailer needs the full Node.js runtime (not Edge).
export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => null);
  const { status, body } = await handleContact(raw, {
    verify: (email) => verifyEmail(email, { apiKey: process.env.ZEROBOUNCE_API_KEY }),
    send: sendWithGmail,
  });
  return Response.json(body, { status });
}

async function sendWithGmail(mail: Mail): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transporter.sendMail({
    from: `Portfolio <${user}>`,
    to: user,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
}
