"use client";

import { cloneElement, isValidElement } from "react";
import renderBlock from "./blocks/BlockRenderer";

export default function WorkRenderer({ work }) {
  if (!work || !Array.isArray(work.blocks)) {
    return <p className="py-12 text-center text-sm text-white/60">No work content available.</p>;
  }

  return (
    <div className="flex flex-wrap items-start gap-x-6 gap-y-10 md:gap-y-12">
      {work.blocks.map((block) => {
        const rendered = renderBlock(block);
        if (!isValidElement(rendered)) return null;
        return cloneElement(rendered, { key: block.id });
      })}
    </div>
  );
}