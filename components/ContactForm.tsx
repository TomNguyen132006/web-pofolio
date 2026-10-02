"use client";

import { useRef, useState } from "react";
import { LIMITS, normalizeContact, validateContact, type ContactErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "failure";
type Field = "name" | "email" | "message";

const EMPTY = { name: "", email: "", message: "" };

const inputBase =
  "mt-1.5 w-full rounded-lg border bg-bg px-3 py-2.5 text-base text-fg placeholder:text-muted/60 transition-colors duration-200 focus:outline-2 focus:outline-offset-1 focus:outline-accent";

export default function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [values, setValues] = useState(EMPTY);
  const [website, setWebsite] = useState(""); // honeypot: humans never see or fill this
  const [errors, setErrors] = useState<ContactErrors>({});
  const [suggestion, setSuggestion] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState("");
  // A ref (not state) guards against double submits: it updates immediately, while
  // state only changes on the next render, so two quick clicks could both get through.
  const sending = useRef(false);

  function update(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    if (field === "email") setSuggestion(undefined);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const input = normalizeContact(values);
    const clientErrors = validateContact(input);
    setSuggestion(undefined);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    sending.current = true;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website }),
        // Never leave the visitor on "Sending…": after 30s show the email-me fallback.
        signal: AbortSignal.timeout(30_000),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSentName(input.name);
        setValues(EMPTY);
        setStatus("success");
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setSuggestion(data.suggestion);
        setStatus("idle");
      } else {
        setStatus("failure");
      }
    } catch {
      setStatus("failure");
    } finally {
      sending.current = false;
    }
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: `${inputBase} ${errors[field] ? "border-error" : "border-border"}`,
  });

  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="mt-1.5 text-sm text-error">
        {errors[field]}
      </p>
    );

  return (
    <div aria-live="polite">
      {status === "success" ? (
        <div className="flex h-full flex-col items-center justify-center py-10 text-center">
          <div aria-hidden className="flex size-12 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
            ✓
          </div>
          <h3 className="mt-4 text-xl font-bold break-words">Thanks, {sentName}!</h3>
          <p className="mt-2 text-muted">Your message is on its way. I&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="relative">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="text-sm font-medium">
                Name
              </label>
              <input
                {...fieldProps("name")}
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name}
                placeholder="Jane Smith"
                onChange={(e) => update("name", e.target.value)}
              />
              {errorText("name")}
            </div>
            <div>
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </label>
              <input
                {...fieldProps("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="jane@company.com"
                onChange={(e) => update("email", e.target.value)}
              />
              {errorText("email")}
              {suggestion && (
                <button
                  type="button"
                  onClick={() => update("email", suggestion)}
                  className="mt-1 text-left text-sm break-all text-accent underline underline-offset-[3px]"
                >
                  Did you mean {suggestion}?
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="contact-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              {...fieldProps("message")}
              rows={5}
              maxLength={LIMITS.messageMax}
              placeholder="Hi! I'd love to chat about an internship on our team…"
              onChange={(e) => update("message", e.target.value)}
              style={{ resize: "vertical" }}
            />
            {errorText("message")}
          </div>

          {/* Honeypot: off-screen, hidden from assistive tech, skipped by Tab. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary to-primary-light px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <span aria-hidden className="size-3.5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin" />
                Sending…
              </>
            ) : (
              "Send message →"
            )}
          </button>

          {status === "failure" && (
            <p className="mt-4 rounded-lg bg-error/10 px-3 py-2.5 text-sm text-error">
              Couldn&apos;t send your message. Please email me directly at{" "}
              <a href={`mailto:${fallbackEmail}`} className="font-semibold break-words underline">
                {fallbackEmail}
              </a>
              .
            </p>
          )}
        </form>
      )}
    </div>
  );
}
