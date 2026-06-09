"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"

export function TextCounter() {
  const [text, setText] = useState(
    "Paste your text here to count characters, words, sentences, and reading time.",
  )

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0) : 0
    const lines = text ? text.split(/\n/).length : 0
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0
    const readingTime = Math.max(1, Math.round(words / 200))
    return { chars, charsNoSpaces, words, sentences, lines, paragraphs, readingTime }
  }, [text])

  const cards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "No spaces", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Lines", value: stats.lines },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Read time", value: `${stats.readingTime} min` },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-card/50 p-3 text-center">
            <div className="font-mono text-xl font-bold text-primary">{c.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-56 text-sm leading-relaxed"
      />
    </div>
  )
}
