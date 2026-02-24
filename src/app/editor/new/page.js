'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '../../../components/editor/Editor';

// 包装组件以处理useSearchParams的Suspense
function NewWorkPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialCategory, setInitialCategory] = useState('full-game');

  useEffect(() => {
    // 从URL参数获取分类
    const category = searchParams.get('cat');
    if (category && ['full-game', 'demos', 'tools', 'shader'].includes(category)) {
      setInitialCategory(category);
    }
  }, [searchParams]);

  const handleSave = (workData) => {
    // 保存成功后返回首页
    router.push('/');
  };

  const handleCancel = () => {
    // 取消编辑，返回首页
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-bg-0 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-strong mb-2">
            Create New Work
          </h1>
          <p className="text-text-muted">
            Add a new project to your portfolio
          </p>
        </div>
        
        <Editor 
          initialCategory={initialCategory}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

// 主页面组件，添加Suspense边界
export default function NewWorkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-0 flex items-center justify-center">
        <div className="text-text-muted">Loading editor...</div>
      </div>
    }>
      <NewWorkPageContent />
    </Suspense>
  );
}