import Link from "next/link";

import { addToCartAction } from "@/app/actions";
import { ProductRecord } from "@/lib/types";

type ProductCardProps = {
  product: ProductRecord;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-2xl font-semibold text-white">
        {product.name.slice(0, 1)}
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {product.category || "General"}
        </span>
        <span className="text-xs text-slate-500">Stock {product.stock}</span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
        {product.name}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {product.description || "No description yet."}
      </p>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Price
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            ¥{product.price.toLocaleString("ja-JP")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Details
          </Link>

          <form action={addToCartAction}>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
            >
              Add to cart
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
