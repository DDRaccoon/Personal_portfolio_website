'use client';

import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import WorksGrid from '../components/works/WorksGrid';
import Tabs from '../components/ui/Tabs';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('full-game');

  return (
    <main className="min-h-screen bg-bg-0">
      {/* 个人资料部分 */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <ProfileCard />
      </section>
      
      {/* 作品展示部分 */}
      <section className="min-h-screen px-4 py-16 bg-gradient-to-b from-transparent to-bg-1/20">
        <div className="max-w-7xl mx-auto">
          {/* Tabs 分类导航 */}
          <div className="mb-16">
            <Tabs 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />
          </div>
          
          {/* 作品列表 */}
          <WorksGrid category={activeCategory} />
        </div>
      </section>
    </main>
  );
}