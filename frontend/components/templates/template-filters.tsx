"use client";

import { useState } from "react";
import { TEMPLATE_FILTERS } from "@/lib/constants/product";

export function TemplateFilters() {
  const [active, setActive] = useState("Barchasi");

  return (
    <div className="sticky top-[4.25rem] z-20 mb-8 rounded-2xl border border-[#e8edf3] bg-white/95 p-3 shadow-sm backdrop-blur-md">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
        Tadbir bo‘yicha filtrlash
      </p>
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              active === f
                ? "bg-[#0a1628] text-white shadow-md"
                : "text-[#64748b] hover:bg-slate-100 hover:text-[#0a1628]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="mt-2 px-1 text-[10px] text-[#94a3b8]">
        {/* TODO: API — filter query params bilan shablonlarni qaytarish */}
        Tanlangan: {active} — frontend filtri (backend ulanishi kutilmoqda)
      </p>
    </div>
  );
}
