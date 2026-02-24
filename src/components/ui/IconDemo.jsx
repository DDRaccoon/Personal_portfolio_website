'use client';

import React from 'react';
import { PlusIcon, EditIcon, DeleteIcon, MusicIcon, SoundOnIcon, SoundOffIcon, ArrowUpIcon, ArrowDownIcon, CloseIcon, SaveIcon } from './icons';

/**
 * 图标系统演示组件
 * 展示所有图标尺寸和用法
 */
export default function IconDemo() {
  return (
    <div className="p-6 bg-bg-1 rounded-card border border-border">
      <h3 className="text-lg font-semibold text-text-strong mb-4">Icon System Demo</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* 16px 尺寸 */}
        <div className="flex items-center space-2">
          <PlusIcon size={16} />
          <span className="text-text-muted text-sm">16px</span>
        </div>
        
        {/* 20px 尺寸（默认） */}
        <div className="flex items-center space-2">
          <EditIcon size={20} />
          <span className="text-text-muted text-sm">20px</span>
        </div>
        
        {/* 24px 尺寸 */}
        <div className="flex items-center space-2">
          <DeleteIcon size={24} />
          <span className="text-text-muted text-sm">24px</span>
        </div>
        
        {/* 音乐相关图标 */}
        <div className="flex items-center space-2">
          <MusicIcon />
          <span className="text-text-muted text-sm">Music</span>
        </div>
        
        <div className="flex items-center space-2">
          <SoundOnIcon />
          <span className="text-text-muted text-sm">Sound On</span>
        </div>
        
        <div className="flex items-center space-2">
          <SoundOffIcon />
          <span className="text-text-muted text-sm">Sound Off</span>
        </div>
        
        {/* 操作图标 */}
        <div className="flex items-center space-2">
          <ArrowUpIcon />
          <span className="text-text-muted text-sm">Move Up</span>
        </div>
        
        <div className="flex items-center space-2">
          <ArrowDownIcon />
          <span className="text-text-muted text-sm">Move Down</span>
        </div>
        
        <div className="flex items-center space-2">
          <CloseIcon />
          <span className="text-text-muted text-sm">Close</span>
        </div>
        
        <div className="flex items-center space-2">
          <SaveIcon />
          <span className="text-text-muted text-sm">Save</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-bg-0 rounded-button border border-border">
        <p className="text-text-muted text-xs">
          Icon System: 16/20/24px sizes, inline-flex alignment, unified strokeWidth
        </p>
      </div>
    </div>
  );
}