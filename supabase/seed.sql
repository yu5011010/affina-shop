-- Supabase seed for Affina Shop
-- 1. Sign up once from /register with this email (or edit the email below)
-- 2. Run `supabase db reset` locally or copy this into SQL editor
-- 3. The matching profile will be promoted to owner and products will be inserted

with seed_owner as (
  update public.profiles
  set role = 'owner',
      display_name = coalesce(display_name, 'Affina Demo Owner'),
      updated_at = now()
  where email = 'owner@example.com'
  returning id
)
insert into public.products (
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
      'Desk Setup Starter Kit',
      'A beginner-friendly desk bundle with a compact lamp, notebook stand, and cable organizer.',
      12800,
      null,
      'Desk',
      24
    ),
    (
      'Focus Mechanical Keyboard',
      'A quiet mechanical keyboard tuned for long writing and coding sessions.',
      18400,
      null,
      'Keyboard',
      18
    ),
    (
      'Travel Mug Pro',
      'A double-walled mug for remote work days, with leak protection and heat retention.',
      4200,
      null,
      'Lifestyle',
      42
    ),
    (
      'Creator Note Pack',
      'Premium memo pads for quick task capture, sketching, and meeting notes.',
      2600,
      null,
      'Stationery',
      65
    ),
    (
      'Ultra Monitor Arm',
      'A heavy-duty monitor arm that clears desk space and helps improve posture during long sessions.',
      9800,
      null,
      'Desk',
      16
    ),
    (
      'Silent Desk Mat',
      'A large desk mat with a soft finish that reduces keyboard noise and keeps your setup clean.',
      3800,
      null,
      'Desk',
      54
    ),
    (
      'Deep Focus Headphones',
      'Wireless headphones tuned for focus music, calls, and low-fatigue all-day listening.',
      22100,
      null,
      'Audio',
      11
    ),
    (
      'Portable SSD Lite',
      'Fast external storage for creators and developers who need quick file access on the go.',
      14900,
      null,
      'Storage',
      21
    ),
    (
      'Video Call Light Mini',
      'A compact clip-on light for cleaner video calls, interviews, and content recording.',
      5100,
      null,
      'Lighting',
      33
    ),
    (
      'Ergonomic Mouse Pro',
      'An ergonomic wireless mouse designed to reduce wrist strain without sacrificing speed.',
      8700,
      null,
      'Mouse',
      27
    ),
    (
      'Weekly Planner Board',
      'A reusable desktop planning board for sprint goals, meetings, and personal priorities.',
      3200,
      null,
      'Stationery',
      44
    ),
    (
      'Coffee Scale Studio',
      'A precision scale for home brewing that fits neatly into a compact workspace.',
      6900,
      null,
      'Lifestyle',
      19
    ),
    (
      'Laptop Stand Air',
      'A foldable aluminum laptop stand built for hybrid work, travel, and heat management.',
      5600,
      null,
      'Desk',
      31
    ),
    (
      'Cable Kit Pro',
      'A bundle of organizers, clips, and sleeves to clean up charger and monitor cables fast.',
      2400,
      null,
      'Accessories',
      72
    )
) as seed_data(name, description, price, image_url, category, stock)
where not exists (
  select 1
  from public.products existing
  where existing.owner_id = seed_owner.id
    and existing.name = seed_data.name
);
