"use client";

import BlockRenderer from "./BlockRenderer";

const RATIO_MAP = {
  "50/50": ["1fr", "1fr"],
  "60/40": ["3fr", "2fr"],
  "40/60": ["2fr", "3fr"],
};

export default function TwoColumnBlock({ block, renderBlock }) {
  const ratio = RATIO_MAP[block.ratio] || RATIO_MAP["50/50"];
  const gap = block.gap || 24;
  const leftBlocks = Array.isArray(block.leftBlocks) ? block.leftBlocks : [];
  const rightBlocks = Array.isArray(block.rightBlocks) ? block.rightBlocks : [];

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[var(--col-left)_var(--col-right)]"
      style={{
        "--col-left": ratio[0],
        "--col-right": ratio[1],
        gap: `${gap}px`,
      }}
    >
      <div className={`space-y-6 ${block.stickyRight ? "" : ""}`}>
        {leftBlocks.map((child) => (
          <div key={child.id}>{renderBlock(child)}</div>
        ))}
        {leftBlocks.length === 0 && (
          <p className="rounded border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/30">
            Left column empty
          </p>
        )}
      </div>
      <div className={`space-y-6 ${block.stickyRight ? "md:sticky md:top-24 md:self-start" : ""}`}>
        {rightBlocks.map((child) => (
          <div key={child.id}>{renderBlock(child)}</div>
        ))}
        {rightBlocks.length === 0 && (
          <p className="rounded border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/30">
            Right column empty
          </p>
        )}
      </div>
    </div>
  );
}
