/** Premium light-mode design tokens for the editor shell */

export const EDITOR_RAIL_WIDTH = 56
export const EDITOR_PANEL_WIDTH = 300
export const EDITOR_INSPECTOR_WIDTH = 300

export const editorChrome = {
  shell: "flex h-full flex-col bg-[#eceef2] font-sans antialiased",
  toolbar:
    "flex h-12 shrink-0 items-center gap-2 border-b border-[#dfe3ea] bg-white/95 px-2.5 shadow-[0_1px_0_rgba(15,23,42,0.05)] backdrop-blur-sm md:gap-2.5 md:px-3",
  toolbarGroup:
    "flex shrink-0 items-center gap-0.5 rounded-lg border border-[#e8eaef] bg-[#f4f5f7] p-0.5",
  iconBtn:
    "size-8 rounded-md text-[#64748b] transition-[color,background,transform] duration-150 hover:bg-white hover:text-[#0f172a] hover:shadow-sm active:scale-[0.97] disabled:pointer-events-none disabled:opacity-35",
  iconBtnActive: "bg-white text-[#4f46e5] shadow-sm ring-1 ring-[#e0e7ff]",
  workspace:
    "relative min-w-0 flex-1 bg-[linear-gradient(165deg,#e8ebf0_0%,#dfe3e9_45%,#d5dae3_100%)]",
  workspaceDots:
    "pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(circle,#a8b0bd_0.65px,transparent_0.65px)] [background-size:20px_20px]",
  workspaceGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.35),transparent_70%)]",
  panel: "flex shrink-0 flex-col border-[#dfe3ea] bg-white",
  panelHeader: "flex shrink-0 items-center justify-between border-b border-[#e8ebf0] px-3.5 py-3",
  panelTitle:
    "text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]",
  panelBody: "p-3.5 text-[13px] leading-relaxed text-[#334155]",
  rail: "flex w-14 shrink-0 flex-col border-r border-[#dfe3ea] bg-[#f8f9fb] py-2",
  railBtn:
    "mx-1.5 mb-0.5 flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2.5 text-[9px] font-medium leading-none transition-all duration-150",
  railBtnActive:
    "bg-white text-[#4f46e5] shadow-[0_1px_2px_rgba(15,23,42,0.06),inset_0_0_0_1px_#e0e7ff]",
  railBtnIdle: "text-[#64748b] hover:bg-white/80 hover:text-[#0f172a]",
  railIcon: "size-[18px] stroke-[1.75]",
  inspector: "flex w-[300px] shrink-0 flex-col border-l border-[#dfe3ea] bg-white",
  inspectorTabs: "flex shrink-0 gap-1 border-b border-[#e8ebf0] bg-[#fafbfc] p-1.5",
  inspectorTab:
    "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[11px] font-medium transition-all duration-150",
  inspectorTabActive:
    "bg-white text-[#4338ca] shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-[#e8ebf0]",
  inspectorTabIdle: "text-[#64748b] hover:bg-white/60 hover:text-[#334155]",
  statusBar:
    "flex h-9 shrink-0 items-center justify-between gap-3 border-t border-[#dfe3ea] bg-white/95 px-3 text-[11px] text-[#64748b] backdrop-blur-sm",
  input:
    "h-8 rounded-md border-[#e2e5ea] bg-white text-[13px] text-[#0f172a] shadow-none placeholder:text-[#94a3b8] focus-visible:border-[#6366f1] focus-visible:ring-2 focus-visible:ring-[#6366f1]/20",
  toolCard:
    "rounded-lg border border-[#e8ebf0] bg-[#fafbfc] px-3 py-3 text-left text-[11px] font-medium text-[#334155] transition-all duration-150 hover:border-[#c7d2fe] hover:bg-[#f5f7ff] hover:text-[#3730a3] hover:shadow-sm active:scale-[0.99]",
  artboardShadow:
    "rounded-sm shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.05),0_16px_40px_rgba(15,23,42,0.1),0_40px_80px_-24px_rgba(15,23,42,0.14)]",
  selectionRing:
    "ring-2 ring-[#6366f1] ring-offset-2 ring-offset-white shadow-[0_0_0_1px_rgba(99,102,241,0.25)]",
  selectionHover: "ring-1 ring-[#a5b4fc]/90 ring-offset-1 ring-offset-white",
  resizeHandle:
    "absolute z-30 size-3 rounded-[3px] border-[1.5px] border-white bg-[#6366f1] shadow-[0_1px_4px_rgba(15,23,42,0.2)] transition-transform duration-100 hover:scale-125",
  rotateHandle:
    "flex size-6 items-center justify-center rounded-full border-[1.5px] border-white bg-[#6366f1] text-white shadow-[0_2px_8px_rgba(79,70,229,0.35)] transition-transform hover:scale-110 active:scale-95",
  rotateStem: "h-5 w-px bg-[#6366f1]",
  badge:
    "inline-flex items-center rounded-md border border-[#e2e5ea] bg-[#f8f9fb] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#475569]",
} as const
