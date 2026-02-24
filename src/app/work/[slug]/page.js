'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWorkBySlugCompat } from '../../../content/works';
import WorkOverlay from '../../../components/works/WorkOverlay';
import WorkDetailLayout from '../../../components/works/WorkDetailLayout';

export default function WorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [work, setWork] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    if (params.slug) {
      const foundWork = getWorkBySlugCompat(params.slug);
      if (foundWork) {
        setWork(foundWork);
        setIsOverlayOpen(true);
      } else {
        // 作品不存在，重定向到首页
        router.push('/');
      }
    }
  }, [params.slug, router]);

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    // 延迟重定向，确保动画完成
    setTimeout(() => {
      router.push('/', { scroll: false });
    }, 300);
  };

  // 更新WorkOverlay以使用完整的渲染系统
  const EnhancedWorkOverlay = ({ work, isOpen, onClose }) => {
    if (!isOpen || !work) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-[#1a1a1a]/80 border border-[#333]/50 rounded-full hover:bg-[#ff8c5a]/20 hover:border-[#ff8c5a]/50 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 内容容器 */}
        <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 my-8 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-[#333]/50 shadow-2xl overflow-hidden">
          {/* 头部信息 */}
          <div className="p-8 border-b border-[#333]/50 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]/80">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {work.title}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {work.summary}
            </p>
            
            {/* 标签和年份 */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-[#ff8c5a]/10 border border-[#ff8c5a]/30 rounded-full text-sm text-[#ff8c5a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-gray-400 text-sm">
                {work.year}
              </span>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="h-full overflow-y-auto p-8">
            <WorkDetailLayout work={work} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <EnhancedWorkOverlay 
      work={work} 
      isOpen={isOverlayOpen} 
      onClose={handleCloseOverlay} 
    />
  );
}