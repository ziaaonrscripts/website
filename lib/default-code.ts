export const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <h1 id="title">Hello from Ziaa Viewer</h1>
  <p>Edit the HTML, CSS and JS and watch it update live.</p>
  <button id="btn">Click me</button>
</body>
</html>`

export const DEFAULT_CSS = `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 1rem;
  background: #0f172a;
  color: #e2e8f0;
  text-align: center;
}
h1 { color: #22d3ee; }
button {
  padding: 0.6rem 1.2rem;
  border: 0;
  border-radius: 8px;
  background: #22d3ee;
  color: #06141b;
  font-weight: 600;
  cursor: pointer;
}`

export const DEFAULT_JS = `const btn = document.getElementById("btn");
let count = 0;
btn.addEventListener("click", () => {
  count++;
  document.getElementById("title").textContent =
    "Clicked " + count + " time" + (count === 1 ? "" : "s");
  console.log("Button clicked:", count);
});`

export const DEFAULT_PYTHON = `# Real Python via Pyodide (WebAssembly)
import sys
import math

print("Python", sys.version.split()[0])

def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print("First 10 Fibonacci:", [fib(i) for i in range(10)])
print("pi =", round(math.pi, 5))
`

export const DEFAULT_LUA = `-- Lua via Wasmoon (WebAssembly)
print("Hello from Lua!")

local function factorial(n)
  if n <= 1 then return 1 end
  return n * factorial(n - 1)
end

for i = 1, 6 do
  print(i .. "! = " .. factorial(i))
end
`
