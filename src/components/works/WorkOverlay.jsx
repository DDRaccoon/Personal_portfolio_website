'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../ui/Icon';

export default function WorkOverlay({ work, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const router = useRouter();

  // 关闭Overlay
  const handleClose = () => {
    onClose();
    // 延迟移除URL参数，避免闪烁
    setTimeout(() => {
      router.push('/', { scroll: false });
    }, 300);
  };

  // ESC键关闭
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    // 锁定背景滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // 点击遮罩关闭
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!isOpen || !work) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-10 p-3 bg-[#1a1a1a]/80 border border-[#333]/50 rounded-full hover:bg-[#ff8c5a]/20 hover:border-[#ff8c5a]/50 transition-all duration-300 group"
      >
        <Icon size={24} className="text-white group-hover:text-[#ff8c5a]">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Icon>
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
        <div className="h-full overflow-y-auto">
          {/* 这里将渲染WorkRenderer组件 */}
          <div className="p-8">
            <div className="text-center text-gray-400">
              WorkRenderer组件将在这里渲染作品内容
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}