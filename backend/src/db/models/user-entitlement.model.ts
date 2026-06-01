import type { PlanLimits } from "./billing.model";

export const EntitlementStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type EntitlementStatus = (typeof EntitlementStatus)[keyof typeof EntitlementStatus];

export interface UserEntitlement {
  id: string;
  userId: string;
  planId: string | null;
  sourceOrderId: string;
  startsAt: string;
  endsAt: string | null;
  status: EntitlementStatus;
  features: string[];
  limits: PlanLimits;
  createdAt: string;
  updatedAt: string;
}
