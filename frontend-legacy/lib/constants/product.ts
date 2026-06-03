/** Gildia.uz — konferensiya va tadbir materiallari avtomatlashtirish platformasi */

export const PLATFORM_TAGLINE =
  "Konferensiya, forum, davlat va xususiy tashkilot tadbirlari uchun barcha grafik va chop etiladigan materiallar";

export const HERO = {
  headline: "Konferensiya va rasmiy tadbirlar uchun barcha grafik materiallar bir platformada",
  subheadline:
    "Gildia.uz orqali taklifnoma, sertifikat, bejik, flyer, tadbir dasturi, agenda, QR kartalar va boshqa rasmiy event materiallarini tez, chiroyli va print-ready formatda tayyorlang.",
  ctaTemplates: "Shablon tanlash",
  ctaEventPackage: "Tadbir yaratish",
};

export const HERO_MATERIAL_CARDS = [
  { label: "Certificate", labelUz: "Sertifikat", href: "/templates?cat=sertifikatlar" },
  { label: "Invitation", labelUz: "Taklifnoma", href: "/templates?cat=taklifnomalar" },
  { label: "Badge", labelUz: "Bejik", href: "/templates?cat=bejiklar" },
  { label: "Agenda", labelUz: "Agenda", href: "/templates?cat=agenda" },
  { label: "QR Card", labelUz: "QR karta", href: "/dashboard/qr-generator" },
  { label: "Speaker Card", labelUz: "Speaker card", href: "/templates?cat=speaker-cards" },
];

export const EVENT_PACKAGE_ITEMS = [
  { name: "Rasmiy taklifnoma", key: "invitation" },
  { name: "Ishtirokchi bejigi", key: "badge" },
  { name: "Sertifikat", key: "certificate" },
  { name: "Tadbir dasturi (agenda)", key: "agenda" },
  { name: "Speaker card", key: "speaker" },
  { name: "Sponsor banner", key: "sponsor" },
  { name: "Ijtimoiy tarmoq e’loni", key: "social" },
  { name: "QR ro‘yxatga yozilish kartasi", key: "qr" },
];

export const ALL_MATERIAL_TYPES = [
  "Sertifikatlar",
  "Taklifnomalar",
  "Bejiklar",
  "Flyerlar",
  "Tadbir dasturlari",
  "Agenda",
  "Speaker cards",
  "Sponsor bannerlar",
  "Roll-up bannerlar",
  "Ijtimoiy tarmoq postlari",
  "QR ro‘yxatga yozilish kartalari",
  "Chiptalar (tickets)",
  "Table cards",
  "ID kartalar",
  "Minnatdorchilik sertifikatlari",
  "Rasmiy tadbir paketlari",
];

export const TEMPLATE_CATEGORIES = [
  { slug: "sertifikatlar", name: "Sertifikatlar", icon: "📜" },
  { slug: "taklifnomalar", name: "Taklifnomalar", icon: "✉️" },
  { slug: "bejiklar", name: "Bejiklar", icon: "🪪" },
  { slug: "flyerlar", name: "Flyerlar", icon: "📋" },
  { slug: "tadbir-dasturlari", name: "Tadbir dasturlari", icon: "📑" },
  { slug: "agenda", name: "Agenda", icon: "📅" },
  { slug: "speaker-cards", name: "Speaker cards", icon: "🎤" },
  { slug: "sponsor-bannerlar", name: "Sponsor bannerlar", icon: "🏷️" },
  { slug: "roll-up-bannerlar", name: "Roll-up bannerlar", icon: "🖼️" },
  { slug: "social-media", name: "Social media postlar", icon: "📱" },
  { slug: "qr-registration", name: "QR registration cards", icon: "⬛" },
  { slug: "tadbir-paketlari", name: "Rasmiy tadbir paketlari", icon: "📦" },
  { slug: "table-cards", name: "Table cards", icon: "🪑" },
  { slug: "tickets", name: "Tickets", icon: "🎫" },
  { slug: "id-cards", name: "ID cards", icon: "🆔" },
];

export const TEMPLATE_FILTERS = [
  "Barchasi",
  "Free",
  "Premium",
  "Printable",
  "Online",
  "Certificate",
  "Badge",
  "Invitation",
  "Konferensiya",
  "Davlat",
  "Korporativ",
  "Akademik",
];

export const EXPORT_FORMATS = [
  "PDF Print",
  "PNG",
  "JPG",
  "SVG",
  "ZIP bulk export",
  "Online optimized files",
  "High-quality premium export",
];

