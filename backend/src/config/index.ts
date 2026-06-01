import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

function bool(v: string | undefined, fallback = false): boolean {
  if (v === undefined) return fallback;
  return v === "1" || v.toLowerCase() === "true";
}

const rootDir = path.join(__dirname, "..", "..");

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "gildia-dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  databasePath:
    process.env.DATABASE_PATH || path.join(rootDir, "data", "gildia.db"),
  storageDriver: (process.env.STORAGE_DRIVER || "local") as "local" | "s3",
  storageLocalPath:
    process.env.STORAGE_LOCAL_PATH || path.join(rootDir, "storage", "uploads"),
  storagePublicBaseUrl:
    process.env.STORAGE_PUBLIC_BASE_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:4000",
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "auto",
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL,
  },
  authAllowDevHeader: bool(process.env.AUTH_ALLOW_DEV_HEADER, true),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 10),
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    maxAuth: Number(process.env.RATE_LIMIT_AUTH_MAX || 20),
    maxApi: Number(process.env.RATE_LIMIT_API_MAX || 120),
    maxUpload: Number(process.env.RATE_LIMIT_UPLOAD_MAX || 30),
  },
  upload: {
    maxFileBytes: Number(process.env.UPLOAD_MAX_BYTES || 15 * 1024 * 1024),
    maxExportBytes: Number(process.env.EXPORT_MAX_BYTES || 50 * 1024 * 1024),
  },
};

import type { PlanLimits } from "../db/models/billing.model";

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxDesigns: 5,
    maxExports: 10,
    maxEvents: 3,
    maxEventProductsPerEvent: 3,
    watermark: true,
    premiumTemplates: false,
    highQualityExport: false,
    eventBuilder: false,
    bulkEventProducts: false,
    brandKit: false,
    participantLists: false,
    programBook: false,
    fullPackageExport: false,
  },
  pro: {
    maxDesigns: 200,
    maxExports: 500,
    maxEvents: 50,
    maxEventProductsPerEvent: 20,
    watermark: false,
    premiumTemplates: true,
    highQualityExport: true,
    eventBuilder: false,
    bulkEventProducts: false,
    brandKit: false,
    participantLists: false,
    programBook: false,
    fullPackageExport: false,
  },
  pro_yearly: {
    maxDesigns: 200,
    maxExports: 500,
    maxEvents: 50,
    maxEventProductsPerEvent: 20,
    watermark: false,
    premiumTemplates: true,
    highQualityExport: true,
    eventBuilder: false,
    bulkEventProducts: false,
    brandKit: false,
    participantLists: false,
    programBook: false,
    fullPackageExport: false,
  },
  event_package: {
    maxDesigns: 500,
    maxExports: 2000,
    maxEvents: 200,
    maxEventProductsPerEvent: 999,
    watermark: false,
    premiumTemplates: true,
    highQualityExport: true,
    eventBuilder: true,
    bulkEventProducts: true,
    brandKit: true,
    participantLists: true,
    programBook: true,
    fullPackageExport: true,
  },
  enterprise: {
    maxDesigns: 5000,
    maxExports: 10000,
    maxEvents: 1000,
    maxEventProductsPerEvent: 999,
    watermark: false,
    premiumTemplates: true,
    highQualityExport: true,
    eventBuilder: true,
    bulkEventProducts: true,
    brandKit: true,
    participantLists: true,
    programBook: true,
    fullPackageExport: true,
  },
};
