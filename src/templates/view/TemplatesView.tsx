import '@templates/view/templates.css';
import {
  IconArrowLeft,
  IconCheck,
  IconLayers,
  IconPlus,
  IconThemeContrast,
} from '@shared/view/SvgIcons';
import type { ScenarioKey } from '@templates/model/templates.model';
import { BLOG_PROFILES, SCENARIO_DEFINITIONS } from '@templates/service/templates.service';
import { useTemplatesViewModel } from '@templates/viewmodel/useTemplatesViewModel';
import { TemplateAdminView } from '@templates/view/TemplateAdminView';
import { StyleLevelSidebar } from '@templates/view/StyleLevelSidebar';
import { HierarchyLayerEditor } from '@templates/view/HierarchyLayerEditor';
import { TemplateLivePreview } from '@templates/view/TemplateLivePreview';
import { CreateTemplateModal } from '@templates/view/CreateTemplateModal';
import { ExportTemplateModal } from '@templates/view/ExportTemplateModal';

interface TemplatesViewProps {
  onOpenEditor: () => void;
  onToggleTheme: () => void;
  onNotify: (text: string) => void;
}

export function TemplatesView({
  onOpenEditor,
  onToggleTheme,
  onNotify,
}: TemplatesViewProps) {
  const vm = useTemplatesViewModel(onNotify);

  const canRenderEditor =
    vm.screenMode === 'editor' &&
    Boolean(vm.activeTemplate) &&
    Boolean(vm.resolvedArticleAesthetic) &&
    Boolean(vm.resolvedBlocksMap) &&
    Boolean(vm.activeResolvedBlock);

  const activeTemplate = vm.activeTemplate;
  const isAssignedToCurrent = Boolean(
    activeTemplate &&
      vm.currentAssignment?.templateId === activeTemplate.id &&
      vm.currentAssignment?.articleType === vm.selectedArticleType,
  );

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand">
            <div className="brand-icon">
              <IconLayers size={15} />
            </div>
            <span>InkStack Plantillas</span>
          </div>

          {canRenderEditor ? (
            <>
              <button
                type="button"
                className="btn btn-sm"
                data-tooltip="Regresar a la vista de administración de plantillas"
                onClick={vm.backToAdmin}
              >
                <IconArrowLeft size={14} />
                <span>Administración</span>
              </button>

              <div className="tpl-context-selectors">
                <select
                  className="control-select"
                  value={vm.selectedBlogId}
                  data-tooltip="Selecciona el blog objetivo para previsualizar o asignar la plantilla"
                  onChange={(e) => vm.selectBlogAndScenario(e.target.value, vm.selectedScenarioKey)}
                >
                  {BLOG_PROFILES.map((b) => (
                    <option key={b.id} value={b.id}>
                      Blog: {b.name}
                    </option>
                  ))}
                </select>

                <select
                  className="control-select"
                  value={vm.selectedScenarioKey}
                  data-tooltip="Selecciona el escenario de publicación donde se aplicará la plantilla"
                  onChange={(e) =>
                    vm.selectBlogAndScenario(vm.selectedBlogId, e.target.value as ScenarioKey)
                  }
                >
                  {SCENARIO_DEFINITIONS.map((sc) => (
                    <option key={sc.key} value={sc.key}>
                      Escenario: {sc.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className={`btn btn-sm ${isAssignedToCurrent ? '' : 'btn-primary'}`}
                  data-tooltip="Vincula la plantilla y tipo de artículo actuales a este blog y escenario"
                  onClick={vm.assignActiveTemplateToScenario}
                >
                  {isAssignedToCurrent && <IconCheck size={13} />}
                  <span>{isAssignedToCurrent ? 'Asignada al escenario' : 'Asignar a escenario'}</span>
                </button>
              </div>
            </>
          ) : (
            <span className="tpl-topbar-subtitle">
              Administración de catálogo, vistas previas y jerarquía en 3 capas
            </span>
          )}
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="btn btn-icon"
            data-tooltip="Alterna entre tema claro y oscuro"
            onClick={onToggleTheme}
          >
            <IconThemeContrast size={15} />
          </button>

          {canRenderEditor ? (
            <>
              <button
                type="button"
                className="btn"
                data-tooltip="Exporta los tokens CSS o JSON de la cascada de 3 capas"
                onClick={() => vm.setIsExportModalOpen(true)}
              >
                Exportar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-tooltip="Aplica la tipografía y configuración resuelta directamente al borrador del Editor CMS"
                onClick={() => {
                  vm.applyToEditor();
                  onOpenEditor();
                }}
              >
                Aplicar en Editor
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              data-tooltip="Crea una nueva plantilla jerárquica"
              onClick={() => vm.setIsCreateModalOpen(true)}
            >
              <IconPlus size={14} />
              <span>Nueva Plantilla</span>
            </button>
          )}
        </div>
      </header>

      {canRenderEditor &&
      activeTemplate &&
      vm.resolvedArticleAesthetic &&
      vm.resolvedBlocksMap &&
      vm.activeResolvedBlock ? (
        <main
          className={`tpl-workspace ${vm.styleSidebarCollapsed ? 'style-sidebar-collapsed' : ''}`}
        >
          <StyleLevelSidebar
            template={activeTemplate}
            activeLayer={vm.activeLayer}
            selectedArticleType={vm.selectedArticleType}
            selectedBlockType={vm.selectedBlockType}
            resolvedArticle={vm.resolvedArticleAesthetic}
            resolvedBlocksMap={vm.resolvedBlocksMap}
            collapsed={vm.styleSidebarCollapsed}
            onToggleCollapse={vm.toggleStyleSidebarCollapsed}
            onSelectLayer={vm.setActiveLayer}
            onSelectArticleType={vm.selectArticleTypeFromSidebar}
            onSelectBlockType={vm.selectBlockTypeFromSidebar}
          />

          <HierarchyLayerEditor
            template={activeTemplate}
            activeLayer={vm.activeLayer}
            selectedArticleType={vm.selectedArticleType}
            selectedBlockType={vm.selectedBlockType}
            resolvedArticle={vm.resolvedArticleAesthetic}
            resolvedBlock={vm.activeResolvedBlock}
            styleSidebarCollapsed={vm.styleSidebarCollapsed}
            onToggleStyleSidebar={vm.toggleStyleSidebarCollapsed}
            onSelectArticleType={vm.setSelectedArticleType}
            onSelectBlockType={vm.setSelectedBlockType}
            onUpdateMeta={vm.updateTemplateMeta}
            onToggleScenario={vm.toggleTemplateScenario}
            onApplyPreset={vm.applyBlogPreset}
            onUpdateBlogLayer={vm.updateBlogLayer}
            onUpdateArticleLayer={vm.updateArticleTypeLayer}
            onResetArticleField={vm.resetArticleTypeField}
            onResetAllArticleOverrides={vm.resetAllArticleTypeOverrides}
            onUpdateBlockLayer={vm.updateBlockLayer}
            onResetBlockField={vm.resetBlockField}
            onResetAllBlockOverrides={vm.resetAllBlockOverrides}
          />

          <TemplateLivePreview
            template={activeTemplate}
            blogProfile={vm.activeBlogProfile}
            scenarioDef={vm.activeScenarioDef}
            selectedArticleType={vm.selectedArticleType}
            selectedBlockType={vm.selectedBlockType}
            activeLayer={vm.activeLayer}
            previewTab={vm.previewTab}
            resolvedArticle={vm.resolvedArticleAesthetic}
            resolvedBlocksMap={vm.resolvedBlocksMap}
            onPreviewTabChange={vm.setPreviewTab}
            onInspectBlock={vm.inspectBlockFromPreview}
            onSelectLayer={vm.setActiveLayer}
          />
        </main>
      ) : (
        <TemplateAdminView
          templates={vm.filteredTemplates}
          selectedTemplateId={vm.selectedTemplateId}
          statusFilter={vm.statusFilter}
          activeCount={vm.activeCount}
          archivedCount={vm.archivedCount}
          blogFilterId={vm.blogFilterId}
          searchQuery={vm.searchQuery}
          onStatusFilterChange={vm.setStatusFilter}
          onBlogFilterChange={vm.setBlogFilterId}
          onSearchChange={vm.setSearchQuery}
          onOpenTemplate={vm.openTemplateToWork}
          onOpenCreateModal={() => vm.setIsCreateModalOpen(true)}
          onDuplicateTemplate={vm.duplicateTemplate}
          onArchiveTemplate={vm.archiveTemplate}
          onRestoreTemplate={vm.restoreTemplate}
          onDeleteTemplate={vm.deleteTemplate}
          onResetDefaults={vm.resetDefaultTemplates}
        />
      )}

      <CreateTemplateModal
        isOpen={vm.isCreateModalOpen}
        existingTemplates={vm.templates}
        defaultBlogId={vm.selectedBlogId}
        onClose={() => vm.setIsCreateModalOpen(false)}
        onCreate={vm.createTemplate}
      />

      <ExportTemplateModal
        isOpen={vm.isExportModalOpen}
        exportFormat={vm.exportFormat}
        exportContent={vm.exportContent}
        onFormatChange={vm.setExportFormat}
        onCopy={vm.copyExport}
        onDownload={vm.downloadExport}
        onClose={() => vm.setIsExportModalOpen(false)}
      />
    </>
  );
}
