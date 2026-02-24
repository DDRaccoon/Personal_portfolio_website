"use client";

export default function ImageBlock({ block }) {
  return (
    <div className="space-y-3">
      <img 
        src={block.src} 
        alt={block.alt || "Work image"}
        className="w-full rounded-lg border border-white/10 bg-black/40"
        loading="lazy"
      />
      {block.caption && (
        <p className="text-center text-sm text-white/60">
          {block.caption}
        </p>
      )}
    </div>
  );
}