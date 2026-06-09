import {
  Code2,
  FileCode2,
  Terminal,
  Sparkles,
  Wrench,
  Eye,
  Braces,
  Palette,
  Share2,
  Zap,
} from "lucide-react"

const FEATURES = [
  {
    icon: Eye,
    title: "Live web preview",
    desc: "HTML, CSS and JavaScript render in a sandboxed iframe as you type — instant, safe, and accurate.",
  },
  {
    icon: Terminal,
    title: "Real Python runtime",
    desc: "Pyodide runs a full CPython environment in WebAssembly. Import the standard library and print to the console.",
  },
  {
    icon: FileCode2,
    title: "Lua execution",
    desc: "Run Lua scripts in-browser with Wasmoon. Perfect for game logic, scripting, and quick experiments.",
  },
  {
    icon: Sparkles,
    title: "Built-in AI assistant",
    desc: "Ask coding questions, debug errors, or generate snippets with a powerful reasoning model — right beside your code.",
  },
  {
    icon: Code2,
    title: "Pro editor",
    desc: "The Monaco editor (the engine behind VS Code) brings syntax highlighting, line numbers, and IntelliSense.",
  },
  {
    icon: Wrench,
    title: "Developer utilities",
    desc: "Format JSON, encode Base64, convert colors, generate hashes, test regex and more — a whole toolbox.",
  },
  {
    icon: Braces,
    title: "Multi-language",
    desc: "Switch between web, Python and Lua without losing your work. Each language keeps its own buffer.",
  },
  {
    icon: Palette,
    title: "Beautiful by default",
    desc: "A focused, dark, distraction-free interface designed for long coding sessions.",
  },
  {
    icon: Share2,
    title: "Save & share",
    desc: "Your snippets persist locally so you can pick up where you left off and copy code in one click.",
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <Zap className="size-3.5 text-primary" />
          Everything you need
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Much more than a compiler
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Ziaa Viewer combines an editor, multiple runtimes, an AI assistant and
          a full set of utilities into one fast workspace.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
              <f.icon className="size-5 text-primary" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
