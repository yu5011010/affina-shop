import Link from "next/link";

import { removeCartItemAction, updateCartItemAction } from "@/app/actions";
import { getCartSummary } from "@/lib/store";

export default async function CartPage() {
  const { lines, total } = await getCartSummary();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Cart</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
          Review your items
        </h1>
      </div>

      {lines.length === 0 ? (
        <section className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Your cart is empty
          </h2>
          <p className="mt-3 text-slate-600">
            Add a few products from the home page to continue.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-4">
            {lines.map((line) => (
              <article
                key={line.product.id}
                className="rounded-[1.75rem] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 text-3xl font-semibold text-white">
                      {line.product.name.slice(0, 1)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        {line.product.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        ¥{line.product.price.toLocaleString("ja-JP")} each
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <form action={updateCartItemAction} className="flex gap-2">
                      <input
                        type="hidden"
                        name="productId"
                        value={line.product.id}
                      />
                      <input
                        type="number"
                        name="quantity"
                        min="0"
                        defaultValue={line.quantity}
                        className="w-20 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                      >
                        Update
                      </button>
                    </form>

                    <form action={removeCartItemAction}>
                      <input
                        type="hidden"
                        name="productId"
                        value={line.product.id}
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>

                <div className="mt-4 text-right text-sm font-medium text-slate-700">
                  Subtotal: ¥{line.subtotal.toLocaleString("ja-JP")}
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Summary
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{lines.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
                <span>Total</span>
                <span>¥{total.toLocaleString("ja-JP")}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 inline-flex w-full justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
