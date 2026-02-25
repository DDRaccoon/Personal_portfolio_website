"use client";

import RichTextBlock from "./RichTextBlock";
import ImageBlock from "./ImageBlock";
import GalleryBlock from "./GalleryBlock";
import VideoBlock from "./VideoBlock";
import MetaBlock from "./MetaBlock";
import SpacerBlock from "./SpacerBlock";
import DividerBlock from "./DividerBlock";
import TwoColumnBlock from "./TwoColumnBlock";
import GridBlock from "./GridBlock";
import CalloutBlock from "./CalloutBlock";

const WIDTH_CLASSES = {
  full: "max-w-none",
  half: "max-w-[50%]",
};

const ALIGN_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ── Inline renderers for new block types ──

function TitleBlock({ block }) {
  return (
    <h1 className="text-[28px] font-semibold leading-tight text-white">
      {block.content || ""}
    </h1>
  );
}

function DescriptionBlock({ block }) {
  return (
    <p className="text-[16px] leading-relaxed text-white/80">
      {block.content || ""}
    </p>
  );
}

function TextRendererBlock({ block }) {
  const align = ALIGN_MAP[block.align] || ALIGN_MAP.left;
  return (
    <div className={`${align}`}>
      <RichTextBlock block={block} />
    </div>
  );
}

function VideoRendererBlock({ block }) {
  const isEmbed = /youtube|youtu\.be|vimeo/.test(block.src || "");
  return (
    <figure className="space-y-3">
      {isEmbed ? (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          <iframe
            src={(block.src || "").replace("watch?v=", "embed/")}
            className="aspect-video w-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <VideoBlock block={block} />
      )}
      {block.caption && (
        <figcaption className="text-center text-[13px] tracking-wide text-white/45">{block.caption}</figcaption>
      )}
    </figure>
  );
}

export default function renderBlock(block) {
  if (!block || !block.type) return null;

  let content;

  switch (block.type) {
    case "Title":
      content = <TitleBlock block={block} />;
      break;
    case "Description":
      content = <DescriptionBlock block={block} />;
      break;
    case "Text":
    case "RichText":
      content = <TextRendererBlock block={block} />;
      break;
    case "Image":
      content = <ImageBlock block={block} />;
      break;
    case "Gallery":
      content = <GalleryBlock block={block} />;
      break;
    case "Video":
      content = <VideoRendererBlock block={block} />;
      break;
    case "Meta":
      content = <MetaBlock block={block} />;
      break;
    case "Spacer":
      content = <SpacerBlock block={block} />;
      break;
    case "Divider":
      content = <DividerBlock />;
      break;
    case "TwoColumn":
      content = <TwoColumnBlock block={block} renderBlock={renderBlock} />;
      break;
    case "Grid":
      content = <GridBlock block={block} renderBlock={renderBlock} />;
      break;
    case "Callout":
      content = <CalloutBlock block={block} renderBlock={renderBlock} />;
      break;
    default:
      content = (
        <p className="rounded border border-red-400/40 px-3 py-2 text-sm text-red-300">
          Unknown block type: {block.type}
        </p>
      );
  }

  // Apply block-level width control
  const width = block.width || "full";

  if (width === "full") {
    return content;
  }

  const widthClass = WIDTH_CLASSES[width] || WIDTH_CLASSES.full;

  return <div className={widthClass}>{content}</div>;
}
