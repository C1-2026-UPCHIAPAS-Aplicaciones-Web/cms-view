import { BUILTIN_CODE_FONTS, BUILTIN_PROSE_FONTS } from '@editor/service/editor-document.service';
import {
  IconArrowRight,
  IconRotateCcw,
  IconSidebarPanel,
} from '@shared/view/SvgIcons';
import type {
  AestheticTemplate,
  ArticleTypeAestheticLayer,
  ArticleTypeKey,
  BlogAestheticLayer,
  BlogAestheticPreset,
  CalloutSurfaceStyle,
  CanvasBlockAestheticLayer,
  CanvasBlockType,
  CodeBlockTheme,
  CodeChromeStyle,
  DividerPatternStyle,
  HeaderLayoutStyle,
  HeadingDecorationStyle,
  HierarchyLayer,
  ImageFrameStyle,
  ListMarkerStyle,
  ParagraphEmphasisStyle,
  QuoteSurfaceStyle,
  ResolvedArticleAesthetic,
  ResolvedBlockAesthetic,
  ScenarioKey,
  ShadowStyle,
  SpacingDensity,
} from '@templates/model/templates.model';
import {
  ARTICLE_TYPE_DEFINITIONS,
  BLOG_AESTHETIC_PRESETS,
  BLOG_PROFILES,
  CANVAS_BLOCK_DEFINITIONS,
  SCENARIO_DEFINITIONS,
} from '@templates/service/templates.service';

interface HierarchyLayerEditorProps {
  template: AestheticTemplate;
  activeLayer: HierarchyLayer;
  selectedArticleType: ArticleTypeKey;
  selectedBlockType: CanvasBlockType;
  resolvedArticle: ResolvedArticleAesthetic;
  resolvedBlock: ResolvedBlockAesthetic;
  styleSidebarCollapsed: boolean;
  onToggleStyleSidebar: () => void;
  onSelectArticleType: (type: ArticleTypeKey) => void;
  onSelectBlockType: (type: CanvasBlockType) => void;
  onUpdateMeta: (
    patch: Partial<Pick<AestheticTemplate, 'name' | 'description' | 'targetBlogId' | 'scenarios'>>,
  ) => void;
  onToggleScenario: (scenario: ScenarioKey) => void;
  onApplyPreset: (preset: BlogAestheticPreset) => void;
  onUpdateBlogLayer: (patch: Partial<BlogAestheticLayer>) => void;
  onUpdateArticleLayer: (type: ArticleTypeKey, patch: Partial<ArticleTypeAestheticLayer>) => void;
  onResetArticleField: (type: ArticleTypeKey, field: keyof ArticleTypeAestheticLayer) => void;
  onResetAllArticleOverrides: (type: ArticleTypeKey) => void;
  onUpdateBlockLayer: (type: CanvasBlockType, patch: Partial<CanvasBlockAestheticLayer>) => void;
  onResetBlockField: (type: CanvasBlockType, field: keyof CanvasBlockAestheticLayer) => void;
  onResetAllBlockOverrides: (type: CanvasBlockType) => void;
}

const SOURCE_LABELS: Record<HierarchyLayer, string> = {
  blog: 'Heredado · Blog',
  'article-type': 'Capa 2 · Artículo',
  block: 'Capa 3 · Block',
};

function OriginPill({
  source,
  hasOverride,
  onReset,
}: {
  source: HierarchyLayer;
  hasOverride: boolean;
  onReset?: () => void;
}) {
  return (
    <span className="tpl-origin-wrap">
      <span className={`tpl-origin-badge src-${source}`}>
        {hasOverride ? SOURCE_LABELS[source] : `Heredado · ${source === 'article-type' ? 'Artículo' : 'Blog'}`}
      </span>
      {hasOverride && onReset && (
        <button
          type="button"
          className="tpl-reset-link"
          data-tooltip="Restaurar este valor para heredarlo de la capa superior"
          onClick={onReset}
        >
          <IconRotateCcw size={11} />
          <span>Heredar</span>
        </button>
      )}
    </span>
  );
}

