import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeContact, subjectFor, validateContact } from "../lib/contact.ts";

const good = {
  name: "Jane Smith",
  email: "jane@company.com",
  message: "Hi! I'd love to chat about an internship.",
};

test("a complete, well-formed message has no errors", () => {
  assert.deepEqual(validateContact(good), {});
});

test("normalizeContact trims strings and blanks out anything else", () => {
  assert.deepEqual(normalizeContact({ name: "  Jane ", email: 42, message: null }), {
    name: "Jane",
    email: "",
    message: "",
  });
  assert.deepEqual(normalizeContact(null), { name: "", email: "", message: "" });
  assert.deepEqual(normalizeContact("not an object"), { name: "", email: "", message: "" });
});

test("name is required and at most 100 characters", () => {
  assert.equal(validateContact({ ...good, name: "" }).name, "Please enter your name.");
  assert.equal(validateContact({ ...good, name: "a".repeat(101) }).name, "Name must be 100 characters or fewer.");
  assert.equal(validateContact({ ...good, name: "a".repeat(100) }).name, undefined);
});

test("malformed emails are rejected", () => {
  const bad = ["", "jane", "jane@company", "jane.company.com", "jane @company.com", "jane@company.c", `${"a".repeat(250)}@x.com`];
  for (const email of bad) {
    assert.equal(validateContact({ ...good, email }).email, "Please enter a valid email address.", email);
  }
});

test("common real-world email shapes are accepted", () => {
  for (const email of ["jane@company.com", "jane.smith+jobs@mail.company.co.uk"]) {
    assert.equal(validateContact({ ...good, email }).email, undefined, email);
  }
});

test("message must be 10–2000 characters", () => {
  assert.equal(validateContact({ ...good, message: "Too short" }).message, "Message should be at least 10 characters.");
  assert.equal(validateContact({ ...good, message: "a".repeat(10) }).message, undefined);
  assert.equal(validateContact({ ...good, message: "a".repeat(2000) }).message, undefined);
  assert.equal(validateContact({ ...good, message: "a".repeat(2001) }).message, "Message must be 2000 characters or fewer.");
});

test("subjectFor strips line breaks so a name can't inject email headers", () => {
  assert.equal(subjectFor("Jane Smith"), "Portfolio message from Jane Smith");
  assert.equal(subjectFor("Jane\r\nBcc: x@evil.com"), "Portfolio message from Jane Bcc: x@evil.com");
});
