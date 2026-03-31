-- Supabase seed for Affina Shop
--
-- ローカル: `supabase db reset` だけでデモオーナー＋商品が入る（手動サインアップ不要）
-- ログイン: owner@example.com / OwnerDemo123（ローカル専用）
--
-- 先頭3商品は固定 UUID（仲介 intermediary のシード案件 external_product_id と一致）
--   aaaaaaaa-aaaa-4aaa-8aaa-000000000001 = Desk Setup Starter Kit
--   aaaaaaaa-aaaa-4aaa-8aaa-000000000002 = Focus Mechanical Keyboard
--   aaaaaaaa-aaaa-4aaa-8aaa-000000000003 = Travel Mug Pro

-- デモオーナー（auth + identity）。既に同メールがいればスキップ（手動登録済み DB 向け）
do $$
declare
  demo_uid uuid := '11111111-1111-4111-8111-111111111001';
  demo_pw text := extensions.crypt('OwnerDemo123', extensions.gen_salt('bf'));
begin
  if exists (select 1 from auth.users where email = 'owner@example.com') then
    return;
  end if;

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    demo_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'owner@example.com',
    demo_pw,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Affina Demo Owner"}',
    now(),
    now()
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    demo_uid,
    demo_uid,
    jsonb_build_object('sub', demo_uid::text, 'email', 'owner@example.com'),
    'email',
    demo_uid::text,
    now(),
    now(),
    now()
  );
end $$;

-- 既存の商品・注文・カートを消してから投入（固定 UUID を確実に当てる。リモートの古い products を置き換える）
delete from public.order_items;
delete from public.orders;
delete from public.cart_items;
delete from public.products;

with seed_owner as (
  update public.profiles
  set role = 'owner',
      display_name = coalesce(display_name, 'Affina Demo Owner'),
      updated_at = now()
  where email = 'owner@example.com'
  returning id
)
insert into public.products (
  id,
  owner_id,
  name,
  description,
  price,
  image_url,
  category,
  stock,
  is_active
)
select
  coalesce(seed_data.fixed_id, extensions.gen_random_uuid()),
  seed_owner.id,
  seed_data.name,
  seed_data.description,
  seed_data.price,
  seed_data.image_url,
  seed_data.category,
  seed_data.stock,
  true
