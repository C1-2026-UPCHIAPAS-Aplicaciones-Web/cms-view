import type { BlockType } from '@editor/model/editor.model';

export type HierarchyLayer = 'blog' | 'article-type' | 'block';

export type TemplateScreenMode = 'admin' | 'editor';

export type TemplateStatusFilter = 'active' | 'archived' | 'all';

export type BlogAestheticPreset =
  | 'editorial-minimal'
  | 'tech-terminal'
  | 'modern-magazine'
  | 'clean-docs';

export type SpacingDensity = 'compact' | 'comfortable' | 'spacious';

export type HeaderLayoutStyle = 'banner' | 'editorial-centered' | 'split-cover' | 'minimal';

export type ShadowStyle = 'none' | 'soft' | 'elevated';

export type ScenarioKey =
  | 'technical-tutorial'
  | 'architecture-deep-dive'
  | 'product-launch'
  | 'incident-postmortem'
  | 'benchmark-comparison'
  | 'weekly-digest';

export type ArticleTypeKey =
  | 'tutorial'
  | 'deep-dive'
  | 'release-notes'
  | 'case-study'
  | 'opinion'
  | 'cheatsheet';

export type CanvasBlockType = BlockType;

export interface BlogProfile {
  id: string;
  name: string;
  domain: string;
  color: string;
  tagline: string;
}

export interface ScenarioDefinition {
  key: ScenarioKey;
  label: string;
  description: string;
  defaultArticleType: ArticleTypeKey;
  badge: string;
}

export interface ArticleTypeDefinition {
  key: ArticleTypeKey;
  label: string;
  description: string;
}

export interface CanvasBlockDefinition {
  type: CanvasBlockType;
  label: string;
  codeBadge: string;
  description: string;
}

/**
 * Capa 1: Estética general del blog.
 * Define los tokens base que heredan todos los tipos de artículo y canvas blocks.
 */
export interface BlogAestheticLayer {
  preset: BlogAestheticPreset;
  accentColor: string;
  surfaceBg: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  codeFont: string;
  baseFontSize: number;
  lineHeight: number;
  contentMaxWidth: number;
  borderRadius: number;
  density: SpacingDensity;
  headerStyle: HeaderLayoutStyle;
}

/**
 * Capa 2: Estética específica por tipo de artículo.
 * Cualquier propiedad indefinida hereda automáticamente de la Capa 1 (Blog).
 */
export interface ArticleTypeAestheticLayer {
  accentColor?: string;
  surfaceTint?: string;
  headingFont?: string;
  bodyFont?: string;
  fontSizeDelta?: number;
  lineHeight?: number;
  contentMaxWidth?: number;
  borderRadius?: number;
  density?: SpacingDensity;
  headerStyle?: HeaderLayoutStyle;
  showToc?: boolean;
  showReadingMeta?: boolean;
  leadBadgeLabel?: string;
  recommendedBlocks?: CanvasBlockType[];
}

export type ParagraphEmphasisStyle = 'standard' | 'dropcap' | 'lead-highlight';
export type HeadingDecorationStyle = 'clean' | 'bottom-rule' | 'left-accent' | 'numbered-pill';
export type CodeBlockTheme = 'dark-slate' | 'midnight' | 'light-paper' | 'emerald-cli';
export type CodeChromeStyle = 'macos-dots' | 'minimal-bar' | 'borderless';
export type CalloutSurfaceStyle = 'left-bar' | 'soft-tint' | 'outlined' | 'banner';
export type QuoteSurfaceStyle = 'left-border' | 'editorial-mark' | 'centered-serif' | 'card';
export type ListMarkerStyle = 'disc' | 'accent-dot' | 'check-badge' | 'step-number';
export type ImageFrameStyle = 'clean' | 'bordered' | 'elevated' | 'rounded-pill';
export type DividerPatternStyle = 'solid' | 'dashed' | 'dots' | 'gradient-fade';

/**
 * Capa 3: Estética específica de cada Canvas Block.
 * Hereda de Capa 1 (Blog) -> Capa 2 (Tipo de Artículo) y permite afinar cada bloque individual.
 */
