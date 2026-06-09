"use client"

import { useState } from "react"
import {
  Braces,
  Binary,
  Link2,
  Palette,
  Hash,
  KeyRound,
  Fingerprint,
  Type,
  CaseSensitive,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { JsonFormatter } from "@/components/tools/items/json-formatter"
import { Base64Tool } from "@/components/tools/items/base64-tool"
import { UrlTool } from "@/components/tools/items/url-tool"
import { ColorConverter } from "@/components/tools/items/color-converter"
import { HashTool } from "@/components/tools/items/hash-tool"
import { JwtTool } from "@/components/tools/items/jwt-tool"
import { UuidTool } from "@/components/tools/items/uuid-tool"
import { TextCounter } from "@/components/tools/items/text-counter"
import { CaseConverter } from "@/components/tools/items/case-converter"
import { TimestampTool } from "@/components/tools/items/timestamp-tool"

type Tool = {
  id: string
  name: string
  description: string
  icon: typeof Braces
  component: React.ComponentType
}

const TOOLS: Tool[] = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Beautify, minify and validate JSON.",
    icon: Braces,
    component: JsonFormatter,
  },
  {
    id: "base64",
    name: "Base64",
    description: "Encode and decode Base64 strings.",
    icon: Binary,
    component: Base64Tool,
  },
  {
    id: "url",
    name: "URL Encoder",
    description: "Encode/decode URLs and parse query strings.",
    icon: Link2,
    component: UrlTool,
  },
  {
    id: "color",
    name: "Color Converter",
    description: "Convert between HEX, RGB and HSL.",
    icon: Palette,
    component: ColorConverter,
  },
  {
    id: "hash",
    name: "Hash Generator",
    description: "SHA-1/256/384/512 and DJB2 hashes.",
    icon: Hash,
    component: HashTool,
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    description: "Inspect JWT header and payload.",
    icon: KeyRound,
    component: JwtTool,
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate v4 UUIDs in bulk.",
    icon: Fingerprint,
    component: UuidTool,
  },
  {
    id: "case",
    name: "Case Converter",
    description: "camelCase, snake_case, kebab and more.",
    icon: CaseSensitive,
    component: CaseConverter,
  },
  {
    id: "counter",
    name: "Text Counter",
    description: "Count words, chars and reading time.",
    icon: Type,
    component: TextCounter,
  },
  {
    id: "timestamp",
    name: "Timestamp",
    description: "Convert between Unix time and dates.",
    icon: Clock,
    component: TimestampTool,
  },
]

export function ToolsWorkspace() {
  const [activeId, setActiveId] = useState(TOOLS[0].id)
  const active = TOOLS.find((t) => t.id === activeId) ?? TOOLS[0]
  const ActiveComponent = active.component

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Developer Tools
        </h2>
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {TOOLS.map((tool) => {
            const Icon = tool.icon
            const isActive = tool.id === activeId
            return (
              <button
                key={tool.id}
                onClick={() => setActiveId(tool.id)}
                className={cn(
                  "group flex shrink-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors lg:w-full",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card/60 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                />
                <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">{tool.name}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <active.icon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{active.name}</h1>
            <p className="text-sm text-muted-foreground">{active.description}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <ActiveComponent />
        </div>
      </section>
    </div>
  )
}
