-- Add seller role to profiles
alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check check (role in ('user', 'owner', 'seller'));

-- Allow seller to insert products (in addition to owner)
drop policy if exists "products_owner_insert" on public.products;

create policy "products_owner_insert"
on public.products
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role in ('owner', 'seller')
  )
);
