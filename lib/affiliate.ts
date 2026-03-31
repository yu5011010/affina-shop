/** httpOnly Cookie: アフィリエイト ref（仲介の affiliate_code） */

export const AFFILIATE_REF_COOKIE = "affina_ref";

/** httpOnly Cookie: 仲介の案件 ID（?campaign_id=） */
export const AFFILIATE_CAMPAIGN_COOKIE = "affina_campaign";

/** 30 日 */
export const AFFILIATE_REF_MAX_AGE = 60 * 60 * 24 * 30;

export const affiliateRefCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: AFFILIATE_REF_MAX_AGE,
};
