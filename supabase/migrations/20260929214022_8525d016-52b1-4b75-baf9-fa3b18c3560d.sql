create type public.app_role as enum ('super_admin', 'business_owner');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "own roles readable" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'super_admin'));

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  slug text not null unique,
  name text not null,
  owner_name text,
  phone text,
  email text,
  address text,
  country text default 'Kenya',
  currency text not null default 'KES',
  tagline text default 'Fast neighbourhood WiFi',
  headline text default 'Get online in seconds',
  primary_color text not null default '#22d3ee',
  accent_color text not null default '#f59e0b',
  portal_background text default '#0a1020',
  logo_url text,
  support_phone text,
  support_email text,
  terms text default 'Fair usage applies.',
  status text not null default 'trial',
  saas_plan text not null default 'starter',
  setup_step int not null default 1,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.businesses to anon;
grant select, insert, update, delete on public.businesses to authenticated;
grant all on public.businesses to service_role;
alter table public.businesses enable row level security;

create or replace function public.owns_business(_business_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.businesses where id = _business_id and owner_id = auth.uid())
   or public.has_role(auth.uid(), 'super_admin') $$;

create policy "public sees published" on public.businesses for select to anon, authenticated using (published);
create policy "owner reads" on public.businesses for select to authenticated using (owner_id = auth.uid() or public.has_role(auth.uid(), 'super_admin'));
create policy "owner creates" on public.businesses for insert to authenticated with check (owner_id = auth.uid());
create policy "owner updates" on public.businesses for update to authenticated using (owner_id = auth.uid() or public.has_role(auth.uid(), 'super_admin'));
create policy "owner deletes" on public.businesses for delete to authenticated using (owner_id = auth.uid() or public.has_role(auth.uid(), 'super_admin'));

-- tenant child tables
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null, address text, created_at timestamptz not null default now());
create table public.routers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  name text not null, hotspot_network text default '192.168.88.0/24', tunnel_ip text,
  radius_secret text, status text not null default 'pending', routeros_version text,
  last_seen timestamptz, created_at timestamptz not null default now());
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null, price numeric not null default 0, duration_minutes int not null default 60,
  data_label text default 'Unlimited', speed_label text default '5 Mbps', popular boolean not null default false,
  active boolean not null default true, created_at timestamptz not null default now());
create table public.vouchers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  code text not null, status text not null default 'unused', created_at timestamptz not null default now(),
  unique (business_id, code));
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  phone text not null, name text, created_at timestamptz not null default now());
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  phone text, amount numeric not null default 0, provider text not null default 'mpesa',
  reference text, status text not null default 'success', created_at timestamptz not null default now());
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  router_id uuid references public.routers(id) on delete set null,
  username text not null, mac text, started_at timestamptz not null default now(), ended_at timestamptz,
  bytes_used bigint not null default 0);
create table public.gateway_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  provider text not null, config jsonb not null default '{}', enabled boolean not null default true,
  unique (business_id, provider));
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null, email text not null, role text not null default 'cashier', created_at timestamptz not null default now());

do $$ declare t text; begin
  foreach t in array array['locations','routers','plans','vouchers','subscribers','payments','sessions','gateway_settings','staff'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "tenant access" on public.%I for all to authenticated using (public.owns_business(business_id)) with check (public.owns_business(business_id))', t);
  end loop; end $$;

grant select on public.plans to anon;
create policy "public plans of published" on public.plans for select to anon, authenticated
  using (active and exists (select 1 from public.businesses b where b.id = business_id and b.published));

-- seed first tenant (not special-cased anywhere in code)
insert into public.businesses (slug, name, owner_name, phone, email, country, currency, support_phone, status, published, setup_step)
values ('kwetunet', 'KWETUNET', 'Kwetunet team', '+254712000111', 'hello@kwetunet.co.ke', 'Kenya', 'KES', '+254 712 000 111', 'active', true, 9);
insert into public.plans (business_id, name, price, duration_minutes, data_label, speed_label, popular)
select id, v.n, v.p, v.d, v.dl, v.s, v.pop from public.businesses,
 (values ('1 Hour',50,60,'500 MB','5 Mbps',false),('6 Hours',150,360,'2 GB','8 Mbps',true),('24 Hours',300,1440,'Unlimited','10 Mbps',false)) as v(n,p,d,dl,s,pop)
where slug = 'kwetunet';