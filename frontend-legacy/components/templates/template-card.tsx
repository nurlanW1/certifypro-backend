import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type TemplateCardProps = {
  title: string;
  category: string;
  isPremium?: boolean;
  isPrint?: boolean;
  isOnline?: boolean;
  height?: "sm" | "md" | "lg";
  trending?: boolean;
};

const heights = { sm: "h-40", md: "h-52", lg: "h-64" };

export function TemplateCard({
  title,
  category,
  isPremium = false,
  isPrint = true,
  isOnline = true,
  height = "md",
  trending = false,
}: TemplateCardProps) {
  return (
    <article className="gildia-card group overflow-hidden rounded-2xl border border-[#e8edf3] bg-white">
      <div className={`relative ${heights[height]} overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50/50`}>
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href="/editor"
            className="rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Shablonni ishlatish
          </Link>
          <button
            type="button"
            className="rounded-lg border border-white/80 bg-white/90 px-4 py-2 text-xs font-semibold text-[#0a1628] backdrop-blur"
          >
            Ko‘rib chiqish
          </button>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {trending ? <Badge text="Trend" variant="new" /> : null}
          <Badge text={isPremium ? "Premium" : "Free"} variant={isPremium ? "premium" : "free"} />
          {isPrint ? <Badge text="Print-ready" variant="print" /> : null}
          {isOnline ? <Badge text="Online-ready" variant="online" /> : null}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-[#2563eb]">{category}</p>
        <h3 className="mt-0.5 font-semibold text-[#0a1628] group-hover:text-[#2563eb]">{title}</h3>
        <p className="mt-2 text-xs text-[#64748b]">Konferensiya / tadbir materiali</p>
      </div>
    </article>
  );
}
