"use client";

import { cn } from "@/lib/utils";
import type { PaymentProviderId } from "@/lib/billing/catalog";
import { PAYMENT_PROVIDERS } from "@/lib/billing/catalog";

export function ProviderSelector({
  value,
  onChange,
  disabled,
}: {
  value: PaymentProviderId;
  onChange: (id: PaymentProviderId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="To‘lov usuli">
      {PAYMENT_PROVIDERS.map((provider) => (
        <label
          key={provider.id}
          className={cn(
            "flex cursor-pointer flex-col rounded-xl border p-4 transition-colors",
            value === provider.id
              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
              : "border-border hover:border-primary/30",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <input
            type="radio"
            name="payment-provider"
            value={provider.id}
            checked={value === provider.id}
            onChange={() => onChange(provider.id)}
            className="sr-only"
            disabled={disabled}
          />
          <span className="font-semibold text-foreground">{provider.label}</span>
          <span className="mt-1 text-xs text-muted-foreground">{provider.description}</span>
        </label>
      ))}
    </div>
  );
}
