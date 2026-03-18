import Link from "next/link";

import { signInAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Auth</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in with Supabase Auth. If env vars are missing, this page stays in
          read-only demo mode.
        </p>

        {!hasSupabaseEnv() ? (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            to enable auth.
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <form action={signInAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-slate-900">
            Register here
          </Link>
        </p>
      </section>
    </main>
  );
}
