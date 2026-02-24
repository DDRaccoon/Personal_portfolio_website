// 作品本地存储管理模块
const STORAGE_KEY = 'technical-artist-works';

// 数据模型（英文字段）
const createWorkSchema = {
  id: '',              // 唯一标识
  slug: '',            // URL友好标识
  category: '',        // 分类：'full-game' | 'demos' | 'tools' | 'shader'
  title_en: '',        // 英文标题
  summary_en: '',      // 英文简介
  cover: '',           // 封面图片路径
  tags: [],            // 技术标签
  year: new Date().getFullYear(), // 完成年份
  blocks: [],          // 内容块数组
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// 获取所有作品
function getAllWorks() {
  // 确保在客户端环境下运行
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading works from localStorage:', error);
    return [];
  }
}

// 保存所有作品
function saveAllWorks(works) {
  // 确保在客户端环境下运行
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    return true;
  } catch (error) {
    console.error('Error saving works to localStorage:', error);
    return false;
  }
}

// 根据ID获取作品
function getWorkById(id) {
  const works = getAllWorks();
  return works.find(work => work.id === id);
}

// 根据slug获取作品
function getWorkBySlug(slug) {
  const works = getAllWorks();
  return works.find(work => work.slug === slug);
}

// 根据分类获取作品
function getWorksByCategory(category) {
  const works = getAllWorks();
  return works
    .filter(work => work.category === category)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// 创建新作品
function createWork(workData) {
  const works = getAllWorks();
  const newWork = {
    ...createWorkSchema,
    ...workData,
    id: `work-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 确保slug唯一
  const slugExists = works.some(work => work.slug === newWork.slug);
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
  const index = works.findIndex(work => work.id === id);
  
  if (index === -1) return null;
  
  works[index] = {
    ...works[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  const success = saveAllWorks(works);
  return success ? works[index] : null;
}

// 删除作品
function deleteWork(id) {
  const works = getAllWorks();
  const filteredWorks = works.filter(work => work.id !== id);
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
    if (Array.isArray(works) && works.every(work => work.id && work.slug)) {
      return saveAllWorks(works);
    }
    return false;
  } catch (error) {
    console.error('Error importing works:', error);
    return false;
  }
}

// 初始化示例数据（如果存储为空）
function initializeWithSampleData() {
  const existingWorks = getAllWorks();
  if (existingWorks.length === 0) {
    const sampleWorks = [
      {
        id: 'work-sample-1',
        slug: 'unreal-engine-environment',
        category: 'full-game',
        title_en: 'Unreal Engine 5 Environment Art',
        summary_en: 'High-quality environment art created with UE5, showcasing real-time rendering and material systems',
        cover: '/images/works/ue5-environment-cover.jpg',
        tags: ['Unreal Engine 5', 'Environment Art', 'Real-time Rendering'],
        year: 2024,
        blocks: [
          {
            type: 'RichText',
            id: 'intro',
            content: '# Unreal Engine 5 Environment Art\n\nThis project showcases my environment art creation capabilities in Unreal Engine 5.'
          }
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'work-sample-2',
        slug: 'procedural-tool-development',
        category: 'tools',
        title_en: 'Procedural Tool Development',
        summary_en: 'Houdini and Python-based procedural tool development for enhancing environment art production efficiency',
        cover: '/images/works/procedural-tools-cover.jpg',
        tags: ['Houdini', 'Python', 'Procedural Generation', 'Tool Development'],
        year: 2024,
        blocks: [
          {
            type: 'RichText',
            id: 'intro',
            content: '# Procedural Tool Development\n\nThis project focuses on developing Houdini-based procedural tools for automated environment asset generation.'
          }
        ],
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 'work-sample-3',
        slug: 'character-art-portfolio',
        category: 'demos',
        title_en: 'Character Art Portfolio',
        summary_en: 'High-quality character art showcasing the complete workflow from concept to final rendering',
        cover: '/images/works/character-art-cover.jpg',
        tags: ['Character Art', 'ZBrush', 'Marmoset Toolbag', 'Substance Painter'],
        year: 2024,
        blocks: [
          {
            type: 'RichText',
            id: 'intro',
            content: '# Character Art Portfolio\n\nThis portfolio showcases my skills as a character artist, covering the complete production workflow.'
          }
        ],
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z'
      }
    ];
    
    saveAllWorks(sampleWorks);
    console.log('Sample works initialized');
  }
}

// 自动初始化示例数据
if (typeof window !== 'undefined') {
  initializeWithSampleData();
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
  initializeWithSampleData
};