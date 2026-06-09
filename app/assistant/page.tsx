import { SiteHeader } from "@/components/site-header"
import { Assistant } from "@/components/assistant/assistant"

export const metadata = {
  title: "AI Assistant — Ziaa Viewer",
  description:
    "Ask the Ziaa Assistant coding questions and get instant, runnable answers.",
}

export default function AssistantPage() {
  return (
    <div className="flex h-dvh flex-col">
      <SiteHeader />
      <Assistant />
    </div>
  )
}
