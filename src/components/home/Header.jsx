'use client';

import React from 'react';
import Tabs from '../ui/Tabs';

export default function Header({ activeCategory, onCategoryChange }) {
  return (
    <header className="sticky top-0 z-10 bg-bg-0/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-strong">Portfolio</h1>
          <Tabs 
            activeCategory={activeCategory} 
            onCategoryChange={onCategoryChange} 
          />
        </div>
      </div>
    </header>
  );
}