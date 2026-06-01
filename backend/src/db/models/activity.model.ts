/** Known activity action identifiers */
export const ActivityAction = {
  EVENT_CREATED: "event.created",
  EVENT_UPDATED: "event.updated",
  PRODUCT_ENABLED: "product.enabled",
  PRODUCT_UPDATED: "product.updated",
  DESIGN_CREATED: "design.created",
  DESIGN_SAVED: "design.saved",
  DESIGN_DELETED: "design.deleted",
  ASSET_UPLOADED: "asset.uploaded",
  EXPORT_CREATED: "export.created",
  EXPORT_COMPLETED: "export.completed",
  TEMPLATE_USED: "template.used",
  PLAN_CHANGED: "plan.changed",
  PAYMENT_WEBHOOK_REVIEWED: "payment.webhook_reviewed",
  PAYMENT_ADMIN_OVERRIDE: "payment.admin_override",
} as const;

export type ActivityActionType = (typeof ActivityAction)[keyof typeof ActivityAction];

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  title: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLogWithUser extends ActivityLog {
  userName: string | null;
}
