# Kwetu Connection: public website + business owner workspace

Keep everything built so far as the **Super Admin console** (Kwetu Connection staff only). Add a public Kwetu Connection website where hotspot business owners sign up and then build and run their own hotspot business in a separate, private workspace.

## 1. Public website (anyone can visit)
Brand: KWETU CONNECTION — Internet Services — "Powering Smarter Wi-Fi Businesses."
- `/` Home: hero, how it works (sign up, add router, sell Wi-Fi), features, call to action
- `/features`, `/pricing` (SaaS plans: Starter / Growth / Pro, with 14-day trial), `/contact`
- `/signup` and `/login` (email + password, Google optional)

## 2. Accounts and access
- Turn on Lovable Cloud for real accounts and saved data.
- Two roles: **super admin** (Kwetu staff) and **business owner**. Roles kept in a separate, protected roles table.
- Super admin console moves to `/admin/...` (current pages, unchanged look) and only super admins can open it.
- Business owners land in `/app/...` and only ever see their own business.

## 3. Business owner onboarding (after signup)
Wizard at `/app/setup`: business details (name, owner, phone, email, address, country, currency) → first location → branding (logo, colours, support contacts) → internet plans → connect MikroTik router (setup script) → test router → test customer page → publish hotspot. Progress saved at each step.

## 4. Business owner workspace `/app`
Dashboard (revenue today/month, active users, subscribers, online routers, sessions + charts), Locations, Routers, Internet Plans, Vouchers (generate batches), Subscribers, Payments, Sessions, Portal (branding), Payment setup, Staff, Settings.

## 5. Customer Wi-Fi page
`/portal/<business>` reads that business's saved branding and plans (no more hard-coded sample businesses).

## Technical details
- Tables (all with business_id + row-level security so each owner sees only their rows): businesses, business_members, user_roles, locations, routers, plans, vouchers, subscribers, payments, sessions, gateway_settings, saas_subscriptions.
- `has_role()` security-definer function; super admin reads all.
- Admin routes under `_authenticated/admin`, owner routes under `_authenticated/app`; public marketing routes top-level.
- Admin pages switch from sample data to database reads; KWETUNET seeded as a normal tenant, never special-cased.
- Payments and router checks stay simulated until real provider keys and a live router are supplied.
- First super admin: the first account you sign up with is promoted (I will set this up once you register).