export const EVENT_VARIABLES = [
  "{{full_name}}",
  "{{organization}}",
  "{{position}}",
  "{{event_name}}",
  "{{date}}",
  "{{qr_code}}",
  "{{certificate_id}}",
  "{{seat_number}}",
  "{{speaker_name}}",
];

export const EXCEL_COLUMNS = [
  "Full name",
  "Organization",
  "Position",
  "Email",
  "Certificate ID",
  "QR link",
  "Seat number",
  "Role",
];

export const QR_TYPES = [
  "Event registration QR",
  "Attendance QR",
  "Certificate verification QR",
  "Website QR",
  "Speaker profile QR",
  "Ticket QR",
];

export const QR_OPTIONS = ["URL", "Text", "Color", "Logo inside QR", "Download PNG/SVG", "Attach QR to current design"];

export const ASSET_TYPES = [
  "Event logo",
  "Organization logo",
  "Sponsor logo",
  "Partner logo",
  "Speaker photo",
  "Signature",
  "Stamp",
  "Background",
  "Icon/SVG",
];

export const DASHBOARD_SECTIONS = [
  { title: "Mening tadbirlarim", href: "/dashboard/events", desc: "Har bir tadbir uchun alohida workspace" },
  { title: "Yangi tadbir paketi", href: "/dashboard/events/new", desc: "Katalog bo‘yicha materiallar tanlash" },
  { title: "So‘nggi dizaynlar", href: "/editor", desc: "Yaqinda tahrirlangan loyihalar" },
  { title: "Ishtirokchilar ro‘yxati", href: "/dashboard/bulk-generate", desc: "Excel/CSV yuklangan ro‘yxatlar" },
  { title: "Bulk generatsiya fayllari", href: "/dashboard/bulk-generate", desc: "100+ avtomatik yaratilgan fayllar" },
  { title: "Yuklangan aktivlar", href: "/dashboard/assets", desc: "Logo, imzo, muhr, sponsor" },
  { title: "Premium holati", href: "/pricing", desc: "Obuna va imkoniyatlar" },
  { title: "Yuklab olish tarixi", href: "/dashboard", desc: "Eksport qilingan fayllar" },
  { title: "To‘lov tarixi", href: "/pricing", desc: "Click, Payme, Uzum, Paynet" },
];

export const QUICK_ACTIONS = [
  { label: "Sertifikat yaratish", href: "/editor?type=certificate", icon: "📜" },
  { label: "Bejik yaratish", href: "/editor?type=badge", icon: "🪪" },
  { label: "Taklifnoma yaratish", href: "/editor?type=invitation", icon: "✉️" },
  { label: "Tadbir dasturi", href: "/editor?type=program", icon: "📑" },
  { label: "Excel ro‘yxat yuklash", href: "/dashboard/bulk-generate", icon: "📊" },
  { label: "QR kod yaratish", href: "/dashboard/qr-generator", icon: "⬛" },
  { label: "Tadbir yaratish", href: "/dashboard/events/new", icon: "📦" },
];

export const WORKSPACE_TABS = [
  "Overview",
  "Templates",
  "Participants",
  "Assets",
  "Generated Files",
  "Exports",
  "Settings",
] as const;

export const EXAMPLE_EVENT = {
  id: "ws_ai_forum_2026",
  name: "Tashkent International Forum 2026",
  date: "2026-10-12",
  organization: "Forum Directorate",
  stats: {
    certificates: 125,
    badges: 125,
    agendas: 1,
    sponsorBanners: 4,
    qrCards: 1,
  },
};

export const PRICING_FEATURES = {
  free: [
    "Cheklangan shablonlar",
    "Cheklangan export",
    "Watermark bilan fayllar",
    "Bulk generation yo‘q",
    "Cheklangan asset yuklash",
  ],
  premium: [
    "Premium shablonlar",
    "Watermark yo‘q",
    "Yuqori sifatli export",
    "PDF print export",
    "Excel orqali bulk generation",
    "ZIP yuklab olish",
    "QR generator",
    "Loyihalarni saqlash",
    "Asset kutubxonasi",
  ],
  enterprise: [
    "Jamoa a’zolari",
    "To‘liq event paketlar",
    "Priority support",
    "Custom branding",
    "Katta ishtirokchilar ro‘yxati",
    "Admin access",
  ],
};

export const ADMIN_SECTIONS = [
  "Templates",
  "Categories",
  "Users",
  "Payments",
  "Event Packages",
  "Uploaded Assets",
  "Generated Files",
  "Premium Access",
  "Analytics",
];

export const TEMPLATE_UPLOAD_FIELDS = [
  "template title",
  "category",
  "free/premium",
  "printable/online",
  "page size",
  "orientation",
  "editable variables",
  "preview image",
  "source file",
  "tags",
];
