import type { ReactNode } from 'react';
import {
  IconChartBar,
  IconCode,
  IconFileEdit,
  IconImage,
  IconLightbulb,
  IconList,
  IconMicroscope,
  IconMinus,
  IconQuote,
  IconRocket,
  IconSidebarPanel,
  IconTypeParagraph,
  IconWrench,
  IconZap,
} from '@shared/view/SvgIcons';
import type {
  AestheticTemplate,
  ArticleTypeKey,
  CanvasBlockType,
  HierarchyLayer,
  ResolvedArticleAesthetic,
  ResolvedBlockAesthetic,
} from '@templates/model/templates.model';
import {
  ARTICLE_TYPE_DEFINITIONS,
  BLOG_AESTHETIC_PRESETS,
  BLOG_PROFILES,
  CANVAS_BLOCK_DEFINITIONS,
} from '@templates/service/templates.service';

interface StyleLevelSidebarProps {
  template: AestheticTemplate;
  activeLayer: HierarchyLayer;
  selectedArticleType: ArticleTypeKey;
  selectedBlockType: CanvasBlockType;
  resolvedArticle: ResolvedArticleAesthetic;
  resolvedBlocksMap: Record<CanvasBlockType, ResolvedBlockAesthetic>;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectLayer: (layer: HierarchyLayer) => void;
  onSelectArticleType: (type: ArticleTypeKey) => void;
  onSelectBlockType: (type: CanvasBlockType) => void;
}

function renderArticleTypeIcon(key: ArticleTypeKey): ReactNode {
  switch (key) {
    case 'tutorial':
      return <IconWrench size={13} />;
    case 'deep-dive':
      return <IconMicroscope size={13} />;
    case 'release-notes':
      return <IconRocket size={13} />;
    case 'case-study':
      return <IconChartBar size={13} />;
    case 'opinion':
      return <IconFileEdit size={13} />;
    case 'cheatsheet':
      return <IconZap size={13} />;
  }
}

function renderCanvasBlockIcon(type: CanvasBlockType, codeBadge: string): ReactNode {
  switch (type) {
    case 'paragraph':
      return <IconTypeParagraph size={12} />;
    case 'code':
      return <IconCode size={12} />;
    case 'callout':
      return <IconLightbulb size={12} />;
    case 'quote':
      return <IconQuote size={12} />;
    case 'list':
      return <IconList size={12} />;
    case 'image':
      return <IconImage size={12} />;
    case 'divider':
      return <IconMinus size={12} />;
    case 'h2':
    case 'h3':
      return <span className="tpl-block-badge-txt">{codeBadge}</span>;
  }
}

