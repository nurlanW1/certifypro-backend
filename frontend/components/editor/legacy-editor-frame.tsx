"use client";

import { LEGACY_EDITOR_URL } from "@/lib/constants/env";

/**
 * Embeds the production-ready legacy editor (public/editor.html + editor.js).
 * Backend serves /public when running server.js — see backend/server.js static middleware.
 */
export function LegacyEditorFrame() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[#e8edf3] bg-white px-4 py-2">
        <p className="text-xs text-[#64748b]">
          To‘liq funksional editor (Konva, export, bulk, QR) — migratsiya bosqichida legacy shell
        </p>
        <a href={LEGACY_EDITOR_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#2563eb]">
          Yangi oynada ochish →
        </a>
      </div>
      <iframe
        title="Gildia Editor"
        src={LEGACY_EDITOR_URL}
        className="min-h-0 flex-1 w-full border-0 bg-white"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
