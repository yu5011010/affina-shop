import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { CSRF_COOKIE } from "@/lib/csrf";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";

function ensureCsrfToken(request: NextRequest): { token: string; isNew: boolean } {
  const existing = request.cookies.get(CSRF_COOKIE)?.value;
  if (existing) {
    return { token: existing, isNew: false };
  }
  return { token: crypto.randomUUID(), isNew: true };
}

export async function updateSession(request: NextRequest) {
  const { token: csrfToken, isNew: csrfIsNew } = ensureCsrfToken(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-csrf-token", csrfToken);

  const isGetOrHead = request.method === "GET" || request.method === "HEAD";
  const requestForNext = isGetOrHead
    ? new Request(request.url, { method: request.method, headers: requestHeaders })
    : request;

  if (!hasSupabaseEnv()) {
    const response = NextResponse.next({ request: requestForNext });
    if (csrfIsNew) {
      response.cookies.set(CSRF_COOKIE, csrfToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 3600,
      });
    }
    return response;
  }

  const response = NextResponse.next({
    request: requestForNext,
  });

  if (csrfIsNew) {
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ["/cart", "/checkout", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    if (csrfIsNew) {
      redirectResponse.cookies.set(CSRF_COOKIE, csrfToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 3600,
      });
    }
    return redirectResponse;
  }

  return response;
}
