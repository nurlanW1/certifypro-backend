import { resolveMaterialFields } from "./material-form-schema";
import { CatalogItem } from "./types";
import { preset } from "./field-presets";

export const CATALOG_GROUPS = [
  { id: "branding", label: "Brending asoslari" },
  { id: "documents", label: "Asosiy hujjatlar va ID" },
  { id: "print", label: "Chop etish va maketlar" },
  { id: "venue", label: "Joylashuv va navigatsiya" },
  { id: "digital", label: "Raqamli va ijtimoiy tarmoq" },
  { id: "video", label: "Video materiallar" },
  { id: "brand-system", label: "Brendbuk va korporativ" },
  { id: "packaging", label: "Muqova, suvenir va paketlar" },
  { id: "reports", label: "Hisobot va yakuniy materiallar" },
] as const;

export const EVENT_CATALOG: CatalogItem[] = [
  { id: "conference-logo", name: "Konferensiya logotipi", icon: "🎯", group: "branding", mockupVariant: "logo", fields: preset.conferenceLogo },
  { id: "certificate", name: "Sertifikat", icon: "📜", group: "documents", mockupVariant: "certificate", fields: preset.certificate },
  { id: "diploma", name: "Diplom", icon: "🎓", group: "documents", mockupVariant: "diploma", fields: preset.diploma },
  { id: "thanks-letter", name: "Tashakkurnoma", icon: "🙏", group: "documents", mockupVariant: "thanks", fields: preset.thanks },
  { id: "badge", name: "Badge (Bejik)", icon: "🪪", group: "documents", mockupVariant: "badge", fields: preset.badge },
  { id: "business-card", name: "Vizitka", icon: "💼", group: "documents", mockupVariant: "business-card", fields: preset.businessCard },
  { id: "invitation", name: "Taklifnoma", icon: "✉️", group: "documents", mockupVariant: "invitation", fields: preset.invitation },
  { id: "flyer", name: "Flyer", icon: "📋", group: "print", mockupVariant: "flyer", fields: preset.flyer },
  { id: "poster", name: "Poster", icon: "🖼️", group: "print", mockupVariant: "poster", fields: preset.poster },
  { id: "scientific-poster", name: "Ilmiy poster", icon: "🔬", group: "print", mockupVariant: "scientific-poster", fields: preset.scientificPoster },
  { id: "program-book", name: "Konferensiya dasturi (Program Book)", icon: "📑", group: "print", mockupVariant: "program", fields: preset.programBook },
  { id: "proceedings", name: "Maqolalar to‘plami (Proceedings Book)", icon: "📚", group: "print", mockupVariant: "proceedings", fields: preset.proceedings },
  { id: "catalog", name: "Katalog", icon: "📒", group: "print", mockupVariant: "catalog", fields: preset.catalogDoc },
  { id: "report-book", name: "Hisobot kitobi", icon: "📊", group: "reports", mockupVariant: "report", fields: preset.reportBook },
  { id: "photo-album", name: "Fotoalbom / Tadbir rasmlari kitobi", icon: "📷", group: "reports", mockupVariant: "album", fields: preset.photoAlbum },
  { id: "participant-folder", name: "Ishtirokchi papkasi (Folder)", icon: "📁", group: "packaging", mockupVariant: "folder", fields: preset.folder },
  { id: "rollup", name: "Roll-up banner", icon: "🪧", group: "venue", mockupVariant: "rollup", fields: preset.rollup },
  { id: "press-wall", name: "Press Wall (Fotozona)", icon: "📸", group: "venue", mockupVariant: "press-wall", fields: preset.pressWall },
  { id: "stage-backdrop", name: "Sahna foni (Stage Backdrop)", icon: "🎭", group: "venue", mockupVariant: "backdrop", fields: preset.stageBackdrop },
  { id: "led-screen", name: "LED ekran uchun dizaylar", icon: "🖥️", group: "venue", mockupVariant: "led", fields: preset.led },
  { id: "opening-slide", name: "Ochilish slaydi", icon: "▶️", group: "digital", mockupVariant: "slide", fields: preset.openingSlide },
  { id: "powerpoint", name: "Taqdimot (PowerPoint)", icon: "📽️", group: "digital", mockupVariant: "ppt", fields: preset.powerpoint },
  { id: "table-tent", name: "Stol usti nom kartalari (Table Tent)", icon: "🪑", group: "venue", mockupVariant: "table-tent", fields: preset.tableTent },
  { id: "navigation", name: "Yo‘naltiruvchi belgilar (Navigation Signs)", icon: "🧭", group: "venue", mockupVariant: "navigation", fields: preset.navigation },
  { id: "registration-desk", name: "Registratsiya stendi dizayni", icon: "🛎️", group: "venue", mockupVariant: "registration", fields: preset.registrationDesk },
  { id: "qr-card", name: "QR kod kartalari", icon: "⬛", group: "digital", mockupVariant: "qr", fields: preset.qrCard },
  { id: "sponsor-banner", name: "Homiylar banneri", icon: "🏆", group: "print", mockupVariant: "sponsor", fields: preset.sponsorBanner },
  { id: "partner-banner", name: "Hamkorlar banneri", icon: "🤝", group: "print", mockupVariant: "partner", fields: preset.partnerBanner },
  { id: "social-post", name: "Ijtimoiy tarmoq postlari", icon: "📱", group: "digital", mockupVariant: "social", fields: preset.socialPost },
  { id: "instagram-story", name: "Instagram Story dizaynlari", icon: "📲", group: "digital", mockupVariant: "story", fields: preset.instagramStory },
  { id: "telegram-banner", name: "Telegram bannerlari", icon: "✈️", group: "digital", mockupVariant: "telegram", fields: preset.telegramBanner },
  { id: "linkedin-banner", name: "LinkedIn bannerlari", icon: "💼", group: "digital", mockupVariant: "linkedin", fields: preset.linkedinBanner },
  { id: "email-banner", name: "Email bannerlari", icon: "📧", group: "digital", mockupVariant: "email", fields: preset.emailBanner },
  { id: "press-kit", name: "Matbuot uchun press-kit", icon: "📰", group: "digital", mockupVariant: "press-kit", fields: preset.pressKit },
  { id: "video-intro", name: "Foto va video reportaj uchun intro", icon: "🎬", group: "video", mockupVariant: "video-intro", fields: preset.videoIntro },
  { id: "video-outro", name: "Video outro", icon: "🎞️", group: "video", mockupVariant: "video-outro", fields: preset.videoOutro },
  { id: "lower-thirds", name: "Video titrlar (Lower Thirds)", icon: "🎥", group: "video", mockupVariant: "lower-thirds", fields: preset.lowerThirds },
  { id: "brand-book", name: "Brendbuk (Brand Book)", icon: "📘", group: "brand-system", mockupVariant: "brand-book", fields: preset.brandBook },
  { id: "color-system", name: "Korporativ ranglar tizimi", icon: "🎨", group: "brand-system", mockupVariant: "colors", fields: preset.colorSystem },
  { id: "typography", name: "Shriftlar qo‘llanmasi", icon: "🔤", group: "brand-system", mockupVariant: "typography", fields: preset.typographyGuide },
  { id: "letterhead", name: "Rasmiy blanka (Letterhead)", icon: "📝", group: "brand-system", mockupVariant: "letterhead", fields: preset.letterhead },
  { id: "envelope", name: "Konvert dizayni", icon: "✉️", group: "brand-system", mockupVariant: "envelope", fields: preset.envelope },
  { id: "diploma-cover", name: "Diplom muqovasi", icon: "📕", group: "packaging", mockupVariant: "cover", fields: preset.diplomaCover },
  { id: "cert-folder", name: "Sertifikat papkasi", icon: "📂", group: "packaging", mockupVariant: "cert-folder", fields: preset.certFolder },
  { id: "souvenirs", name: "Suvenir mahsulotlar dizayni", icon: "🎁", group: "packaging", mockupVariant: "souvenir", fields: preset.souvenirs },
  { id: "stickers", name: "Ishtirokchi paketlari uchun stikerlar", icon: "🏷️", group: "packaging", mockupVariant: "sticker", fields: preset.stickers },
  { id: "name-tag", name: "Nom yorliqlari (Name Tags)", icon: "🔖", group: "documents", mockupVariant: "name-tag", fields: preset.nameTag },
  { id: "final-report", name: "Tadbir yakuniy hisoboti", icon: "📈", group: "reports", mockupVariant: "final-report", fields: preset.finalReport },
  { id: "photo-catalog", name: "Tadbir foto katalogi", icon: "🖼️", group: "reports", mockupVariant: "photo-catalog", fields: preset.photoCatalog },
  { id: "video-presentation", name: "Tadbir video prezentatsiyasi", icon: "📹", group: "video", mockupVariant: "video-presentation", fields: preset.videoPresentation },
].map((item) => ({
  ...item,
  fields: resolveMaterialFields(item.id),
}));

export function getCatalogItem(id: string) {
  return EVENT_CATALOG.find((c) => c.id === id);
}

export function getCatalogByGroup(groupId: string) {
  return EVENT_CATALOG.filter((c) => c.group === groupId);
}
