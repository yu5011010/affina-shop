import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const CSRF_COOKIE = "ec-csrf-token";

/**
 * Reads the CSRF token from the request (set by middleware).
 * Uses header first (GET), falls back to cookie (POST/RSC) for consistent hydration.
 */
export async function generateCsrfToken(): Promise<string> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-csrf-token");
  if (fromHeader) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(CSRF_COOKIE)?.value;
  return fromCookie ?? "";
}

export async function validateCsrfToken(formData: FormData): Promise<void> {
  const token = String(formData.get("csrf_token") ?? "").trim();
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value ?? "";

  if (!token || token !== cookieToken) {
    redirect("/?error=csrf_invalid");
  }
}
