import { ProductConceptStrip } from "@/components/marketing/product-concept-strip";
import { SectionHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { EVENT_PACKAGE_ITEMS, ALL_MATERIAL_TYPES } from "@/lib/constants/product";

const packages = [
  {
    name: "Conference Starter",
    audience: "Konferensiya va forumlar",
    items: EVENT_PACKAGE_ITEMS.map((i) => i.name),
  },
  {
    name: "Government Official",
    audience: "Davlat va rasmiy tadbirlar",
    items: [
      "Rasmiy taklifnoma",
      "ID karta",
      "Speaker card",
      "Sponsor banner",
      "Agenda",
      "QR ro‘yxatga yozilish",
    ],
  },
  {
    name: "University Ceremony",
    audience: "Universitet tantanalari",
    items: ["Sertifikat", "Taklifnoma", "Bejik", "Flyer", "Roll-up banner", "Minnatdorchilik sertifikati"],
  },
];

export default function EventPackagesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ProductConceptStrip context="Bitta tadbir uchun to‘liq materiallar to‘plami" />
      <div className="gildia-container py-16">
        <SectionHeader
          eyebrow="Tadbir paketlari"
          title="Bitta tadbir uchun to‘liq dizayn paketi"
          description="Taklifnoma, bejik, sertifikat, agenda, sponsor, QR va ijtimoiy tarmoq — bir xil brendingda. Umumiy shablon sayti emas, tadbir avtomatlashtirish."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.name} className="rounded-2xl border border-[#e8edf3] bg-[#f8fafc] p-8">
              <p className="text-xs font-semibold uppercase text-[#2563eb]">{pkg.audience}</p>
              <h3 className="mt-2 text-lg font-bold">{pkg.name}</h3>
              <ul className="mt-4 space-y-2">
                {pkg.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#64748b]">
                    <span className="text-[#2563eb]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="mb-4 text-center text-sm font-semibold text-[#64748b]">
            Platformada yaratiladigan barcha material turlari
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {ALL_MATERIAL_TYPES.map((m) => (
              <span key={m} className="rounded-full border border-[#e8edf3] bg-white px-3 py-1 text-xs">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <LinkButton href="/dashboard/events/new" size="lg">
            Tadbir yaratish — materiallar katalogi
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
