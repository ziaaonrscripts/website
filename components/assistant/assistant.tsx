"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Send, Square, Sparkles, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Markdown } from "./markdown"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Write a Python function to check if a number is prime",
  "How do I center a div with flexbox?",
  "Explain closures in JavaScript with an example",
  "Give me a Lua table iteration example",
]

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || streaming) return

      const next: Message[] = [...messages, { role: "user", content: trimmed }]
      setMessages([...next, { role: "assistant", content: "" }])
      setInput("")
      setStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({ error: "Request failed." }))
          throw new Error(err.error || "Request failed.")
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: "assistant", content: acc }
            return copy
          })
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = {
            role: "assistant",
            content: `**Error:** ${(err as Error).message}`,
          }
          return copy
        })
      } finally {
        setStreaming(false)
        abortRef.current = null
      }
    },
    [messages, streaming],
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col px-4">
      {/* Messages */}
      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
              <Sparkles className="size-7 text-primary" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Ziaa Assistant
            </h1>
            <p className="mt-2 max-w-md text-pretty text-muted-foreground">
              Ask anything about code — debugging, explanations, or generating
              snippets you can run in the Playground.
            </p>
            <div className="mt-8 grid w-full max-w-xl gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {m.role === "assistant" && (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                    <Sparkles className="size-4 text-primary" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card",
                  )}
                >
                  {m.role === "assistant" ? (
                    m.content ? (
                      <Markdown content={m.content} />
                    ) : (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    )
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {m.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border py-4">
        <form onSubmit={onSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask Ziaa Assistant anything…"
            className="scrollbar-thin max-h-40 w-full resize-none rounded-xl border border-border bg-card py-3.5 pl-4 pr-24 text-sm leading-relaxed outline-none transition-colors focus:border-primary/50"
          />
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
            {messages.length > 0 && !streaming && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Clear conversation"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            {streaming ? (
              <Button type="button" size="icon" variant="secondary" onClick={stop}>
                <Square className="size-4" />
                <span className="sr-only">Stop</span>
              </Button>
            ) : (
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="size-4" />
                <span className="sr-only">Send</span>
              </Button>
            )}
          </div>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Powered by DeepSeek. Responses may be inaccurate — verify important code.
        </p>
      </div>
    </div>
  )
}
