import Link from "next/link";
import { HERO_MATERIAL_CARDS } from "@/lib/constants/product";

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg lg:max-w-none">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50" />

      {HERO_MATERIAL_CARDS.map((card, i) => {
        const positions = [
          "left-0 top-6",
          "right-0 top-2",
          "left-4 bottom-20",
          "right-6 bottom-24",
          "left-1/2 -translate-x-1/2 bottom-4",
          "right-12 top-1/3",
        ];
        const anim = i % 2 === 0 ? "animate-float" : "animate-float-delayed";
        return (
          <Link
            key={card.label}
            href={card.href}
            className={`absolute ${positions[i]} ${anim} rounded-xl border border-[#e8edf3] bg-white px-3 py-2 shadow-lg transition-transform hover:scale-105`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#2563eb]">{card.label}</p>
            <p className="text-xs font-medium text-[#0a1628]">{card.labelUz}</p>
          </Link>
        );
      })}

      <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-[0_20px_72px_rgba(10,22,40,0.12)]">
        <p className="text-[10px] font-semibold uppercase text-[#64748b]">Event material editor</p>
        <p className="mt-1 text-sm font-bold text-[#0a1628]">Konferensiya sertifikati</p>
        <div className="mt-3 h-24 rounded-lg bg-gradient-to-br from-[#0a1628] to-[#2563eb] opacity-90" />
        <p className="mt-2 font-mono text-[10px] text-[#64748b]">{"{{full_name}}"} • Print-ready A4</p>
      </div>
    </div>
  );
}
