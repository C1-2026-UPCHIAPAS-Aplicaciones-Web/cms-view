import { useState } from 'react';
import type { AddSiteFormInput } from '@dashboard/model/dashboard.model';
import { IconClose } from '@shared/view/SvgIcons';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: AddSiteFormInput) => void;
}

export function AddSiteModal({ isOpen, onClose, onSave }: AddSiteModalProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [weeklyVisits, setWeeklyVisits] = useState(4200);
  const [retentionMin, setRetentionMin] = useState(4.8);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name, domain, weeklyVisits, retentionMin });
    setName('');
    setDomain('');
    setWeeklyVisits(4200);
    setRetentionMin(4.8);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label="Agregar sitio administrado">
        <div className="modal-header">
          <span>Agregar sitio administrado</span>
          <button type="button" className="btn btn-sm btn-icon" onClick={onClose}>
            <IconClose size={14} />
          </button>
        </div>
        <div className="modal-body">
          <label className="form-field">
            Nombre del blog / sitio
            <input
              type="text"
              className="form-input"
              placeholder="Ej. Rust en Español"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="form-field">
            Dominio
            <input
              type="text"
              className="form-input"
              placeholder="Ej. rustblog.dev"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </label>
          <label className="form-field">
            Visitas base semanales (simuladas)
            <input
              type="number"
              className="form-input"
              min={100}
              value={weeklyVisits}
              onChange={(e) => setWeeklyVisits(Number(e.target.value))}
            />
          </label>
          <label className="form-field">
            Retención promedio (min / usuario)
            <input
              type="number"
              className="form-input"
              step={0.1}
              min={0.5}
              max={30}
              value={retentionMin}
              onChange={(e) => setRetentionMin(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Guardar sitio
          </button>
        </div>
      </div>
    </div>
  );
}
