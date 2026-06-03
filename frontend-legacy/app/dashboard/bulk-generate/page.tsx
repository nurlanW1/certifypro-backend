import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";
import { SectionHeader } from "@/components/ui/card";
import { BulkGenerateWizard } from "@/components/dashboard/bulk-generate-wizard";

export default function BulkGeneratePage() {
  return (
    <div className="min-h-full bg-muted/20">
      <ProductConceptStrip context="Excel → 100+ tadbir materiali avtomatik generatsiya" />
      <div className="gildia-container py-10 md:py-14">
        <SectionHeader
          eyebrow="Bulk Generate"
          title="Excel orqali ommaviy yaratish"
          description="Ishtirokchilar ro‘yxatidan sertifikat, bejik va taklifnomalarni avtomatik generatsiya qiling. ZIP paketda yuklab oling."
          align="left"
        />
        <BulkGenerateWizard />
      </div>
    </div>
  );
}
