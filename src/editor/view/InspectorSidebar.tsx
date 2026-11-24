import { useState } from 'react';
import type {
  DocumentStats,
  EditorBlock,
  FontOption,
  FontTarget,
  PostDocument,
  PostStatus,
  SidebarTab,
  TypographySettings,
} from '@editor/model/editor.model';
import { sharedUtilsService } from '@shared/service/shared-utils.service';
import { IconClose } from '@shared/view/SvgIcons';

interface InspectorSidebarProps {
  doc: PostDocument;
  stats: DocumentStats;
  headings: EditorBlock[];
  sidebarTab: SidebarTab;
  allProseFonts: FontOption[];
  allCodeFonts: FontOption[];
  onTabChange: (tab: SidebarTab) => void;
  onCloseSidebar: () => void;
  onUpdateDoc: (updater: (prev: PostDocument) => PostDocument) => void;
  onAddTag: (raw: string) => void;
  onRemoveTag: (idx: number) => void;
  onNewBlankPost: () => void;
  onResetSamplePost: () => void;
  onUpdateTypography: (patch: Partial<TypographySettings>) => void;
  onImportGoogleFont: (raw: string, target: FontTarget) => void;
  onImportLocalFontFile: (file: File, customName: string, target: FontTarget) => void;
  onRemoveCustomFont: (fontId: string) => void;
  onJumpToBlock: (blockId: string) => void;
}