export function StyleLevelSidebar({
  template,
  activeLayer,
  selectedArticleType,
  selectedBlockType,
  resolvedArticle,
  resolvedBlocksMap,
  collapsed,
  onToggleCollapse,
  onSelectLayer,
  onSelectArticleType,
  onSelectBlockType,
}: StyleLevelSidebarProps) {
  const presetLabel = BLOG_AESTHETIC_PRESETS[template.blogLayer.preset].label;
  const targetBlog = BLOG_PROFILES.find((b) => b.id === template.targetBlogId);
  const totalBlockOverrides = Object.values(resolvedBlocksMap).reduce(
    (sum, item) => sum + item.blockOverrideCount,
    0,
  );

  if (collapsed) {
    return (
      <aside className="tpl-level-sidebar collapsed" aria-label="Selector de nivel de estilos">
        <div className="tpl-level-rail-top">
          <button
            type="button"
            className="btn btn-icon btn-sm"
            data-tooltip="Expandir selector de niveles de estilo"
            onClick={onToggleCollapse}
          >
            <IconSidebarPanel size={15} />
          </button>
        </div>

        <div className="tpl-level-rail-items">
          <button
            type="button"
            className={`tpl-rail-step ${activeLayer === 'blog' ? 'active layer-1' : ''}`}
            data-tooltip={`Nivel 1 · Estética del Blog (${presetLabel})`}
            onClick={() => onSelectLayer('blog')}
          >
            <span>1</span>
          </button>

          <button
            type="button"
            className={`tpl-rail-step ${activeLayer === 'article-type' ? 'active layer-2' : ''}`}
            data-tooltip={`Nivel 2 · Tipo de Artículo (${resolvedArticle.articleOverrideCount} ajustes)`}
            onClick={() => onSelectLayer('article-type')}
          >
            <span>2</span>
          </button>

          <button
            type="button"
            className={`tpl-rail-step ${activeLayer === 'block' ? 'active layer-3' : ''}`}
            data-tooltip={`Nivel 3 · Canvas Blocks (${totalBlockOverrides} ajustes)`}
            onClick={() => onSelectLayer('block')}
          >
            <span>3</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="tpl-level-sidebar" aria-label="Selector de nivel de estilos">
      <div className="tpl-level-sidebar-head">
        <div>
          <h2 className="tpl-panel-title">Niveles de Estilo</h2>
          <p className="tpl-panel-sub">Cascada jerárquica en 3 capas</p>
        </div>
        <button
          type="button"
          className="btn btn-icon btn-sm"
          data-tooltip="Contraer panel de niveles de estilo"
          onClick={onToggleCollapse}
        >
          <IconSidebarPanel size={15} />
        </button>
      </div>

      <div className="tpl-level-sidebar-scroll">
        {/* Nivel 1: Estética General del Blog */}
        <section className={`tpl-level-group ${activeLayer === 'blog' ? 'active layer-1' : ''}`}>
          <button
            type="button"
            className="tpl-level-trigger"
            data-tooltip="Capa base: paleta, tipografía y layout general del blog"
            onClick={() => onSelectLayer('blog')}
          >
            <span className="tpl-level-num layer-1">1</span>
            <div className="tpl-level-meta">
              <strong>Estética del Blog</strong>
              <span>Base global · {presetLabel}</span>
            </div>
            <span
              className="tpl-swatch"
              style={{ background: template.blogLayer.accentColor }}
            />
          </button>
        </section>

        {/* Nivel 2: Tipo de Artículo */}
        <section
          className={`tpl-level-group ${activeLayer === 'article-type' ? 'active layer-2' : ''}`}
        >
          <button
            type="button"
            className="tpl-level-trigger"
            data-tooltip="Segunda capa: hereda del blog y adapta según el tipo de artículo"
            onClick={() => onSelectLayer('article-type')}
          >
            <span className="tpl-level-num layer-2">2</span>
            <div className="tpl-level-meta">
              <strong>Tipo de Artículo</strong>
              <span>{resolvedArticle.articleOverrideCount} ajustes activos</span>
            </div>
          </button>

          <div className="tpl-level-sublist">
            {ARTICLE_TYPE_DEFINITIONS.map((def) => {
              const overrides = template.articleTypeLayers[def.key];
              const overrideCount = overrides
                ? Object.values(overrides).filter((v) => v !== undefined).length
                : 0;
              const isItemActive =
                activeLayer === 'article-type' && selectedArticleType === def.key;
              const isSelectedType = selectedArticleType === def.key;

              return (
                <button
                  key={def.key}
                  type="button"
                  className={`tpl-level-subitem ${isItemActive ? 'active layer-2' : isSelectedType ? 'current' : ''}`}
                  data-tooltip={def.description}
                  onClick={() => onSelectArticleType(def.key)}
                >
                  <span className="tpl-subitem-icon">{renderArticleTypeIcon(def.key)}</span>
                  <span className="tpl-subitem-label">{def.label}</span>
                  {overrideCount > 0 && (
                    <span className="tpl-subitem-badge layer-2">{overrideCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Nivel 3: Canvas Blocks */}
        <section className={`tpl-level-group ${activeLayer === 'block' ? 'active layer-3' : ''}`}>
          <button
            type="button"
            className="tpl-level-trigger"
            data-tooltip="Última capa: afina la estética individual de cada Canvas Block"
            onClick={() => onSelectLayer('block')}
          >
            <span className="tpl-level-num layer-3">3</span>
            <div className="tpl-level-meta">
              <strong>Canvas Blocks</strong>
              <span>{totalBlockOverrides} ajustes en bloques</span>
            </div>
          </button>

          <div className="tpl-level-sublist">
            {CANVAS_BLOCK_DEFINITIONS.map((def) => {
              const res = resolvedBlocksMap[def.type];
              const isItemActive = activeLayer === 'block' && selectedBlockType === def.type;
              const isSelectedBlock = selectedBlockType === def.type;

              return (
                <button
                  key={def.type}
                  type="button"
                  className={`tpl-level-subitem ${isItemActive ? 'active layer-3' : isSelectedBlock ? 'current' : ''}`}
                  data-tooltip={def.description}
                  onClick={() => onSelectBlockType(def.type)}
                >
                  <span className="tpl-subitem-icon">
                    {renderCanvasBlockIcon(def.type, def.codeBadge)}
                  </span>
                  <span className="tpl-subitem-label">{def.label}</span>
                  {res.blockOverrideCount > 0 && (
                    <span className="tpl-subitem-badge layer-3">{res.blockOverrideCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="tpl-level-sidebar-foot">
        <div className="tpl-level-template-pill">
          <span
            className="tpl-swatch"
            style={{ background: template.blogLayer.accentColor }}
          />
          <div className="tpl-level-template-text">
            <strong>{template.name}</strong>
            <span>{targetBlog ? targetBlog.name : 'Multi-blog'} · {presetLabel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
