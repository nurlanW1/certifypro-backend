import Link from "next/link";

import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";
import { SectionHeader } from "@/components/ui/card";
import { ADMIN_SECTIONS, TEMPLATE_UPLOAD_FIELDS, TEMPLATE_CATEGORIES } from "@/lib/constants/product";

const sectionDesc: Record<string, string> = {
  Templates: "Tadbir shablonlari — sertifikat, bejik, taklifnoma...",
  Categories: "15 ta event-specific kategoriya",
  Users: "Tashkilotchilar va agentliklar",
  Payments: "Click, Payme, Uzum, Paynet",
  "Event Packages": "To‘liq tadbir paketlari",
  "Uploaded Assets": "Logo, imzo, muhr",
  "Generated Files": "Bulk generatsiya natijalari",
  "Premium Access": "Obuna boshqaruvi",
  Analytics: "Shablonlar, generatsiya, eksport statistikasi",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ProductConceptStrip context="Admin — tadbir platformasi biznes modeli" />
      <div className="gildia-container py-10">
        <SectionHeader
          eyebrow="Admin"
          title="Gildia platformasi boshqaruvi"
          description="Shablonlar, to‘lovlar, tadbir paketlari va foydalanuvchilar — konferensiya/event biznes modeliga mos."
          align="left"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => (
            <div key={section} className="rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-[#0a1628]">{section}</h3>
              <p className="mt-2 text-sm text-[#64748b]">{sectionDesc[section]}</p>
              {section === "Payments" ? (
                <Link
                  href="/admin/payments"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  To‘lovlarni boshqarish →
                </Link>
              ) : (
                <p className="mt-3 text-[10px] text-muted-foreground">Admin API ulanishi kutilmoqda</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#e8edf3] bg-white p-8">
          <h3 className="text-lg font-bold">Shablon yuklash formasi (admin)</h3>
          <p className="mt-1 text-sm text-[#64748b]">Har bir shablon tadbir materiali sifatida tasniflanadi</p>
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Shablon nomi</span>
              <input className="mt-1 w-full rounded-lg border border-[#e8edf3] px-3 py-2 text-sm" placeholder="Davlat forumi sertifikati" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Kategoriya</span>
              <select className="mt-1 w-full rounded-lg border border-[#e8edf3] px-3 py-2 text-sm">
                {TEMPLATE_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Free / Premium</span>
              <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                <option>Free</option>
                <option>Premium</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Printable / Online</span>
              <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                <option>Printable</option>
                <option>Online</option>
                <option>Both</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Sahifa o‘lchami</span>
              <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="A4" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Orientation</span>
              <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                <option>Landscape</option>
                <option>Portrait</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-semibold text-[#64748b]">Editable variables</span>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono"
                placeholder="{{full_name}}, {{organization}}, {{qr_code}}..."
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Preview image</span>
              <input type="file" className="mt-1 w-full text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[#64748b]">Source file</span>
              <input type="file" className="mt-1 w-full text-sm" />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-semibold text-[#64748b]">Tags</span>
              <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="konferensiya, davlat, akademik" />
            </label>
          </form>
          <p className="mt-4 text-[10px] text-muted-foreground">
            Maydonlar: {TEMPLATE_UPLOAD_FIELDS.join(" • ")}
          </p>
        </div>
      </div>
    </div>
  );
}
