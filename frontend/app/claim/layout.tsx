export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gildia-page-mesh min-h-screen">
      <header className="border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-sm">
            <span className="font-display text-sm font-bold text-text-inverse">G</span>
          </div>
          <span className="font-display text-lg font-bold text-brand-800">Gildia</span>
        </div>
      </header>
      <main className="px-4 py-10">{children}</main>
    </div>
  )
}
