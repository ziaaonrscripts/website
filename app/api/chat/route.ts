import type { NextRequest } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

const SYSTEM_PROMPT = `You are Ziaa Assistant, a friendly and highly capable coding assistant built into Ziaa Viewer, an online code playground that runs HTML, CSS, JavaScript, Python and Lua in the browser.

Guidelines:
- Answer clearly and concisely. Prefer practical, working code.
- Use Markdown. Put code in fenced code blocks with the correct language tag.
- When relevant, mention that the user can paste the code into the Ziaa Viewer Playground to run it.
- Be accurate. If unsure, say so.`

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "NVIDIA_API_KEY is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  let messages: ChatMessage[] = []
  try {
    const body = await req.json()
    messages = Array.isArray(body.messages) ? body.messages : []
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const upstream = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v4-pro",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 16384,
        chat_template_kwargs: { thinking: false },
        stream: true,
      }),
    },
  )

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "")
    return new Response(
      JSON.stringify({
        error: `Model request failed (${upstream.status}). ${detail.slice(0, 300)}`,
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    )
  }

  // Re-stream just the text deltas as a plain text stream.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader()
      let buffer = ""
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue
            const data = trimmed.slice(5).trim()
            if (data === "[DONE]") {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) controller.enqueue(encoder.encode(delta))
            } catch {
              /* ignore partial json */
            }
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            "\n\n[Error streaming response: " +
              (err instanceof Error ? err.message : String(err)) +
              "]",
          ),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}
