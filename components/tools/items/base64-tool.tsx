"use client"

import { useState } from "react"
import { ArrowDownUp } from "lucide-react"
import { CopyButton } from "../copy-button"
import { Button } from "@/components/ui/button"

export function Base64Tool() {
  const [text, setText] = useState("Hello, Ziaa Viewer!")
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  let output = ""
  let error = ""
  try {
    if (text) {
      output =
        mode === "encode"
          ? btoa(unescape(encodeURIComponent(text)))
          : decodeURIComponent(escape(atob(text)))
    }
  } catch {
    error = "Invalid input for the selected mode."
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg bg-secondary p-1">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            if (!error && output) setText(output)
            setMode((m) => (m === "encode" ? "decode" : "encode"))
          }}
        >
          <ArrowDownUp className="size-4" />
          Swap
        </Button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        placeholder="Text to convert…"
        className="scrollbar-thin h-32 w-full resize-none rounded-lg border border-border bg-card p-3 font-mono text-[13px] outline-none focus:border-primary/50"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Result</span>
        {output && <CopyButton value={output} />}
      </div>
      <pre
        className={`scrollbar-thin h-32 w-full overflow-auto rounded-lg border p-3 font-mono text-[13px] ${
          error ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-border bg-card"
        }`}
      >
        {error || output || "Output appears here."}
      </pre>
    </div>
  )
}
