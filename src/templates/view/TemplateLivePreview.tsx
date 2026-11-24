import type { CSSProperties, ReactNode } from 'react';
import {
  IconArrowDown,
  IconCode,
  IconImage,
  IconLightbulb,
  IconList,
  IconMinus,
  IconQuote,
  IconTypeParagraph,
} from '@shared/view/SvgIcons';
import type {
  AestheticTemplate,
  ArticleTypeKey,
  BlogProfile,
  CanvasBlockType,
  HierarchyLayer,
  ResolvedArticleAesthetic,
  ResolvedBlockAesthetic,
  ScenarioDefinition,
  TemplatePreviewTab,
} from '@templates/model/templates.model';
import { CANVAS_BLOCK_DEFINITIONS } from '@templates/service/templates.service';

interface TemplateLivePreviewProps {
  template: AestheticTemplate;
  blogProfile: BlogProfile;
  scenarioDef: ScenarioDefinition;
  selectedArticleType: ArticleTypeKey;
  selectedBlockType: CanvasBlockType;
  activeLayer: HierarchyLayer;
  previewTab: TemplatePreviewTab;
  resolvedArticle: ResolvedArticleAesthetic;
  resolvedBlocksMap: Record<CanvasBlockType, ResolvedBlockAesthetic>;
  onPreviewTabChange: (tab: TemplatePreviewTab) => void;
  onInspectBlock: (blockType: CanvasBlockType) => void;
  onSelectLayer: (layer: HierarchyLayer) => void;
}

const SHADOW_MAP = {
  none: 'none',
  soft: '0 4px 14px rgba(15, 23, 42, 0.08)',
  elevated: '0 12px 28px rgba(15, 23, 42, 0.16)',
};

const CODE_THEME_COLORS = {
  'dark-slate': { bg: '#0f172a', header: '#1e293b', text: '#e2e8f0', border: '#334155' },
  midnight: { bg: '#09090b', header: '#18181b', text: '#f4f4f5', border: '#27272a' },
  'emerald-cli': { bg: '#042f2e', header: '#115e59', text: '#ccfbf1', border: '#0f766e' },
  'light-paper': { bg: '#f8fafc', header: '#e2e8f0', text: '#0f172a', border: '#cbd5e1' },
};

