import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyEmail } from "../lib/verifyEmail.ts";

// verifyEmail logs a warning when it fails open. Keep test output clean.
console.warn = () => {};

const INVALID = "This email address doesn't seem to exist.";
const DISPOSABLE = "Please use a permanent email address.";

// A fake fetch that returns `body` as JSON and records the URLs it was called with.
function fakeFetch(body: unknown, status = 200) {
  const calls: string[] = [];
  const impl = (async (url: string | URL | Request) => {
    calls.push(String(url));
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
  return { impl, calls };
}

const check = (body: unknown, status = 200) =>
  verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: fakeFetch(body, status).impl });

test("calls ZeroBounce with the key, the email, and a 5s server timeout", async () => {
  const { impl, calls } = fakeFetch({ status: "valid" });
  await verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: impl });
  assert.equal(calls.length, 1);
  const url = new URL(calls[0]);
  assert.equal(url.origin + url.pathname, "https://api.zerobounce.net/v2/validate");
  assert.equal(url.searchParams.get("api_key"), "KEY");
  assert.equal(url.searchParams.get("email"), "jane@company.com");
  assert.equal(url.searchParams.get("timeout"), "5");
});

test("valid → allowed", async () => {
  assert.deepEqual(await check({ status: "valid", sub_status: "" }), { ok: true });
});

test("invalid → rejected, with ZeroBounce's typo suggestion when it has one", async () => {
  assert.deepEqual(await check({ status: "invalid", sub_status: "mailbox_not_found", did_you_mean: "jane@gmail.com" }), {
    ok: false,
    message: INVALID,
    suggestion: "jane@gmail.com",
  });
  assert.deepEqual(await check({ status: "invalid", sub_status: "mailbox_not_found", did_you_mean: null }), {
    ok: false,
    message: INVALID,
  });
});

test("spamtrap → rejected", async () => {
  assert.deepEqual(await check({ status: "spamtrap", did_you_mean: null }), { ok: false, message: INVALID });
});

test("disposable address → rejected with its own message", async () => {
  assert.deepEqual(await check({ status: "do_not_mail", sub_status: "disposable" }), { ok: false, message: DISPOSABLE });
});

test("uncertain results are allowed so real recruiters are never blocked", async () => {
  for (const body of [
    { status: "catch-all" },
    { status: "unknown" },
    { status: "abuse" },
    { status: "do_not_mail", sub_status: "role_based" },
  ]) {
    assert.deepEqual(await check(body), { ok: true }, JSON.stringify(body));
  }
});

test("fails open: API error field (e.g. out of credits)", async () => {
  assert.deepEqual(await check({ error: "Invalid API Key or your account ran out of credits" }), { ok: true });
});

test("fails open: HTTP error", async () => {
  assert.deepEqual(await check({ message: "oops" }, 500), { ok: true });
});

test("fails open: network error", async () => {
  const failing = (async () => {
    throw new Error("network down");
  }) as typeof fetch;
  assert.deepEqual(await verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: failing }), { ok: true });
});

test("fails open: ZeroBounce too slow", async () => {
  // Never resolves on its own. It only rejects when verifyEmail aborts it.
  const hanging = ((_url: string | URL | Request, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init?.signal?.reason));
    })) as typeof fetch;
  assert.deepEqual(await verifyEmail("jane@company.com", { apiKey: "KEY", fetchImpl: hanging, timeoutMs: 50 }), {
    ok: true,
  });
});

test("no API key → skips the call entirely and allows", async () => {
  const { impl, calls } = fakeFetch({ status: "invalid" });
  assert.deepEqual(await verifyEmail("jane@company.com", { apiKey: undefined, fetchImpl: impl }), { ok: true });
  assert.equal(calls.length, 0);
});
