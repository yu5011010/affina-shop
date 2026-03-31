import Image from "next/image";
import Link from "next/link";

import { addToCartAction } from "@/app/actions";
import { ProductRecord } from "@/lib/types";

type ProductCardProps = {
  product: ProductRecord;
  csrfToken?: string;
};

export function ProductCard({ product, csrfToken }: ProductCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-2xl font-semibold text-white">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={480}
            height={320}
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          product.name.slice(0, 1)
        )}
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {product.category || "その他"}
        </span>
        {product.stock <= 0 ? (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
            在庫切れ
          </span>
        ) : (
          <span className="text-xs text-slate-500">在庫 {product.stock}</span>
        )}
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {product.name}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {product.description || "説明はありません。"}
      </p>

      <div className="mt-6 flex min-w-0 flex-col gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            価格
          </p>
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            ¥{product.price.toLocaleString("ja-JP")}
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-2">
          <Link
            href={`/products/${product.id}`}
            className="inline-flex min-w-0 items-center justify-center rounded-full border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            詳細
          </Link>

          {product.stock <= 0 ? (
            <span className="inline-flex min-w-0 cursor-not-allowed items-center justify-center rounded-full bg-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-500">
              在庫切れ
            </span>
          ) : (
            <form action={addToCartAction} className="min-w-0">
              {csrfToken ? (
                <input type="hidden" name="csrf_token" value={csrfToken} />
              ) : null}
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="quantity" value="1" />
              <button
                type="submit"
                className="w-full min-w-0 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                カートに追加
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
