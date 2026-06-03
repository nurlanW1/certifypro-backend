import Link from "next/link"

import { LinkButton } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Sahifa topilmadi</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        So‘ralgan manzil mavjud emas yoki ko‘chirilgan. Bosh sahifaga qayting yoki dashboard orqali
        davom eting.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/">Bosh sahifa</LinkButton>
        <LinkButton href="/dashboard" variant="outline">
          Dashboard
        </LinkButton>
        <Link href="/templates" className="text-sm font-medium text-primary hover:underline">
          Shablonlar
        </Link>
      </div>
    </div>
  )
}
