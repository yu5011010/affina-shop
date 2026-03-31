# Affina Shop

Next.js + TypeScript + Supabase で構成した EC サイトの Phase 1 MVP です。

## Current scope

- 商品一覧
- 商品詳細
- カート
- チェックアウト
- Supabase Auth ベースのログイン / 新規登録
- `owner` ロール向けの簡易管理画面
- Supabase 未接続時のデモモード

## Local development

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## Supabase setup

1. `.env.example` をコピーして `.env.local` を作成
2. `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
3. スキーマを反映

```bash
supabase db push
```

4. ローカル DB をまとめて初期化（**デモユーザー・商品が seed で入ります**）

```bash
supabase start   # 未起動なら
supabase db reset
```

- デモログイン: **`owner@example.com` / `OwnerDemo123`**（`seed.sql` が `auth.users` を作成。手動サインアップ不要）
- `supabase/seed.sql` はプロフィールを `owner` にし、サンプル商品を投入します

**仲介（`../intermediary`）と揃える固定商品 ID**（先頭3件のみ）:

| UUID | 商品名 |
|------|--------|
| `aaaaaaaa-aaaa-4aaa-8aaa-000000000001` | Desk Setup Starter Kit |
| `aaaaaaaa-aaaa-4aaa-8aaa-000000000002` | Focus Mechanical Keyboard |
| `aaaaaaaa-aaaa-4aaa-8aaa-000000000003` | Travel Mug Pro |

既存 DB に同名商品だけある場合は UUID が古いままなので、**EC と案件を一致させるには `supabase db reset` を推奨**します。

## Key files

- `app/page.tsx`: 商品一覧トップ
- `app/products/[id]/page.tsx`: 商品詳細
- `app/cart/page.tsx`: カート
- `app/checkout/page.tsx`: チェックアウト
- `app/admin/page.tsx`: owner 管理画面
- `app/actions.ts`: Server Actions
- `lib/store.ts`: Supabase / デモモードのデータ取得切り替え
- `supabase/migrations/20260318000000_create_ec_schema.sql`: EC 用スキーマ

## 仲介（Affina）との ref 連携（localhost）

EC は **3000**、仲介アプリは **3001** で動かす想定です。

1. **仲介** [`../intermediary`](../intermediary) で `npm run dev`（ポート 3001）
2. 仲介に `intermediary/.env.local` を作成し `AFFINA_INBOUND_SECRET` と **`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`**（仲介用 Supabase プロジェクトの API 設定）を入れる。仲介の DB に `supabase db push` でマイグレーション（anon 向け GRANT 含む）を当てる（`intermediary/README.md` 参照）
3. EC に `.env.local` で以下を追加（`.env.example` 参照）
   - `AFFINA_NOTIFICATION_URL=http://localhost:3001/api/conversions`
   - `AFFINA_MERCHANT_ID` / `AFFINA_API_SECRET`（サンプル広告主と同じ値なら `mch_demo_affina` / `sk_demo_sample_do_not_use_in_production`）
4. `supabase db push` で `orders` のアフィ列（`affiliate_code` / `affiliate_campaign_id`）マイグレーションを反映
5. 仲介の「広告リンク」または手動で `?ref=demoaff1&campaign_id={案件UUID}` 付き商品 URL でアクセス → Cookie `affina_ref` / `affina_campaign` → ログインして購入 → `orders` に反映、仲介ターミナルに `[api/conversions]` ログ（`campaign_id` 付き）

## Deploy

Vercel を想定しています。環境変数は Vercel 側にも同じ名前で設定してください。
