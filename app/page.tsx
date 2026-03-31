import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { hasSupabaseEnv } from "@/lib/env";
import { generateCsrfToken } from "@/lib/csrf";
import { getProducts } from "@/lib/store";

/** 商品一覧は常に DB 最新（ID 差し替え・seed 後も古いリンクが残らないように） */
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const csrfToken = await generateCsrfToken();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col px-6 py-10">
      <section className="grid gap-8 rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-xl md:grid-cols-[1.4fr_0.9fr] md:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Affina Shop
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
            アフィリエイト特化型のECサイト
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
            商品を登録する出品者（owner/seller）と、紹介して購入につなげるユーザーが
            つながるプラットフォーム。カート・チェックアウト・在庫管理に対応。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="inline-flex min-w-32 items-center justify-center whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              カートを見る
            </Link>
            <Link
              href="/admin"
              className="inline-flex min-w-32 items-center justify-center whitespace-nowrap rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
            >
              管理画面へ
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.5rem] bg-white/6 p-5 text-sm text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              出品者
            </p>
            <p className="mt-2 text-lg font-medium">owner / seller が商品を登録</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              データ
            </p>
            <p className="mt-2 text-lg font-medium">
              {hasSupabaseEnv() ? "Supabase 接続中" : "未接続"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              掲載商品
            </p>
            <p className="mt-2 text-lg font-medium">{products.length} 点</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              カタログ
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              おすすめ商品
            </h2>
          </div>
          {!hasSupabaseEnv() ? (
            <p className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">
              Supabase の環境変数を設定すると商品を表示できます。
            </p>
          ) : null}
        </div>

        {products.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-12 text-center text-slate-600">
            <p className="text-lg font-medium text-slate-900">商品がありません</p>
            <p className="mt-3">
              Supabase のシードを実行するか、管理画面から商品を追加してください。
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} csrfToken={csrfToken} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
