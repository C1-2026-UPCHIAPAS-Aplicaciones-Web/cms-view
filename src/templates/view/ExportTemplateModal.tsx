import { IconClose } from '@shared/view/SvgIcons';
import type { TemplateExportFormat } from '@templates/model/templates.model';

interface ExportTemplateModalProps {
  isOpen: boolean;
  exportFormat: TemplateExportFormat;
  exportContent: string;
  onFormatChange: (fmt: TemplateExportFormat) => void;
  onCopy: () => void;
  onDownload: () => void;
  onClose: () => void;
}

export function ExportTemplateModal({
  isOpen,
  exportFormat,
  exportContent,
  onFormatChange,
  onCopy,
  onDownload,
  onClose,
}: ExportTemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal modal-wide">
        <div className="modal-header">
          <span>Exportar Plantilla y Tokens de Cascada</span>
          <button
            type="button"
            className="btn btn-icon btn-sm"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <IconClose size={14} />
          </button>
        </div>

        <div className="modal-body">
          <div className="segmented" style={{ alignSelf: 'flex-start' }}>
            <button
              type="button"
              className={exportFormat === 'css' ? 'active' : ''}
              onClick={() => onFormatChange('css')}
            >
              Variables CSS (3 Capas)
            </button>
            <button
              type="button"
              className={exportFormat === 'json' ? 'active' : ''}
              onClick={() => onFormatChange('json')}
            >
              JSON Completo + Resolución
            </button>
          </div>

          <textarea
            className="form-input tpl-export-area"
            readOnly
            value={exportContent}
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onCopy}>
            Copiar
          </button>
          <button type="button" className="btn btn-primary" onClick={onDownload}>
            Descargar archivo
          </button>
        </div>
      </div>
    </div>
  );
}
