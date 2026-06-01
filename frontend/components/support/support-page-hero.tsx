import type { ReactNode } from "react"

import {
  LandingContainer,
  LandingEyebrow,
  LandingHeading,
  LandingSection,
} from "@/components/marketing/home/landing-primitives"

type Props = {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function SupportPageHero({ eyebrow, title, description, children }: Props) {
  return (
    <LandingSection className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-20">
      <LandingContainer>
        <LandingEyebrow>{eyebrow}</LandingEyebrow>
        <LandingHeading title={title} description={description} align="left" />
        {children}
      </LandingContainer>
    </LandingSection>
  )
}
