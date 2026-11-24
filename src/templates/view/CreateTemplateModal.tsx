import { useState, type FormEvent } from 'react';
import { IconClose } from '@shared/view/SvgIcons';
import type {
  AestheticTemplate,
  BlogAestheticPreset,
  CreateTemplateInput,
  ScenarioKey,
} from '@templates/model/templates.model';
import {
  BLOG_AESTHETIC_PRESETS,
  BLOG_PROFILES,
  SCENARIO_DEFINITIONS,
} from '@templates/service/templates.service';

interface CreateTemplateModalProps {
  isOpen: boolean;
  existingTemplates: AestheticTemplate[];
  defaultBlogId: string;
  onClose: () => void;
  onCreate: (input: CreateTemplateInput) => void;
}

export function CreateTemplateModal({
  isOpen,
  existingTemplates,
  defaultBlogId,
  onClose,
  onCreate,
}: CreateTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetBlogId, setTargetBlogId] = useState<string>(defaultBlogId || 'all');
  const [preset, setPreset] = useState<BlogAestheticPreset>('editorial-minimal');
  const [baseTemplateId, setBaseTemplateId] = useState<string>('');
  const [scenarios, setScenarios] = useState<ScenarioKey[]>(['technical-tutorial']);

  if (!isOpen) return null;

  const toggleScenario = (key: ScenarioKey) => {
    setScenarios((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((s) => s !== key)
          : prev
        : [...prev, key],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      name,
      description,
      targetBlogId,
      scenarios,
      preset,
      baseTemplateId: baseTemplateId || undefined,
    });
    setName('');
    setDescription('');
    setBaseTemplateId('');
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="modal modal-wide" onSubmit={handleSubmit}>
        <div className="modal-header">
          <span>Nueva Plantilla Jerárquica</span>
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
          <label className="form-field">
            Nombre de la plantilla
            <input
              type="text"
              className="form-input"
              required
              placeholder="Ej. DevPulse Guía de Migración"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="form-field">
            Descripción
            <input
              type="text"
              className="form-input"
              placeholder="Describe el tono visual y los escenarios objetivo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="tpl-form-grid">
            <label className="form-field">
              Blog objetivo
              <select
                className="form-input"
                value={targetBlogId}
                onChange={(e) => setTargetBlogId(e.target.value)}
              >
                <option value="all">Multi-blog (Global)</option>
                {BLOG_PROFILES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.domain})
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              Estética base (Capa 1)
              <select
                className="form-input"
                value={preset}
                onChange={(e) => setPreset(e.target.value as BlogAestheticPreset)}
                disabled={Boolean(baseTemplateId)}
              >
                {(Object.keys(BLOG_AESTHETIC_PRESETS) as BlogAestheticPreset[]).map((key) => (
                  <option key={key} value={key}>
                    {BLOG_AESTHETIC_PRESETS[key].label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-field">
            Heredar desde plantilla existente (opcional)
            <select
              className="form-input"
              value={baseTemplateId}
              onChange={(e) => setBaseTemplateId(e.target.value)}
            >
              <option value="">Crear limpia desde preset base</option>
              {existingTemplates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  Clonar capas de: {tpl.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-field">
            <span>Escenarios aplicables</span>
            <div className="tpl-scenario-pills">
              {SCENARIO_DEFINITIONS.map((sc) => (
                <button
                  key={sc.key}
                  type="button"
                  className={`tpl-toggle-pill ${scenarios.includes(sc.key) ? 'active' : ''}`}
                  onClick={() => toggleScenario(sc.key)}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Crear Plantilla
          </button>
        </div>
      </form>
    </div>
  );
}
