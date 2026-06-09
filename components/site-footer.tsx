import Link from "next/link"
import { Boxes } from "lucide-react"
import { DISCORD_URL, SITE } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <Boxes className="size-4 text-primary" />
          </span>
          <span className="font-semibold tracking-tight">{SITE.name}</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/playground" className="transition-colors hover:text-foreground">
            Playground
          </Link>
          <Link href="/tools" className="transition-colors hover:text-foreground">
            Tools
          </Link>
          <Link href="/assistant" className="transition-colors hover:text-foreground">
            AI Assistant
          </Link>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Discord
          </a>
        </nav>

        <p className="text-sm text-muted-foreground">
          {"\u00A9"} {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  )
}
