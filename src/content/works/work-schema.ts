// 作品数据模型定义
export interface WorkBlock {
  type: 'RichText' | 'Image' | 'Gallery' | 'Video' | 'Meta' | 'Spacer' | 'Divider';
  id: string;
  layout?: {
    column?: 'left' | 'right';
    width?: 'full' | 'half' | 'third';
    align?: 'left' | 'center' | 'right';
    sticky?: boolean;
  };
}

export interface RichTextBlock extends WorkBlock {
  type: 'RichText';
  content: string;
}

export interface ImageBlock extends WorkBlock {
  type: 'Image';
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryBlock extends WorkBlock {
  type: 'Gallery';
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: 2 | 3 | 4;
}

export interface VideoBlock extends WorkBlock {
  type: 'Video';
  src: string;
  poster?: string;
  caption?: string;
}

export interface MetaBlock extends WorkBlock {
  type: 'Meta';
  role: string;
  tools: string[];
  responsibilities: string[];
  duration?: string;
  teamSize?: number;
}

export interface SpacerBlock extends WorkBlock {
  type: 'Spacer';
  height: number; // px
}

export interface DividerBlock extends WorkBlock {
  type: 'Divider';
}

export type WorkBlockUnion = 
  | RichTextBlock 
  | ImageBlock 
  | GalleryBlock 
  | VideoBlock 
  | MetaBlock 
  | SpacerBlock 
  | DividerBlock;

export interface WorkData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover: string;
  featured: boolean;
  order: number;
  category: 'full-game' | 'demos' | 'tools' | 'shader';
  tags: string[];
  year: number;
  layout: 'single' | 'twoColumn' | 'masonry';
  blocks: WorkBlockUnion[];
}