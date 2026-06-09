"use client"

import { useCallback, useRef, useState } from "react"

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL: string }) => Promise<PyodideInstance>
  }
}

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (opts: { batched: (s: string) => void }) => void
  setStderr: (opts: { batched: (s: string) => void }) => void
}

const PYODIDE_VERSION = "0.26.2"
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let pyodidePromise: Promise<PyodideInstance> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement("script")
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("Failed to load " + src))
    document.head.appendChild(s)
  })
}

export function usePython() {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const instanceRef = useRef<PyodideInstance | null>(null)

  const ensure = useCallback(async () => {
    if (instanceRef.current) return instanceRef.current
    if (!pyodidePromise) {
      pyodidePromise = (async () => {
        await loadScript(PYODIDE_URL + "pyodide.js")
        if (!window.loadPyodide) throw new Error("Pyodide failed to load")
        return window.loadPyodide({ indexURL: PYODIDE_URL })
      })()
    }
    const inst = await pyodidePromise
    instanceRef.current = inst
    return inst
  }, [])

  const run = useCallback(
    async (
      code: string,
      onOutput: (text: string, isError: boolean) => void,
    ): Promise<void> => {
      setLoading(true)
      try {
        const py = await ensure()
        setReady(true)
        py.setStdout({ batched: (s) => onOutput(s, false) })
        py.setStderr({ batched: (s) => onOutput(s, true) })
        await py.runPythonAsync(code)
      } catch (err) {
        onOutput(err instanceof Error ? err.message : String(err), true)
      } finally {
        setLoading(false)
      }
    },
    [ensure],
  )

  return { run, loading, ready }
}
