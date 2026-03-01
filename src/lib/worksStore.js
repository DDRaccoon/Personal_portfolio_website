const WORKS_UPDATED_EVENT = "works:updated";

function toSlug(input) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `work-${Date.now()}`;
}

async function uploadVideoFile(file, { workId } = {}) {
  if (!file) {
    throw new Error("Missing video file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  if (workId) {
    formData.append("workId", workId);
  }

  const response = await fetch("/api/uploads/video", {
    method: "POST",
    body: formData,
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

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.error) ||
      (typeof data === "string" && data.trim()) ||
      `Upload failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function uploadImageFile(file, { workId } = {}) {
  if (!file) {
    throw new Error("Missing image file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  if (workId) {
    formData.append("workId", workId);
  }

  const response = await fetch("/api/uploads/image", {
    method: "POST",
    body: formData,
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

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.error) ||
      (typeof data === "string" && data.trim()) ||
      `Upload failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

function emitWorksUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WORKS_UPDATED_EVENT));
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.error) ||
      (typeof data === "string" && data.trim()) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

async function getAllWorks() {
  try {
    return await request("/api/works");
  } catch (error) {
    console.error("Error loading works from CMS:", error);
    return [];
  }
}

async function getWorkById(id) {
  if (!id) return null;
  try {
    return await request(`/api/works/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

async function getWorkBySlug(slug) {
  if (!slug) return null;
  try {
    return await request(`/api/works/slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

async function getWorksByCategory(category) {
  const works = await getAllWorks();
  return works
    .filter((work) => work.category === category)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

async function createWork(workData) {
  try {
    const created = await request("/api/works", {
      method: "POST",
      body: JSON.stringify({
        ...workData,
        slug: toSlug(workData.slug || workData.title_en),
      }),
    });
    emitWorksUpdated();
    return created;
  } catch (error) {
    console.error("Error creating work in CMS:", error);
    return null;
  }
}

async function updateWork(id, updates) {
  if (!id) return null;
  try {
    const updated = await request(`/api/works/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    emitWorksUpdated();
    return updated;
  } catch (error) {
    console.error("Error updating work in CMS:", error);
    return null;
  }
}

async function deleteWork(id) {
  if (!id) return false;
  try {
    await request(`/api/works/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    emitWorksUpdated();
    return true;
  } catch (error) {
    console.error("Error deleting work from CMS:", error);
    return false;
  }
}

async function exportWorks() {
  const works = await getAllWorks();
  return JSON.stringify(works, null, 2);
}

async function importWorks() {
  throw new Error("Bulk import is not implemented for CMS mode yet.");
}

async function saveAllWorks() {
  throw new Error("saveAllWorks is not supported in CMS mode.");
}

export {
  getAllWorks,
  getWorkById,
  getWorkBySlug,
  getWorksByCategory,
  createWork,
  uploadImageFile,
  uploadVideoFile,
  updateWork,
  deleteWork,
  exportWorks,
  importWorks,
  saveAllWorks,
  WORKS_UPDATED_EVENT,
  toSlug,
};