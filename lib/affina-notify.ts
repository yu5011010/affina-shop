/**
 * 購入確定後に仲介（Affina）へ成果通知する。
 * 失敗しても呼び出し元の注文はロールバックしない。
 */

export type AffinaConversionItem = {
  product_id: string;
  quantity: number;
  price: number;
};

export type AffinaNotifyPayload = {
  orderId: string;
  affiliateCode: string;
  /** 仲介の campaigns.id（?campaign_id=） */
  campaignId?: string | null;
  totalAmount: number;
  items: AffinaConversionItem[];
};

const LOG_PREFIX = "[affina-notify]";

export async function notifyAffinaConversion(
  payload: AffinaNotifyPayload,
): Promise<void> {
  const url = process.env.AFFINA_NOTIFICATION_URL?.trim();
  const merchantId = process.env.AFFINA_MERCHANT_ID?.trim();
  const secret = process.env.AFFINA_API_SECRET?.trim();

  if (!payload.affiliateCode?.trim()) {
    console.warn(`${LOG_PREFIX} skipped: no affiliate_code (ref Cookie なし＝アフィ経由でない購入)`, {
      orderId: payload.orderId,
    });
    return;
  }

  if (!url || !merchantId || !secret) {
    console.error(`${LOG_PREFIX} skipped: missing env (need AFFINA_NOTIFICATION_URL, AFFINA_MERCHANT_ID, AFFINA_API_SECRET)`, {
      orderId: payload.orderId,
      hasUrl: Boolean(url),
      hasMerchantId: Boolean(merchantId),
      hasSecret: Boolean(secret),
    });
    return;
  }

  const body: Record<string, unknown> = {
    merchant_id: merchantId,
    order_id: payload.orderId,
    affiliate_code: payload.affiliateCode,
    total_amount: payload.totalAmount,
    items: payload.items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
    })),
  };

  const cid = payload.campaignId?.trim();
  if (cid) {
    body.campaign_id = cid;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text().catch(() => "(could not read body)");

    if (!res.ok) {
      console.error(`${LOG_PREFIX} HTTP request failed`, {
        orderId: payload.orderId,
        status: res.status,
        statusText: res.statusText,
        responseBody: responseText.slice(0, 2000),
      });
      return;
    }

    let parsed: { persisted?: boolean; conversionId?: string | null } | null =
      null;
    try {
      parsed = JSON.parse(responseText) as {
        persisted?: boolean;
        conversionId?: string | null;
      };
    } catch {
      /* 非JSON応答 */
    }

    if (parsed && parsed.persisted === false) {
      console.warn(`${LOG_PREFIX} accepted but not persisted on intermediary`, {
        orderId: payload.orderId,
        affiliateCode: payload.affiliateCode,
        campaignId: payload.campaignId ?? null,
        hint:
          "仲介DBで advertiser(merchant_id)・affiliate(affiliate_code)・案件(campaign_id または items[0].product_id = campaigns.external_product_id)が解決できなかった可能性があります。",
        responseBody: responseText.slice(0, 2000),
      });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : undefined;
    console.error(`${LOG_PREFIX} fetch threw`, {
      orderId: payload.orderId,
      message,
      stack,
    });
  }
}
