import { BadgeChip } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Kutilmoqda",
  PAID: "To‘langan",
  FAILED: "Muvaffaqiyatsiz",
  CANCELLED: "Bekor qilingan",
  EXPIRED: "Muddati tugagan",
  CREATED: "Yaratilgan",
};

export function BillingStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label = STATUS_LABELS[status] ?? status;
  const variant =
    status === "PAID"
      ? "default"
      : status === "PENDING" || status === "CREATED"
        ? "secondary"
        : "outline";

  return (
    <BadgeChip variant={variant} className={cn("text-[10px] uppercase", className)}>
      {label}
    </BadgeChip>
  );
}