export function TemplateLivePreview({
  template,
  blogProfile,
  scenarioDef,
  selectedArticleType,
  selectedBlockType,
  activeLayer,
  previewTab,
  resolvedArticle,
  resolvedBlocksMap,
  onPreviewTabChange,
  onInspectBlock,
  onSelectLayer,
}: TemplateLivePreviewProps) {
  const pBlk = resolvedBlocksMap.paragraph;
  const h2Blk = resolvedBlocksMap.h2;
  const h3Blk = resolvedBlocksMap.h3;
  const codeBlk = resolvedBlocksMap.code;
  const calloutBlk = resolvedBlocksMap.callout;
  const quoteBlk = resolvedBlocksMap.quote;
  const listBlk = resolvedBlocksMap.list;
  const imageBlk = resolvedBlocksMap.image;
  const dividerBlk = resolvedBlocksMap.divider;

  const codePalette = CODE_THEME_COLORS[codeBlk.codeTheme];

  const surfaceVars: CSSProperties = {
    background: resolvedArticle.surfaceBg.value,
    color: resolvedArticle.textPrimary.value,
    borderColor: resolvedArticle.borderColor.value,
    borderRadius: `${resolvedArticle.borderRadius.value}px`,
    maxWidth: `${resolvedArticle.contentMaxWidth.value}px`,
    fontFamily: resolvedArticle.bodyFont.value,
    fontSize: `${resolvedArticle.fontSize.value}px`,
    lineHeight: resolvedArticle.lineHeight.value,
  };

  const renderBlockWrapper = (
    blockType: CanvasBlockType,
    icon: ReactNode,
    label: string,
    children: ReactNode,
  ) => {
    const isFocused = activeLayer === 'block' && selectedBlockType === blockType;
    const res = resolvedBlocksMap[blockType];
    return (
      <div
        role="button"
        tabIndex={0}
        className={`tpl-canvas-block-slot ${isFocused ? 'focused' : ''}`}
        style={{ marginTop: `${res.marginY.value}px`, marginBottom: `${res.marginY.value}px` }}
        onClick={() => onInspectBlock(blockType)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onInspectBlock(blockType);
          }
        }}
      >
        <span className="tpl-slot-tag">
          {icon}
          <span>
            {label}
            {res.blockOverrideCount > 0 ? ` · ${res.blockOverrideCount} ajustes` : ' · heredado'}
          </span>
        </span>
        {children}
      </div>
    );
  };

  return (
    <section className="tpl-preview-panel">
      <div className="tpl-preview-toolbar">
        <div className="tpl-cascade-crumb">
          <button
            type="button"
            className={`tpl-crumb-chip ${activeLayer === 'blog' ? 'active' : ''}`}
            onClick={() => onSelectLayer('blog')}
          >
            1. {blogProfile.name}
          </button>
          <span>/</span>
          <button
            type="button"
            className={`tpl-crumb-chip ${activeLayer === 'article-type' ? 'active' : ''}`}
            onClick={() => onSelectLayer('article-type')}
          >
            2. {resolvedArticle.leadBadgeLabel}
          </button>
          <span>/</span>
          <button
            type="button"
            className={`tpl-crumb-chip ${activeLayer === 'block' ? 'active' : ''}`}
            onClick={() => onSelectLayer('block')}
          >
            3. Block: {selectedBlockType}
          </button>
        </div>

        <div className="segmented-sm">
          <button
            type="button"
            className={previewTab === 'live' ? 'active' : ''}
            onClick={() => onPreviewTabChange('live')}
          >
            Vista Previa en Vivo
          </button>
          <button
            type="button"
            className={previewTab === 'cascade' ? 'active' : ''}
            onClick={() => onPreviewTabChange('cascade')}
          >
            Árbol de Cascada
          </button>
        </div>
      </div>

      {previewTab === 'live' ? (
        <div className="tpl-preview-viewport">
          <p className="tpl-preview-hint">
            Haz clic en cualquier <strong>Canvas Block</strong> del lienzo para editar su estética
            de Capa 3.
          </p>

          <article className="tpl-article-canvas" style={surfaceVars}>
            <header
              className={`tpl-preview-header hdr-${resolvedArticle.headerStyle.value}`}
              style={{
                borderColor: resolvedArticle.borderColor.value,
                background:
                  resolvedArticle.headerStyle.value === 'banner'
                    ? `${resolvedArticle.accentColor.value}14`
                    : resolvedArticle.headerStyle.value === 'split-cover'
                      ? resolvedArticle.surfaceSubtle.value
                      : 'transparent',
                borderRadius: `${resolvedArticle.borderRadius.value}px`,
              }}
            >
              <div className="tpl-preview-meta-row">
                <span
                  className="tpl-preview-badge"
                  style={{
                    background: `${resolvedArticle.accentColor.value}1a`,
                    color: resolvedArticle.accentColor.value,
                  }}
                >
                  {resolvedArticle.leadBadgeLabel}
                </span>
                <span style={{ color: resolvedArticle.textSecondary.value, fontSize: '0.8em' }}>
                  {blogProfile.domain} · Escenario: {scenarioDef.label}
                </span>
              </div>

              <h1
                className="tpl-preview-title"
                style={{
                  fontFamily: resolvedArticle.headingFont.value,
                  color: resolvedArticle.textPrimary.value,
                }}
              >
                Arquitectura de plantillas jerárquicas para {blogProfile.name}
              </h1>

              {resolvedArticle.showReadingMeta && (
                <div
                  className="tpl-preview-author"
                  style={{ color: resolvedArticle.textSecondary.value }}
                >
                  <span>Por Equipo Editorial</span>
                  <span>·</span>
                  <span>6 min lectura</span>
                  <span>·</span>
                  <span>Preset: {template.blogLayer.preset}</span>
                </div>
              )}
            </header>

            {resolvedArticle.showToc && (
              <nav
                className="tpl-preview-toc"
                style={{
                  background: resolvedArticle.surfaceSubtle.value,
                  borderColor: resolvedArticle.borderColor.value,
                  borderRadius: `${Math.max(4, resolvedArticle.borderRadius.value - 2)}px`,
                }}
              >
                <strong style={{ color: resolvedArticle.accentColor.value }}>
                  Índice del artículo
                </strong>
                <ul>
                  <li>1. Resolución de tokens por cascada</li>
                  <li>2. Implementación de Canvas Blocks</li>
                </ul>
              </nav>
            )}

            {/* Paragraph Block */}
            {renderBlockWrapper(
              'paragraph',
              <IconTypeParagraph size={11} />,
              'Párrafo',
              <p
                className={`tpl-blk-paragraph style-${pBlk.paragraphStyle}`}
                style={{
                  fontFamily: pBlk.fontFamily.value,
                  fontSize: `${pBlk.fontSize.value}px`,
                  color: pBlk.textColor.value,
                  background:
                    pBlk.paragraphStyle === 'lead-highlight'
                      ? resolvedArticle.surfaceSubtle.value
                      : 'transparent',
                  borderLeftColor: pBlk.accentColor.value,
                  borderRadius: `${pBlk.borderRadius.value}px`,
                  boxShadow: SHADOW_MAP[pBlk.shadowStyle.value],
                }}
              >
                Este bloque demuestra cómo la estética base de <strong>{blogProfile.name}</strong>{' '}
                se especializa para <em>{resolvedArticle.leadBadgeLabel}</em> y finalmente se afina
                a nivel de cada Canvas Block sin perder coherencia visual.
              </p>,
            )}

            {/* H2 Block */}
            {renderBlockWrapper(
              'h2',
              <span className="tpl-slot-code">H2</span>,
              'Encabezado',
              <h2
                className={`tpl-blk-h2 deco-${h2Blk.headingDecoration}`}
                style={{
                  fontFamily: h2Blk.fontFamily.value,
                  fontSize: `${h2Blk.fontSize.value}px`,
                  color: h2Blk.textColor.value,
                  borderColor: h2Blk.accentColor.value,
                }}
              >
                {h2Blk.headingDecoration === 'numbered-pill' && (
                  <span
                    className="tpl-h2-pill"
                    style={{ background: h2Blk.accentColor.value }}
                  >
                    01
                  </span>
                )}
                Resolución jerárquica de estilos
              </h2>,
            )}

            {/* Callout Block */}
            {renderBlockWrapper(
              'callout',
              <IconLightbulb size={11} />,
              'Callout',
              <div
                className={`tpl-blk-callout surf-${calloutBlk.calloutSurface}`}
                style={{
                  background:
                    calloutBlk.calloutSurface === 'soft-tint' ||
                    calloutBlk.calloutSurface === 'banner'
                      ? `${calloutBlk.accentColor.value}14`
                      : calloutBlk.backgroundColor.value,
                  borderColor: calloutBlk.accentColor.value,
                  borderRadius: `${calloutBlk.borderRadius.value}px`,
                  padding: `${calloutBlk.paddingY.value}px ${calloutBlk.paddingX.value}px`,
                  boxShadow: SHADOW_MAP[calloutBlk.shadowStyle.value],
                }}
              >
                <div className="tpl-blk-callout-title" style={{ color: calloutBlk.accentColor.value }}>
                  {calloutBlk.showCalloutIcon && <IconLightbulb size={14} />}
                  <span>Regla de prioridad en cascada</span>
                </div>
                <div style={{ color: calloutBlk.textColor.value, fontSize: '0.93em' }}>
                  Capa 3 (Canvas Block) prevalece sobre Capa 2 (Tipo de Artículo), y ambas heredan
                  de Capa 1 (Blog).
                </div>
              </div>,
            )}

            {/* Code Block */}
            {renderBlockWrapper(
              'code',
              <IconCode size={11} />,
              'Código',
              <div
                className="tpl-blk-code"
                style={{
                  background: codePalette.bg,
                  color: codePalette.text,
                  borderColor: codePalette.border,
                  borderRadius: `${codeBlk.borderRadius.value}px`,
                  boxShadow: SHADOW_MAP[codeBlk.shadowStyle.value],
                  fontFamily: codeBlk.fontFamily.value,
                  fontSize: `${codeBlk.fontSize.value}px`,
                }}
              >
                {codeBlk.codeChrome !== 'borderless' && (
                  <div
                    className="tpl-blk-code-head"
                    style={{ background: codePalette.header, borderColor: codePalette.border }}
                  >
                    <div className="tpl-blk-code-left">
                      {codeBlk.codeChrome === 'macos-dots' && (
                        <div className="tpl-code-dots">
                          <span style={{ background: '#ef4444' }} />
                          <span style={{ background: '#f59e0b' }} />
                          <span style={{ background: '#10b981' }} />
                        </div>
                      )}
                      <span>resolveHierarchy.ts</span>
                    </div>
                    <span
                      className="tpl-code-lang"
                      style={{ color: codeBlk.accentColor.value }}
                    >
                      typescript
                    </span>
                  </div>
                )}
                <pre className="tpl-blk-code-body">
                  <code>
                    {`const theme = resolveCascade({\n  blog: "${blogProfile.id}",\n  articleType: "${selectedArticleType}",\n  block: "code"\n});`}
                  </code>
                </pre>
              </div>,
            )}

            {/* H3 Block */}
            {renderBlockWrapper(
              'h3',
              <span className="tpl-slot-code">H3</span>,
              'Subtítulo',
              <h3
                className={`tpl-blk-h3 deco-${h3Blk.headingDecoration}`}
                style={{
                  fontFamily: h3Blk.fontFamily.value,
                  fontSize: `${h3Blk.fontSize.value}px`,
                  color: h3Blk.textColor.value,
                  borderColor: h3Blk.accentColor.value,
                }}
              >
                Lista de verificación editorial
              </h3>,
            )}

            {/* List Block */}
            {renderBlockWrapper(
              'list',
              <IconList size={11} />,
              'Lista',
              <ul
                className={`tpl-blk-list marker-${listBlk.listMarker}`}
                style={{
                  fontFamily: listBlk.fontFamily.value,
                  fontSize: `${listBlk.fontSize.value}px`,
                  color: listBlk.textColor.value,
                  ['--list-accent' as string]: listBlk.accentColor.value,
                }}
              >
                <li>Tokens globales definidos en el Blog</li>
                <li>Variaciones aplicadas al tipo {resolvedArticle.leadBadgeLabel}</li>
                <li>Refinamiento granular en cada Canvas Block</li>
              </ul>,
            )}

            {/* Quote Block */}
            {renderBlockWrapper(
              'quote',
              <IconQuote size={11} />,
              'Cita',
              <blockquote
                className={`tpl-blk-quote style-${quoteBlk.quoteStyle}`}
                style={{
                  fontFamily: quoteBlk.fontFamily.value,
                  fontSize: `${quoteBlk.fontSize.value}px`,
                  fontStyle: quoteBlk.quoteItalic ? 'italic' : 'normal',
                  color: quoteBlk.textColor.value,
                  background:
                    quoteBlk.quoteStyle === 'card'
                      ? resolvedArticle.surfaceSubtle.value
                      : 'transparent',
                  borderColor: quoteBlk.accentColor.value,
                  borderRadius: `${quoteBlk.borderRadius.value}px`,
                  boxShadow: SHADOW_MAP[quoteBlk.shadowStyle.value],
                }}
              >
                <p style={{ margin: 0 }}>
                  “Una buena arquitectura visual permite escalar decenas de escenarios sin romper la
                  identidad del blog.”
                </p>
                <cite style={{ color: resolvedArticle.textSecondary.value }}>
                  — Sistema de Diseño {blogProfile.name}
                </cite>
              </blockquote>,
            )}

            {/* Image Block */}
            {renderBlockWrapper(
              'image',
              <IconImage size={11} />,
              'Imagen',
              <figure
                className={`tpl-blk-image frame-${imageBlk.imageFrame}`}
                style={{
                  borderColor: imageBlk.borderColor.value,
                  borderRadius: `${imageBlk.borderRadius.value}px`,
                  boxShadow: SHADOW_MAP[imageBlk.shadowStyle.value],
                  background: resolvedArticle.surfaceSubtle.value,
                }}
              >
                <div
                  className="tpl-blk-image-placeholder"
                  style={{
                    background: `linear-gradient(135deg, ${resolvedArticle.accentColor.value}22, ${resolvedArticle.accentColor.value}08)`,
                    borderRadius: `${Math.max(4, imageBlk.borderRadius.value - 4)}px`,
                  }}
                >
                  <IconImage size={18} />
                  <span>Diagrama de Cascada · {scenarioDef.badge}</span>
                </div>
                <figcaption
                  style={{
                    textAlign: imageBlk.imageCaptionAlign,
                    color: resolvedArticle.textSecondary.value,
                  }}
                >
                  Figura 1. Composición de estilos aplicada a {blogProfile.domain}
                </figcaption>
              </figure>,
            )}

            {/* Divider Block */}
            {renderBlockWrapper(
              'divider',
              <IconMinus size={11} />,
              'Separador',
              <div
                className={`tpl-blk-divider pat-${dividerBlk.dividerPattern}`}
                style={{ ['--div-accent' as string]: dividerBlk.accentColor.value }}
              />,
            )}
          </article>
        </div>
      ) : (
        <div className="tpl-cascade-tree-view">
          <div className="tpl-cascade-node layer-1">
            <div className="tpl-cascade-node-head">
              <span className="tpl-layer-tag layer-1">Capa 1 · Blog</span>
              <strong>{template.name}</strong>
            </div>
            <div className="tpl-token-table">
              <div>
                <span>Preset</span>
                <code>{template.blogLayer.preset}</code>
              </div>
              <div>
                <span>Acento Base</span>
                <code>{template.blogLayer.accentColor}</code>
              </div>
              <div>
                <span>Ancho / Densidad</span>
                <code>
                  {template.blogLayer.contentMaxWidth}px · {template.blogLayer.density}
                </code>
              </div>
              <div>
                <span>Tipografía Base</span>
                <code>{template.blogLayer.baseFontSize}px / {template.blogLayer.lineHeight}</code>
              </div>
            </div>
          </div>

          <div className="tpl-cascade-connector">
            <IconArrowDown size={13} />
            <span>hereda y especializa</span>
          </div>

          <div className="tpl-cascade-node layer-2">
            <div className="tpl-cascade-node-head">
              <span className="tpl-layer-tag layer-2">Capa 2 · Tipo de Artículo</span>
              <strong>{resolvedArticle.leadBadgeLabel}</strong>
              <span className="tpl-chip">
                {resolvedArticle.articleOverrideCount} sobrescrituras
              </span>
            </div>
            <div className="tpl-token-table">
              <div>
                <span>Acento Efectivo</span>
                <code>
                  {resolvedArticle.accentColor.value} ({resolvedArticle.accentColor.source})
                </code>
              </div>
              <div>
                <span>Cabecera</span>
                <code>
                  {resolvedArticle.headerStyle.value} ({resolvedArticle.headerStyle.source})
                </code>
              </div>
              <div>
                <span>Tamaño / Ancho</span>
                <code>
                  {resolvedArticle.fontSize.value}px · {resolvedArticle.contentMaxWidth.value}px
                </code>
              </div>
              <div>
                <span>TOC / Meta</span>
                <code>
                  {resolvedArticle.showToc ? 'TOC activo' : 'Sin TOC'} ·{' '}
                  {resolvedArticle.showReadingMeta ? 'Meta visible' : 'Sin meta'}
                </code>
              </div>
            </div>
          </div>

          <div className="tpl-cascade-connector">
            <IconArrowDown size={13} />
            <span>hereda y afina cada bloque</span>
          </div>

          <div className="tpl-cascade-node layer-3">
            <div className="tpl-cascade-node-head">
              <span className="tpl-layer-tag layer-3">Capa 3 · Canvas Blocks</span>
              <strong>Resolución por bloque</strong>
            </div>
            <div className="tpl-blocks-matrix">
              {CANVAS_BLOCK_DEFINITIONS.map((def) => {
                const res = resolvedBlocksMap[def.type];
                return (
                  <button
                    key={def.type}
                    type="button"
                    className={`tpl-matrix-row ${selectedBlockType === def.type ? 'active' : ''}`}
                    onClick={() => {
                      onInspectBlock(def.type);
                      onPreviewTabChange('live');
                    }}
                  >
                    <span className="tpl-matrix-name">
                      <code className="tpl-matrix-badge">{def.codeBadge}</code> {def.label}
                    </span>
                    <span className="tpl-matrix-origin">
                      Acento: {res.accentColor.source} · Radio: {res.borderRadius.value}px (
                      {res.borderRadius.source})
                    </span>
                    <span className="tpl-chip">
                      {res.blockOverrideCount > 0
                        ? `${res.blockOverrideCount} propios`
                        : 'Heredado'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
