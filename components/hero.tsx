import Link from "next/link"
import { ArrowRight, Code2, Terminal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroScene } from "@/components/hero-scene"
import { DISCORD_URL } from "@/lib/site"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            HTML · CSS · JS · Python · Lua — no setup
          </span>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Run code instantly,{" "}
            <span className="text-primary glow-text">right in your browser</span>
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Ziaa Viewer is a fast, beautiful playground for the web and beyond.
            Write HTML, CSS and JavaScript with a live preview, execute real
            Python and Lua, ask the built-in AI assistant, and reach for dozens
            of developer utilities — all without leaving the page.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button render={<Link href="/playground" />} size="lg" className="gap-2">
              Open Playground
              <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/assistant" />}
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              <Sparkles className="size-4" />
              Try the AI Assistant
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Code2 className="size-4 text-primary" />
              Monaco-powered editor
            </span>
            <span className="flex items-center gap-2">
              <Terminal className="size-4 text-primary" />
              WebAssembly runtimes
            </span>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              Join the community
            </a>
          </div>
        </div>

        <div className="relative h-[340px] w-full sm:h-[440px] lg:h-[520px]">
          <HeroScene />
        </div>
      </div>
    </section>
  )
}
