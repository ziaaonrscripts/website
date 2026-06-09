"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/tools/copy-button"

function djb2(str: string) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return (hash >>> 0).toString(16).padStart(8, "0")
}

async function digest(algo: string, text: string) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function HashTool() {
  const [input, setInput] = useState("Hello, Ziaa!")
  const [hashes, setHashes] = useState<{ algo: string; value: string }[]>([])

  useMemo(() => {
    let active = true
    Promise.all(
      ["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map(async (algo) => ({
        algo,
        value: await digest(algo, input),
      })),
    ).then((results) => {
      if (active) setHashes([{ algo: "DJB2", value: djb2(input) }, ...results])
    })
    return () => {
      active = false
    }
  }, [input])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Input text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-24 font-mono text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        {hashes.map((h) => (
          <div
            key={h.algo}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2"
          >
            <span className="w-20 shrink-0 font-mono text-xs font-semibold text-primary">{h.algo}</span>
            <code className="flex-1 truncate font-mono text-xs text-muted-foreground">{h.value}</code>
            <CopyButton value={h.value} />
          </div>
        ))}
      </div>
    </div>
  )
}
