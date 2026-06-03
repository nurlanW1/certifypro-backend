import Link from "next/link";

import { AccountPlanPanel } from "@/components/billing/account-plan-panel";
import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";

export default function AccountPlanPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ProductConceptStrip context="Reja va obuna" />
      <div className="gildia-container py-10">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/account" className="hover:text-primary">
            Hisob
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Reja</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reja va obuna</h1>
        <p className="mt-2 text-muted-foreground">
          Joriy tarif, imkoniyatlar va to‘lovlar
        </p>
        <div className="mt-8">
          <AccountPlanPanel />
        </div>
      </div>
    </div>
  );
}
