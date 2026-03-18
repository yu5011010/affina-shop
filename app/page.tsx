import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { hasSupabaseEnv } from "@/lib/env";
import { getProducts } from "@/lib/store";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col px-6 py-10">
      <section className="grid gap-8 rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-xl md:grid-cols-[1.4fr_0.9fr] md:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Phase 1 MVP
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
            A small EC site built for the future affiliate layer.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
            Product listing, product detail, cart, checkout, owner admin, and
            Supabase-ready auth are all wired into one Next.js app.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Open cart
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/60"
            >
              Go to admin
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.5rem] bg-white/6 p-5 text-sm text-slate-200">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              Runtime
            </p>
            <p className="mt-2 text-lg font-medium">Next.js 16 + TypeScript</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              Data source
            </p>
            <p className="mt-2 text-lg font-medium">
              {hasSupabaseEnv() ? "Supabase connected" : "Demo mode with mock data"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
              Products loaded
            </p>
            <p className="mt-2 text-lg font-medium">{products.length}</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Catalog
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Featured products
            </h2>
          </div>
          {!hasSupabaseEnv() ? (
            <p className="rounded-full bg-amber-100 px-4 py-2 text-sm text-amber-800">
              Add Supabase env vars to switch from demo data to database data.
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
