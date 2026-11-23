export type PostStatus = 'draft' | 'review' | 'published';

export type EditorViewMode = 'split' | 'preview';

export type SidebarTab = 'publish' | 'typography' | 'seo' | 'toc';

export type ExportMode = 'md' | 'json';

export type BlockType =
  | 'paragraph'
  | 'h2'
  | 'h3'
  | 'code'
  | 'callout'
  | 'list'
  | 'quote'
  | 'image'
  | 'divider';

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'danger';

export type ImageAnchor =
  | 'center'
  | 'inline-left'
  | 'inline-right'
  | 'float-left'
  | 'float-right'
  | 'full';

export type FontTarget = 'prose' | 'code';

export type FontSourceType = 'google' | 'file';

export interface FontOption {
  label: string;
  value: string;
}

export interface CustomFontItem {
  id: string;
  name: string;
  target: FontTarget;
  sourceType: FontSourceType;
  value: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  codeFont: string;
  fontSize: number;
  lineHeight: number;
  customFonts: CustomFontItem[];
}

export interface ImageSlot {
  id: string;
  url: string;
  alt: string;
  caption: string;
  width: number;
  anchor: ImageAnchor;
}

export interface EditorBlock {
  id: string;
  type: BlockType;
  text?: string;
  ordered?: boolean;
  language?: string;
  filename?: string;
  highlightLines?: string;
  showLineNumbers?: boolean;
  caption?: string;
  code?: string;
  variant?: CalloutVariant;
  title?: string;
  cite?: string;
  images?: ImageSlot[];
}

export interface PostDocument {
  title: string;
  excerpt: string;
  coverEnabled: boolean;
  coverImage: string;
  status: PostStatus;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  seoTitle: string;
  seoDesc: string;
  showToc: boolean;
  typography: TypographySettings;
  blocks: EditorBlock[];
}

export interface DocumentStats {
  words: number;
  readTime: number;
  codeBlocks: number;
  totalBlocks: number;
}
