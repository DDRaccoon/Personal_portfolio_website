'use client';

import React from 'react';
import WorkRenderer from './WorkRenderer';

export default function WorkDetailLayout({ work }) {
  if (!work) return null;

  // 移动端自动降级为单列
  const isMobileLayout = typeof window !== 'undefined' && window.innerWidth < 768;
  const effectiveLayout = isMobileLayout ? 'single' : work.layout;

  const renderSingleLayout = () => (
    <div className="max-w-4xl mx-auto">
      <WorkRenderer work={work} />
    </div>
  );

  const renderTwoColumnLayout = () => {
    // 分离左右列的内容
    const leftBlocks = work.blocks.filter(block => 
      block.layout?.column === 'left' || !block.layout?.column
    );
    
    const rightBlocks = work.blocks.filter(block => 
      block.layout?.column === 'right'
    );

    // 检查是否有sticky元素
    const hasSticky = rightBlocks.some(block => block.layout?.sticky);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* 左列 - 主要内容 */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {leftBlocks.map((block, index) => (
            <div key={block.id} className="animate-fade-in">
              <WorkRenderer work={{ ...work, blocks: [block] }} />
            </div>
          ))}
        </div>

        {/* 右列 - 侧边内容 */}
        <div className="lg:col-span-1">
          <div className={`space-y-6 ${hasSticky ? 'lg:sticky lg:top-8' : ''}`}>
            {rightBlocks.map((block, index) => (
              <div key={block.id} className="animate-fade-in">
                <WorkRenderer work={{ ...work, blocks: [block] }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMasonryLayout = () => {
    // 简单的瀑布流实现
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-7xl mx-auto">
        {work.blocks.map((block, index) => (
          <div key={block.id} className="mb-8 break-inside-avoid animate-fade-in">
            <WorkRenderer work={{ ...work, blocks: [block] }} />
          </div>
        ))}
      </div>
    );
  };

  // 根据布局类型渲染不同的布局
  switch (effectiveLayout) {
    case 'twoColumn':
      return renderTwoColumnLayout();
    case 'masonry':
      return renderMasonryLayout();
    case 'single':
    default:
      return renderSingleLayout();
  }
}