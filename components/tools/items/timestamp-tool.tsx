"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/tools/copy-button"

export function TimestampTool() {
  const [now, setNow] = useState(() => Date.now())
  const [unix, setUnix] = useState(() => Math.floor(Date.now() / 1000).toString())
  const [iso, setIso] = useState("")

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const fromUnix = useMemo(() => {
    const n = Number(unix)
    if (!Number.isFinite(n)) return null
    const ms = unix.length > 10 ? n : n * 1000
    const d = new Date(ms)
    if (Number.isNaN(d.getTime())) return null
    return d
  }, [unix])

  const fromIso = useMemo(() => {
    if (!iso) return null
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? null : d
  }, [iso])

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <div className="text-xs text-muted-foreground">Current Unix time</div>
        <div className="mt-1 flex items-center gap-3">
          <code className="font-mono text-2xl font-bold text-primary">{Math.floor(now / 1000)}</code>
          <CopyButton value={String(Math.floor(now / 1000))} />
        </div>
        <div className="mt-1 font-mono text-xs text-muted-foreground">{new Date(now).toString()}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Unix → Date</label>
          <div className="flex gap-2">
            <Input value={unix} onChange={(e) => setUnix(e.target.value)} className="font-mono" />
            <Button variant="secondary" onClick={() => setUnix(String(Math.floor(Date.now() / 1000)))}>
              Now
            </Button>
          </div>
          <p className="min-h-5 font-mono text-xs text-muted-foreground">
            {fromUnix ? fromUnix.toUTCString() : "Invalid timestamp"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Date → Unix</label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={iso}
              onChange={(e) => setIso(e.target.value)}
              className="font-mono"
            />
          </div>
          <p className="min-h-5 font-mono text-xs text-muted-foreground">
            {fromIso ? `${Math.floor(fromIso.getTime() / 1000)} (s)` : "Pick a date"}
          </p>
        </div>
      </div>
    </div>
  )
}
