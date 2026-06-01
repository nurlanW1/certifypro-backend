import rateLimit from "express-rate-limit";
import { config } from "../config";

export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxAuth,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    ok: false,
    error: { code: "RATE_LIMITED", message: "Too many auth attempts. Try again later." },
    message: "Too many auth attempts. Try again later.",
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxApi,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    ok: false,
    error: { code: "RATE_LIMITED", message: "Too many requests. Slow down." },
    message: "Too many requests. Slow down.",
  },
});

export const uploadRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxUpload,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    ok: false,
    error: { code: "RATE_LIMITED", message: "Too many uploads. Try again later." },
    message: "Too many uploads. Try again later.",
  },
});
