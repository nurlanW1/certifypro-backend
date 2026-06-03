import Link from "next/link";
import { ALL_MATERIAL_TYPES } from "@/lib/constants/product";

/** Platformada yaratiladigan barcha material turlari */
export function MaterialTypesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-2 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
      {ALL_MATERIAL_TYPES.map((name) => (
        <Link
          key={name}
          href={`/templates?cat=${encodeURIComponent(name)}`}
          className="flex items-center gap-2 rounded-xl border border-[#e8edf3] bg-white px-3 py-2.5 text-sm text-[#0a1628] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563eb]" />
          {name}
        </Link>
      ))}
    </div>
  );
}
