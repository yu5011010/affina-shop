import type { NextRequest } from "next/server";

import {
  AFFILIATE_CAMPAIGN_COOKIE,
  AFFILIATE_REF_COOKIE,
  affiliateRefCookieOptions,
} from "@/lib/affiliate";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const method = request.method;
  if (method !== "GET" && method !== "HEAD") {
    return response;
  }

  const ref = request.nextUrl.searchParams.get("ref")?.trim();
  if (ref) {
    response.cookies.set(AFFILIATE_REF_COOKIE, ref, affiliateRefCookieOptions);
  }

  const campaignId = request.nextUrl.searchParams.get("campaign_id")?.trim();
  if (campaignId) {
    response.cookies.set(
      AFFILIATE_CAMPAIGN_COOKIE,
      campaignId,
      affiliateRefCookieOptions,
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
