import { createFileRoute } from "@tanstack/react-router";
import { OwnerShell } from "@/components/owner-shell";
import { WithBusiness } from "@/components/with-business";
import { BusinessEditor, profileFields } from "@/components/business-fields";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Kwetu Connection" }] }),
  component: () => (
    <OwnerShell title="Settings" description="Business details and your Kwetu Connection plan.">
      <WithBusiness>
        {(b) => (
          <div className="space-y-6">
            <div className="panel flex flex-wrap items-center gap-6 p-5 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Kwetu plan</p>
                <p className="font-medium capitalize text-foreground">{b.saas_plan}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account status</p>
                <StatusPill status={b.status} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Workspace address</p>
                <p className="font-mono text-foreground">{b.slug}</p>
              </div>
            </div>
            <BusinessEditor business={b} fields={profileFields} />
          </div>
        )}
      </WithBusiness>
    </OwnerShell>
  ),
});
