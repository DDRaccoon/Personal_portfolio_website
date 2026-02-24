// 作品数据模块 - 适配本地存储系统
import { 
  getAllWorks, 
  getWorksByCategory, 
  getWorkBySlug 
} from '../../lib/worksStore';

// 兼容性函数 - 将本地存储数据转换为旧格式
function adaptWorkData(work) {
  return {
    ...work,
    title: work.title_en,
    summary: work.summary_en,
    featured: true, // 暂时全部设为featured
    order: 1, // 暂时固定排序
    layout: 'single' // 暂时固定布局
  };
}

// 获取所有作品（兼容旧接口）
export const allWorks = getAllWorks().map(adaptWorkData);

// 获取首页展示的作品（兼容旧接口）
export const getFeaturedWorks = () => {
  return getAllWorks()
    .map(adaptWorkData)
    .filter(work => work.featured)
    .sort((a, b) => a.order - b.order);
};

// 根据分类获取作品（兼容旧接口）
export const getWorksByCategoryCompat = (category: string) => {
  return getWorksByCategory(category)
    .map(adaptWorkData)
    .sort((a, b) => a.order - b.order);
};

// 根据slug获取单个作品（兼容旧接口）
export const getWorkBySlugCompat = (slug: string) => {
  const work = getWorkBySlug(slug);
  return work ? adaptWorkData(work) : undefined;
};

// 获取所有作品的slug列表（兼容旧接口）
export const getAllWorkSlugs = () => {
  return getAllWorks().map(work => work.slug);
};

// 导出本地存储操作（供Editor使用）
export { 
  createWork, 
  updateWork, 
  deleteWork 
} from '../../lib/worksStore';