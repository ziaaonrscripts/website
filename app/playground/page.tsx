import { SiteHeader } from "@/components/site-header"
import { Playground } from "@/components/playground/playground"

export const metadata = {
  title: "Playground — Ziaa Viewer",
  description:
    "Write HTML, CSS, JS, Python and Lua with a live preview and console. Powered by Monaco, Pyodide and Wasmoon.",
}

export default function PlaygroundPage() {
  return (
    <div className="flex h-dvh flex-col">
      <SiteHeader />
      <Playground />
    </div>
  )
}
