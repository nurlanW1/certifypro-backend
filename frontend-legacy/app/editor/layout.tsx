export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#eceef2] font-sans text-[#0f172a] antialiased">
      {children}
    </div>
  )
}
