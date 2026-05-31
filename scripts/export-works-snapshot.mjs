import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const snapshotPath = path.join(rootDir, "src", "content", "works", "works-snapshot.json");

async function loadEnvFile(fileName) {
  try {
    const content = await readFile(path.join(rootDir, fileName), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getOptionalEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return { name, value };
  }
  return null;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function fromSourceWork(row, index) {
  return {
    id: row.id || `snapshot-work-${index + 1}`,
    slug: row.slug,
    category: row.category || "full-game",
    title_en: row.title_en || row.title || "",
    title_zh: row.title_zh || "",
    summary_en: row.summary_en || row.summary || "",
    summary_zh: row.summary_zh || "",
    cover: row.cover || "",
    tags: normalizeArray(row.tags),
    year: Number(row.year) || new Date().getFullYear(),
    sort_order: row.sort_order ?? 0,
    blocks: normalizeArray(row.blocks),
    createdAt: row.createdAt || row.created_at || "",
    updatedAt: row.updatedAt || row.updated_at || row.createdAt || row.created_at || "",
  };
}

await loadEnvFile(".env.local");
await loadEnvFile(".env");

const sourceUrlArgIndex = process.argv.findIndex((arg) => arg === "--source-url");
const sourceFileArgIndex = process.argv.findIndex((arg) => arg === "--source-file");
const sourceUrl =
  (sourceUrlArgIndex !== -1 && process.argv[sourceUrlArgIndex + 1]) ||
  process.env.WORKS_SNAPSHOT_SOURCE_URL ||
  "";
const sourceFile =
  (sourceFileArgIndex !== -1 && process.argv[sourceFileArgIndex + 1]) ||
  process.env.WORKS_SNAPSHOT_SOURCE_FILE ||
  "";

let response;
if (sourceFile) {
  const fileContent = await readFile(path.resolve(rootDir, sourceFile), "utf8");
  response = {
    ok: true,
    status: 200,
    text: async () => fileContent,
  };
} else if (sourceUrl) {
  response = await fetch(sourceUrl);
} else {
  const baseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const apiKey = getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!apiKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Alternatively set WORKS_SNAPSHOT_SOURCE_URL or pass --source-url https://your-site/api/works."
    );
  }
  const table = process.env.SUPABASE_WORKS_TABLE || "works";
  const url = `${baseUrl}/rest/v1/${encodeURIComponent(table)}?select=*&order=sort_order.asc,created_at.desc`;

  response = await fetch(url, {
    headers: {
      apikey: apiKey.value,
      Authorization: `Bearer ${apiKey.value}`,
    },
  });
}

const text = await response.text();
let data = null;
if (text) {
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
}

if (!response.ok) {
  throw new Error(`Failed to export works (${response.status}): ${JSON.stringify(data)}`);
}

const works = Array.isArray(data) ? data.map(fromSourceWork) : [];
await mkdir(path.dirname(snapshotPath), { recursive: true });
await writeFile(`${snapshotPath}.tmp`, `${JSON.stringify(works, null, 2)}\n`, "utf8");
await rename(`${snapshotPath}.tmp`, snapshotPath);

console.log(`Exported ${works.length} works to ${path.relative(rootDir, snapshotPath)}`);
