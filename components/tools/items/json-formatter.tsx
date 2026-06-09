"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "../copy-button"

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Ziaa","langs":["html","python","lua"],"stars":42}')
  const [indent, setIndent] = useState(2)

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, text: "" }
    try {
      const parsed = JSON.parse(input)
      return { ok: true, text: JSON.stringify(parsed, null, indent) }
    } catch (e) {
      return { ok: false, text: (e as Error).message }
    }
  }, [input, indent])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Input JSON</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-md border border-border bg-secondary px-2 py-1 text-xs"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Minify</option>
          </select>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          className="scrollbar-thin h-72 w-full resize-none rounded-lg border border-border bg-card p-3 font-mono text-[13px] outline-none focus:border-primary/50"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {result.ok ? "Formatted" : "Error"}
          </label>
          {result.ok && result.text && <CopyButton value={result.text} />}
        </div>
        <pre
          className={`scrollbar-thin h-72 w-full overflow-auto rounded-lg border p-3 font-mono text-[13px] ${
            result.ok ? "border-border bg-card" : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}
        >
          {result.text || "Output appears here."}
        </pre>
      </div>
    </div>
  )
}
