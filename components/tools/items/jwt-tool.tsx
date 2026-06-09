"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/tools/copy-button"

function decodeJwtPart(part: string) {
  try {
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return null
  }
}

export function JwtTool() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlppYWEgVmlld2VyIiwiaWF0IjoxNzE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  )

  const { header, payload, error } = useMemo(() => {
    const parts = token.trim().split(".")
    if (parts.length < 2) return { header: null, payload: null, error: "Not a valid JWT (need 3 parts)." }
    const header = decodeJwtPart(parts[0])
    const payload = decodeJwtPart(parts[1])
    if (!header || !payload) return { header: null, payload: null, error: "Failed to decode token segments." }
    return { header, payload, error: null }
  }, [token])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">JWT</label>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="min-h-24 break-all font-mono text-xs"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Header", value: header },
            { title: "Payload", value: payload },
          ].map((b) => (
            <div key={b.title} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{b.title}</span>
                <CopyButton value={b.value ?? ""} />
              </div>
              <pre className="max-h-72 overflow-auto rounded-lg border border-border bg-card/50 p-3 font-mono text-xs text-muted-foreground">
                {b.value}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