from seed_owner
cross join (
  values
    (
      'aaaaaaaa-aaaa-4aaa-8aaa-000000000001'::uuid,
      'Desk Setup Starter Kit',
      'A beginner-friendly desk bundle with a compact lamp, notebook stand, and cable organizer.',
      12800,
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop&q=80',
      'Desk',
      24
    ),
    (
      'aaaaaaaa-aaaa-4aaa-8aaa-000000000002'::uuid,
      'Focus Mechanical Keyboard',
      'A quiet mechanical keyboard tuned for long writing and coding sessions.',
      18400,
      'https://images.unsplash.com/photo-1587829741301-dc798b83add7?w=900&auto=format&fit=crop&q=80',
      'Keyboard',
      18
    ),
    (
      'aaaaaaaa-aaaa-4aaa-8aaa-000000000003'::uuid,
      'Travel Mug Pro',
      'A double-walled mug for remote work days, with leak protection and heat retention.',
      4200,
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900&auto=format&fit=crop&q=80',
      'Lifestyle',
      42
    ),
    (
      null::uuid,
      'Creator Note Pack',
      'Premium memo pads for quick task capture, sketching, and meeting notes.',
      2600,
      'https://images.unsplash.com/photo-1517842645767-c639b880cd6b?w=900&auto=format&fit=crop&q=80',
      'Stationery',
      65
    ),
    (
      null::uuid,
      'Ultra Monitor Arm',
      'A heavy-duty monitor arm that clears desk space and helps improve posture during long sessions.',
      9800,
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&auto=format&fit=crop&q=80',
      'Desk',
      16
    ),
    (
      null::uuid,
      'Silent Desk Mat',
      'A large desk mat with a soft finish that reduces keyboard noise and keeps your setup clean.',
      3800,
      'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=900&auto=format&fit=crop&q=80',
      'Desk',
      54
    ),
    (
      null::uuid,
      'Deep Focus Headphones',
      'Wireless headphones tuned for focus music, calls, and low-fatigue all-day listening.',
      22100,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
      'Audio',
      11
    ),
    (
      null::uuid,
      'Portable SSD Lite',
      'Fast external storage for creators and developers who need quick file access on the go.',
      14900,
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=900&auto=format&fit=crop&q=80',
      'Storage',
      21
    ),
    (
      null::uuid,
      'Video Call Light Mini',
      'A compact clip-on light for cleaner video calls, interviews, and content recording.',
      5100,
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d24?w=900&auto=format&fit=crop&q=80',
      'Lighting',
      33
    ),
    (
      null::uuid,
      'Ergonomic Mouse Pro',
      'An ergonomic wireless mouse designed to reduce wrist strain without sacrificing speed.',
      8700,
      'https://images.unsplash.com/photo-1527814050140-2483469802b6?w=900&auto=format&fit=crop&q=80',
      'Mouse',
      27
    ),
    (
      null::uuid,
      'Weekly Planner Board',
      'A reusable desktop planning board for sprint goals, meetings, and personal priorities.',
      3200,
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=900&auto=format&fit=crop&q=80',
      'Stationery',
      44
    ),
    (
      null::uuid,
      'Coffee Scale Studio',
      'A precision scale for home brewing that fits neatly into a compact workspace.',
      6900,
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=80',
      'Lifestyle',
      19
    ),
    (
      null::uuid,
      'Laptop Stand Air',
      'A foldable aluminum laptop stand built for hybrid work, travel, and heat management.',
      5600,
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=900&auto=format&fit=crop&q=80',
      'Desk',
      31
    ),
    (
      null::uuid,
      'Cable Kit Pro',
      'A bundle of organizers, clips, and sleeves to clean up charger and monitor cables fast.',
      2400,
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80',
      'Accessories',
      72
    )
) as seed_data(fixed_id, name, description, price, image_url, category, stock)
where not exists (
  select 1
  from public.products existing
  where existing.owner_id = seed_owner.id
    and existing.name = seed_data.name
);

-- 既に同名商品だけある（古い seed でランダム UUID）場合、カート・注文が無ければ固定 ID に寄せる
-- （アフィリンクの /products/aaaaaaaa-... が 404 になるのを防ぐ）
update public.products p
set id = 'aaaaaaaa-aaaa-4aaa-8aaa-000000000001'::uuid
where p.id = (
    select p2.id
    from public.products p2
    inner join public.profiles pr on pr.id = p2.owner_id
    where pr.email = 'owner@example.com'
      and p2.name = 'Desk Setup Starter Kit'
      and p2.id <> 'aaaaaaaa-aaaa-4aaa-8aaa-000000000001'::uuid
    limit 1
  )
  and not exists (select 1 from public.cart_items c where c.product_id = p.id)
  and not exists (select 1 from public.order_items o where o.product_id = p.id);

update public.products p
set id = 'aaaaaaaa-aaaa-4aaa-8aaa-000000000002'::uuid
where p.id = (
    select p2.id
    from public.products p2
    inner join public.profiles pr on pr.id = p2.owner_id
    where pr.email = 'owner@example.com'
      and p2.name = 'Focus Mechanical Keyboard'
      and p2.id <> 'aaaaaaaa-aaaa-4aaa-8aaa-000000000002'::uuid
    limit 1
  )
  and not exists (select 1 from public.cart_items c where c.product_id = p.id)
  and not exists (select 1 from public.order_items o where o.product_id = p.id);

update public.products p
set id = 'aaaaaaaa-aaaa-4aaa-8aaa-000000000003'::uuid
where p.id = (
    select p2.id
    from public.products p2
    inner join public.profiles pr on pr.id = p2.owner_id
    where pr.email = 'owner@example.com'
      and p2.name = 'Travel Mug Pro'
      and p2.id <> 'aaaaaaaa-aaaa-4aaa-8aaa-000000000003'::uuid
    limit 1
  )
  and not exists (select 1 from public.cart_items c where c.product_id = p.id)
  and not exists (select 1 from public.order_items o where o.product_id = p.id);
