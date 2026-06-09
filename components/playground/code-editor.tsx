"use client"

import Editor, { type OnMount } from "@monaco-editor/react"
import { useRef } from "react"

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  height?: string | number
}

export function CodeEditor({
  language,
  value,
  onChange,
  height = "100%",
}: CodeEditorProps) {
  const defined = useRef(false)

  const handleMount: OnMount = (_editor, monaco) => {
    if (!defined.current) {
      monaco.editor.defineTheme("ziaa", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1a1d23",
          "editor.lineHighlightBackground": "#22262e",
          "editorLineNumber.foreground": "#4b5563",
          "editorCursor.foreground": "#22d3ee",
          "editor.selectionBackground": "#164e63aa",
        },
      })
      defined.current = true
    }
    monaco.editor.setTheme("ziaa")
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={handleMount}
      theme="ziaa"
      options={{
        fontSize: 13,
        fontFamily: "var(--font-geist-mono), monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        padding: { top: 14 },
        tabSize: 2,
        automaticLayout: true,
        lineNumbersMinChars: 3,
        renderLineHighlight: "all",
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      }}
      loading={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading editor…
        </div>
      }
    />
  )
}
