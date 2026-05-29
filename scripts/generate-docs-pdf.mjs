/**
 * Generates Voice-of-Law-Project-Documentation.pdf from README.md
 * Run: node scripts/generate-docs-pdf.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const readmePath = join(root, "README.md");
const outPath = join(root, "Voice-of-Law-Project-Documentation.pdf");

async function main() {
  const { mdToPdf } = await import("md-to-pdf");
  const pdf = await mdToPdf(
    { path: readmePath },
    {
      dest: outPath,
      pdf_options: {
        format: "A4",
        margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
        printBackground: true,
      },
      stylesheet: join(__dirname, "pdf-styles.css"),
    }
  );
  if (pdf?.filename) {
    console.log("PDF created:", pdf.filename);
  } else {
    writeFileSync(outPath, pdf.content);
    console.log("PDF created:", outPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
