"use client";

import RichTextBlock from "./blocks/RichTextBlock";
import ImageBlock from "./blocks/ImageBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import VideoBlock from "./blocks/VideoBlock";
import MetaBlock from "./blocks/MetaBlock";
import SpacerBlock from "./blocks/SpacerBlock";
import DividerBlock from "./blocks/DividerBlock";

export default function WorkRenderer({ work }) {
  if (!work || !Array.isArray(work.blocks)) {
    return <p className="py-12 text-center text-sm text-white/60">No work content available.</p>;
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case "Text":
      case "RichText":
        return <RichTextBlock block={block} />;
      case "Image":
        return <ImageBlock block={block} />;
      case "Gallery":
        return <GalleryBlock block={block} />;
      case "Video":
        return <VideoBlock block={block} />;
      case "Meta":
        return <MetaBlock block={block} />;
      case "Spacer":
        return <SpacerBlock block={block} />;
      case "Divider":
        return <DividerBlock />;
      default:
        return (
          <p className="rounded border border-red-400/40 px-3 py-2 text-sm text-red-300">
            Unknown block type: {block.type}
          </p>
        );
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      {work.blocks.map((block) => (
        <section key={block.id}>{renderBlock(block)}</section>
      ))}
    </div>
  );
}