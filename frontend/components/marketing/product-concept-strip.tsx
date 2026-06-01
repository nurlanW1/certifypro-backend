import { PLATFORM_TAGLINE } from "@/lib/constants/product";

/** Har bir sahifada Gildia konsepsiyasini eslatuvchi qisqa banner */
export function ProductConceptStrip({ context }: { context?: string }) {
  return (
    <div className="border-b border-[#e8edf3] bg-[#f8fafc]">
      <div className="gildia-container py-3">
        <p className="text-center text-xs text-[#64748b] md:text-sm">
          <span className="font-semibold text-[#2563eb]">Gildia.uz</span>
          {" — "}
          {PLATFORM_TAGLINE}
          {context ? (
            <>
              {" "}
              <span className="text-[#94a3b8]">• {context}</span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
