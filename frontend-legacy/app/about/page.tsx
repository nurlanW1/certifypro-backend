import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";
import { SectionHeader } from "@/components/ui/card";
import { MaterialTypesGrid } from "@/components/marketing/material-types-grid";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <ProductConceptStrip />
      <div className="gildia-container py-16">
        <SectionHeader
          eyebrow="Biz haqimizda"
          title="Gildia.uz — konferensiya va tadbir dizayn avtomatlashtirish"
          description="Gildia konferensiya, forum, majlis, akademik va xalqaro tadbirlar uchun rasmiy grafik materiallarni tayyorlash platformasidir. Canva-ga o‘xshash editor, lekin tadbir materiallariga ixtisoslashgan."
          align="left"
        />
        <MaterialTypesGrid compact />
      </div>
    </div>
  );
}
