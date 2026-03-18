import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { hasSupabaseEnv } from "@/lib/env";
import { getCartSummary, getCurrentProfile } from "@/lib/store";

export async function Header() {
  const profile = await getCurrentProfile();
  const cart = await getCartSummary();

  return (
    <header className="border-b border-black/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Affina Shop
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
            <Link href="/">Products</Link>
            <Link href="/cart">Cart ({cart.quantity})</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {!hasSupabaseEnv() ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
              Demo mode
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
                <button
                  type="submit"
                  className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 px-3 py-1 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-3 py-1 text-white transition hover:bg-slate-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
