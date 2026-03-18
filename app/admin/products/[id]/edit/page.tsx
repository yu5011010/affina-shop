import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentProfile, getOwnerProductById } from "@/lib/store";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Edit is available after Supabase setup
          </h1>
          <p className="mt-4 text-slate-600">
            Configure Supabase env vars and sign in as an owner to update
            products.
          </p>
        </section>
      </main>
    );
  }

  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "owner") {
    notFound();
  }

  const { id } = await params;
  const product = await getOwnerProductById(profile.id, id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Owner tools
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Edit product
            </h1>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Back to admin
          </Link>
        </div>

        <form action={updateProductAction} className="mt-8 space-y-4">
          <input type="hidden" name="productId" value={product.id} />

          <input
            name="name"
            defaultValue={product.name}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />
          <textarea
            name="description"
            defaultValue={product.description ?? ""}
            rows={4}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />
          <input
            name="category"
            defaultValue={product.category ?? ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />
          <input
            name="imageUrl"
            defaultValue={product.image_url ?? ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              name="price"
              min="0"
              defaultValue={product.price}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <input
              type="number"
              name="stock"
              min="0"
              defaultValue={product.stock}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={product.is_active}
            />
            Visible on storefront
          </label>

          <button
            type="submit"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Update product
          </button>
        </form>
      </section>
    </main>
  );
}
