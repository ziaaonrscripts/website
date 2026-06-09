"use client"

import { useState } from "react"
import { CopyButton } from "../copy-button"

function hexToRgb(hex: string) {
  const m = hex.replace("#", "")
  const full =
    m.length === 3
      ? m.split("").map((c) => c + c).join("")
      : m.padEnd(6, "0").slice(0, 6)
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function ColorConverter() {
  const [hex, setHex] = useState("#22d3ee")
  const valid = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)
  const normalized = hex.startsWith("#") ? hex : "#" + hex
  const { r, g, b } = valid ? hexToRgb(normalized) : { r: 0, g: 0, b: 0 }
  const { h, s, l } = rgbToHsl(r, g, b)

  const rgb = `rgb(${r}, ${g}, ${b})`
  const hsl = `hsl(${h}, ${s}%, ${l}%)`

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={valid ? normalized : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className="size-16 cursor-pointer rounded-lg border border-border bg-transparent"
          aria-label="Pick a color"
        />
        <div className="flex-1">
          <label className="text-sm font-medium">HEX</label>
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            className={`mt-1 w-full rounded-lg border bg-card px-3 py-2 font-mono text-sm outline-none ${
              valid ? "border-border focus:border-primary/50" : "border-destructive/50"
            }`}
          />
        </div>
        <div
          className="size-16 rounded-lg border border-border"
          style={{ background: valid ? normalized : "transparent" }}
          aria-hidden="true"
        />
      </div>

      {valid && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "HEX", value: normalized.toLowerCase() },
            { label: "RGB", value: rgb },
            { label: "HSL", value: hsl },
            { label: "CSS var", value: `--color: ${normalized.toLowerCase()};` },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
            >
              <div>
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <p className="font-mono text-sm">{row.value}</p>
              </div>
              <CopyButton value={row.value} label="" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
