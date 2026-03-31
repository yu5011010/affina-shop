import Link from "next/link";

import { checkoutAction } from "@/app/actions";
import { generateCsrfToken } from "@/lib/csrf";
import { getCartSummary } from "@/lib/store";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; order?: string }>;
}) {
  const params = await searchParams;
  const { lines, total } = await getCartSummary();
  const csrfToken = await generateCsrfToken();

  if (params.success === "1") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <section className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
            注文完了
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            ご注文ありがとうございます
          </h1>
          <p className="mt-4 text-slate-600">
            注文番号:{" "}
            <span className="font-medium text-slate-900">{params.order}</span>
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            商品一覧に戻る
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          レジ
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
          注文を確定する
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <form action={checkoutAction} className="space-y-5">
            <input type="hidden" name="csrf_token" value={csrfToken} />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                お名前
              </label>
              <input
                name="fullName"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Taira Yugo"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                郵便番号
              </label>
              <input
                name="postalCode"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="100-0001"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                住所
              </label>
              <textarea
                name="address"
                required
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Tokyo, Chiyoda..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              注文する
            </button>
          </form>
        </section>

        <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            注文内容
          </p>

          <div className="mt-6 space-y-4">
            {lines.map((line) => (
              <div
                key={line.product.id}
                className="flex items-start justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium text-white">{line.product.name}</p>
                  <p className="text-slate-400">数量 {line.quantity}</p>
                </div>
                <span>¥{line.subtotal.toLocaleString("ja-JP")}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-lg font-semibold">
            合計: ¥{total.toLocaleString("ja-JP")}
          </div>
        </aside>
      </div>
    </main>
  );
}
