import Link from "next/link";

import { createProductAction, deleteProductAction } from "@/app/actions";
import { demoProducts } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentProfile, getOwnerProducts } from "@/lib/store";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Admin
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            Owner admin is ready for Supabase
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            This page becomes writable once Supabase env vars are configured and
            you log in as an `owner`. Until then, sample products are shown
            below so the layout stays demoable.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {demoProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border border-slate-200 p-4"
              >
                <p className="text-sm text-slate-500">{product.category}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  ¥{product.price.toLocaleString("ja-JP")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Login required
          </h1>
          <p className="mt-4 text-slate-600">
            Sign in with an owner account to manage products.
          </p>
        </section>
      </main>
    );
  }

  if (profile.role !== "owner") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Owner access only
          </h1>
          <p className="mt-4 text-slate-600">
            Your current role is `{profile.role}`. Create or update a profile
            with role `owner` to open the admin product form.
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
            Owner tools
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Add a new product
          </h1>

          <form action={createProductAction} className="mt-6 space-y-4">
            <input
              name="name"
              placeholder="Product name"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <textarea
              name="description"
              placeholder="Description"
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              name="category"
              placeholder="Category"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              name="imageUrl"
              placeholder="Image URL (optional)"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                name="price"
                min="0"
                placeholder="Price"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
              <input
                type="number"
                name="stock"
                min="0"
                placeholder="Stock"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Save product
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Current catalog
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Your products
          </h2>

          <div className="mt-6 space-y-4">
            {products.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                No products yet. Add your first item from the form.
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
                        ¥{product.price.toLocaleString("ja-JP")} / stock{" "}
                        {product.stock}
                      </p>
                    </div>
                    <form action={deleteProductAction}>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                        >
                          Edit
                        </Link>
                        <input type="hidden" name="productId" value={product.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600"
                        >
                          Delete
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
