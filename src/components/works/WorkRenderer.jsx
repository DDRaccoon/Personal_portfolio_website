'use client';

import React from 'react';
import RichTextBlock from './blocks/RichTextBlock';
import ImageBlock from './blocks/ImageBlock';
import GalleryBlock from './blocks/GalleryBlock';
import VideoBlock from './blocks/VideoBlock';
import MetaBlock from './blocks/MetaBlock';
import SpacerBlock from './blocks/SpacerBlock';
import DividerBlock from './blocks/DividerBlock';

export default function WorkRenderer({ work }) {
  if (!work || !work.blocks) {
    return (
      <div className="text-center text-text-muted py-16">
        No work content available
      </div>
    );
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'RichText':
        return <RichTextBlock key={block.id} block={block} />;
      case 'Image':
        return <ImageBlock key={block.id} block={block} />;
      case 'Gallery':
        return <GalleryBlock key={block.id} block={block} />;
      case 'Video':
        return <VideoBlock key={block.id} block={block} />;
      case 'Meta':
        return <MetaBlock key={block.id} block={block} />;
      case 'Spacer':
        return <SpacerBlock key={block.id} block={block} />;
      case 'Divider':
        return <DividerBlock key={block.id} />;
      default:
        return (
          <div key={block.id} className="text-red-400">
            Unknown block type: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {work.blocks.map((block, index) => (
        <div key={block.id} className="animate-fade-in">
          {renderBlock(block, index)}
        </div>
      ))}
    </div>
  );
}