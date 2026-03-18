import { notFound } from "next/navigation";

import { addToCartAction } from "@/app/actions";
import { getProductById } from "@/lib/store";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex min-h-[380px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-8xl font-semibold text-white">
          {product.name.slice(0, 1)}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {product.category || "General"}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              Stock {product.stock}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900">
            {product.name}
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {product.description || "No description yet."}
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Price
            </p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">
              ¥{product.price.toLocaleString("ja-JP")}
            </p>

            <form action={addToCartAction} className="mt-6 flex flex-wrap gap-3">
              <input type="hidden" name="productId" value={product.id} />
              <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Qty
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  defaultValue="1"
                  className="w-16 bg-transparent text-right text-slate-900 outline-none"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Add to cart
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
