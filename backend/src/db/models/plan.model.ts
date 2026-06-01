import type { PlanLimits } from "./billing.model";

/** Subscription / product plan (stored in `billing_plans`). */
export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number | null;
  features: string[];
  limits: PlanLimits;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
