import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";
import { SectionHeader } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ProductConceptStrip context="Maxfiylik siyosati" />
      <div className="gildia-container max-w-3xl py-16">
        <SectionHeader eyebrow="Huquqiy" title="Maxfiylik siyosati" align="left" />
        <div className="prose prose-sm max-w-none text-[#64748b]">
          <p>
            Gildia.uz foydalanuvchi ma’lumotlarini himoya qiladi. Yuklangan logotiplar, imzolar, ishtirokchilar
            ro‘yxatlari va generatsiya qilingan fayllar faqat sizning tadbir workspace’ingizda saqlanadi.
          </p>
          <p className="mt-4">
            To‘lov ma’lumotlari Click, Payme, Uzum va Paynet orqali qayta ishlanadi; karta ma’lumotlari Gildia
            serverlarida saqlanmaydi.
          </p>
          <p className="mt-4 text-xs text-[#94a3b8]">
            To‘liq matn legacy sahifadan ko‘chiriladi: public/contact-about-privacy.html
          </p>
        </div>
      </div>
    </div>
  );
}
