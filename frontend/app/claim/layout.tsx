export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gildia-page-mesh min-h-screen">
      <header className="border-b-2 border-text-primary/10 bg-surface/90 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-text-primary bg-accent-500">
            <span className="font-display text-sm font-extrabold text-text-primary">G</span>
          </div>
          <span className="font-display text-lg font-bold text-brand-800">Gildia</span>
        </div>
      </header>
      <main className="px-4 py-10">{children}</main>
    </div>
  )
}
