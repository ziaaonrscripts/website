"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Minimal, dependency-free Markdown renderer tuned for chat output.
 * Supports: fenced code blocks, inline code, bold, headings, lists, links.
 */
export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content)
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <CodeBlock key={i} lang={block.lang} code={block.code} />
        ) : (
          <div
            key={i}
            className="prose-chat"
            dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
          />
        ),
      )}
    </div>
  )
}

type Block =
  | { type: "text"; text: string }
  | { type: "code"; lang: string; code: string }

function parseBlocks(input: string): Block[] {
  const blocks: Block[] = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(input))) {
    if (m.index > last) {
      blocks.push({ type: "text", text: input.slice(last, m.index) })
    }
    blocks.push({ type: "code", lang: m[1] || "text", code: m[2].replace(/\n$/, "") })
    last = regex.lastIndex
  }
  if (last < input.length) {
    blocks.push({ type: "text", text: input.slice(last) })
  }
  return blocks
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function renderInline(text: string): string {
  const lines = text.split("\n")
  let html = ""
  let inList = false
  for (let raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      continue
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/)
    const li = line.match(/^[-*]\s+(.*)$/)
    if (heading) {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      const level = heading[1].length
      const size = level <= 1 ? "text-lg" : level === 2 ? "text-base" : "text-sm"
      html += `<p class="${size} font-semibold mt-1">${formatSpans(heading[2])}</p>`
    } else if (li) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-1">'
        inList = true
      }
      html += `<li>${formatSpans(li[1])}</li>`
    } else {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      html += `<p>${formatSpans(line)}</p>`
    }
  }
  if (inList) html += "</ul>"
  return html
}

function formatSpans(s: string): string {
  let out = escapeHtml(s)
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.8em] text-primary">$1</code>',
  )
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline underline-offset-2">$1</a>',
  )
  return out
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#15171c]">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {lang}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className={cn(
            "flex items-center gap-1 text-[11px] transition-colors",
            copied ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-auto p-3 font-mono text-[12.5px] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  )
}
