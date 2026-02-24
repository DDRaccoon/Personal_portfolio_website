// 作品本地存储管理模块
const STORAGE_KEY = "technical-artist-works";
const WORKS_UPDATED_EVENT = "works:updated";

// 数据模型（英文字段）
const createWorkSchema = {
  id: "", // 唯一标识
  slug: "", // URL友好标识
  category: "", // 分类：'full-game' | 'demos' | 'tools' | 'shader'
  title_en: "", // 英文标题
  summary_en: "", // 英文简介
  cover: "", // 封面图片路径
  tags: [], // 技术标签
  year: new Date().getFullYear(), // 完成年份
  blocks: [], // 内容块数组
  title_zh: "",
  summary_zh: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function toSlug(input) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `work-${Date.now()}`;
}

function emitWorksUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WORKS_UPDATED_EVENT));
}

// 获取所有作品
function getAllWorks() {
  // 确保在客户端环境下运行
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading works from localStorage:", error);
    return [];
  }
}

// 保存所有作品
function saveAllWorks(works) {
  // 确保在客户端环境下运行
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    emitWorksUpdated();
    return true;
  } catch (error) {
    console.error("Error saving works to localStorage:", error);
    return false;
  }
}

// 根据ID获取作品
function getWorkById(id) {
  const works = getAllWorks();
  return works.find((work) => work.id === id);
}

// 根据slug获取作品
function getWorkBySlug(slug) {
  const works = getAllWorks();
  return works.find((work) => work.slug === slug);
}

// 根据分类获取作品
function getWorksByCategory(category) {
  const works = getAllWorks();
  return works
    .filter((work) => work.category === category)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// 创建新作品
function createWork(workData) {
  const works = getAllWorks();

  const safeSlug = toSlug(workData.slug || workData.title_en);
  const newWork = {
    ...createWorkSchema,
    ...workData,
    id: `work-${Date.now()}`,
    slug: safeSlug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 确保slug唯一
  const slugExists = works.some((work) => work.slug === newWork.slug);
  if (slugExists) {
    newWork.slug = `${newWork.slug}-${Date.now()}`;
  }

  works.push(newWork);
  const success = saveAllWorks(works);
  return success ? newWork : null;
}

// 更新作品
function updateWork(id, updates) {
  const works = getAllWorks();
  const index = works.findIndex((work) => work.id === id);

  if (index === -1) return null;

  const maybeUpdatedSlug = updates.slug || (updates.title_en ? toSlug(updates.title_en) : works[index].slug);

  works[index] = {
    ...works[index],
    ...updates,
    slug: maybeUpdatedSlug,
    updatedAt: new Date().toISOString(),
  };

  const success = saveAllWorks(works);
  return success ? works[index] : null;
}

// 删除作品
function deleteWork(id) {
  const works = getAllWorks();
  const filteredWorks = works.filter((work) => work.id !== id);
  return saveAllWorks(filteredWorks);
}

// 导出/导入功能（P1）
function exportWorks() {
  const works = getAllWorks();
  return JSON.stringify(works, null, 2);
}

function importWorks(jsonData) {
  try {
    const works = JSON.parse(jsonData);
    // 验证数据格式
    if (Array.isArray(works) && works.every((work) => work.id && work.slug)) {
      return saveAllWorks(works);
    }
    return false;
  } catch (error) {
    console.error("Error importing works:", error);
    return false;
  }
}

export {
  getAllWorks,
  getWorkById,
  getWorkBySlug,
  getWorksByCategory,
  createWork,
  updateWork,
  deleteWork,
  exportWorks,
  importWorks,
  saveAllWorks,
  WORKS_UPDATED_EVENT,
  toSlug,
};