import type { PaymentProvider } from "./payment-transaction.model";

export interface PaymentWebhookLog {
  id: string;
  provider: PaymentProvider;
  transactionId: string | null;
  rawPayload: Record<string, unknown>;
  headers: Record<string, unknown>;
  status: string;
  errorMessage: string | null;
  reviewedAt: string | null;
  reviewedByAdminId: string | null;
  reviewNote: string | null;
  createdAt: string;
}
