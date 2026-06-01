import { BillingHistoryTable } from "@/components/billing/billing-history-table";
import { PageHeader } from "@/components/layout/page-header";

export default function BillingHistoryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="To‘lov tarixi"
        description="Buyurtmalar va to‘lov provayderlari bo‘yicha tarix"
      />
      <BillingHistoryTable />
    </div>
  );
}
