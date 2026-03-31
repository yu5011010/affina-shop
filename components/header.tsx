import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";
import { generateCsrfToken } from "@/lib/csrf";
import { getCartSummary, getCurrentProfile } from "@/lib/store";

export async function Header() {
  const profile = await getCurrentProfile();
  const cart = await getCartSummary();
  const csrfToken = await generateCsrfToken();

  return (
    <header className="border-b border-black/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Affina Shop
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
            <Link href="/" className="text-slate-600 transition hover:text-slate-900">
              商品
            </Link>
            <Link
              href="/cart"
              className="text-slate-600 transition hover:text-slate-900"
            >
              カート ({cart.quantity})
            </Link>
            <Link
              href="/checkout"
              className="text-slate-600 transition hover:text-slate-900"
            >
              レジに進む
            </Link>
            <Link
              href="/admin"
              className="text-slate-600 transition hover:text-slate-900"
            >
              管理画面
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {!hasSupabaseEnv() ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
              デモモード
            </span>
          ) : null}

          {profile ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {profile.display_name || profile.email}
              </span>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                {profile.role}
              </span>
              <form action={signOutAction}>
                <input type="hidden" name="csrf_token" value={csrfToken} />
                <button
                  type="submit"
                  className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-w-20 items-center justify-center whitespace-nowrap rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="inline-flex min-w-24 items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
