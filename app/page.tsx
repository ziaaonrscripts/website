import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CtaDiscord } from "@/components/cta-discord"

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <CtaDiscord />
      </main>
      <SiteFooter />
    </div>
  )
}
