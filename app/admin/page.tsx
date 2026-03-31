import Link from "next/link";

import { createProductAction, deleteProductAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";
import { generateCsrfToken } from "@/lib/csrf";
import { getCurrentProfile, getOwnerProducts } from "@/lib/store";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            管理画面
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            Supabase 設定後に利用可能
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Supabase の環境変数を設定し、管理者または出品者でログインすると編集できます。
          </p>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            ログインが必要です
          </h1>
          <p className="mt-4 text-slate-600">
            管理者または出品者アカウントでログインして商品を管理してください。
          </p>
        </section>
      </main>
    );
  }

  const csrfToken = await generateCsrfToken();

  if (!["owner", "seller"].includes(profile.role)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            管理画面へのアクセス権限がありません
          </h1>
          <p className="mt-4 text-slate-600">
            現在のロールは `{profile.role}` です。管理者または出品者でプロフィールを更新してください。
          </p>
        </section>
      </main>
    );
  }

  const products = await getOwnerProducts(profile.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            出品者ツール
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            新規商品を追加
          </h1>

          <form action={createProductAction} className="mt-6 space-y-4">
            <input type="hidden" name="csrf_token" value={csrfToken} />
            <input
              name="name"
              placeholder="商品名"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <textarea
              name="description"
              placeholder="説明"
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              name="category"
              placeholder="カテゴリ"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              name="imageUrl"
              placeholder="画像URL（任意）"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                name="price"
                min="0"
                placeholder="価格"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              <input
                type="number"
                name="stock"
                min="0"
                placeholder="在庫数"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              商品を保存
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            登録商品
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            あなたの商品
          </h2>

          <div className="mt-6 space-y-4">
            {products.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                商品がありません。上のフォームから最初の商品を追加してください。
              </p>
            ) : (
              products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-3xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{product.category}</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        ¥{product.price.toLocaleString("ja-JP")} / 在庫{" "}
                        {product.stock}
                      </p>
                    </div>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="csrf_token" value={csrfToken} />
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                        >
                          編集
                        </Link>
                        <input type="hidden" name="productId" value={product.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600"
                        >
                          削除
                        </button>
                      </div>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
