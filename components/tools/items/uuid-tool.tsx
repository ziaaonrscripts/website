"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/tools/copy-button"

function uuidv4() {
  return crypto.randomUUID()
}

export function UuidTool() {
  const [count, setCount] = useState(5)
  const [seed, setSeed] = useState(0)

  const uuids = useMemo(() => {
    void seed
    return Array.from({ length: Math.min(Math.max(count, 1), 100) }, () => uuidv4())
  }, [count, seed])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">How many?</label>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-32"
          />
        </div>
        <Button onClick={() => setSeed((s) => s + 1)}>Regenerate</Button>
        <CopyButton value={uuids.join("\n")} label="Copy all" />
      </div>
      <Textarea readOnly value={uuids.join("\n")} className="min-h-48 font-mono text-sm" />
    </div>
  )
}
