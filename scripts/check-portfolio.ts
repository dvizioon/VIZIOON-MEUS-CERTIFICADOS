import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import portfolio from "../src/data/portfolio.json";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
let ok = true;

function previewFor(filePath: string) {
  const name = filePath.split("/").pop() ?? "file";
  const base = name.replace(/\.(pdf|png|jpe?g|webp)$/i, "");
  return `/certificates/previews/${base}.png`;
}

for (const cert of portfolio.certificates) {
  console.assert(cert.files.length > 0, `${cert.id}: sem arquivos`);
  if (cert.files.length === 0) ok = false;
  for (const file of cert.files) {
    const abs = join(publicDir, file.path);
    if (!existsSync(abs)) {
      console.error(`missing file: ${file.path} (${cert.id})`);
      ok = false;
    }
  }
  const primary = cert.files[0];
  if (primary) {
    const preview = previewFor(primary.path);
    if (!existsSync(join(publicDir, preview))) {
      console.error(`missing preview: ${preview} (${cert.id})`);
      ok = false;
    }
  }
}

const featured = portfolio.certificates.filter((c) => c.featured);
console.assert(featured.length >= 1, "precisa de ao menos 1 featured");
if (featured.length < 1) ok = false;

if (!ok) process.exit(1);
console.log(
  `ok: ${portfolio.certificates.length} certificados + previews presentes`,
);
