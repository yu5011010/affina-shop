-- 仲介プラットフォームの affiliate_code（?ref=）を注文に紐づけ
alter table public.orders
add column if not exists affiliate_code text;

comment on column public.orders.affiliate_code is 'Affiliate ref from ?ref= query (intermediary affiliate_code)';
