import worksSnapshot from "../content/works/works-snapshot.json";

const STORAGE_MEDIA_PREFIX = "/storage/v1/object/public/works-media/";
let snapshotMediaPaths = null;

function toSlug(input) {
  return (
    (input || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "work"
  );
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function numberOrFallback(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function timeValue(value) {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeWork(work, index = 0) {
  const source = work || {};
  const id = String(source.id || `snapshot-work-${index + 1}`);
  const titleEn = source.title_en || source.title || "";
  const slug = String(source.slug || toSlug(titleEn || id));
  const createdAt = source.createdAt || source.created_at || "";
  const updatedAt = source.updatedAt || source.updated_at || createdAt;

  return localizeKnownMediaUrls({
    id,
    slug,
    category: source.category || "full-game",
    title_en: titleEn,
    title_zh: source.title_zh || "",
    summary_en: source.summary_en || source.summary || "",
    summary_zh: source.summary_zh || "",
    cover: source.cover || "",
    tags: normalizeArray(source.tags),
    year: numberOrFallback(source.year, null),
    sort_order: numberOrFallback(source.sort_order ?? source.order, index),
    blocks: normalizeArray(source.blocks),
    createdAt,
    updatedAt,
  });
}

function toLocalWorksMediaPath(value) {
  if (typeof value !== "string") return null;

  let url = null;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const markerIndex = url.pathname.indexOf(STORAGE_MEDIA_PREFIX);
  if (markerIndex === -1) return null;

  const objectPath = decodeURIComponent(url.pathname.slice(markerIndex + STORAGE_MEDIA_PREFIX.length));
  if (!objectPath || objectPath.includes("..")) return null;

  return `/works-media/${objectPath.split("/").map(encodeURIComponent).join("/")}`;
}

function collectSnapshotMediaPaths(value, paths = new Set()) {
  if (typeof value === "string") {
    if (value.startsWith("/works-media/")) {
      paths.add(value);
    }
    return paths;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectSnapshotMediaPaths(item, paths);
    return paths;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectSnapshotMediaPaths(item, paths);
  }

  return paths;
}

function getSnapshotMediaPaths() {
  if (!snapshotMediaPaths) {
    snapshotMediaPaths = collectSnapshotMediaPaths(worksSnapshot);
  }
  return snapshotMediaPaths;
}

export function localizeKnownMediaUrls(value) {
  const localPath = toLocalWorksMediaPath(value);
  if (localPath && getSnapshotMediaPaths().has(localPath)) {
    return localPath;
  }

  if (Array.isArray(value)) {
    return value.map(localizeKnownMediaUrls);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeKnownMediaUrls(item)])
    );
  }

  return value;
}

export function sortWorks(works) {
  return [...works].sort((a, b) => {
    const orderDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return timeValue(b.updatedAt || b.createdAt) - timeValue(a.updatedAt || a.createdAt);
  });
}

export function normalizeWorks(works) {
  return sortWorks(normalizeArray(works).map(normalizeWork));
}

export function findWorkById(works, id) {
  if (!id) return null;
  const target = String(id);
  return normalizeWorks(works).find((work) => String(work.id) === target) || null;
}

export function findWorkBySlug(works, slug) {
  if (!slug) return null;
  const rawTarget = String(slug).trim();
  const normalizedTarget = toSlug(rawTarget);

  return (
    normalizeWorks(works).find((work) => {
      const candidate = String(work.slug || "").trim();
      return candidate === rawTarget || toSlug(candidate) === normalizedTarget;
    }) || null
  );
}

export function getStaticWorks() {
  return normalizeWorks(worksSnapshot);
}

export function getStaticWorksByCategory(category) {
  return getStaticWorks().filter((work) => work.category === category);
}

export function getStaticWorkById(id) {
  return findWorkById(worksSnapshot, id);
}

export function getStaticWorkBySlug(slug) {
  return findWorkBySlug(worksSnapshot, slug);
}
