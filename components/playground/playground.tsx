"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Play, RotateCcw, Copy, Check, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CodeEditor } from "./code-editor"
import { WebPreview } from "./web-preview"
import { ConsoleOutput, type ConsoleLine } from "./console-output"
import { usePython } from "./use-python"
import { useLua } from "./use-lua"
import {
  DEFAULT_HTML,
  DEFAULT_CSS,
  DEFAULT_JS,
  DEFAULT_PYTHON,
  DEFAULT_LUA,
} from "@/lib/default-code"

type Lang = "web" | "python" | "lua"
type WebTab = "html" | "css" | "js"

const LANGS: { id: Lang; label: string }[] = [
  { id: "web", label: "Web (HTML/CSS/JS)" },
  { id: "python", label: "Python" },
  { id: "lua", label: "Lua" },
]

const STORAGE_KEY = "ziaa-playground-v1"

interface SavedState {
  html: string
  css: string
  js: string
  python: string
  lua: string
  lang: Lang
}

export function Playground() {
  const [lang, setLang] = useState<Lang>("web")
  const [webTab, setWebTab] = useState<WebTab>("html")

  const [html, setHtml] = useState(DEFAULT_HTML)
  const [css, setCss] = useState(DEFAULT_CSS)
  const [js, setJs] = useState(DEFAULT_JS)
  const [python, setPython] = useState(DEFAULT_PYTHON)
  const [lua, setLua] = useState(DEFAULT_LUA)

  const [refreshKey, setRefreshKey] = useState(0)
  const [autoRun, setAutoRun] = useState(true)
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([])
  const [copied, setCopied] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const { run: runPython, loading: pyLoading } = usePython()
  const { run: runLua, loading: luaLoading } = useLua()

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw) as Partial<SavedState>
        if (s.html != null) setHtml(s.html)
        if (s.css != null) setCss(s.css)
        if (s.js != null) setJs(s.js)
        if (s.python != null) setPython(s.python)
        if (s.lua != null) setLua(s.lua)
        if (s.lang) setLang(s.lang)
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    const data: SavedState = { html, css, js, python, lua, lang }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* ignore */
    }
  }, [html, css, js, python, lua, lang, hydrated])

  const pushConsole = useCallback((line: ConsoleLine) => {
    setConsoleLines((prev) => [...prev, line])
  }, [])

  const runWeb = useCallback(() => {
    setConsoleLines([])
    setRefreshKey((k) => k + 1)
  }, [])

  const runScript = useCallback(async () => {
    setConsoleLines([])
    const onOutput = (text: string, isError: boolean) =>
      pushConsole({ type: isError ? "error" : "log", text })
    if (lang === "python") {
      pushConsole({ type: "info", text: "Running Python (Pyodide)…" })
      setConsoleLines([])
      await runPython(python, onOutput)
    } else if (lang === "lua") {
      await runLua(lua, onOutput)
    }
  }, [lang, python, lua, runPython, runLua, pushConsole])

  const handleRun = useCallback(() => {
    if (lang === "web") runWeb()
    else runScript()
  }, [lang, runWeb, runScript])

  // Auto-run for web
  useEffect(() => {
    if (lang !== "web" || !autoRun) return
    const t = setTimeout(() => setRefreshKey((k) => k + 1), 500)
    return () => clearTimeout(t)
  }, [html, css, js, lang, autoRun])

  const currentValue = useCallback(() => {
    switch (lang) {
      case "python":
        return python
      case "lua":
        return lua
      default:
        return webTab === "html" ? html : webTab === "css" ? css : js
    }
  }, [lang, webTab, html, css, js, python, lua])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentValue())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [currentValue])

  const handleReset = useCallback(() => {
    if (lang === "python") setPython(DEFAULT_PYTHON)
    else if (lang === "lua") setLua(DEFAULT_LUA)
    else {
      setHtml(DEFAULT_HTML)
      setCss(DEFAULT_CSS)
      setJs(DEFAULT_JS)
    }
  }, [lang])

  const scriptLoading = pyLoading || luaLoading

  // Editor config per current view
  const editorLang =
    lang === "python"
      ? "python"
      : lang === "lua"
        ? "lua"
        : webTab === "html"
          ? "html"
          : webTab === "css"
            ? "css"
            : "javascript"

  const editorValue = currentValue()
  const setEditorValue = (v: string) => {
    if (lang === "python") setPython(v)
    else if (lang === "lua") setLua(v)
    else if (webTab === "html") setHtml(v)
    else if (webTab === "css") setCss(v)
    else setJs(v)
  }

  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card/40 px-4 py-2.5">
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                lang === l.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {lang === "web" && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="size-3.5 accent-[var(--primary)]"
              />
              Auto-run
            </label>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button size="sm" onClick={handleRun} disabled={scriptLoading} className="gap-1.5">
            {scriptLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        {/* Editor pane */}
        <div className="flex min-h-0 flex-col border-b border-border lg:border-b-0 lg:border-r">
          {lang === "web" && (
            <div className="flex items-center gap-1 border-b border-border bg-[#1a1d23] px-2 py-1.5">
              {(["html", "css", "js"] as WebTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setWebTab(t)}
                  className={cn(
                    "rounded px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
                    webTab === t
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <div ref={editorRef} className="min-h-0 flex-1">
            <CodeEditor
              language={editorLang}
              value={editorValue}
              onChange={setEditorValue}
            />
          </div>
        </div>

        {/* Output pane */}
        <div className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-border bg-[#1a1d23] px-3 py-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {lang === "web" ? "Preview" : "Console"}
            </span>
            {lang !== "web" && consoleLines.length > 0 && (
              <button
                onClick={() => setConsoleLines([])}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="size-3.5" />
                Clear
              </button>
            )}
          </div>

          {lang === "web" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <WebPreview
                  html={html}
                  css={css}
                  js={js}
                  refreshKey={refreshKey}
                  onConsole={pushConsole}
                />
              </div>
              <div className="h-40 shrink-0 border-t border-border">
                <div className="flex items-center justify-between border-b border-border bg-[#1a1d23] px-3 py-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Console
                  </span>
                  {consoleLines.length > 0 && (
                    <button
                      onClick={() => setConsoleLines([])}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="h-[calc(100%-1.75rem)]">
                  <ConsoleOutput
                    lines={consoleLines}
                    empty="console.log output appears here."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1">
              <ConsoleOutput
                lines={consoleLines}
                empty={
                  scriptLoading
                    ? "Loading runtime…"
                    : `Press Run to execute your ${lang === "python" ? "Python" : "Lua"} code.`
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
