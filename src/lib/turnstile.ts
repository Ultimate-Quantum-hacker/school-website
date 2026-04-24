/**
 * Cloudflare Turnstile — lightweight, privacy-friendly bot protection.
 *
 * Usage:
 * 1. Client renders <TurnstileWidget /> which injects a hidden
 *    `cf-turnstile-response` token into the form.
 * 2. Server reads that token via `getTurnstileToken(formData)` and calls
 *    `verifyTurnstileToken(token)` before trusting the submission.
 *
 * Defaults to Cloudflare's publicly documented test keys (always pass,
 * never prompt). Override via env in production:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAA...
 *   TURNSTILE_SECRET_KEY=0x4AAA...
 * https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */

/** Test site key — always passes, visible widget. Safe to ship. */
const TEST_SITE_KEY = "1x00000000000000000000AA";

/** Test secret key — always verifies. Safe on server. */
const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || TEST_SITE_KEY;

function getSecret(): string {
  return process.env.TURNSTILE_SECRET_KEY || TEST_SECRET_KEY;
}

export function getTurnstileToken(formData: FormData): string {
  return (formData.get("cf-turnstile-response") as string | null) ?? "";
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  hostname?: string;
  challenge_ts?: string;
  action?: string;
}

/**
 * Verify a Turnstile token with Cloudflare. Returns true when the token
 * is present and valid, false otherwise. Never throws — network errors
 * resolve to `false` so the caller can reject the submission.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams();
  body.append("secret", getSecret());
  body.append("response", token);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        // Short fetch so a slow/outages CF endpoint doesn't hang the form.
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (!res.ok) return false;
    const data = (await res.json()) as TurnstileVerifyResponse;
    return Boolean(data.success);
  } catch {
    return false;
  }
}
