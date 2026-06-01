import { ArrowRight, BarChart3, Calendar, FileStack, Users } from "lucide-react"

import {
  BrowserFrame,
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"
import { LinkButton } from "@/components/ui/button"

const SIDEBAR = [
  { icon: Calendar, label: "Tadbirlar", active: true },
  { icon: FileStack, label: "Materiallar" },
  { icon: Users, label: "Jamoa" },
  { icon: BarChart3, label: "Hisobot" },
]

export function HomeDashboardPreview() {
  return (
    <LandingSection id="dashboard">
      <LandingContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <LandingEyebrow>Tadbir workspace</LandingEyebrow>
            <LandingHeading
              align="left"
              title="Butun tadbirni boshqarish paneli"
              description="Material tanlash, brending, jamoa va bulk generatsiya — barchasi bitta workspace’da."
            />
            <ul className="space-y-4">
              {[
                "Tadbir katalogi — kerakli materiallarni belgilang",
                "Brend ranglari va logo — barcha shablonlarga",
                "Excel orqali ommaviy generatsiya",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/dashboard/events/new" className="gap-2">
                Workspace yaratish
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/dashboard" variant="outline">
                Dashboard
              </LinkButton>
            </div>
          </div>

          <BrowserFrame>
            <div className="flex min-h-[320px] bg-muted/20">
              <aside className="hidden w-44 shrink-0 border-r border-border bg-card p-3 sm:block">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Workspace
                </p>
                <ul className="mt-3 space-y-1">
                  {SIDEBAR.map((item) => (
                    <li
                      key={item.label}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium ${
                        item.active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="size-3.5" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </aside>
              <div className="flex-1 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">Tech Summit 2026</p>
                    <p className="text-[10px] text-muted-foreground">24 ta material • 3 ta tayyor</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Faol
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["Sertifikat", "Bejik", "Roll-up", "Flyer", "PPT", "QR"].map((label, i) => (
                    <div
                      key={label}
                      className="rounded-lg border border-border bg-background p-2 text-center"
                    >
                      <div
                        className={`mx-auto mb-1.5 aspect-square w-full max-w-[48px] rounded-md ${
                          i % 3 === 0
                            ? "bg-gradient-to-br from-[#0a1628] to-primary"
                            : "bg-muted"
                        }`}
                      />
                      <p className="text-[9px] font-medium text-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-center">
                  <p className="text-[10px] font-semibold text-primary">+ Material qo‘shish</p>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </LandingContainer>
    </LandingSection>
  )
}
