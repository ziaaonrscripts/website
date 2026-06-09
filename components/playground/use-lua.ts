"use client"

import { useCallback, useState } from "react"

// Wasmoon's npm build references Node's `module`, which breaks bundling.
// Load the browser ESM build from a CDN at runtime instead. The URL is held
// in a variable so the bundler does not try to statically resolve it.
const WASMOON_URL = "https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/+esm"

type LuaFactoryCtor = new () => {
  createEngine: () => Promise<{
    global: {
      set: (name: string, value: unknown) => void
      close: () => void
    }
    doString: (code: string) => Promise<unknown>
  }>
}

let factoryPromise: Promise<LuaFactoryCtor> | null = null

async function loadFactory(): Promise<LuaFactoryCtor> {
  if (!factoryPromise) {
    factoryPromise = import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ WASMOON_URL
    ).then((mod: { LuaFactory: LuaFactoryCtor }) => mod.LuaFactory)
  }
  return factoryPromise
}

export function useLua() {
  const [loading, setLoading] = useState(false)

  const run = useCallback(
    async (
      code: string,
      onOutput: (text: string, isError: boolean) => void,
    ): Promise<void> => {
      setLoading(true)
      try {
        const LuaFactory = await loadFactory()
        const factory = new LuaFactory()
        const lua = await factory.createEngine()
        try {
          lua.global.set("print", (...args: unknown[]) => {
            onOutput(args.map((a) => String(a)).join("\t"), false)
          })
          await lua.doString(code)
        } finally {
          lua.global.close()
        }
      } catch (err) {
        onOutput(err instanceof Error ? err.message : String(err), true)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { run, loading }
}
