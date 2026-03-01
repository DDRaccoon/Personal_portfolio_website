"use client";

import { useState } from "react";
import Lightbox from "../Lightbox";

export default function ImageBlock({ block }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <img
            src={block.src}
            alt={block.alt || "Work image"}
            className="w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
            onClick={() => setOpen(true)}
          />
        </div>
        {block.caption && (
          <figcaption className="text-center text-[13px] tracking-wide text-white/45">
            {block.caption}
          </figcaption>
        )}
      </figure>

      {open && (
        <Lightbox
          src={block.src}
          alt={block.alt || "Work image"}
          caption={block.caption}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}