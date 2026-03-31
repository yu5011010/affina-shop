import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      <p className="text-sm font-medium text-slate-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        商品が見つかりません
      </h1>
      <p className="mt-4 text-left text-sm leading-relaxed text-slate-600">
        アフィリンクの URL に含まれる商品 ID（例:{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">
          aaaaaaaa-aaaa-4aaa-8aaa-000000000001
        </code>
        ）は、<strong>Supabase の seed で投入したデモ商品</strong>と一致している必要があります。
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-left text-sm text-slate-600">
        <li>
          まだなら <code className="rounded bg-slate-100 px-1">supabase db reset</code>{" "}
          を実行し、<code className="rounded bg-slate-100 px-1">owner@example.com</code>{" "}
          で一度登録したうえで seed を流してください（README 参照）。
        </li>
        <li>
          既に商品がある DB では、同名行が残っていて固定 UUID が付かないことがあります。その場合も{" "}
          <code className="rounded bg-slate-100 px-1">db reset</code> が確実です。
        </li>
        <li>
          EC トップの商品カードから実際の{" "}
          <code className="rounded bg-slate-100 px-1">/products/{"{id}"}</code>{" "}
          を開き、仲介の案件「EC 商品 ID」をその ID に合わせてください。
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          トップへ
        </Link>
      </div>
    </main>
  );
}
