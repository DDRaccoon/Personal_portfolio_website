'use client';

import React from 'react';

// 固定分类定义（英文）
const CATEGORIES = [
  { id: 'full-game', label: 'Full Game Project Experience' },
  { id: 'demos', label: 'Game Demos' },
  { id: 'tools', label: 'Tools / Features' },
  { id: 'shader', label: 'Shader / VFX' }
];

export default function Tabs({ activeCategory, onCategoryChange }) {
  return (
    <div className="w-full">
      <div className="flex space-1 border-b border-border">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-4 py-3 text-sm font-medium transition-hover
              ${activeCategory === category.id 
                ? 'text-accent-orange border-b-2 border-accent-orange' 
                : 'text-text-muted hover:text-text-strong'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CATEGORIES };