"use client";

export default function GridBlock({ block, renderBlock }) {
  const columns = block.columnsDesktop || 2;
  const gap = block.gap || 16;
  const items = Array.isArray(block.items) ? block.items : [];

  const gridColsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid grid-cols-1 ${gridColsClass[columns] || gridColsClass[2]}`}
      style={{ gap: `${gap}px` }}
    >
      {items.map((child) => (
        <div key={child.id}>{renderBlock(child)}</div>
      ))}
      {items.length === 0 && (
        <p className="col-span-full rounded border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/30">
          Grid empty — add items in the editor
        </p>
      )}
    </div>
  );
}
