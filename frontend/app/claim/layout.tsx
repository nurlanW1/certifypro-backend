export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-divide bg-canvas px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-text-primary">
            <span className="text-sm font-bold text-canvas">G</span>
          </div>
          <span className="text-sm font-semibold text-text-primary">ildia</span>
        </div>
      </header>
      <main className="px-4 py-10">{children}</main>
    </div>
  )
}
