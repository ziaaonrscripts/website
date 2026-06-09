"use client"

import { cn } from "@/lib/utils"

export interface ConsoleLine {
  type: "log" | "error" | "warn" | "info" | "result"
  text: string
}

export function ConsoleOutput({
  lines,
  empty = "Run your code to see output here.",
}: {
  lines: ConsoleLine[]
  empty?: string
}) {
  return (
    <div className="scrollbar-thin h-full overflow-auto bg-[#15171c] p-3 font-mono text-[13px] leading-relaxed">
      {lines.length === 0 ? (
        <p className="text-muted-foreground">{empty}</p>
      ) : (
        lines.map((line, i) => (
          <pre
            key={i}
            className={cn(
              "whitespace-pre-wrap break-words",
              line.type === "error" && "text-destructive",
              line.type === "warn" && "text-yellow-400",
              line.type === "info" && "text-sky-300",
              line.type === "result" && "text-primary",
              line.type === "log" && "text-foreground/90",
            )}
          >
            {line.type === "error" ? "✕ " : line.type === "result" ? "→ " : ""}
            {line.text}
          </pre>
        ))
      )}
    </div>
  )
}
