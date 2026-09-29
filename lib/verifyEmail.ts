// Asks ZeroBounce whether an email address really exists.
// Fails open: if ZeroBounce is unavailable, we allow the message rather than lose a real one.

export type VerifyResult = { ok: true } | { ok: false; message: string; suggestion?: string };

type Options = {
  apiKey: string | undefined;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

type ZeroBounceResponse = {
  status?: string;
  sub_status?: string;
  did_you_mean?: string | null;
  error?: string;
};

const ENDPOINT = "https://api.zerobounce.net/v2/validate";
const INVALID = "This email address doesn't seem to exist.";
const DISPOSABLE = "Please use a permanent email address.";

export async function verifyEmail(
  email: string,
  { apiKey, fetchImpl = fetch, timeoutMs = 8000 }: Options,
): Promise<VerifyResult> {
  if (!apiKey) {
    console.warn("[contact] ZEROBOUNCE_API_KEY is not set; skipping email verification.");
    return { ok: true };
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("email", email);
  url.searchParams.set("timeout", "5");

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`ZeroBounce HTTP ${res.status}`);
    const data = (await res.json()) as ZeroBounceResponse;
    if (data.error) throw new Error(`ZeroBounce: ${data.error}`);

    if (data.status === "invalid" || data.status === "spamtrap") {
      return data.did_you_mean
        ? { ok: false, message: INVALID, suggestion: data.did_you_mean }
        : { ok: false, message: INVALID };
    }
    if (data.status === "do_not_mail" && data.sub_status === "disposable") {
      return { ok: false, message: DISPOSABLE };
    }
    return { ok: true };
  } catch (err) {
    // Log the reason only. The API key is in the URL, so never log the URL.
    console.warn("[contact] Email verification unavailable; allowing message:", (err as Error).message);
    return { ok: true };
  }
}
