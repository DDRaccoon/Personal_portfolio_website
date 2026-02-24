'use client';

import React from 'react';
import { getWorksByCategoryCompat } from '../../content/works';
import WorkCard from './WorkCard';
import { PlusIcon } from '../ui/icons';

export default function WorksGrid({ category = 'full-game' }) {
  const works = getWorksByCategoryCompat(category);

  // 空态处理
  if (works.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bg-1 rounded-full border border-border mb-4">
            <PlusIcon size={24} className="text-text-muted" />
          </div>
          <p className="text-text-muted text-lg mb-2">
            Create your first work in this category
          </p>
          <button 
            className="btn bg-accent-orange text-text-strong px-6 py-2 rounded-button"
            onClick={() => window.location.href = `/editor/new?cat=${category}`}
          >
            Create Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}