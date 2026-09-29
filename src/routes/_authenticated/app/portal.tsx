import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { Button } from "@/components/ui/button";
import {
  BizFieldsGrid,
  PortalPreview,
  brandingFields,
  saveBusiness,
  useBizForm,
} from "@/components/business-fields";
import type { Business } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/app/portal")({
  head: () => ({ meta: [{ title: "Customer page — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Customer Wi-Fi page" description="What customers see when they join your Wi-Fi.">
      <WithBusiness>{(b) => <PortalEditor business={b} />}</WithBusiness>
    </OwnerShell>
  ),
});

function PortalEditor({ business }: { business: Business }) {
  const { values, setValues } = useBizForm(business, brandingFields);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="panel space-y-5 p-6">
        <BizFieldsGrid fields={brandingFields} values={values} onChange={setValues} />
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const ok = await saveBusiness(business.id, values);
              setBusy(false);
              if (ok) {
                toast.success("Customer page updated");
                qc.invalidateQueries({ queryKey: ["my-business"] });
              }
            }}
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const ok = await saveBusiness(business.id, { published: !business.published });
              if (ok) {
                toast.success(business.published ? "Page taken offline" : "Page is live");
                qc.invalidateQueries({ queryKey: ["my-business"] });
              }
            }}
          >
            {business.published ? "Unpublish" : "Publish page"}
          </Button>
          {business.published && (
            <Button asChild variant="ghost">
              <Link to="/portal/$slug" params={{ slug: business.slug }}>
                Open live page
              </Link>
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Page address: <span className="font-mono">/portal/{business.slug}</span>
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Preview</p>
        <PortalPreview values={values} />
      </div>
    </div>
  );
}
