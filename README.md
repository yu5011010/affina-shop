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

4. `owner@example.com` で一度サインアップしてから seed を流す

```bash
supabase db reset
```

`supabase/seed.sql` は、該当メールのプロフィールを `owner` に更新し、サンプル商品をまとめて投入します。

## Key files

- `app/page.tsx`: 商品一覧トップ
- `app/products/[id]/page.tsx`: 商品詳細
- `app/cart/page.tsx`: カート
- `app/checkout/page.tsx`: チェックアウト
- `app/admin/page.tsx`: owner 管理画面
- `app/actions.ts`: Server Actions
- `lib/store.ts`: Supabase / デモモードのデータ取得切り替え
- `supabase/migrations/20260318000000_create_ec_schema.sql`: EC 用スキーマ

## Deploy

Vercel を想定しています。環境変数は Vercel 側にも同じ名前で設定してください。
