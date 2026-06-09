"use client"

import { useEffect, useRef } from "react"
import type { ConsoleLine } from "./console-output"

interface WebPreviewProps {
  html: string
  css: string
  js: string
  onConsole: (line: ConsoleLine) => void
  refreshKey: number
}

export function WebPreview({ html, css, js, onConsole, refreshKey }: WebPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.__ziaa_console) {
        onConsole({ type: e.data.level, text: e.data.text })
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onConsole])

  const bridge = `
    <script>
      (function () {
        function send(level, args) {
          var text = Array.prototype.map.call(args, function (a) {
            try {
              return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a);
            } catch (e) { return String(a); }
          }).join(" ");
          parent.postMessage({ __ziaa_console: true, level: level, text: text }, "*");
        }
        ["log", "info", "warn", "error"].forEach(function (m) {
          var orig = console[m];
          console[m] = function () { send(m === "info" ? "info" : m, arguments); orig.apply(console, arguments); };
        });
        window.addEventListener("error", function (e) {
          send("error", [e.message + (e.lineno ? " (line " + e.lineno + ")" : "")]);
        });
        window.addEventListener("unhandledrejection", function (e) {
          send("error", ["Unhandled promise rejection: " + (e.reason && e.reason.message ? e.reason.message : e.reason)]);
        });
      })();
    <\/script>
  `

  const headInjected = html.includes("</head>")
    ? html.replace("</head>", `<style>${css}</style></head>`)
    : `<style>${css}</style>` + html

  const srcDoc = headInjected.includes("</body>")
    ? headInjected.replace("</body>", `${bridge}<script>\ntry{\n${js}\n}catch(e){console.error(e.message)}\n<\/script></body>`)
    : `${headInjected}${bridge}<script>\ntry{\n${js}\n}catch(e){console.error(e.message)}\n<\/script>`

  return (
    <iframe
      key={refreshKey}
      ref={iframeRef}
      title="Live preview"
      sandbox="allow-scripts allow-modals allow-forms allow-popups"
      srcDoc={srcDoc}
      className="h-full w-full border-0 bg-white"
    />
  )
}
