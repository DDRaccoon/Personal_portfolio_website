const WORKS_TABLE = process.env.SUPABASE_WORKS_TABLE || "works";
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "works-media";
const ADMIN_COOKIE = "cms_admin";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getSupabaseBaseUrl() {
  const raw = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  return raw.replace(/\/$/, "");
}

function getSupabaseServiceRoleKey() {
  return getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function getStorageBucket() {
  return STORAGE_BUCKET;
}

export function toSlug(input) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `work-${Date.now()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  return `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toDbWork(input, { id, slug, createdAt, updatedAt }) {
  return {
    id,
    slug,
    category: input.category,
    title_en: input.title_en,
    title_zh: input.title_zh || "",
    summary_en: input.summary_en,
    summary_zh: input.summary_zh || "",
    cover: input.cover,
    tags: normalizeArray(input.tags),
    year: Number(input.year) || new Date().getFullYear(),
    sort_order: Number(input.sort_order) || 0,
    blocks: normalizeArray(input.blocks),
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function fromDbWork(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title_en: row.title_en,
    title_zh: row.title_zh || "",
    summary_en: row.summary_en,
    summary_zh: row.summary_zh || "",
    cover: row.cover,
    tags: normalizeArray(row.tags),
    year: row.year,
    sort_order: row.sort_order ?? 0,
    blocks: normalizeArray(row.blocks),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function supabaseRequest(path, { method = "GET", body, headers = {} } = {}) {
  const baseUrl = getSupabaseBaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  const response = await fetch(`${baseUrl}/rest/v1${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { ok: response.ok, status: response.status, data };
}

function encodeStoragePath(path) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function safePathSegment(value, fallback = "draft") {
  const normalized = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || fallback;
}

function getPublicStorageUrl(path) {
  const baseUrl = getSupabaseBaseUrl();
  const bucket = getStorageBucket();
  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeStoragePath(path)}`;
}

export function isAdminRequest(request) {
  const cookieValue = request.cookies.get(ADMIN_COOKIE)?.value;
  return cookieValue === "1";
}

export async function uploadImageToCmsStorage(file, { workId = "draft" } = {}) {
  if (!file) {
    throw new Error("Missing file");
  }

  const bucket = getStorageBucket();
  const baseUrl = getSupabaseBaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  const ext = (file.name?.split(".").pop() || "png").toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "png";
  const objectPath = `works/${safePathSegment(workId)}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const encodedPath = encodeStoragePath(objectPath);

  const uploadResponse = await fetch(
    `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: file,
      cache: "no-store",
    }
  );

  const text = await uploadResponse.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image (${uploadResponse.status}): ${JSON.stringify(data)}`);
  }

  return {
    path: objectPath,
    url: getPublicStorageUrl(objectPath),
  };
}

export async function uploadVideoToCmsStorage(file, { workId = "draft" } = {}) {
  if (!file) {
    throw new Error("Missing file");
  }

  const bucket = getStorageBucket();
  const baseUrl = getSupabaseBaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  const ext = (file.name?.split(".").pop() || "mp4").toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "mp4";
  const objectPath = `works/${safePathSegment(workId)}/videos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const encodedPath = encodeStoragePath(objectPath);

  const uploadResponse = await fetch(
    `${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": file.type || "video/mp4",
        "x-upsert": "false",
      },
      body: file,
      cache: "no-store",
    }
  );

  const text = await uploadResponse.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload video (${uploadResponse.status}): ${JSON.stringify(data)}`);
  }

  return {
    path: objectPath,
    url: getPublicStorageUrl(objectPath),
  };
}

export async function listWorksFromCms() {
  const result = await supabaseRequest(`/${WORKS_TABLE}?select=*&order=sort_order.asc,created_at.desc`);
  if (!result.ok) {
    throw new Error(`Failed to list works (${result.status}): ${JSON.stringify(result.data)}`);
  }
  return Array.isArray(result.data) ? result.data.map(fromDbWork) : [];
}

export async function getWorkByIdFromCms(id) {
  const result = await supabaseRequest(`/${WORKS_TABLE}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  if (!result.ok) {
    throw new Error(`Failed to get work by id (${result.status}): ${JSON.stringify(result.data)}`);
  }
  return result.data?.[0] ? fromDbWork(result.data[0]) : null;
}

export async function getWorkBySlugFromCms(slug) {
  const trimmedSlug = String(slug || "").trim();
  const normalizedMatchSlug = toSlug(trimmedSlug);

  const all = await listWorksFromCms();
  return (
    all.find((work) => {
      const candidate = String(work?.slug || "").trim();
      return candidate === trimmedSlug || toSlug(candidate) === normalizedMatchSlug;
    }) || null
  );
}

async function ensureUniqueSlug(baseSlug) {
  const check = await supabaseRequest(`/${WORKS_TABLE}?slug=eq.${encodeURIComponent(baseSlug)}&select=id&limit=1`);
  if (!check.ok) {
    throw new Error(`Failed to verify slug (${check.status}): ${JSON.stringify(check.data)}`);
  }
  return check.data?.length ? `${baseSlug}-${Date.now()}` : baseSlug;
}

export async function createWorkInCms(input) {
  const createdAt = nowIso();
  const updatedAt = createdAt;
  const slug = await ensureUniqueSlug(toSlug(input.slug || input.title_en));
  const payload = toDbWork(input, {
    id: createId(),
    slug,
    createdAt,
    updatedAt,
  });

  const result = await supabaseRequest(`/${WORKS_TABLE}`, {
    method: "POST",
    body: payload,
    headers: { Prefer: "return=representation" },
  });

  if (!result.ok || !result.data?.[0]) {
    throw new Error(`Failed to create work (${result.status}): ${JSON.stringify(result.data)}`);
  }

  return fromDbWork(result.data[0]);
}

export async function updateWorkInCms(id, updates) {
  const existing = await getWorkByIdFromCms(id);
  if (!existing) return null;

  const nextSlug = updates.slug || (updates.title_en ? toSlug(updates.title_en) : existing.slug);
  const merged = {
    ...existing,
    ...updates,
    slug: nextSlug,
    updatedAt: nowIso(),
  };

  const payload = toDbWork(merged, {
    id: existing.id,
    slug: merged.slug,
    createdAt: existing.createdAt,
    updatedAt: merged.updatedAt,
  });

  const result = await supabaseRequest(`/${WORKS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
    headers: { Prefer: "return=representation" },
  });

  if (!result.ok || !result.data?.[0]) {
    throw new Error(`Failed to update work (${result.status}): ${JSON.stringify(result.data)}`);
  }

  return fromDbWork(result.data[0]);
}

export async function deleteWorkInCms(id) {
  const result = await supabaseRequest(`/${WORKS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!result.ok) {
    throw new Error(`Failed to delete work (${result.status}): ${JSON.stringify(result.data)}`);
  }

  return true;
}