export interface CanvasBlockAestheticLayer {
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  paddingY?: number;
  paddingX?: number;
  marginY?: number;
  fontFamily?: string;
  fontSizeDelta?: number;
  shadowStyle?: ShadowStyle;
  paragraphStyle?: ParagraphEmphasisStyle;
  headingDecoration?: HeadingDecorationStyle;
  codeTheme?: CodeBlockTheme;
  codeChrome?: CodeChromeStyle;
  showLineNumbers?: boolean;
  calloutSurface?: CalloutSurfaceStyle;
  showCalloutIcon?: boolean;
  quoteStyle?: QuoteSurfaceStyle;
  quoteItalic?: boolean;
  listMarker?: ListMarkerStyle;
  imageFrame?: ImageFrameStyle;
  imageCaptionAlign?: 'left' | 'center';
  dividerPattern?: DividerPatternStyle;
}

export interface AestheticTemplate {
  id: string;
  name: string;
  description: string;
  targetBlogId: string | 'all';
  scenarios: ScenarioKey[];
  archived: boolean;
  updatedAt: string;
  blogLayer: BlogAestheticLayer;
  articleTypeLayers: Partial<Record<ArticleTypeKey, ArticleTypeAestheticLayer>>;
  blockLayers: Partial<Record<CanvasBlockType, CanvasBlockAestheticLayer>>;
}

export interface BlogScenarioAssignment {
  id: string;
  blogId: string;
  scenarioKey: ScenarioKey;
  templateId: string;
  articleType: ArticleTypeKey;
  updatedAt: string;
}

export interface ResolvedToken<T> {
  value: T;
  source: HierarchyLayer;
  hasOverride: boolean;
}

export interface ResolvedArticleAesthetic {
  accentColor: ResolvedToken<string>;
  surfaceBg: ResolvedToken<string>;
  surfaceSubtle: ResolvedToken<string>;
  textPrimary: ResolvedToken<string>;
  textSecondary: ResolvedToken<string>;
  borderColor: ResolvedToken<string>;
  headingFont: ResolvedToken<string>;
  bodyFont: ResolvedToken<string>;
  codeFont: ResolvedToken<string>;
  fontSize: ResolvedToken<number>;
  lineHeight: ResolvedToken<number>;
  contentMaxWidth: ResolvedToken<number>;
  borderRadius: ResolvedToken<number>;
  density: ResolvedToken<SpacingDensity>;
  headerStyle: ResolvedToken<HeaderLayoutStyle>;
  showToc: boolean;
  showReadingMeta: boolean;
  leadBadgeLabel: string;
  recommendedBlocks: CanvasBlockType[];
  articleOverrideCount: number;
}

export interface ResolvedBlockAesthetic {
  blockType: CanvasBlockType;
  accentColor: ResolvedToken<string>;
  backgroundColor: ResolvedToken<string>;
  textColor: ResolvedToken<string>;
  borderColor: ResolvedToken<string>;
  borderRadius: ResolvedToken<number>;
  paddingY: ResolvedToken<number>;
  paddingX: ResolvedToken<number>;
  marginY: ResolvedToken<number>;
  fontFamily: ResolvedToken<string>;
  fontSize: ResolvedToken<number>;
  shadowStyle: ResolvedToken<ShadowStyle>;
  paragraphStyle: ParagraphEmphasisStyle;
  headingDecoration: HeadingDecorationStyle;
  codeTheme: CodeBlockTheme;
  codeChrome: CodeChromeStyle;
  showLineNumbers: boolean;
  calloutSurface: CalloutSurfaceStyle;
  showCalloutIcon: boolean;
  quoteStyle: QuoteSurfaceStyle;
  quoteItalic: boolean;
  listMarker: ListMarkerStyle;
  imageFrame: ImageFrameStyle;
  imageCaptionAlign: 'left' | 'center';
  dividerPattern: DividerPatternStyle;
  blockOverrideCount: number;
}

export interface CreateTemplateInput {
  name: string;
  description: string;
  targetBlogId: string | 'all';
  scenarios: ScenarioKey[];
  preset: BlogAestheticPreset;
  baseTemplateId?: string;
}

export type TemplatePreviewTab = 'live' | 'cascade';
export type TemplateExportFormat = 'json' | 'css';
