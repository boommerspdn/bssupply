import { cpSync, existsSync, readdirSync, unlinkSync } from "node:fs"
import { resolve, join } from "node:path"

const root = resolve(".next/standalone")
const output = join(root, "bssupply")
if (!existsSync(join(output, "server.js"))) throw new Error("Standalone server was not generated")
cpSync(resolve("public"), join(output, "public"), { recursive: true })
cpSync(resolve(".next/static"), join(output, ".next/static"), { recursive: true })
cpSync(resolve("ecosystem.config.cjs"), join(root, "ecosystem.config.cjs"))
// Runtime credentials belong to the host, never to a bundled development .env.
for (const directory of [root, output]) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.startsWith(".env")) unlinkSync(join(directory, entry.name))
  }
}
console.log("Prepared standalone server with public assets; environment files excluded")
