import fs from "fs";
import path from "path";
import archiver from "archiver";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "exported");
const OUT_ZIP = path.join(OUT_DIR, "edukids-export.zip");
const EXPORT_ROOT = "edukids-export"; // folder root inside zip

const includeEntries = [
  "package.json",
  "package-lock.json",
  "README.md",
  "README_EXPORT.md",
  "vercel.json",
  "vite.config.ts",
  "index.html",
  "public",
  "src",
  "scripts",
  "supabase",
  "twa-manifest.json"
];

// Exclude heavy or platform-native folders by not including them:
// node_modules, .git, dist, build, android (they will be skipped automatically)

function exists(p) {
  try {
    return fs.existsSync(path.join(ROOT, p));
  } catch {
    return false;
  }
}

async function buildZip() {
  // Ensure output dir exists
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Remove previous zip if present
  if (fs.existsSync(OUT_ZIP)) {
    fs.unlinkSync(OUT_ZIP);
  }

  const output = fs.createWriteStream(OUT_ZIP);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`Export complete: ${OUT_ZIP} (${archive.pointer()} total bytes)`);
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.warn("Archiver warning:", err.message);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  for (const entry of includeEntries) {
    if (!exists(entry)) {
      // skip if missing
      continue;
    }

    const fullPath = path.join(ROOT, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Add directory under EXPORT_ROOT. Use a filter to skip unwanted nested folders if present.
      archive.directory(fullPath, path.posix.join(EXPORT_ROOT, entry), (entryData) => {
        // Skip node_modules, .git, dist, build, android within directories
        const name = entryData.name;
        if (!name) return false;
        const lower = name.toLowerCase();
        if (lower.includes("node_modules") || lower.includes(".git/") || lower.includes("/dist") || lower.includes("/build") || lower.includes("/android")) {
          return false;
        }
        return true;
      });
    } else if (stats.isFile()) {
      archive.file(fullPath, { name: path.posix.join(EXPORT_ROOT, entry) });
    }
  }

  // Also include a small manifest describing the export
  const manifest = {
    exported_at: new Date().toISOString(),
    files: includeEntries.filter(exists),
    excluded: ["node_modules", ".git", "dist", "build", "android"]
  };
  archive.append(JSON.stringify(manifest, null, 2), { name: path.posix.join(EXPORT_ROOT, "export-manifest.json") });

  await archive.finalize();
}

buildZip().catch((err) => {
  console.error("Failed to create export:", err);
  process.exit(1);
});