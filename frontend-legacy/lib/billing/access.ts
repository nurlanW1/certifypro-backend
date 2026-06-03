import { getBillingMe, type BillingMe } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/errors";

export type BillingAccessCheck =
  | "canCreateDesign"
  | "canCreateEvent"
  | "canExport"
  | "canUsePremiumTemplate"
  | "canUseEventBuilder";

const DENIED_MESSAGES: Record<BillingAccessCheck, string> = {
  canCreateDesign: "Dizayn limiti tugadi. Pro rejaga o‘ting.",
  canCreateEvent: "Tadbir limiti tugadi. Rejangizni yangilang.",
  canExport: "Eksport limiti tugadi. Pro yoki Event paketiga o‘ting.",
  canUsePremiumTemplate: "Premium shablonlar Pro yoki Event paketida mavjud.",
  canUseEventBuilder: "Tadbir quruvchi Event paketida mavjud.",
};

export type AccessGateResult =
  | { allowed: true; billing: BillingMe }
  | { allowed: false; billing: BillingMe | null; message: string };

let cached: BillingMe | null = null;
let cacheAt = 0;
const CACHE_MS = 30_000;

export function invalidateBillingCache(): void {
  cached = null;
  cacheAt = 0;
}

export async function fetchBillingAccess(force = false): Promise<BillingMe> {
  const now = Date.now();
  if (!force && cached && now - cacheAt < CACHE_MS) {
    return cached;
  }
  const me = await getBillingMe();
  cached = me;
  cacheAt = now;
  return me;
}

export async function checkBillingAccess(
  check: BillingAccessCheck,
  force = false
): Promise<AccessGateResult> {
  try {
    const billing = await fetchBillingAccess(force);
    if (billing[check]) {
      return { allowed: true, billing };
    }
    return { allowed: false, billing, message: DENIED_MESSAGES[check] };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return {
        allowed: false,
        billing: null,
        message: "Davom etish uchun tizimga kiring.",
      };
    }
    throw err;
  }
}

export function isPremiumProductAllowed(
  billing: BillingMe,
  isPremium?: boolean
): boolean {
  if (!isPremium) return true;
  return billing.canUsePremiumTemplate;
}
