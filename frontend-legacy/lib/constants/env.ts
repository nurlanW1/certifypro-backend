export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "Gildia";
export const LEGACY_EDITOR_URL =
  process.env.NEXT_PUBLIC_LEGACY_EDITOR_URL || `${API_URL.replace(/\/$/, "")}/editor.html`;
