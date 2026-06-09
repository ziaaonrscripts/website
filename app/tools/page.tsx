import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ToolsWorkspace } from "@/components/tools/tools-workspace"

export const metadata = {
  title: "Developer Tools — Ziaa Viewer",
  description:
    "A collection of fast, privacy-friendly developer utilities: JSON formatter, Base64, color converter, hashing, JWT decoder, UUID generator and more.",
}

export default function ToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ToolsWorkspace />
      </main>
      <SiteFooter />
    </div>
  )
}
