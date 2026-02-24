'use client';

import React from 'react';

export default function ImageBlock({ block }) {
  return (
    <div className="space-y-4">
      <img 
        src={block.src} 
        alt={block.alt}
        className="w-full rounded-lg shadow-lg"
        loading="lazy"
      />
      {block.caption && (
        <p className="text-gray-400 text-sm text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
}