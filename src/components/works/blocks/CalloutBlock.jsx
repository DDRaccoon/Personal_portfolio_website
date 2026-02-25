"use client";

const ICONS = {
  none: null,
  dot: (
    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#FF7A18]" />
  ),
  triangle: (
    <span
      className="mt-0.5 inline-block"
      style={{
        width: 0,
        height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderBottom: "10px solid #FF7A18",
      }}
    />
  ),
};

export default function CalloutBlock({ block, renderBlock }) {
  const style = block.style || "minimal";
  const icon = block.icon || "none";
  const contentBlocks = Array.isArray(block.contentBlocks) ? block.contentBlocks : [];

  const isFramed = style === "framed";

  return (
    <div
      className={`relative rounded-lg px-6 py-5 ${
        isFramed
          ? "border border-[#FF7A18]/25 bg-[#FF7A18]/[0.04]"
          : "border-l-2 border-[#FF7A18]/40 bg-white/[0.02]"
      }`}
    >
      <div className="flex gap-3">
        {ICONS[icon] && <div className="flex-shrink-0">{ICONS[icon]}</div>}
        <div className="min-w-0 flex-1 space-y-4">
          {contentBlocks.map((child) => (
            <div key={child.id}>{renderBlock(child)}</div>
          ))}
          {contentBlocks.length === 0 && (
            <p className="text-sm text-white/30">Callout empty — add content in the editor</p>
          )}
        </div>
      </div>
    </div>
  );
}
