import Link from "next/link";

import { AdminPaymentsPanel } from "@/components/admin/admin-payments-panel";
import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";
import { SectionHeader } from "@/components/ui/card";

export default function AdminPaymentsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ProductConceptStrip context="Admin — to‘lovlar boshqaruvi" />
      <div className="gildia-container py-10">
        <SectionHeader
          eyebrow="Admin"
          title="To‘lovlar boshqaruvi"
          description="Buyurtmalar, tranzaksiyalar va webhook loglari. Barcha yo‘llar admin roli bilan himoyalangan."
          align="left"
        />
        <p className="mb-6 text-sm">
          <Link href="/admin" className="text-primary hover:underline">
            ← Admin panel
          </Link>
        </p>
        <AdminPaymentsPanel />
      </div>
    </div>
  );
}