export function HierarchyLayerEditor({
  template,
  activeLayer,
  selectedArticleType,
  selectedBlockType,
  resolvedArticle,
  resolvedBlock,
  styleSidebarCollapsed,
  onToggleStyleSidebar,
  onSelectArticleType,
  onSelectBlockType,
  onUpdateMeta,
  onToggleScenario,
  onApplyPreset,
  onUpdateBlogLayer,
  onUpdateArticleLayer,
  onResetArticleField,
  onResetAllArticleOverrides,
  onUpdateBlockLayer,
  onResetBlockField,
  onResetAllBlockOverrides,
}: HierarchyLayerEditorProps) {
  const blog = template.blogLayer;
  const articleOverride = template.articleTypeLayers[selectedArticleType] || {};
  const blockOverride = template.blockLayers[selectedBlockType] || {};

  const activeArticleLabel =
    ARTICLE_TYPE_DEFINITIONS.find((d) => d.key === selectedArticleType)?.label ||
    selectedArticleType;
  const activeBlockLabel =
    CANVAS_BLOCK_DEFINITIONS.find((b) => b.type === selectedBlockType)?.label || selectedBlockType;

  return (
    <section className="tpl-editor-panel">
      {/* Barra contextual del nivel activo */}
      <div className="tpl-editor-context-bar">
        <div className="tpl-editor-context-left">
          {styleSidebarCollapsed && (
            <button
              type="button"
              className="btn btn-sm"
              data-tooltip="Mostrar selector de niveles de estilo"
              onClick={onToggleStyleSidebar}
            >
              <IconSidebarPanel size={14} />
              <span>Niveles</span>
            </button>
          )}

          <span
            className={`tpl-layer-tag ${
              activeLayer === 'blog'
                ? 'layer-1'
                : activeLayer === 'article-type'
                  ? 'layer-2'
                  : 'layer-3'
            }`}
          >
            {activeLayer === 'blog'
              ? 'Nivel 1 · Estética del Blog'
              : activeLayer === 'article-type'
                ? `Nivel 2 · ${activeArticleLabel}`
                : `Nivel 3 · ${activeBlockLabel}`}
          </span>
        </div>

        <span className="tpl-editor-context-hint">
          {activeLayer === 'blog'
            ? 'Tokens base heredados por toda la plantilla'
            : activeLayer === 'article-type'
              ? `${resolvedArticle.articleOverrideCount} ajustes propios sobre Blog`
              : `${resolvedBlock.blockOverrideCount} ajustes propios sobre Artículo`}
        </span>
      </div>

      <div className="tpl-editor-scroll">
        {/* CAPA 1: ESTÉTICA GENERAL DEL BLOG */}
        {activeLayer === 'blog' && (
          <div className="tpl-layer-stack">
            <div className="tpl-section-card">
              <div className="tpl-card-header">
                <div>
                  <h3>Identidad y Alcance de la Plantilla</h3>
                  <p>Define nombre, blog principal y escenarios compatibles.</p>
                </div>
                <span className="tpl-layer-tag layer-1">Capa 1 · Blog</span>
              </div>

              <div className="tpl-form-grid">
                <label className="form-field tpl-col-span-2">
                  Nombre de la plantilla
                  <input
                    type="text"
                    className="form-input"
                    value={template.name}
                    onChange={(e) => onUpdateMeta({ name: e.target.value })}
                  />
                </label>

                <label className="form-field tpl-col-span-2">
                  Descripción editorial
                  <input
                    type="text"
                    className="form-input"
                    value={template.description}
                    onChange={(e) => onUpdateMeta({ description: e.target.value })}
                  />
                </label>

                <label className="form-field">
                  Blog objetivo
                  <select
                    className="form-input"
                    value={template.targetBlogId}
                    onChange={(e) => onUpdateMeta({ targetBlogId: e.target.value })}
                  >
                    <option value="all">Multi-blog (Cualquier sitio)</option>
                    {BLOG_PROFILES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.domain})
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-field">
                  <span>Escenarios aplicables</span>
                  <div className="tpl-scenario-pills">
                    {SCENARIO_DEFINITIONS.map((sc) => {
                      const active = template.scenarios.includes(sc.key);
                      return (
                        <button
                          key={sc.key}
                          type="button"
                          className={`tpl-toggle-pill ${active ? 'active' : ''}`}
                          data-tooltip={sc.description}
                          onClick={() => onToggleScenario(sc.key)}
                        >
                          {sc.badge}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="tpl-section-card">
              <div className="tpl-card-header">
                <div>
                  <h3>Preset Estético Base del Blog</h3>
                  <p>Aplica una dirección visual coherente como punto de partida.</p>
                </div>
              </div>

              <div className="tpl-preset-grid">
                {(Object.keys(BLOG_AESTHETIC_PRESETS) as BlogAestheticPreset[]).map((presetKey) => {
                  const preset = BLOG_AESTHETIC_PRESETS[presetKey];
                  const isActive = blog.preset === presetKey;
                  return (
                    <button
                      key={presetKey}
                      type="button"
                      className={`tpl-preset-card ${isActive ? 'active' : ''}`}
                      onClick={() => onApplyPreset(presetKey)}
                    >
                      <div className="tpl-preset-head">
                        <span
                          className="tpl-swatch"
                          style={{ background: preset.layer.accentColor }}
                        />
                        <strong>{preset.label}</strong>
                      </div>
                      <span>{preset.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="tpl-section-card">
              <div className="tpl-card-header">
                <div>
                  <h3>Paleta Visual, Tipografía y Estructura Base</h3>
                  <p>Estos tokens forman la base heredada por Capa 2 y Capa 3.</p>
                </div>
              </div>

              <div className="tpl-form-grid">
                <label className="form-field">
                  Color de acento
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={blog.accentColor}
                      onChange={(e) => onUpdateBlogLayer({ accentColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={blog.accentColor}
                      onChange={(e) => onUpdateBlogLayer({ accentColor: e.target.value })}
                    />
                  </div>
                </label>

                <label className="form-field">
                  Fondo del lienzo
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={blog.surfaceBg}
                      onChange={(e) => onUpdateBlogLayer({ surfaceBg: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={blog.surfaceBg}
                      onChange={(e) => onUpdateBlogLayer({ surfaceBg: e.target.value })}
                    />
                  </div>
                </label>

                <label className="form-field">
                  Superficie sutil (callouts/citas)
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={blog.surfaceSubtle}
                      onChange={(e) => onUpdateBlogLayer({ surfaceSubtle: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={blog.surfaceSubtle}
                      onChange={(e) => onUpdateBlogLayer({ surfaceSubtle: e.target.value })}
                    />
                  </div>
                </label>

                <label className="form-field">
                  Color de bordes
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={blog.borderColor}
                      onChange={(e) => onUpdateBlogLayer({ borderColor: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={blog.borderColor}
                      onChange={(e) => onUpdateBlogLayer({ borderColor: e.target.value })}
                    />
                  </div>
                </label>

                <label className="form-field">
                  Tipografía de encabezados
                  <select
                    className="form-input"
                    value={blog.headingFont}
                    onChange={(e) => onUpdateBlogLayer({ headingFont: e.target.value })}
                  >
                    {BUILTIN_PROSE_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-field">
                  Tipografía de cuerpo
                  <select
                    className="form-input"
                    value={blog.bodyFont}
                    onChange={(e) => onUpdateBlogLayer({ bodyFont: e.target.value })}
                  >
                    {BUILTIN_PROSE_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-field">
                  Tipografía de código
                  <select
                    className="form-input"
                    value={blog.codeFont}
                    onChange={(e) => onUpdateBlogLayer({ codeFont: e.target.value })}
                  >
                    {BUILTIN_CODE_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="form-field">
                  Estilo de cabecera
                  <select
                    className="form-input"
                    value={blog.headerStyle}
                    onChange={(e) =>
                      onUpdateBlogLayer({ headerStyle: e.target.value as HeaderLayoutStyle })
                    }
                  >
                    <option value="editorial-centered">Editorial Centrada</option>
                    <option value="banner">Banner con acento</option>
                    <option value="split-cover">Split Cover</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </label>

                <label className="form-field">
                  Tamaño base ({blog.baseFontSize}px)
                  <input
                    type="range"
                    min={14}
                    max={20}
                    step={1}
                    value={blog.baseFontSize}
                    onChange={(e) => onUpdateBlogLayer({ baseFontSize: Number(e.target.value) })}
                  />
                </label>

                <label className="form-field">
                  Interlineado ({blog.lineHeight})
                  <input
                    type="range"
                    min={1.45}
                    max={2.0}
                    step={0.05}
                    value={blog.lineHeight}
                    onChange={(e) => onUpdateBlogLayer({ lineHeight: Number(e.target.value) })}
                  />
                </label>

                <label className="form-field">
                  Ancho máximo ({blog.contentMaxWidth}px)
                  <input
                    type="range"
                    min={640}
                    max={960}
                    step={20}
                    value={blog.contentMaxWidth}
                    onChange={(e) => onUpdateBlogLayer({ contentMaxWidth: Number(e.target.value) })}
                  />
                </label>

                <label className="form-field">
                  Radio de bordes ({blog.borderRadius}px)
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={2}
                    value={blog.borderRadius}
                    onChange={(e) => onUpdateBlogLayer({ borderRadius: Number(e.target.value) })}
                  />
                </label>

                <label className="form-field tpl-col-span-2">
                  Densidad de espaciado
                  <div className="segmented">
                    {(['compact', 'comfortable', 'spacious'] as SpacingDensity[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={blog.density === d ? 'active' : ''}
                        onClick={() => onUpdateBlogLayer({ density: d })}
                      >
                        {d === 'compact' ? 'Compacta' : d === 'comfortable' ? 'Equilibrada' : 'Amplia'}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* CAPA 2: ESTÉTICA POR TIPO DE ARTÍCULO */}
        {activeLayer === 'article-type' && (
          <div className="tpl-layer-stack">
            <div className="tpl-section-card">
              <div className="tpl-card-header">
                <div>
                  <h3>Ajustes para {activeArticleLabel}</h3>
                  <p>
                    Hereda automáticamente la Capa 1 (Blog) y sobrescribe solo lo necesario para
                    este formato.
                  </p>
                </div>

                <div className="tpl-card-header-actions">
                  <select
                    className="control-select tpl-compact-select"
                    aria-label="Cambiar tipo de artículo"
                    value={selectedArticleType}
                    onChange={(e) => onSelectArticleType(e.target.value as ArticleTypeKey)}
                  >
                    {ARTICLE_TYPE_DEFINITIONS.map((def) => (
                      <option key={def.key} value={def.key}>
                        {def.label}
                      </option>
                    ))}
                  </select>

                  {resolvedArticle.articleOverrideCount > 0 && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => onResetAllArticleOverrides(selectedArticleType)}
                    >
                      <IconRotateCcw size={13} />
                      <span>Heredar todo</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="tpl-form-grid">
                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Color de acento</span>
                    <OriginPill
                      source={resolvedArticle.accentColor.source}
                      hasOverride={resolvedArticle.accentColor.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'accentColor')}
                    />
                  </div>
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={resolvedArticle.accentColor.value}
                      onChange={(e) =>
                        onUpdateArticleLayer(selectedArticleType, { accentColor: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={resolvedArticle.accentColor.value}
                      onChange={(e) =>
                        onUpdateArticleLayer(selectedArticleType, { accentColor: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Tinte de superficie</span>
                    <OriginPill
                      source={resolvedArticle.surfaceBg.source}
                      hasOverride={resolvedArticle.surfaceBg.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'surfaceTint')}
                    />
                  </div>
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={resolvedArticle.surfaceBg.value}
                      onChange={(e) =>
                        onUpdateArticleLayer(selectedArticleType, { surfaceTint: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={resolvedArticle.surfaceBg.value}
                      onChange={(e) =>
                        onUpdateArticleLayer(selectedArticleType, { surfaceTint: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Tipografía de títulos</span>
                    <OriginPill
                      source={resolvedArticle.headingFont.source}
                      hasOverride={resolvedArticle.headingFont.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'headingFont')}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={articleOverride.headingFont ?? '__inherit__'}
                    onChange={(e) => {
                      if (e.target.value === '__inherit__') {
                        onResetArticleField(selectedArticleType, 'headingFont');
                      } else {
                        onUpdateArticleLayer(selectedArticleType, { headingFont: e.target.value });
                      }
                    }}
                  >
                    <option value="__inherit__">Heredar del Blog</option>
                    {BUILTIN_PROSE_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Tipografía de lectura</span>
                    <OriginPill
                      source={resolvedArticle.bodyFont.source}
                      hasOverride={resolvedArticle.bodyFont.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'bodyFont')}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={articleOverride.bodyFont ?? '__inherit__'}
                    onChange={(e) => {
                      if (e.target.value === '__inherit__') {
                        onResetArticleField(selectedArticleType, 'bodyFont');
                      } else {
                        onUpdateArticleLayer(selectedArticleType, { bodyFont: e.target.value });
                      }
                    }}
                  >
                    <option value="__inherit__">Heredar del Blog</option>
                    {BUILTIN_PROSE_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Estilo de cabecera</span>
                    <OriginPill
                      source={resolvedArticle.headerStyle.source}
                      hasOverride={resolvedArticle.headerStyle.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'headerStyle')}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={articleOverride.headerStyle ?? '__inherit__'}
                    onChange={(e) => {
                      if (e.target.value === '__inherit__') {
                        onResetArticleField(selectedArticleType, 'headerStyle');
                      } else {
                        onUpdateArticleLayer(selectedArticleType, {
                          headerStyle: e.target.value as HeaderLayoutStyle,
                        });
                      }
                    }}
                  >
                    <option value="__inherit__">Heredar del Blog</option>
                    <option value="editorial-centered">Editorial Centrada</option>
                    <option value="banner">Banner con acento</option>
                    <option value="split-cover">Split Cover</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Densidad de lectura</span>
                    <OriginPill
                      source={resolvedArticle.density.source}
                      hasOverride={resolvedArticle.density.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'density')}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={articleOverride.density ?? '__inherit__'}
                    onChange={(e) => {
                      if (e.target.value === '__inherit__') {
                        onResetArticleField(selectedArticleType, 'density');
                      } else {
                        onUpdateArticleLayer(selectedArticleType, {
                          density: e.target.value as SpacingDensity,
                        });
                      }
                    }}
                  >
                    <option value="__inherit__">Heredar del Blog</option>
                    <option value="compact">Compacta</option>
                    <option value="comfortable">Equilibrada</option>
                    <option value="spacious">Amplia</option>
                  </select>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Delta de tamaño ({resolvedArticle.fontSize.value}px)</span>
                    <OriginPill
                      source={resolvedArticle.fontSize.source}
                      hasOverride={resolvedArticle.fontSize.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'fontSizeDelta')}
                    />
                  </div>
                  <input
                    type="range"
                    min={-2}
                    max={3}
                    step={1}
                    value={articleOverride.fontSizeDelta ?? 0}
                    onChange={(e) =>
                      onUpdateArticleLayer(selectedArticleType, {
                        fontSizeDelta: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Ancho de columna ({resolvedArticle.contentMaxWidth.value}px)</span>
                    <OriginPill
                      source={resolvedArticle.contentMaxWidth.source}
                      hasOverride={resolvedArticle.contentMaxWidth.hasOverride}
                      onReset={() => onResetArticleField(selectedArticleType, 'contentMaxWidth')}
                    />
                  </div>
                  <input
                    type="range"
                    min={640}
                    max={960}
                    step={20}
                    value={resolvedArticle.contentMaxWidth.value}
                    onChange={(e) =>
                      onUpdateArticleLayer(selectedArticleType, {
                        contentMaxWidth: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <label className="form-field">
                  Etiqueta / Badge del tipo
                  <input
                    type="text"
                    className="form-input"
                    placeholder={resolvedArticle.leadBadgeLabel}
                    value={articleOverride.leadBadgeLabel ?? ''}
                    onChange={(e) =>
                      onUpdateArticleLayer(selectedArticleType, { leadBadgeLabel: e.target.value })
                    }
                  />
                </label>

                <div className="form-field">
                  <span>Elementos editoriales</span>
                  <div className="tpl-checks-row">
                    <label className="tpl-check-item">
                      <input
                        type="checkbox"
                        checked={resolvedArticle.showToc}
                        onChange={(e) =>
                          onUpdateArticleLayer(selectedArticleType, { showToc: e.target.checked })
                        }
                      />
                      Mostrar índice (TOC)
                    </label>
                    <label className="tpl-check-item">
                      <input
                        type="checkbox"
                        checked={resolvedArticle.showReadingMeta}
                        onChange={(e) =>
                          onUpdateArticleLayer(selectedArticleType, {
                            showReadingMeta: e.target.checked,
                          })
                        }
                      />
                      Meta de lectura
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAPA 3: ESTÉTICA DE CADA CANVAS BLOCK */}
        {activeLayer === 'block' && (
          <div className="tpl-layer-stack">
            <div className="tpl-section-card">
              <div className="tpl-card-header">
                <div>
                  <h3>Estética de {activeBlockLabel}</h3>
                  <p className="tpl-cascade-inline">
                    <span>Blog ({blog.preset})</span>
                    <IconArrowRight size={12} />
                    <span>Artículo ({selectedArticleType})</span>
                    <IconArrowRight size={12} />
                    <span>{selectedBlockType}</span>
                  </p>
                </div>

                <div className="tpl-card-header-actions">
                  <select
                    className="control-select tpl-compact-select"
                    aria-label="Cambiar Canvas Block"
                    value={selectedBlockType}
                    onChange={(e) => onSelectBlockType(e.target.value as CanvasBlockType)}
                  >
                    {CANVAS_BLOCK_DEFINITIONS.map((def) => (
                      <option key={def.type} value={def.type}>
                        {def.label}
                      </option>
                    ))}
                  </select>

                  {resolvedBlock.blockOverrideCount > 0 && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => onResetAllBlockOverrides(selectedBlockType)}
                    >
                      <IconRotateCcw size={13} />
                      <span>Heredar todo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Controles específicos del Canvas Block */}
              <div className="tpl-form-grid">
                {selectedBlockType === 'paragraph' && (
                  <div className="form-field tpl-col-span-2">
                    <div className="tpl-field-head">
                      <span>Énfasis de párrafo</span>
                      <OriginPill
                        source={blockOverride.paragraphStyle ? 'block' : 'blog'}
                        hasOverride={Boolean(blockOverride.paragraphStyle)}
                        onReset={() => onResetBlockField('paragraph', 'paragraphStyle')}
                      />
                    </div>
                    <select
                      className="form-input"
                      value={resolvedBlock.paragraphStyle}
                      onChange={(e) =>
                        onUpdateBlockLayer('paragraph', {
                          paragraphStyle: e.target.value as ParagraphEmphasisStyle,
                        })
                      }
                    >
                      <option value="standard">Estándar fluido</option>
                      <option value="dropcap">Capitular editorial (Dropcap)</option>
                      <option value="lead-highlight">Bloque introductorio destacado</option>
                    </select>
                  </div>
                )}

                {(selectedBlockType === 'h2' || selectedBlockType === 'h3') && (
                  <div className="form-field tpl-col-span-2">
                    <div className="tpl-field-head">
                      <span>Decoración de encabezado</span>
                      <OriginPill
                        source={blockOverride.headingDecoration ? 'block' : 'blog'}
                        hasOverride={Boolean(blockOverride.headingDecoration)}
                        onReset={() => onResetBlockField(selectedBlockType, 'headingDecoration')}
                      />
                    </div>
                    <select
                      className="form-input"
                      value={resolvedBlock.headingDecoration}
                      onChange={(e) =>
                        onUpdateBlockLayer(selectedBlockType, {
                          headingDecoration: e.target.value as HeadingDecorationStyle,
                        })
                      }
                    >
                      <option value="clean">Limpio tipográfico</option>
                      <option value="bottom-rule">Línea inferior sutil</option>
                      <option value="left-accent">Barra lateral con acento</option>
                      <option value="numbered-pill">Indicador técnico acentuado</option>
                    </select>
                  </div>
                )}

                {selectedBlockType === 'code' && (
                  <>
                    <div className="form-field">
                      <div className="tpl-field-head">
                        <span>Tema de sintaxis</span>
                        <OriginPill
                          source={blockOverride.codeTheme ? 'block' : 'blog'}
                          hasOverride={Boolean(blockOverride.codeTheme)}
                          onReset={() => onResetBlockField('code', 'codeTheme')}
                        />
                      </div>
                      <select
                        className="form-input"
                        value={resolvedBlock.codeTheme}
                        onChange={(e) =>
                          onUpdateBlockLayer('code', {
                            codeTheme: e.target.value as CodeBlockTheme,
                          })
                        }
                      >
                        <option value="dark-slate">Dark Slate</option>
                        <option value="midnight">Midnight Obsidian</option>
                        <option value="emerald-cli">Emerald CLI</option>
                        <option value="light-paper">Light Paper</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <div className="tpl-field-head">
                        <span>Marco superior</span>
                        <OriginPill
                          source={blockOverride.codeChrome ? 'block' : 'blog'}
                          hasOverride={Boolean(blockOverride.codeChrome)}
                          onReset={() => onResetBlockField('code', 'codeChrome')}
                        />
                      </div>
                      <select
                        className="form-input"
                        value={resolvedBlock.codeChrome}
                        onChange={(e) =>
                          onUpdateBlockLayer('code', {
                            codeChrome: e.target.value as CodeChromeStyle,
                          })
                        }
                      >
                        <option value="macos-dots">Ventana macOS (3 puntos)</option>
                        <option value="minimal-bar">Barra minimalista</option>
                        <option value="borderless">Sin barra superior</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedBlockType === 'callout' && (
                  <>
                    <div className="form-field">
                      <div className="tpl-field-head">
                        <span>Superficie del Callout</span>
                        <OriginPill
                          source={blockOverride.calloutSurface ? 'block' : 'blog'}
                          hasOverride={Boolean(blockOverride.calloutSurface)}
                          onReset={() => onResetBlockField('callout', 'calloutSurface')}
                        />
                      </div>
                      <select
                        className="form-input"
                        value={resolvedBlock.calloutSurface}
                        onChange={(e) =>
                          onUpdateBlockLayer('callout', {
                            calloutSurface: e.target.value as CalloutSurfaceStyle,
                          })
                        }
                      >
                        <option value="left-bar">Borde lateral destacado</option>
                        <option value="soft-tint">Fondo tintado suave</option>
                        <option value="outlined">Contorno definido</option>
                        <option value="banner">Banner editorial</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <span>Iconografía</span>
                      <label className="tpl-check-item" style={{ marginTop: '6px' }}>
                        <input
                          type="checkbox"
                          checked={resolvedBlock.showCalloutIcon}
                          onChange={(e) =>
                            onUpdateBlockLayer('callout', { showCalloutIcon: e.target.checked })
                          }
                        />
                        Mostrar icono contextual
                      </label>
                    </div>
                  </>
                )}

                {selectedBlockType === 'quote' && (
                  <>
                    <div className="form-field">
                      <div className="tpl-field-head">
                        <span>Estilo de cita</span>
                        <OriginPill
                          source={blockOverride.quoteStyle ? 'block' : 'blog'}
                          hasOverride={Boolean(blockOverride.quoteStyle)}
                          onReset={() => onResetBlockField('quote', 'quoteStyle')}
                        />
                      </div>
                      <select
                        className="form-input"
                        value={resolvedBlock.quoteStyle}
                        onChange={(e) =>
                          onUpdateBlockLayer('quote', {
                            quoteStyle: e.target.value as QuoteSurfaceStyle,
                          })
                        }
                      >
                        <option value="left-border">Barra lateral clásica</option>
                        <option value="editorial-mark">Comillas editoriales</option>
                        <option value="centered-serif">Centrada serif</option>
                        <option value="card">Tarjeta elevada</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <span>Estilo tipográfico</span>
                      <label className="tpl-check-item" style={{ marginTop: '6px' }}>
                        <input
                          type="checkbox"
                          checked={resolvedBlock.quoteItalic}
                          onChange={(e) =>
                            onUpdateBlockLayer('quote', { quoteItalic: e.target.checked })
                          }
                        />
                        Texto en cursiva
                      </label>
                    </div>
                  </>
                )}

                {selectedBlockType === 'list' && (
                  <div className="form-field tpl-col-span-2">
                    <div className="tpl-field-head">
                      <span>Estilo de viñetas</span>
                      <OriginPill
                        source={blockOverride.listMarker ? 'block' : 'blog'}
                        hasOverride={Boolean(blockOverride.listMarker)}
                        onReset={() => onResetBlockField('list', 'listMarker')}
                      />
                    </div>
                    <select
                      className="form-input"
                      value={resolvedBlock.listMarker}
                      onChange={(e) =>
                        onUpdateBlockLayer('list', {
                          listMarker: e.target.value as ListMarkerStyle,
                        })
                      }
                    >
                      <option value="disc">Viñeta clásica</option>
                      <option value="accent-dot">Puntos con color de acento</option>
                      <option value="check-badge">Checklist verificada</option>
                      <option value="step-number">Pasos numerados</option>
                    </select>
                  </div>
                )}

                {selectedBlockType === 'image' && (
                  <>
                    <div className="form-field">
                      <div className="tpl-field-head">
                        <span>Marco de imagen</span>
                        <OriginPill
                          source={blockOverride.imageFrame ? 'block' : 'blog'}
                          hasOverride={Boolean(blockOverride.imageFrame)}
                          onReset={() => onResetBlockField('image', 'imageFrame')}
                        />
                      </div>
                      <select
                        className="form-input"
                        value={resolvedBlock.imageFrame}
                        onChange={(e) =>
                          onUpdateBlockLayer('image', {
                            imageFrame: e.target.value as ImageFrameStyle,
                          })
                        }
                      >
                        <option value="clean">Sin marco</option>
                        <option value="bordered">Borde fino</option>
                        <option value="elevated">Tarjeta con sombra</option>
                        <option value="rounded-pill">Esquinas suaves amplias</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <span>Alineación de pie de foto</span>
                      <select
                        className="form-input"
                        value={resolvedBlock.imageCaptionAlign}
                        onChange={(e) =>
                          onUpdateBlockLayer('image', {
                            imageCaptionAlign: e.target.value as 'left' | 'center',
                          })
                        }
                      >
                        <option value="center">Centrado</option>
                        <option value="left">Alineado a la izquierda</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedBlockType === 'divider' && (
                  <div className="form-field tpl-col-span-2">
                    <div className="tpl-field-head">
                      <span>Patrón del separador</span>
                      <OriginPill
                        source={blockOverride.dividerPattern ? 'block' : 'blog'}
                        hasOverride={Boolean(blockOverride.dividerPattern)}
                        onReset={() => onResetBlockField('divider', 'dividerPattern')}
                      />
                    </div>
                    <select
                      className="form-input"
                      value={resolvedBlock.dividerPattern}
                      onChange={(e) =>
                        onUpdateBlockLayer('divider', {
                          dividerPattern: e.target.value as DividerPatternStyle,
                        })
                      }
                    >
                      <option value="solid">Línea sólida continua</option>
                      <option value="dashed">Línea discontinua</option>
                      <option value="dots">Tres puntos editoriales</option>
                      <option value="gradient-fade">Degradado con color acento</option>
                    </select>
                  </div>
                )}

                {/* Tokens compartidos heredables a nivel Canvas Block */}
                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Color de acento del bloque</span>
                    <OriginPill
                      source={resolvedBlock.accentColor.source}
                      hasOverride={resolvedBlock.accentColor.hasOverride}
                      onReset={() => onResetBlockField(selectedBlockType, 'accentColor')}
                    />
                  </div>
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={resolvedBlock.accentColor.value}
                      onChange={(e) =>
                        onUpdateBlockLayer(selectedBlockType, { accentColor: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={resolvedBlock.accentColor.value}
                      onChange={(e) =>
                        onUpdateBlockLayer(selectedBlockType, { accentColor: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Fondo del bloque</span>
                    <OriginPill
                      source={resolvedBlock.backgroundColor.source}
                      hasOverride={resolvedBlock.backgroundColor.hasOverride}
                      onReset={() => onResetBlockField(selectedBlockType, 'backgroundColor')}
                    />
                  </div>
                  <div className="tpl-color-row">
                    <input
                      type="color"
                      value={resolvedBlock.backgroundColor.value}
                      onChange={(e) =>
                        onUpdateBlockLayer(selectedBlockType, { backgroundColor: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={resolvedBlock.backgroundColor.value}
                      onChange={(e) =>
                        onUpdateBlockLayer(selectedBlockType, { backgroundColor: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Radio del bloque ({resolvedBlock.borderRadius.value}px)</span>
                    <OriginPill
                      source={resolvedBlock.borderRadius.source}
                      hasOverride={resolvedBlock.borderRadius.hasOverride}
                      onReset={() => onResetBlockField(selectedBlockType, 'borderRadius')}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={2}
                    value={resolvedBlock.borderRadius.value}
                    onChange={(e) =>
                      onUpdateBlockLayer(selectedBlockType, {
                        borderRadius: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Elevación / Sombra</span>
                    <OriginPill
                      source={resolvedBlock.shadowStyle.source}
                      hasOverride={resolvedBlock.shadowStyle.hasOverride}
                      onReset={() => onResetBlockField(selectedBlockType, 'shadowStyle')}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={resolvedBlock.shadowStyle.value}
                    onChange={(e) =>
                      onUpdateBlockLayer(selectedBlockType, {
                        shadowStyle: e.target.value as ShadowStyle,
                      })
                    }
                  >
                    <option value="none">Plana (sin sombra)</option>
                    <option value="soft">Sombra suave</option>
                    <option value="elevated">Elevada</option>
                  </select>
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Margen vertical ({resolvedBlock.marginY.value}px)</span>
                    <OriginPill
                      source={resolvedBlock.marginY.source}
                      hasOverride={resolvedBlock.marginY.hasOverride}
                      onReset={() => onResetBlockField(selectedBlockType, 'marginY')}
                    />
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={36}
                    step={2}
                    value={resolvedBlock.marginY.value}
                    onChange={(e) =>
                      onUpdateBlockLayer(selectedBlockType, { marginY: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-field">
                  <div className="tpl-field-head">
                    <span>Ajuste tipográfico ({resolvedBlock.fontSize.value}px)</span>
                    <OriginPill
                      source={resolvedBlock.fontSize.source}
                      hasOverride={resolvedBlock.fontSize.hasOverride}
                      onReset={() => onResetBlockField(selectedBlockType, 'fontSizeDelta')}
                    />
                  </div>
                  <input
                    type="range"
                    min={-3}
                    max={5}
                    step={1}
                    value={blockOverride.fontSizeDelta ?? 0}
                    onChange={(e) =>
                      onUpdateBlockLayer(selectedBlockType, {
                        fontSizeDelta: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
