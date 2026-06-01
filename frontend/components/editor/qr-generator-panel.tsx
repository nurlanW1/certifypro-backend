"use client";

import { QR_TYPES } from "@/lib/constants/product";
import { Button } from "@/components/ui/button";

export function QRGeneratorPanel() {
  return (
    <div className="space-y-3 rounded-xl border border-[#e8edf3] bg-white p-4">
      <p className="text-xs font-semibold uppercase text-[#64748b]">QR generator</p>
      <select className="w-full rounded-lg border border-[#e8edf3] px-2 py-1.5 text-xs">
        {QR_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input className="w-full rounded-lg border px-2 py-1.5 text-xs" placeholder="URL yoki matn" />
      <Button size="sm" className="w-full">
        QR yaratish
      </Button>
      <p className="text-[10px] text-muted-foreground">QR sozlamalari dashboard generatorida</p>
    </div>
  );
}
