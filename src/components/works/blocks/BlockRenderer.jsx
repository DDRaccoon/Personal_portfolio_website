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
  full: "w-full",
  half: "w-full md:w-[calc(50%-0.75rem)]",
  third: "w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]",
};

const ALIGN_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ── Locale-aware content helper ──

function localContent(block, locale) {
  if (locale === "zh") return block.content_zh || block.content || "";
  return block.content || "";
}

// ── Inline renderers for new block types ──

function TitleBlock({ block, locale }) {
  return (
    <h1 className="text-[28px] font-semibold leading-tight text-white">
      {localContent(block, locale)}
    </h1>
  );
}

function DescriptionBlock({ block, locale }) {
  return (
    <p className="text-[16px] leading-relaxed text-white/80">
      {localContent(block, locale)}
    </p>
  );
}

function TextRendererBlock({ block, locale }) {
  const align = ALIGN_MAP[block.align] || ALIGN_MAP.left;
  const localBlock = locale === "zh" && block.content_zh
    ? { ...block, content: block.content_zh }
    : block;
  return (
    <div className={`${align}`}>
      <RichTextBlock block={localBlock} />
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

export default function renderBlock(block, locale) {
  if (!block || !block.type) return null;

  let content;

  switch (block.type) {
    case "Title":
      content = <TitleBlock block={block} locale={locale} />;
      break;
    case "Description":
      content = <DescriptionBlock block={block} locale={locale} />;
      break;
    case "Text":
    case "RichText":
      content = <TextRendererBlock block={block} locale={locale} />;
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

  const widthClass = WIDTH_CLASSES[width] || WIDTH_CLASSES.full;

  return <div className={widthClass}>{content}</div>;
}
