import type { AssetType } from "../../db/models";

export const ASSET_TYPES: AssetType[] = [
  "logo",
  "signature",
  "stamp",
  "participant_photo",
  "sponsor_logo",
  "partner_logo",
  "background_image",
  "excel",
];

const ALIASES: Record<string, AssetType> = {
  photo: "participant_photo",
  participant: "participant_photo",
  participant_photo: "participant_photo",
  sponsor: "sponsor_logo",
  partner: "partner_logo",
  background: "background_image",
  image: "logo",
  other: "logo",
};

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const EXCEL_MIMES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
]);

export function normalizeAssetType(input: string): AssetType {
  const key = input.trim().toLowerCase().replace(/-/g, "_");
  if (ALIASES[key]) return ALIASES[key];
  if ((ASSET_TYPES as string[]).includes(key)) return key as AssetType;
  throw new Error(
    `Invalid asset type. Allowed: ${ASSET_TYPES.join(", ")} (aliases: photo, sponsor, partner, background)`
  );
}

export function assertMimeForAssetType(type: AssetType, mimeType: string): void {
  const mime = mimeType.toLowerCase();
  if (type === "excel") {
    if (!EXCEL_MIMES.has(mime)) {
      throw new Error(`Invalid file type for excel upload: ${mimeType}`);
    }
    return;
  }
  if (!IMAGE_MIMES.has(mime)) {
    throw new Error(`Invalid file type for ${type} upload: ${mimeType}. Use JPEG, PNG, WebP, GIF, or SVG.`);
  }
}

export function isImageAssetType(type: AssetType): boolean {
  return type !== "excel";
}
