'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function WorkCard({ work }) {
  const router = useRouter();

  const handleClick = () => {
    // 打开作品详情Overlay
    router.push(`/work/${work.slug}`);
  };

  return (
    <div 
      className="group cursor-pointer bg-bg-1 rounded-card overflow-hidden border border-border hover:border-accent-orange transition-hover"
      onClick={handleClick}
    >
      {/* 封面图片 */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={work.cover} 
          alt={work.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* 悬停效果 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-accent-orange text-text-strong px-4 py-2 rounded-button font-medium">
            View Details
          </div>
        </div>
      </div>
      
      {/* 内容信息 */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-strong mb-2 group-hover:text-accent-orange transition-colors">
          {work.title_en || work.title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
          {work.summary_en || work.summary}
        </p>
      </div>
    </div>
  );
}