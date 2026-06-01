// backend/config.js — Railway / local environment
require("dotenv").config();

function railwayPublicUrl() {
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  if (process.env.RAILWAY_STATIC_URL) {
    return process.env.RAILWAY_STATIC_URL.replace(/\/$/, "");
  }
  return null;
}

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://gildia.uz";

const APP_URL = process.env.APP_URL || FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL || railwayPublicUrl() || "http://localhost:4000";
const CORS_ORIGIN = process.env.CORS_ORIGIN || FRONTEND_URL;

/** Redis: Railway REDIS_URL yoki alohida HOST/PORT */
function buildRedisConfig() {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  if (!process.env.REDIS_HOST) {
    return null;
  }
  return {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

const extraCors = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

module.exports = {
  PORT: Number(process.env.PORT || 4000),
  HOST: process.env.HOST || "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL,
  APP_URL,
  BACKEND_URL,
  CORS_ORIGIN,
  EXTRA_CORS_ORIGINS: extraCors,
  REDIS: buildRedisConfig(),
};
