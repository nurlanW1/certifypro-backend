import type { PricingPlanId } from "@/lib/constants/support";

export type PaymentProviderId = "click" | "payme" | "uzum" | "paynet";

export type BillingCheckoutKey =
  | "pro-monthly"
  | "pro-yearly"
  | "event-package";

export type BillingCatalogItem = {
  id: PricingPlanId | BillingCheckoutKey;
  name: string;
  tagline: string;
  priceLabel: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  /** null = no online checkout (free / enterprise) */
  checkout: null | {
    orderType: "PLAN" | "EVENT_PACKAGE";
    planSlug: string;
    queryKey: BillingCheckoutKey | PricingPlanId;
  };
};

export const PAYMENT_PROVIDERS: {
  id: PaymentProviderId;
  label: string;
  description: string;
}[] = [
  { id: "click", label: "Click", description: "Click ilovasi orqali to‘lov" },
  { id: "payme", label: "Payme", description: "Payme hamyoni orqali" },
  { id: "uzum", label: "Uzum", description: "Uzum Bank ilovasi" },
  { id: "paynet", label: "Paynet", description: "Tez orada (hujjatlar kutilmoqda)" },
];

export const BILLING_CATALOG: BillingCatalogItem[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Boshlash uchun",
    priceLabel: "0",
    period: "UZS",
    description: "Platforma bilan tanishish va bitta dizayn yaratish uchun.",
    features: [
      "Asosiy shablonlar katalogi",
      "Media Editor (cheklangan)",
      "PNG/JPG eksport (watermark bilan)",
      "Qoralama saqlash",
      "1 ta faol loyiha",
    ],
    checkout: null,
  },
  {
    id: "pro-monthly",
    name: "Pro",
    tagline: "Oylik obuna",
    priceLabel: "299,000",
    period: "UZS / oy",
    description: "Muntazam tadbirlar va jamoalar uchun professional imkoniyatlar.",
    features: [
      "Barcha premium shablonlar",
      "Watermark yo‘q eksport",
      "PDF print-ready va ZIP",
      "Excel bulk generatsiya",
      "QR generator va asset kutubxonasi",
    ],
    highlighted: true,
    badge: "Mashhur",
    checkout: { orderType: "PLAN", planSlug: "pro", queryKey: "pro-monthly" },
  },
  {
    id: "pro-yearly",
    name: "Pro",
    tagline: "Yillik obuna",
    priceLabel: "2,490,000",
    period: "UZS / yil",
    description: "12 oy Pro — oylik rejaga nisbatan tejamkor.",
    features: [
      "Pro rejadagi barcha imkoniyatlar",
      "Yillik to‘lov — bir marta",
      "Priority email qo‘llab-quvvatlash",
      "Barcha yangilanishlar kiritiladi",
    ],
    checkout: { orderType: "PLAN", planSlug: "pro_yearly", queryKey: "pro-yearly" },
  },
  {
    id: "event-package",
    name: "Event Package",
    tagline: "To‘liq tadbir paketi",
    priceLabel: "990,000",
    period: "UZS / tadbir",
    description: "Bitta tadbir uchun barcha materiallar.",
    features: [
      "Event Builder — material katalogi",
      "10+ material turi",
      "Brending va logo integratsiyasi",
      "Bulk generatsiya (Excel)",
      "Pro eksport imkoniyatlari",
    ],
    checkout: { orderType: "EVENT_PACKAGE", planSlug: "event_package", queryKey: "event-package" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Tashkilot va agentliklar",
    priceLabel: "Maxsus",
    period: "shartnoma",
    description: "Universitetlar, davlat tashkilotlari va event agentliklari uchun.",
    features: [
      "Cheksiz tadbir workspace’lari",
      "Jamoa a’zolari va rollar",
      "Maxsus shablonlar va brending",
      "Priority qo‘llab-quvvatlash",
      "Admin va hisobotlar",
    ],
    checkout: null,
  },
];

export function findCatalogItem(key: string): BillingCatalogItem | undefined {
  return BILLING_CATALOG.find(
    (p) => p.id === key || p.checkout?.queryKey === key
  );
}

export function formatUzs(amount: number): string {
  return new Intl.NumberFormat("uz-UZ").format(amount);
}
