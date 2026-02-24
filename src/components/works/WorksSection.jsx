'use client';

import React from 'react';
import Tabs from '../ui/Tabs';
import WorksGrid from './WorksGrid';

export default function WorksSection({ activeCategory, onCategoryChange }) {
  return (
    <div className="space-y-8">
      {/* Tabs 放在 Works 区顶部 */}
      <Tabs 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange} 
      />
      
      {/* Works Grid */}
      <WorksGrid category={activeCategory} />
    </div>
  );
}