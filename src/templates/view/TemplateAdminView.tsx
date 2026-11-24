import { useState } from 'react';
import {
  IconArchive,
  IconArchiveRestore,
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconLayers,
  IconPlus,
  IconRotateCcw,
  IconTrash,
} from '@shared/view/SvgIcons';
import type {
  AestheticTemplate,
  TemplateStatusFilter,
} from '@templates/model/templates.model';
import {
  BLOG_AESTHETIC_PRESETS,
  BLOG_PROFILES,
  SCENARIO_DEFINITIONS,
} from '@templates/service/templates.service';
import { TemplateCardPreview } from '@templates/view/TemplateCardPreview';

interface TemplateAdminViewProps {
  templates: AestheticTemplate[];
  selectedTemplateId: string;
  statusFilter: TemplateStatusFilter;
  activeCount: number;
  archivedCount: number;
  blogFilterId: string;
  searchQuery: string;
  onStatusFilterChange: (filter: TemplateStatusFilter) => void;
  onBlogFilterChange: (blogId: string) => void;
  onSearchChange: (q: string) => void;
  onOpenTemplate: (templateId: string) => void;
  onOpenCreateModal: () => void;
  onDuplicateTemplate: (templateId: string) => void;
  onArchiveTemplate: (templateId: string) => void;
  onRestoreTemplate: (templateId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
  onResetDefaults: () => void;
}

export function TemplateAdminView({
  templates,
  selectedTemplateId,
  statusFilter,
  activeCount,
  archivedCount,
  blogFilterId,
  searchQuery,
  onStatusFilterChange,
  onBlogFilterChange,
  onSearchChange,
  onOpenTemplate,
  onOpenCreateModal,
  onDuplicateTemplate,
  onArchiveTemplate,
  onRestoreTemplate,
  onDeleteTemplate,
  onResetDefaults,
}: TemplateAdminViewProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <main className="tpl-admin-container">
      <section className="tpl-admin-hero">
        <div className="tpl-admin-hero-copy">
          <div className="tpl-admin-kicker">
            <IconLayers size={14} />
            <span>Gestión de Estética Jerárquica</span>
          </div>
          <h1>Administración de Plantillas</h1>
          <p>
            Selecciona una plantilla para editar sus 3 capas (Blog, Tipo de Artículo y Canvas
            Blocks), crea nuevas variaciones, archiva las que no estén activas o elimínalas por
            completo.
          </p>
        </div>

        <div className="tpl-admin-hero-actions">
          <button
            type="button"
            className="btn"
            data-tooltip="Restaura las 4 plantillas base de ejemplo"
            onClick={onResetDefaults}
          >
            <IconRotateCcw size={14} />
            <span>Restaurar ejemplos</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-tooltip="Genera una nueva plantilla desde un preset o clonando una existente"
            onClick={onOpenCreateModal}
          >
            <IconPlus size={15} />
            <span>Nueva Plantilla</span>
          </button>
        </div>
      </section>

      <section className="tpl-admin-toolbar">
        <div className="segmented" role="tablist" aria-label="Filtrar por estado de plantilla">
          <button
            type="button"
            className={statusFilter === 'active' ? 'active' : ''}
            onClick={() => onStatusFilterChange('active')}
          >
            Activas ({activeCount})
          </button>
          <button
            type="button"
            className={statusFilter === 'archived' ? 'active' : ''}
            onClick={() => onStatusFilterChange('archived')}
          >
            Archivadas ({archivedCount})
          </button>
          <button
            type="button"
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => onStatusFilterChange('all')}
          >
            Todas ({activeCount + archivedCount})
          </button>
        </div>

        <div className="tpl-admin-filters">
          <input
            type="text"
            className="form-input tpl-admin-search"
            placeholder="Buscar plantilla, descripción o escenario..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select
            className="control-select"
            value={blogFilterId}
            onChange={(e) => onBlogFilterChange(e.target.value)}
          >
            <option value="all">Todos los blogs</option>
            {BLOG_PROFILES.map((blog) => (
              <option key={blog.id} value={blog.id}>
                {blog.name} ({blog.domain})
              </option>
            ))}
          </select>
        </div>
      </section>

