'use client';

import React from 'react';

export default function GalleryBlock({ block }) {
  const columns = block.columns || 3;
  
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="space-y-4">
      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {block.images.map((image, index) => (
          <div key={index} className="group cursor-pointer">
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-48 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {image.caption && (
              <p className="text-gray-400 text-sm mt-2 text-center">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}