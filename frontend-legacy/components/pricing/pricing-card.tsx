import { ReactNode } from "react";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  highlighted = false,
  badge,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-8 ${
        highlighted ? "border-primary shadow-[var(--shadow-glow)]" : "border-border"
      }`}
    >
      {badge ? <Badge text={badge} variant="premium" /> : null}
      <h3 className={`font-bold text-foreground ${badge ? "mt-2" : ""}`}>{name}</h3>
      <p className="mt-4">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        <span className="text-sm text-muted-foreground"> {period}</span>
      </p>
      <ul className="mt-6 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-primary">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <LinkButton href="/register" className="mt-8 w-full justify-center" variant={highlighted ? "brand" : "outline"}>
        {cta}
      </LinkButton>
    </div>
  );
}

export function PaymentMethods({ children }: { children?: ReactNode }) {
  const methods = ["Click", "Payme", "Uzum", "Paynet"];
  return (
    <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        To‘lov usullari (UZS)
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {methods.map((m) => (
          <span
            key={m}
            className="rounded-xl border border-border bg-muted/50 px-6 py-3 text-sm font-semibold text-foreground"
          >
            {m}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}