export function InspectorSidebar({
  doc,
  stats,
  headings,
  sidebarTab,
  allProseFonts,
  allCodeFonts,
  onTabChange,
  onCloseSidebar,
  onUpdateDoc,
  onAddTag,
  onRemoveTag,
  onNewBlankPost,
  onResetSamplePost,
  onUpdateTypography,
  onImportGoogleFont,
  onImportLocalFontFile,
  onRemoveCustomFont,
  onJumpToBlock,
}: InspectorSidebarProps) {
  const [tagDraft, setTagDraft] = useState('');
  const [googleFontInput, setGoogleFontInput] = useState('');
  const [googleFontTarget, setGoogleFontTarget] = useState<FontTarget>('prose');
  const [localFontName, setLocalFontName] = useState('');
  const [localFontTarget, setLocalFontTarget] = useState<FontTarget>('prose');

  const currentSlug = doc.slug || sharedUtilsService.slugify(doc.title);

  return (
    <aside className="sidebar">
      <div className="sidebar-top-bar">
        <span>Configuración del artículo</span>
        <button
          type="button"
          className="icon-action"
          data-tooltip="Oculta el panel lateral derecho"
          onClick={onCloseSidebar}
        >
          <IconClose size={14} />
        </button>
      </div>

      <div className="sidebar-tabs">
        <button
          type="button"
          className={`sidebar-tab ${sidebarTab === 'publish' ? 'active' : ''}`}
          data-tooltip="Estado, URL, categoría, etiquetas y autor"
          onClick={() => onTabChange('publish')}
        >
          Publicación
        </button>
        <button
          type="button"
          className={`sidebar-tab ${sidebarTab === 'typography' ? 'active' : ''}`}
          data-tooltip="Elige o importa tipografías personalizadas y ajusta tamaños"
          onClick={() => onTabChange('typography')}
        >
          Tipografía
        </button>
        <button
          type="button"
          className={`sidebar-tab ${sidebarTab === 'seo' ? 'active' : ''}`}
          data-tooltip="Meta título, descripción y vista previa en Google"
          onClick={() => onTabChange('seo')}
        >
          SEO
        </button>
        <button
          type="button"
          className={`sidebar-tab ${sidebarTab === 'toc' ? 'active' : ''}`}
          data-tooltip="Estadísticas del artículo y navegación por encabezados"
          onClick={() => onTabChange('toc')}
        >
          Índice
        </button>
      </div>

      <div className="sidebar-content">
        {sidebarTab === 'publish' && (
          <div className="sidebar-panel">
            <div className="form-group">
              <label className="form-label">Estado editorial</label>
              <select
                className="control"
                value={doc.status}
                onChange={(e) =>
                  onUpdateDoc((prev) => ({ ...prev, status: e.target.value as PostStatus }))
                }
              >
                <option value="draft">Borrador</option>
                <option value="review">En revisión</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Slug URL</span>
                <button
                  type="button"
                  data-tooltip="Genera el slug automáticamente a partir del título"
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--accent)',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  onClick={() =>
                    onUpdateDoc((prev) => ({
                      ...prev,
                      slug: sharedUtilsService.slugify(prev.title),
                    }))
                  }
                >
                  Regenerar
                </button>
              </label>
              <input
                type="text"
                className="control"
                value={doc.slug}
                onChange={(e) => onUpdateDoc((prev) => ({ ...prev, slug: e.target.value }))}
              />
              <div className="slug-preview">https://blog.dev/posts/{currentSlug}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="control"
                value={doc.category}
                onChange={(e) => onUpdateDoc((prev) => ({ ...prev, category: e.target.value }))}
              >
                <option>Backend &amp; APIs</option>
                <option>Frontend &amp; UI</option>
                <option>Arquitectura</option>
                <option>DevOps &amp; Cloud</option>
                <option>Bases de Datos</option>
                <option>Guías Prácticas</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Etiquetas <span className="form-hint">Enter para añadir</span>
              </label>
              <div className="tags-box">
                {(doc.tags || []).map((tag, idx) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      data-tooltip="Quitar etiqueta"
                      onClick={() => onRemoveTag(idx)}
                    >
                      <IconClose size={11} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="ej. typescript..."
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      onAddTag(tagDraft);
                      setTagDraft('');
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Autor</label>
              <input
                type="text"
                className="control"
                value={doc.author}
                onChange={(e) => onUpdateDoc((prev) => ({ ...prev, author: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de publicación</label>
              <input
                type="date"
                className="control"
                value={doc.date}
                onChange={(e) => onUpdateDoc((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div
              className="form-group"
              style={{
                paddingTop: '8px',
                borderTop: '1px solid var(--border)',
                flexDirection: 'row',
                gap: '8px',
              }}
            >
              <button
                type="button"
                className="btn btn-sm"
                style={{ flex: 1 }}
                data-tooltip="Inicia un artículo vacío conservando tus tipografías"
                onClick={onNewBlankPost}
              >
                Nuevo en blanco
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ flex: 1 }}
                data-tooltip="Restaura el artículo de ejemplo original"
                onClick={onResetSamplePost}
              >
                Restaurar ejemplo
              </button>
            </div>
          </div>
        )}

        {sidebarTab === 'typography' && (
          <div className="sidebar-panel">
            <div className="form-group">
              <label className="form-label">Tipografía de Títulos</label>
              <select
                className="control"
                value={doc.typography.headingFont}
                onChange={(e) => onUpdateTypography({ headingFont: e.target.value })}
              >
                {allProseFonts.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipografía del Cuerpo</label>
              <select
                className="control"
                value={doc.typography.bodyFont}
                onChange={(e) => onUpdateTypography({ bodyFont: e.target.value })}
              >
                {allProseFonts.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipografía de Código</label>
              <select
                className="control"
                value={doc.typography.codeFont}
                onChange={(e) => onUpdateTypography({ codeFont: e.target.value })}
              >
                {allCodeFonts.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Tamaño de lectura</span>
                <span className="form-hint">{doc.typography.fontSize}px</span>
              </label>
              <input
                type="range"
                min={14}
                max={20}
                step={1}
                value={doc.typography.fontSize}
                onChange={(e) => onUpdateTypography({ fontSize: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Interlineado</span>
                <span className="form-hint">{doc.typography.lineHeight}</span>
              </label>
              <input
                type="range"
                min={1.45}
                max={1.95}
                step={0.05}
                value={doc.typography.lineHeight}
                onChange={(e) => onUpdateTypography({ lineHeight: Number(e.target.value) })}
              />
            </div>

            <div className="font-import-card">
              <div className="form-label">Importar desde Google Fonts</div>
              <input
                type="text"
                className="control"
                placeholder="Nombre (ej. Outfit) o URL CSS..."
                value={googleFontInput}
                onChange={(e) => setGoogleFontInput(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <select
                  className="control"
                  style={{ flex: 1 }}
                  value={googleFontTarget}
                  onChange={(e) => setGoogleFontTarget(e.target.value as FontTarget)}
                >
                  <option value="prose">Para textos / títulos</option>
                  <option value="code">Para código</option>
                </select>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  data-tooltip="Carga la fuente desde Google Fonts y la agrega a los selectores"
                  onClick={() => {
                    if (!googleFontInput.trim()) return;
                    onImportGoogleFont(googleFontInput, googleFontTarget);
                    setGoogleFontInput('');
                  }}
                >
                  Importar
                </button>
              </div>
            </div>

            <div className="font-import-card">
              <div className="form-label">Subir fuente local (.woff2, .ttf, .otf)</div>
              <input
                type="text"
                className="control"
                placeholder="Nombre de la fuente (opcional)..."
                value={localFontName}
                onChange={(e) => setLocalFontName(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <select
                  className="control"
                  style={{ flex: 1 }}
                  value={localFontTarget}
                  onChange={(e) => setLocalFontTarget(e.target.value as FontTarget)}
                >
                  <option value="prose">Para textos / títulos</option>
                  <option value="code">Para código</option>
                </select>
                <label
                  className="btn btn-sm"
                  style={{ cursor: 'pointer' }}
                  data-tooltip="Importa un archivo de fuente desde tu equipo"
                >
                  Subir archivo
                  <input
                    type="file"
                    accept=".woff2,.woff,.ttf,.otf"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImportLocalFontFile(file, localFontName, localFontTarget);
                        setLocalFontName('');
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>

            {doc.typography.customFonts.length > 0 && (
              <div className="form-group">
                <label className="form-label">Fuentes importadas</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {doc.typography.customFonts.map((f) => (
                    <div key={f.id} className="custom-font-chip">
                      <span>
                        <strong>{f.name}</strong> ({f.target === 'code' ? 'Código' : 'Texto'})
                      </span>
                      <button
                        type="button"
                        className="icon-action delete"
                        data-tooltip="Elimina esta fuente importada"
                        onClick={() => onRemoveCustomFont(f.id)}
                      >
                        <IconClose size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {sidebarTab === 'seo' && (
          <div className="sidebar-panel">
            <div className="form-group">
              <label className="form-label">
                <span>Meta Título</span>
                <span className="form-hint">{(doc.seoTitle || '').length}/60</span>
              </label>
              <input
                type="text"
                className="control"
                placeholder="Título para buscadores..."
                value={doc.seoTitle}
                onChange={(e) => onUpdateDoc((prev) => ({ ...prev, seoTitle: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Meta Descripción</span>
                <span className="form-hint">{(doc.seoDesc || '').length}/160</span>
              </label>
              <textarea
                className="control"
                rows={3}
                placeholder="Descripción breve para resultados de búsqueda..."
                value={doc.seoDesc}
                onChange={(e) => onUpdateDoc((prev) => ({ ...prev, seoDesc: e.target.value }))}
              />
            </div>

            <div className="seo-card">
              <div className="seo-card-label">Vista previa en Google</div>
              <div className="google-url">blog.dev › posts › {currentSlug}</div>
              <div className="google-title">
                {doc.seoTitle || doc.title || 'Título del artículo'}
              </div>
              <div className="google-desc">
                {doc.seoDesc ||
                  doc.excerpt ||
                  'Añade una descripción meta para mejorar tu posicionamiento.'}
              </div>
            </div>

            <div className="form-group">
              <label
                className="form-label"
                style={{ justifyContent: 'flex-start', gap: '8px', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={doc.showToc !== false}
                  onChange={(e) =>
                    onUpdateDoc((prev) => ({ ...prev, showToc: e.target.checked }))
                  }
                />
                <span>Mostrar Tabla de Contenidos en el artículo</span>
              </label>
            </div>
          </div>
        )}

        {sidebarTab === 'toc' && (
          <div className="sidebar-panel">
            <div className="metrics-grid">
              <div className="metric-box">
                <div className="metric-val">{stats.words}</div>
                <div className="metric-lbl">Palabras</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{stats.readTime} min</div>
                <div className="metric-lbl">Lectura est.</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{stats.codeBlocks}</div>
                <div className="metric-lbl">Bloques código</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">{stats.totalBlocks}</div>
                <div className="metric-lbl">Total bloques</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Estructura del artículo (H2 / H3)</label>
              <div className="sidebar-toc-list">
                {headings.length > 0 ? (
                  headings.map((h) => (
                    <div
                      key={h.id}
                      className={`sidebar-toc-item level-${h.type}`}
                      onClick={() => onJumpToBlock(h.id)}
                    >
                      {h.text}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Añade bloques H2 o H3 para ver la estructura.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
