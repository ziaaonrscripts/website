"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/tools/copy-button"

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}
function toCamel(s: string) {
  return s
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
}
function toSnake(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase()
    .replace(/^_+|_+$/g, "")
}
function toKebab(s: string) {
  return toSnake(s).replace(/_/g, "-")
}

export function CaseConverter() {
  const [text, setText] = useState("Ziaa Viewer is a developer playground")

  const rows = useMemo(
    () => [
      { label: "UPPERCASE", value: text.toUpperCase() },
      { label: "lowercase", value: text.toLowerCase() },
      { label: "Title Case", value: toTitle(text) },
      { label: "camelCase", value: toCamel(text) },
      { label: "snake_case", value: toSnake(text) },
      { label: "kebab-case", value: toKebab(text) },
      { label: "CONSTANT_CASE", value: toSnake(text).toUpperCase() },
    ],
    [text],
  )

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-24 text-sm"
      />
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2"
          >
            <span className="w-32 shrink-0 font-mono text-xs font-semibold text-primary">{r.label}</span>
            <code className="flex-1 truncate font-mono text-xs text-muted-foreground">{r.value}</code>
            <CopyButton value={r.value} />
          </div>
        ))}
      </div>
    </div>
  )
}
