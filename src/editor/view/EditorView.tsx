import '@editor/view/editor.css';
import { useEditorViewModel } from '@editor/viewmodel/useEditorViewModel';
import { EditorPane } from '@editor/view/EditorPane';
import { PreviewPane } from '@editor/view/PreviewPane';
import { InspectorSidebar } from '@editor/view/InspectorSidebar';
import { ExportModal } from '@editor/view/ExportModal';
import { sharedUtilsService } from '@shared/service/shared-utils.service';
import { IconFileEdit, IconThemeContrast } from '@shared/view/SvgIcons';

interface EditorViewProps {
  onToggleTheme: () => void;
  onNotify: (text: string) => void;
}

const STATUS_LABELS = {
  draft: 'Borrador',
  review: 'En revisión',
  published: 'Publicado',
} as const;

export function EditorView({
  onToggleTheme,
  onNotify,
}: EditorViewProps) {
  const vm = useEditorViewModel(onNotify);

  const handleUploadImageSlotFile = async (blockId: string, imageId: string, file: File) => {
    const dataUrl = await sharedUtilsService.readFileAsDataUrl(file);
    vm.updateImageSlot(blockId, imageId, (slot) => ({ ...slot, url: dataUrl }));
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand">
            <div className="brand-icon">
              <IconFileEdit size={15} />
            </div>
            <span>InkStack CMS</span>
          </div>

          <button
            type="button"
            className="status-pill"
            data-status={vm.doc.status}
            data-tooltip="Cambia rápidamente el estado entre Borrador, En revisión y Publicado"
            onClick={vm.cycleStatus}
          >
            <span className="status-dot" />
            <span>{STATUS_LABELS[vm.doc.status]}</span>
          </button>

          <span className="save-indicator">{vm.saveLabel}</span>
        </div>

        <div>
          <div className="segmented">
            <button
              type="button"
              className={vm.viewMode === 'split' ? 'active' : ''}
              data-tooltip="Muestra la vista de diseño a la izquierda y la vista previa en vivo a la derecha"
              onClick={() => vm.setViewMode('split')}
            >
              Dividida
            </button>
            <button
              type="button"
              className={vm.viewMode === 'preview' ? 'active' : ''}
              data-tooltip="Muestra únicamente la vista previa con selector de ancho y alto de pantalla"
              onClick={() => vm.setViewMode('preview')}
            >
              Vista Previa
            </button>
          </div>
        </div>

        <div className="topbar-right">
          <span className="stats-chip">
            {vm.stats.words} palabras · {vm.stats.readTime} min
          </span>
          <button
            type="button"
            className="btn btn-icon"
            data-tooltip="Alterna entre tema claro y tema oscuro"
            onClick={onToggleTheme}
          >
            <IconThemeContrast size={15} />
          </button>
          <button
            type="button"
            className="btn"
            data-tooltip="Abre el exportador para copiar o descargar en Markdown o JSON"
            onClick={() => vm.setExportModalOpen(true)}
          >
            Exportar
          </button>
          <button
            type="button"
            className="btn"
            data-tooltip="Muestra u oculta el panel lateral derecho de configuración"
            onClick={() => vm.setSidebarCollapsed((prev) => !prev)}
          >
            {vm.sidebarCollapsed ? 'Mostrar panel' : 'Ocultar panel'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-tooltip="Marca el artículo como Publicado y genera su slug si falta"
            onClick={vm.publishPost}
          >
            Publicar
          </button>
        </div>
      </header>

      <main
        className={`workspace ${vm.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
        data-view={vm.viewMode}
      >
        <div className="panes">
          <EditorPane
            doc={vm.doc}
            focusedBlockId={vm.focusedBlockId}
            draggedBlockId={vm.draggedBlockId}
            dropHint={vm.dropHint}
            onFocusHandled={() => vm.setFocusedBlockId(null)}
            onUpdateDoc={vm.updateDoc}
            onSetCoverUrl={vm.setCoverImageUrl}
            onUploadCoverFile={vm.uploadCoverFile}
            onClearCoverImage={vm.clearCoverImage}
            onDeleteCoverSection={vm.deleteCoverSection}
            onRestoreCoverSection={vm.restoreCoverSection}
            onAddBlock={vm.addBlock}
            onUpdateBlock={vm.updateBlock}
            onMoveBlock={vm.moveBlock}
            onDuplicateBlock={vm.duplicateBlock}
            onDeleteBlock={vm.deleteBlock}
            onSetDraggedBlockId={vm.setDraggedBlockId}
            onSetDropHint={vm.setDropHint}
            onReorderByDrop={vm.reorderBlockByDrop}
            onAddImageSlot={vm.addImageSlot}
            onUpdateImageSlot={vm.updateImageSlot}
            onRemoveImageSlot={vm.removeImageSlot}
            onUploadImageFile={handleUploadImageSlotFile}
            onNotify={onNotify}
          />

          <PreviewPane
            doc={vm.doc}
            stats={vm.stats}
            headings={vm.headings}
            viewMode={vm.viewMode}
            vpPreset={vm.vpPreset}
            vpWidth={vm.vpWidth}
            vpHeight={vm.vpHeight}
            onVpPresetChange={vm.applyVpPreset}
            onVpWidthChange={vm.setVpWidth}
            onVpHeightChange={vm.setVpHeight}
            onVpReset={vm.resetVpPreset}
            onUpdateDoc={vm.updateDoc}
            onUpdateBlock={vm.updateBlock}
            onUpdateImageSlot={vm.updateImageSlot}
            onNotify={onNotify}
          />
        </div>

        <InspectorSidebar
          doc={vm.doc}
          stats={vm.stats}
          headings={vm.headings}
          sidebarTab={vm.sidebarTab}
          allProseFonts={vm.allProseFonts}
          allCodeFonts={vm.allCodeFonts}
          onTabChange={vm.setSidebarTab}
          onCloseSidebar={() => vm.setSidebarCollapsed(true)}
          onUpdateDoc={vm.updateDoc}
          onAddTag={vm.addTag}
          onRemoveTag={vm.removeTag}
          onNewBlankPost={vm.createNewBlankPost}
          onResetSamplePost={vm.resetSamplePost}
          onUpdateTypography={vm.updateTypography}
          onImportGoogleFont={vm.importGoogleFont}
          onImportLocalFontFile={vm.importLocalFontFile}
          onRemoveCustomFont={vm.removeCustomFont}
          onJumpToBlock={(blockId) => vm.setFocusedBlockId(blockId)}
        />
      </main>

      <ExportModal
        isOpen={vm.exportModalOpen}
        exportMode={vm.exportMode}
        exportContent={vm.exportContent}
        onModeChange={vm.setExportMode}
        onCopy={vm.copyExport}
        onDownload={vm.downloadExport}
        onClose={() => vm.setExportModalOpen(false)}
      />
    </>
  );
}
