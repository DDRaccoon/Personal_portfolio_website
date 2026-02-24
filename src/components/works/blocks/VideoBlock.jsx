'use client';

import React, { useState } from 'react';

export default function VideoBlock({ block }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative">
        <video 
          src={block.src}
          poster={block.poster}
          controls
          className="w-full rounded-lg shadow-lg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-4">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      {block.caption && (
        <p className="text-gray-400 text-sm text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
}