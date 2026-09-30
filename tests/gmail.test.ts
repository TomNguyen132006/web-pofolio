import { test } from "node:test";
import assert from "node:assert/strict";
import { createGmailSender } from "../lib/gmail.ts";

const mail = { subject: "Portfolio message from Jane", text: "Hello", replyTo: "jane@company.com" };

// A fake nodemailer.createTransport that records its options and the sent message.
function fakeTransport() {
  const calls: { options: Record<string, unknown>; sent: Record<string, unknown>[] } = { options: {}, sent: [] };
  const createTransport = (options: Record<string, unknown>) => {
    calls.options = options;
    return {
      sendMail: async (message: Record<string, unknown>) => {
        calls.sent.push(message);
      },
    };
  };
  return { createTransport, calls };
}

test("sends from and to the Gmail account, with Reply-To set to the visitor", async () => {
  const { createTransport, calls } = fakeTransport();
  const send = createGmailSender({ user: "me@gmail.com", pass: "app-pass" }, createTransport);
  await send(mail);
  assert.deepEqual(calls.sent, [
    { from: "Portfolio <me@gmail.com>", to: "me@gmail.com", replyTo: "jane@company.com", subject: mail.subject, text: "Hello" },
  ]);
});

test("gives up quickly if Gmail stalls, so the visitor isn't stuck on 'Sending…'", async () => {
  const { createTransport, calls } = fakeTransport();
  await createGmailSender({ user: "me@gmail.com", pass: "app-pass" }, createTransport)(mail);
  assert.equal(calls.options.service, "gmail");
  assert.deepEqual(calls.options.auth, { user: "me@gmail.com", pass: "app-pass" });
  for (const key of ["connectionTimeout", "greetingTimeout", "socketTimeout"]) {
    const value = calls.options[key];
    assert.ok(typeof value === "number" && value > 0 && value <= 15_000, `${key} should be set and ≤ 15s, got ${value}`);
  }
});

test("missing credentials → throws before trying to connect", async () => {
  const { createTransport, calls } = fakeTransport();
  const send = createGmailSender({ user: undefined, pass: "app-pass" }, createTransport);
  await assert.rejects(send(mail), /GMAIL_USER \/ GMAIL_APP_PASSWORD are not set/);
  assert.equal(calls.sent.length, 0);
});
