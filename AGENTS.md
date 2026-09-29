<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Public marketing site is top-level routes; super admin console lives under `_authenticated/admin` (gated by `has_role(..., 'super_admin')`); business owners use `_authenticated/app`. Why: clear separation of platform staff vs tenants.
- Every tenant table carries `business_id` and uses the `owns_business()` RLS policy. Why: tenant isolation is the top requirement; no tenant is hard-coded.
- Customer Wi-Fi pages load via `getPortal` server fn with the publishable key, only for published businesses. Why: public SSR without exposing private data.
