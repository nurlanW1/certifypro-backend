/** TODO: POST /api/qr/generate */

export type QrType =
  | "registration"
  | "attendance"
  | "certificate-verify"
  | "website"
  | "speaker"
  | "ticket";

export type QrGeneratePayload = {
  type: QrType;
  value: string;
  color?: string;
  logoUrl?: string;
};

export async function generateQr(payload: QrGeneratePayload) {
  void payload;
  throw new Error("QR API not implemented yet — use legacy editor QR panel");
}
