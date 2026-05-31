import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const snapshotPath = path.join(rootDir, "src", "content", "works", "works-snapshot.json");
const publicMediaDir = path.join(rootDir, "public", "works-media");
const storagePrefix = "/storage/v1/object/public/works-media/";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getLocalPathForUrl(value) {
  if (typeof value !== "string") return null;

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const markerIndex = url.pathname.indexOf(storagePrefix);
  if (markerIndex === -1) return null;

  const objectPath = decodeURIComponent(url.pathname.slice(markerIndex + storagePrefix.length));
  if (!objectPath || objectPath.includes("..")) return null;

  const diskPath = path.resolve(publicMediaDir, objectPath);
  const publicPath = `/works-media/${objectPath.split("/").map(encodeURIComponent).join("/")}`;

  if (!diskPath.startsWith(path.resolve(publicMediaDir))) {
    throw new Error(`Refusing to write outside public media directory: ${diskPath}`);
  }

  return { diskPath, publicPath, url: value };
}

function collectMediaUrls(value, urls = new Map()) {
  const media = getLocalPathForUrl(value);
  if (media) {
    urls.set(media.url, media);
    return urls;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectMediaUrls(item, urls);
  } else if (isObject(value)) {
    for (const item of Object.values(value)) collectMediaUrls(item, urls);
  }

  return urls;
}

function rewriteMediaUrls(value, urlMap) {
  const media = getLocalPathForUrl(value);
  if (media && urlMap.has(media.url)) {
    return urlMap.get(media.url).publicPath;
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteMediaUrls(item, urlMap));
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteMediaUrls(item, urlMap)])
    );
  }

  return value;
}

async function fileSize(pathname) {
  try {
    return (await stat(pathname)).size;
  } catch {
    return null;
  }
}

async function downloadMedia(media) {
  const response = await fetch(media.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${media.url} (${response.status})`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const existingSize = await fileSize(media.diskPath);
  if (existingSize === bytes.byteLength) {
    return { skipped: true, bytes: bytes.byteLength };
  }

  await mkdir(path.dirname(media.diskPath), { recursive: true });
  await writeFile(`${media.diskPath}.tmp`, bytes);
  await rename(`${media.diskPath}.tmp`, media.diskPath);
  return { skipped: false, bytes: bytes.byteLength };
}

const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
const mediaItems = [...collectMediaUrls(snapshot).values()];

let totalBytes = 0;
let downloaded = 0;
let skipped = 0;

for (const media of mediaItems) {
  const result = await downloadMedia(media);
  totalBytes += result.bytes;
  if (result.skipped) {
    skipped += 1;
  } else {
    downloaded += 1;
  }
}

const rewritten = rewriteMediaUrls(snapshot, new Map(mediaItems.map((item) => [item.url, item])));
await writeFile(`${snapshotPath}.tmp`, `${JSON.stringify(rewritten, null, 2)}\n`, "utf8");
await rename(`${snapshotPath}.tmp`, snapshotPath);

console.log(
  `Mirrored ${mediaItems.length} media files (${downloaded} downloaded, ${skipped} unchanged, ${(totalBytes / 1024 / 1024).toFixed(2)} MB) to public/works-media`
);
