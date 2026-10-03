import { copyFileSync, existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const output = join(process.cwd(), "out");

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(file);
      continue;
    }
    if (!entry.name.endsWith(".txt")) continue;

    const parts = relative(output, file).split(sep);
    const index = parts.findIndex((part) => part.startsWith("__next."));
    if (index < 0 || index === parts.length - 1) continue;

    const routeDirectory = join(output, ...parts.slice(0, index));
    const alias = join(routeDirectory, parts.slice(index).join("."));
    if (!existsSync(alias)) copyFileSync(file, alias);
  }
}

visit(output);