      {templates.length > 0 ? (
        <section className="tpl-admin-grid">
          {templates.map((tpl) => {
            const blog = BLOG_PROFILES.find((b) => b.id === tpl.targetBlogId);
            const presetLabel = BLOG_AESTHETIC_PRESETS[tpl.blogLayer.preset].label;
            const artCount = Object.keys(tpl.articleTypeLayers).length;
            const blkCount = Object.keys(tpl.blockLayers).length;
            const isSelected = tpl.id === selectedTemplateId;
            const isConfirmingDelete = confirmDeleteId === tpl.id;

            return (
              <article
                key={tpl.id}
                className={`tpl-admin-card ${isSelected ? 'selected' : ''} ${tpl.archived ? 'archived' : ''}`}
              >
                <div className="tpl-admin-card-head">
                  <div className="tpl-admin-card-title-row">
                    <span
                      className="tpl-swatch"
                      style={{ background: tpl.blogLayer.accentColor }}
                    />
                    <h2 className="tpl-admin-card-title">{tpl.name}</h2>
                  </div>

                  <div className="tpl-admin-card-badges">
                    <span className="tpl-chip">{blog ? blog.name : 'Multi-blog'}</span>
                    <span className="tpl-chip">{presetLabel}</span>
                    {tpl.archived && <span className="tpl-archived-badge">Archivada</span>}
                    {isSelected && !tpl.archived && (
                      <span className="tpl-selected-badge">
                        <IconCheck size={11} />
                        <span>En foco</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Imagen central de la card: Preview visual en miniatura */}
                <button
                  type="button"
                  className="tpl-card-preview-stage"
                  data-tooltip="Haz clic para abrir y editar las 3 capas de esta plantilla"
                  onClick={() => onOpenTemplate(tpl.id)}
                >
                  <TemplateCardPreview template={tpl} />
                  <span className="tpl-card-preview-overlay">
                    <span>Abrir editor de capas</span>
                    <IconArrowRight size={13} />
                  </span>
                </button>

                <div className="tpl-admin-card-body">
                  <p className="tpl-admin-card-desc">{tpl.description}</p>

                  <div className="tpl-admin-card-meta">
                    <div className="tpl-admin-scenarios">
                      {tpl.scenarios.slice(0, 3).map((scKey) => {
                        const sc = SCENARIO_DEFINITIONS.find((item) => item.key === scKey);
                        return (
                          <span key={scKey} className="tpl-chip">
                            {sc?.badge || scKey}
                          </span>
                        );
                      })}
                    </div>
                    <div className="tpl-card-layers-mini">
                      <span>C1: Blog</span>
                      <span>·</span>
                      <span>C2: {artCount} tipos</span>
                      <span>·</span>
                      <span>C3: {blkCount} blocks</span>
                    </div>
                  </div>
                </div>

                <footer className="tpl-admin-card-actions">
                  {isConfirmingDelete ? (
                    <div className="tpl-delete-confirm-bar">
                      <span>¿Eliminar definitivamente?</span>
                      <div className="tpl-delete-confirm-btns">
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm tpl-btn-danger-solid"
                          onClick={() => {
                            setConfirmDeleteId(null);
                            onDeleteTemplate(tpl.id);
                          }}
                        >
                          <IconTrash size={13} />
                          <span>Confirmar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm tpl-work-btn"
                        data-tooltip="Selecciona esta plantilla para editar su jerarquía en 3 capas"
                        onClick={() => onOpenTemplate(tpl.id)}
                      >
                        <span>Trabajar</span>
                        <IconArrowRight size={13} />
                      </button>

                      <div className="tpl-admin-icon-actions">
                        <button
                          type="button"
                          className="btn btn-icon btn-sm"
                          data-tooltip="Duplicar plantilla"
                          onClick={() => onDuplicateTemplate(tpl.id)}
                        >
                          <IconCopy size={14} />
                        </button>

                        {tpl.archived ? (
                          <button
                            type="button"
                            className="btn btn-icon btn-sm"
                            data-tooltip="Restaurar plantilla desde archivo"
                            onClick={() => onRestoreTemplate(tpl.id)}
                          >
                            <IconArchiveRestore size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-icon btn-sm"
                            data-tooltip="Archivar plantilla"
                            onClick={() => onArchiveTemplate(tpl.id)}
                          >
                            <IconArchive size={14} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-danger-ghost"
                          data-tooltip="Eliminar plantilla por completo"
                          onClick={() => setConfirmDeleteId(tpl.id)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </footer>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="tpl-admin-empty">
          <div className="tpl-admin-empty-icon">
            <IconLayers size={28} />
          </div>
          <h2>
            {statusFilter === 'archived'
              ? 'No hay plantillas archivadas'
              : 'No se encontraron plantillas'}
          </h2>
          <p>
            {statusFilter === 'archived'
              ? 'Cuando archives una plantilla aparecerá aquí para restaurarla o eliminarla.'
              : 'Crea una nueva plantilla personalizada o restaura el catálogo inicial de ejemplo.'}
          </p>
          <div className="tpl-admin-empty-actions">
            <button type="button" className="btn btn-primary" onClick={onOpenCreateModal}>
              <IconPlus size={14} />
              <span>Generar Nueva Plantilla</span>
            </button>
            <button type="button" className="btn" onClick={onResetDefaults}>
              <IconRotateCcw size={14} />
              <span>Restaurar ejemplos</span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
