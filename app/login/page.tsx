import Link from "next/link";

import { signInAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";
import { generateCsrfToken } from "@/lib/csrf";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const csrfToken = await generateCsrfToken();

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">認証</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          ログイン
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Supabase で認証します。環境変数が未設定の場合はデモモードになります。
        </p>

        {!hasSupabaseEnv() ? (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定してください。
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {decodeURIComponent(params.error)}
          </div>
        ) : null}

        <form action={signInAction} className="mt-6 space-y-4">
          <input type="hidden" name="csrf_token" value={csrfToken} />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              メールアドレス
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              パスワード
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-w-28 items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ログイン
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          アカウントをお持ちでないですか？{" "}
          <Link href="/register" className="font-medium text-slate-900">
            新規登録
          </Link>
        </p>
      </section>
    </main>
  );
}
