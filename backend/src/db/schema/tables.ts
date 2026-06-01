/** SQLite table names — single source for queries and migrations. */
export const Tables = {
  SCHEMA_MIGRATIONS: "schema_migrations",
  USERS: "users",
  BILLING_PLANS: "billing_plans",
  EVENTS: "events",
  EVENT_PRODUCTS: "event_products",
  DESIGN_DRAFTS: "design_drafts",
  DESIGN_DRAFT_VERSIONS: "design_draft_versions",
  TEMPLATES: "templates",
  UPLOADED_ASSETS: "uploaded_assets",
  BRAND_KITS: "brand_kits",
  EXPORT_FILES: "export_files",
  ACTIVITY_LOGS: "activity_logs",
  AUDIT_LOGS: "audit_logs",
  USER_USAGE: "user_usage",
  /** @deprecated Legacy flat payment records — use ORDERS + PAYMENT_TRANSACTIONS */
  PAYMENTS: "payments",
  ORDERS: "orders",
  PAYMENT_TRANSACTIONS: "payment_transactions",
  USER_ENTITLEMENTS: "user_entitlements",
  PAYMENT_WEBHOOK_LOGS: "payment_webhook_logs",
  ADMIN_PAYMENT_AUDIT_LOG: "admin_payment_audit_log",
} as const;

export type TableName = (typeof Tables)[keyof typeof Tables];
