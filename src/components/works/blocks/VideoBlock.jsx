"use client";

import { useState } from "react";

export default function VideoBlock({ block }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <figure className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        <video 
          src={block.src}
          poster={block.poster}
          controls
          muted={block.muted !== false}
          loop={block.loop !== false}
          autoPlay={Boolean(block.autoplay)}
          playsInline
          className="w-full bg-black"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/60 p-4 backdrop-blur-sm">
              <svg className="h-10 w-10 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      {block.caption && (
        <figcaption className="text-center text-[13px] tracking-wide text-white/45">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}