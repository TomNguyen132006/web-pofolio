import { test } from "node:test";
import assert from "node:assert/strict";
import { handleContact } from "../lib/contactHandler.ts";
import type { ContactDeps, Mail } from "../lib/contactHandler.ts";

// handleContact logs send failures. Keep test output clean.
console.error = () => {};

const good = {
  name: "Jane Smith",
  email: "jane@company.com",
  message: "Hi! I'd love to chat about an internship.",
  website: "",
};

// Fake dependencies that record what they were asked to do.
function fakes(overrides: Partial<ContactDeps> = {}) {
  const verified: string[] = [];
  const sent: Mail[] = [];
  const deps: ContactDeps = {
    verify: async (email) => {
      verified.push(email);
      return { ok: true };
    },
    send: async (mail) => {
      sent.push(mail);
    },
    ...overrides,
  };
  return { deps, verified, sent };
}

test("sends a plain-text email with Reply-To set to the visitor", async () => {
  const { deps, sent } = fakes();
  const res = await handleContact({ ...good, name: "  Jane Smith  " }, deps);
  assert.deepEqual(res, { status: 200, body: { ok: true } });
  assert.deepEqual(sent, [
    {
      subject: "Portfolio message from Jane Smith",
      replyTo: "jane@company.com",
      text: "Name: Jane Smith\nEmail: jane@company.com\n\nHi! I'd love to chat about an internship.\n",
    },
  ]);
});

test("honeypot filled → pretends success, verifies and sends nothing", async () => {
  const { deps, verified, sent } = fakes();
  const res = await handleContact({ ...good, website: "http://spam.example" }, deps);
  assert.deepEqual(res, { status: 200, body: { ok: true } });
  assert.equal(verified.length, 0);
  assert.equal(sent.length, 0);
});

test("invalid fields → 400 with field errors, without spending a verification credit", async () => {
  const { deps, verified, sent } = fakes();
  const res = await handleContact({ ...good, email: "jane@company", message: "Hi" }, deps);
  assert.equal(res.status, 400);
  assert.deepEqual(res.body, {
    ok: false,
    errors: { email: "Please enter a valid email address.", message: "Message should be at least 10 characters." },
  });
  assert.equal(verified.length, 0);
  assert.equal(sent.length, 0);
});

test("missing or non-JSON body → 400 with every field error", async () => {
  const { deps } = fakes();
  const res = await handleContact(null, deps);
  assert.equal(res.status, 400);
  assert.deepEqual(Object.keys((res.body as { errors: object }).errors).sort(), ["email", "message", "name"]);
});

test("email rejected by verification → 400 on the email field, with suggestion, nothing sent", async () => {
  const { deps, sent } = fakes({
    verify: async () => ({ ok: false, message: "This email address doesn't seem to exist.", suggestion: "jane@gmail.com" }),
  });
  const res = await handleContact({ ...good, email: "jane@gmial.com" }, deps);
  assert.deepEqual(res, {
    status: 400,
    body: { ok: false, errors: { email: "This email address doesn't seem to exist." }, suggestion: "jane@gmail.com" },
  });
  assert.equal(sent.length, 0);
});

test("rejection without a suggestion has no suggestion key", async () => {
  const { deps } = fakes({ verify: async () => ({ ok: false, message: "Please use a permanent email address." }) });
  const res = await handleContact(good, deps);
  assert.deepEqual(res.body, { ok: false, errors: { email: "Please use a permanent email address." } });
});

test("send failure → 500 with a generic message (no internal details leaked)", async () => {
  const { deps } = fakes({
    send: async () => {
      throw new Error("Invalid login: 535 Username and Password not accepted");
    },
  });
  const res = await handleContact(good, deps);
  assert.deepEqual(res, { status: 500, body: { ok: false, error: "Couldn't send your message." } });
});
