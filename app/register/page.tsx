import Link from "next/link";

import { signUpAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";

export default async function RegisterPage({
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
          Create account
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Register as a customer or owner. Owners can access the admin product
          form after sign-in.
        </p>

        {!hasSupabaseEnv() ? (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            to enable registration.
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <form action={signUpAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Display name
            </label>
            <input
              name="displayName"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

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
              minLength={6}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              name="role"
              defaultValue="user"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="user">user</option>
              <option value="owner">owner</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-slate-900">
            Login here
          </Link>
        </p>
      </section>
    </main>
  );
}
