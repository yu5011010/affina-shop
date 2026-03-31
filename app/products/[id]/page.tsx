import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { addToCartAction } from "@/app/actions";
import { generateCsrfToken } from "@/lib/csrf";
import { hasSupabaseEnv } from "@/lib/env";
import { getProductById } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: rawId } = await params;
  const id = typeof rawId === "string" ? rawId.trim() : "";
  const search = await searchParams;

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Supabase 未設定</h1>
        <p className="mt-4 text-left text-sm leading-relaxed text-slate-600">
          商品ページは DB 参照のため、<code className="rounded bg-slate-100 px-1">.env.local</code> に{" "}
          <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> と{" "}
          <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          が必要です。ローカルなら <code className="rounded bg-slate-100 px-1">supabase status</code> の
          Project URL と Publishable（anon 相当）をコピーしてください。
        </p>
        <Link href="/" className="mt-8 inline-block text-sm text-slate-700 underline">
          トップへ
        </Link>
      </main>
    );
  }

  const product = await getProductById(id);
  const csrfToken = await generateCsrfToken();

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex min-h-[380px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-8xl font-semibold text-white">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={900}
              height={900}
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          ) : (
            product.name.slice(0, 1)
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {product.category || "その他"}
            </span>
            {product.stock <= 0 ? (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                在庫切れ
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                在庫 {product.stock}
              </span>
            )}
          </div>

          {search.error === "out_of_stock" ? (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
              在庫切れのためカートに追加できません。
            </div>
          ) : search.error === "insufficient_stock" ? (
            <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
              在庫が不足しています。数量を減らしてください。
            </div>
          ) : null}

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900">
            {product.name}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {product.description || "説明はありません。"}
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              価格
            </p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">
              ¥{product.price.toLocaleString("ja-JP")}
            </p>

            {product.stock <= 0 ? (
              <div className="mt-6 flex items-center gap-3">
                <span className="rounded-full bg-slate-200 px-6 py-3 text-sm font-medium text-slate-500">
                  在庫切れのため購入できません
                </span>
              </div>
            ) : (
              <form action={addToCartAction} className="mt-6 flex flex-wrap gap-3">
                <input type="hidden" name="csrf_token" value={csrfToken} />
                <input type="hidden" name="productId" value={product.id} />
                <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  数量
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={product.stock}
                    defaultValue="1"
                    className="w-16 bg-transparent text-right text-slate-900 outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-w-36 items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  カートに追加
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
