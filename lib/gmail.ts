// Sends contact messages through Gmail SMTP. `createTransport` is passed in
// (nodemailer's in the route, a fake in tests) so this can be tested offline.
import type { Mail } from "./contactHandler.ts";

type Credentials = { user: string | undefined; pass: string | undefined };

type Transport = { sendMail: (message: Record<string, unknown>) => Promise<unknown> };

// Nodemailer's defaults wait minutes for a stalled server; give up fast instead,
// so the visitor sees the "email me directly" fallback within seconds.
const TIMEOUTS = { connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000 };

export function createGmailSender(
  { user, pass }: Credentials,
  createTransport: (options: Record<string, unknown>) => Transport,
) {
  return async (mail: Mail): Promise<void> => {
    if (!user || !pass) throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD are not set");

    const transporter = createTransport({ service: "gmail", auth: { user, pass }, ...TIMEOUTS });
    await transporter.sendMail({
      from: `Portfolio <${user}>`,
      to: user,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    });
  };
}
