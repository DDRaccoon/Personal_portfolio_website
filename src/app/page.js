'use client';

import { useState } from 'react';
import Header from '../components/home/Header';
import WorksGrid from '../components/works/WorksGrid';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('full-game');

  return (
    <main className="min-h-screen">
      {/* Header with Tabs */}
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      
      {/* Works Grid */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <WorksGrid category={activeCategory} />
        </div>
      </section>
    </main>
  );
}