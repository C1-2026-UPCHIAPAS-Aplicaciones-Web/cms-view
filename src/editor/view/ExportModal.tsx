import type { ExportMode } from '@editor/model/editor.model';
import { IconClose } from '@shared/view/SvgIcons';

interface ExportModalProps {
  isOpen: boolean;
  exportMode: ExportMode;
  exportContent: string;
  onModeChange: (mode: ExportMode) => void;
  onCopy: () => void;
  onDownload: () => void;
  onClose: () => void;
}

export function ExportModal({
  isOpen,
  exportMode,
  exportContent,
  onModeChange,
  onCopy,
  onDownload,
  onClose,
}: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal modal-wide" role="dialog" aria-modal="true" aria-label="Exportar artículo">
        <div className="modal-header">
          <span>Exportar artículo</span>
          <button
            type="button"
            className="icon-action"
            data-tooltip="Cierra la ventana de exportación"
            onClick={onClose}
          >
            <IconClose size={14} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <button
              type="button"
              className={`btn btn-sm ${exportMode === 'md' ? 'btn-primary' : ''}`}
              data-tooltip="Genera el artículo en formato Markdown con metadatos Frontmatter"
              onClick={() => onModeChange('md')}
            >
              Markdown + Frontmatter
            </button>
            <button
              type="button"
              className={`btn btn-sm ${exportMode === 'json' ? 'btn-primary' : ''}`}
              data-tooltip="Genera el esquema JSON completo del artículo y sus bloques"
              onClick={() => onModeChange('json')}
            >
              JSON estructurado
            </button>
          </div>
          <pre className="modal-pre">{exportContent}</pre>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn"
            data-tooltip="Copia el texto exportado al portapapeles"
            onClick={onCopy}
          >
            Copiar contenido
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-tooltip="Descarga el artículo como archivo .md o .json"
            onClick={onDownload}
          >
            Descargar archivo
          </button>
        </div>
      </div>
    </div>
  );
}
