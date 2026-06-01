"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EXCEL_COLUMNS, EVENT_VARIABLES } from "@/lib/constants/product";

const STEPS = [
  { n: 1, title: "Shablon tanlash", desc: "Sertifikat, bejik yoki taklifnoma shablonini tanlang" },
  { n: 2, title: "XLSX/CSV yuklash", desc: "Ishtirokchilar ro‘yxatini yuklang" },
  { n: 3, title: "Ustunlarni bog‘lash", desc: "Excel ustunlarini shablon o‘zgaruvchilariga ulang" },
  { n: 4, title: "Ko‘rib chiqish", desc: "Namuna fayllarni tekshiring" },
  { n: 5, title: "Generatsiya", desc: "Barcha fayllarni yarating" },
  { n: 6, title: "ZIP yuklab olish", desc: "Paketni yuklab oling" },
];

const defaultMapping: Record<string, string> = {
  "Full name": "{{full_name}}",
  Organization: "{{organization}}",
  Position: "{{position}}",
  Email: "{{email}}",
  "Certificate ID": "{{certificate_id}}",
  "QR link": "{{qr_code}}",
  "Seat number": "{{seat_number}}",
  Role: "{{role}}",
};

export function BulkGenerateWizard() {
  const [step, setStep] = useState(1);
  const [mapping, setMapping] = useState(defaultMapping);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setStep(s.n)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              step === s.n ? "bg-[#2563eb] text-white" : "bg-white border border-[#e8edf3] text-[#64748b]"
            }`}
          >
            {s.n}. {s.title}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="rounded-2xl border border-[#e8edf3] bg-white p-6">
          <p className="font-semibold text-[#0a1628]">1-qadam: Shablon tanlash</p>
          <p className="mt-1 text-sm text-[#64748b]">Bulk uchun sertifikat, bejik yoki taklifnoma shablonini tanlang.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Sertifikat", "Bejik", "Taklifnoma"].map((t) => (
              <button key={t} type="button" className="rounded-xl border border-[#e8edf3] py-4 text-sm font-medium hover:border-[#2563eb]">
                {t} shablon
              </button>
            ))}
          </div>
          {/* TODO: GET /api/templates?bulk=true */}
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-white p-12 text-center">
          <p className="font-semibold">XLSX yoki CSV faylni bu yerga tashlang</p>
          <p className="mt-2 text-sm text-[#64748b]">participants.xlsx — Full name, Organization, ...</p>
          <label className="mt-4 inline-block cursor-pointer">
            <span className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
              Fayl tanlash
            </span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="sr-only"
              onChange={() => setStep(3)}
            />
          </label>
          <Button variant="outline" className="mt-4 ml-2" size="sm">
            Namuna Excel yuklab olish
          </Button>
          {/* TODO: POST /api/bulk/upload */}
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl border border-[#e8edf3] bg-white p-6">
          <p className="font-semibold text-[#0a1628]">3-qadam: Ustunlarni shablon o‘zgaruvchilariga bog‘lash</p>
          <div className="mt-4 space-y-3">
            {EXCEL_COLUMNS.map((col) => (
              <div key={col} className="flex flex-wrap items-center gap-3">
                <span className="w-36 text-sm font-medium text-[#0a1628]">{col}</span>
                <span className="text-[#94a3b8]">→</span>
                <select
                  className="rounded-lg border border-[#e8edf3] px-3 py-2 text-sm"
                  value={mapping[col] || ""}
                  onChange={(e) => setMapping({ ...mapping, [col]: e.target.value })}
                >
                  <option value="">Tanlanmagan</option>
                  {EVENT_VARIABLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {/* TODO: POST /api/bulk/map-columns */}
        </div>
      )}

      {step === 4 && (
        <div className="rounded-2xl border border-[#e8edf3] bg-white p-6">
          <p className="font-semibold">4-qadam: Namuna ko‘rib chiqish</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Aliyev J.", "Karimova N.", "Rahimov S."].map((name) => (
              <div key={name} className="rounded-lg border border-[#e8edf3] p-3 text-center text-xs">
                <div className="mx-auto mb-2 h-16 w-full rounded bg-slate-100" />
                {name}
              </div>
            ))}
          </div>
          {/* TODO: GET /api/bulk/preview */}
        </div>
      )}

      {step === 5 && (
        <div className="rounded-2xl border border-[#e8edf3] bg-white p-6 text-center">
          <p className="font-semibold">5-qadam: Generatsiya</p>
          <p className="mt-2 text-sm text-[#64748b]">125 ta fayl yaratiladi (taxminiy)</p>
          <Button className="mt-4">Generatsiyani boshlash</Button>
          {/* TODO: POST /api/bulk/generate — job queue */}
        </div>
      )}

      {step === 6 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
          <p className="font-semibold text-emerald-800">6-qadam: ZIP tayyor</p>
          <Button className="mt-4">ZIP yuklab olish</Button>
          {/* TODO: GET /api/bulk/download/:jobId */}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={step <= 1} onClick={() => setStep((s) => s - 1)}>
          Orqaga
        </Button>
        <Button size="sm" disabled={step >= 6} onClick={() => setStep((s) => s + 1)}>
          Keyingi qadam
        </Button>
      </div>
    </div>
  );
}
