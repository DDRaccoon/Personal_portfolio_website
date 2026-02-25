"use client";

import renderBlock from "./blocks/BlockRenderer";

export default function WorkRenderer({ work }) {
  if (!work || !Array.isArray(work.blocks)) {
    return <p className="py-12 text-center text-sm text-white/60">No work content available.</p>;
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {work.blocks.map((block) => (
        <section key={block.id}>{renderBlock(block)}</section>
      ))}
    </div>
  );
}