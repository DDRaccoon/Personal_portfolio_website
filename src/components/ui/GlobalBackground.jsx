'use client';

import React from 'react';

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      {/* 纯黑背景 */}
      <div className="absolute inset-0 bg-bg-0" />
      
      {/* 极光点缀 - 极简版本 */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-orange/5 blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-orange/3 blur-2xl rounded-full" />
      
      {/* 网格纹理 - 极简 */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}