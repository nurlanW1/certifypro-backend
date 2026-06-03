export function AuthDivider({ label = "yoki email orqali" }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <span className="relative mx-auto block w-fit bg-background px-3 text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
