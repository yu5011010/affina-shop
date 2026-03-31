-- 仲介の案件 ID（?campaign_id= から Cookie 経由で保持）
alter table public.orders
add column if not exists affiliate_campaign_id text;

comment on column public.orders.affiliate_campaign_id is 'Intermediary campaign id from ?campaign_id= (affina_campaign cookie)';
