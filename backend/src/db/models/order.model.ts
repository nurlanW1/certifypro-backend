export const OrderType = {
  PLAN: "PLAN",
  EVENT_PACKAGE: "EVENT_PACKAGE",
  EXPORT: "EXPORT",
  TEMPLATE_PURCHASE: "TEMPLATE_PURCHASE",
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const OrderStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Order {
  id: string;
  userId: string;
  type: OrderType;
  status: OrderStatus;
  amount: number;
  currency: string;
  description: string | null;
  planId: string | null;
  eventId: string | null;
  designDraftId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
