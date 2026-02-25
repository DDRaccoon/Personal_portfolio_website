"use client";

export default function ImageBlock({ block }) {
  return (
    <figure className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-white/10">
        <img 
          src={block.src} 
          alt={block.alt || "Work image"}
          className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-[13px] tracking-wide text-white/45">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}