import path from "path";

export function userEventAssetKey(
  userId: string,
  eventId: string,
  fileName: string
): string {
  const safe = sanitizeFileName(fileName);
  return path.posix.join("users", userId, "events", eventId, "assets", safe);
}

export function userDesignExportKey(
  userId: string,
  designId: string,
  fileName: string
): string {
  const safe = sanitizeFileName(fileName);
  return path.posix.join("users", userId, "designs", designId, "exports", safe);
}

export function userDesignAssetKey(
  userId: string,
  designId: string,
  fileName: string
): string {
  const safe = sanitizeFileName(fileName);
  return path.posix.join("users", userId, "designs", designId, "assets", safe);
}

export function userBrandKitAssetKey(
  userId: string,
  brandKitId: string,
  fileName: string
): string {
  const safe = sanitizeFileName(fileName);
  return path.posix.join("users", userId, "brand-kits", brandKitId, "assets", safe);
}

export function userGeneralUploadKey(userId: string, fileName: string): string {
  const safe = sanitizeFileName(fileName);
  return path.posix.join("users", userId, "uploads", safe);
}

export function templatePreviewKey(productType: string, fileName: string): string {
  const safe = sanitizeFileName(fileName);
  return path.posix.join("templates", productType, "previews", safe);
}

export function sanitizeFileName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 180) || "file";
}
