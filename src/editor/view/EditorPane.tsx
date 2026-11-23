import { useEffect, useRef, useState } from 'react';
import type {
  BlockType,
  CalloutVariant,
  EditorBlock,
  ImageAnchor,
  PostDocument,
} from '@editor/model/editor.model';
import {
  BLOCK_LABELS,
  CODE_LANGUAGES,
} from '@editor/service/editor-document.service';

interface EditorPaneProps {
  doc: PostDocument;
  focusedBlockId: string | null;
  draggedBlockId: string | null;
  dropHint: { blockId: string; position: 'above' | 'below' } | null;
  onFocusHandled: () => void;
  onUpdateDoc: (updater: (prev: PostDocument) => PostDocument) => void;
  onSetCoverUrl: (url: string, notifyMsg?: string) => void;
  onUploadCoverFile: (file: File) => void;
  onClearCoverImage: () => void;
  onDeleteCoverSection: () => void;
  onRestoreCoverSection: () => void;
  onAddBlock: (type: BlockType, index?: number) => void;
  onUpdateBlock: (blockId: string, updater: (block: EditorBlock) => EditorBlock) => void;
  onMoveBlock: (index: number, dir: -1 | 1) => void;
  onDuplicateBlock: (index: number) => void;
  onDeleteBlock: (index: number) => void;
  onSetDraggedBlockId: (id: string | null) => void;
  onSetDropHint: (hint: { blockId: string; position: 'above' | 'below' } | null) => void;
  onReorderByDrop: (sourceId: string, targetId: string, pos: 'above' | 'below') => void;
  onAddImageSlot: (blockId: string) => void;
  onUpdateImageSlot: (
    blockId: string,
    imageId: string,
    updater: (slot: NonNullable<EditorBlock['images']>[number]) => NonNullable<EditorBlock['images']>[number],
  ) => void;
  onRemoveImageSlot: (blockId: string, imageId: string) => void;
  onUploadImageFile: (blockId: string, imageId: string, file: File) => void;
  onNotify: (msg: string) => void;
}

function autoResizeEl(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

function InlineFormatBar({
  textareaRef,
  onTextChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onTextChange: (nextVal: string) => void;
}) {
  const applyFormat = (fmt: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;

    let nextVal = val;
    let selStart = start;
    let selEnd = end;

    if (fmt === 'link') {
      const selected = val.slice(start, end) || 'texto del enlace';
      const snippet = `[${selected}](https://ejemplo.com)`;
      nextVal = val.slice(0, start) + snippet + val.slice(end);
      selStart = start + 1;
      selEnd = start + 1 + selected.length;
    } else {
      const selected = val.slice(start, end) || 'texto';
      const replacement = `${fmt}${selected}${fmt}`;
      nextVal = val.slice(0, start) + replacement + val.slice(end);
      selStart = start + fmt.length;
      selEnd = start + fmt.length + selected.length;
    }

    onTextChange(nextVal);
    window.requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = selStart;
      ta.selectionEnd = selEnd;
    });
  };

  return (
    <div className="inline-format-bar">
      <button
        type="button"
        className="fmt-btn"
        data-tooltip="Aplica **negrita** al texto seleccionado"
        onMouseDown={(e) => {
          e.preventDefault();
          applyFormat('**');
        }}
      >
        <b>B</b>
      </button>
      <button
        type="button"
        className="fmt-btn"
        data-tooltip="Aplica *cursiva* al texto seleccionado"
        onMouseDown={(e) => {
          e.preventDefault();
          applyFormat('*');
        }}
      >
        <i>I</i>
      </button>
      <button
        type="button"
        className="fmt-btn"
        data-tooltip="Formatea la selección como código inline"
        onMouseDown={(e) => {
          e.preventDefault();
          applyFormat('`');
        }}
      >
        <code>&lt;/&gt;</code>
      </button>
      <button
        type="button"
        className="fmt-btn"
        data-tooltip="Inserta un enlace Markdown [texto](url)"
        onMouseDown={(e) => {
          e.preventDefault();
          applyFormat('link');
        }}
      >
        🔗
      </button>
    </div>
  );
}

function startCornerResize(
  startEvent: React.MouseEvent,
  startWidthPct: number,
  containerPxWidth: number,
  onWidthChange: (nextPct: number) => void,
) {
  startEvent.preventDefault();
  const startX = startEvent.clientX;
  const startPx = (startWidthPct / 100) * Math.max(containerPxWidth, 120);

  const onMove = (ev: MouseEvent) => {
    const dx = ev.clientX - startX;
    const nextPct = Math.round(
      Math.max(20, Math.min(100, ((startPx + dx) / Math.max(containerPxWidth, 120)) * 100)),
    );
    onWidthChange(nextPct);
  };

  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

interface BlockCardProps {
  block: EditorBlock;
  index: number;
  isFocused: boolean;
  isDragging: boolean;
  dropPosition: 'above' | 'below' | null;
  onFocusHandled: () => void;
  onAddBlockAfter: () => void;
  onUpdateBlock: (updater: (b: EditorBlock) => EditorBlock) => void;
  onMoveBlock: (dir: -1 | 1) => void;
  onDuplicateBlock: () => void;
  onDeleteBlock: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onAddImageSlot: () => void;
  onUpdateImageSlot: (
    imageId: string,
    updater: (slot: NonNullable<EditorBlock['images']>[number]) => NonNullable<EditorBlock['images']>[number],
  ) => void;
  onRemoveImageSlot: (imageId: string) => void;
  onUploadImageFile: (imageId: string, file: File) => void;
  onNotify: (msg: string) => void;
}

function EditorBlockCard({
  block,
  isFocused,
  isDragging,
  dropPosition,
  onFocusHandled,
  onAddBlockAfter,
  onUpdateBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onAddImageSlot,
  onUpdateImageSlot,
  onRemoveImageSlot,
  onUploadImageFile,
  onNotify,
}: BlockCardProps) {
  const [draggableEnabled, setDraggableEnabled] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    autoResizeEl(taRef.current);
  }, [block.text, block.code, block.type]);

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = cardRef.current.querySelector<HTMLElement>('textarea, input');
      firstInput?.focus();
      onFocusHandled();
    }
  }, [isFocused, onFocusHandled]);

  const cardClasses = [
    'block-card',
    isDragging ? 'dragging' : '',
    dropPosition === 'above' ? 'drop-above' : '',
    dropPosition === 'below' ? 'drop-below' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      data-block-id={block.id}
      draggable={draggableEnabled}
      onDragStart={onDragStart}
      onDragEnd={() => {
        setDraggableEnabled(false);
        onDragEnd();
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="block-header">
        <div className="block-header-left">
          <button
            type="button"
            className="drag-handle"
            data-tooltip="Arrastra para reordenar esta sección"
            onMouseDown={() => {
              setDraggableEnabled(true);
              document.addEventListener('mouseup', () => setDraggableEnabled(false), {
                once: true,
              });
            }}
          >
            ⋮⋮
          </button>
          <span className="block-type-badge">{BLOCK_LABELS[block.type]}</span>
        </div>

        <div className="block-actions">
          <button
            type="button"
            className="icon-action"
            data-tooltip="Sube esta sección una posición"
            onClick={() => onMoveBlock(-1)}
          >
            ↑
          </button>
          <button
            type="button"
            className="icon-action"
            data-tooltip="Baja esta sección una posición"
            onClick={() => onMoveBlock(1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="icon-action"
            data-tooltip="Duplica esta sección debajo"
            onClick={onDuplicateBlock}
          >
            ⧉
          </button>
          <button
            type="button"
            className="icon-action delete"
            data-tooltip="Elimina esta sección del artículo"
            onClick={onDeleteBlock}
          >
            ✕
          </button>
        </div>
      </div>

      {block.type === 'code' ? (
        <div className="code-editor-shell">
          <div className="code-meta-bar">
            <select
              className="code-select-dark"
              value={block.language || 'typescript'}
              onChange={(e) => onUpdateBlock((b) => ({ ...b, language: e.target.value }))}
            >
              {CODE_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="code-input-dark"
              placeholder="archivo (ej. app.ts)"
              style={{ width: '165px' }}
              value={block.filename || ''}
              onChange={(e) => onUpdateBlock((b) => ({ ...b, filename: e.target.value }))}
            />
            <input
              type="text"
              className="code-input-dark"
              placeholder="Resaltar líneas: 1, 3-5"
              style={{ width: '150px' }}
              value={block.highlightLines || ''}
              onChange={(e) => onUpdateBlock((b) => ({ ...b, highlightLines: e.target.value }))}
            />
            <label className="code-toggle-label">
              <input
                type="checkbox"
                checked={block.showLineNumbers !== false}
                onChange={(e) =>
                  onUpdateBlock((b) => ({ ...b, showLineNumbers: e.target.checked }))
                }
              />
              Números
            </label>
          </div>
          <textarea
            ref={taRef}
            className="code-textarea"
            spellCheck={false}
            placeholder="// Escribe o pega tu código aquí..."
            value={block.code || ''}
            onChange={(e) => {
              autoResizeEl(e.target);
              onUpdateBlock((b) => ({ ...b, code: e.target.value }));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const ta = e.currentTarget;
                const start = ta.selectionStart;
                const end = ta.selectionEnd;
                const next = `${ta.value.slice(0, start)}  ${ta.value.slice(end)}`;
                onUpdateBlock((b) => ({ ...b, code: next }));
                window.requestAnimationFrame(() => {
                  ta.selectionStart = start + 2;
                  ta.selectionEnd = start + 2;
                });
              }
            }}
          />
          <div className="code-caption-bar">
            <span style={{ fontSize: '11px', color: '#64748b' }}>Pie:</span>
            <input
              type="text"
              placeholder="Descripción breve del fragmento de código..."
              value={block.caption || ''}
              onChange={(e) => onUpdateBlock((b) => ({ ...b, caption: e.target.value }))}
            />
          </div>
        </div>
      ) : block.type === 'callout' ? (
        <div className="block-body">
          <div className="callout-editor-controls">
            <select
              className="field-select"
              value={block.variant || 'info'}
              onChange={(e) =>
                onUpdateBlock((b) => ({ ...b, variant: e.target.value as CalloutVariant }))
              }
            >
              <option value="info">ℹ️ Info / Nota</option>
              <option value="tip">✅ Tip / Consejo</option>
              <option value="warning">⚠️ Advertencia</option>
              <option value="danger">🚨 Importante</option>
            </select>
            <input
              type="text"
              className="field-input"
              placeholder="Título del aviso..."
              style={{ flex: 1 }}
              value={block.title || ''}
              onChange={(e) => onUpdateBlock((b) => ({ ...b, title: e.target.value }))}
            />
          </div>
          <InlineFormatBar
            textareaRef={taRef}
            onTextChange={(nextText) => onUpdateBlock((b) => ({ ...b, text: nextText }))}
          />
          <textarea
            ref={taRef}
            className="block-textarea"
            placeholder="Contenido de la nota (soporta **negrita** y `código`)..."
            value={block.text || ''}
            onChange={(e) => {
              autoResizeEl(e.target);
              onUpdateBlock((b) => ({ ...b, text: e.target.value }));
            }}
          />
        </div>
      ) : block.type === 'image' ? (
        <div className="block-body">
          <div className="image-items-stack">
            {(block.images || []).map((img, imgIdx) => {
              const alignClass =
                img.anchor === 'inline-right' || img.anchor === 'float-right'
                  ? 'align-right'
                  : img.anchor === 'inline-left' || img.anchor === 'float-left'
                    ? 'align-left'
                    : 'align-center';

              return (
                <div key={img.id} className="image-item-box">
                  <div className="image-item-top">
                    <span className="image-item-title">Imagen {imgIdx + 1}</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {img.url && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          data-tooltip="Quita la imagen subida manteniendo este bloque listo para otra"
                          onClick={() => {
                            onUpdateImageSlot(img.id, (slot) => ({ ...slot, url: '' }));
                            onNotify('Imagen quitada (bloque conservado)');
                          }}
                        >
                          Quitar imagen
                        </button>
                      )}
                      {(block.images || []).length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger-ghost"
                          data-tooltip="Elimina esta ranura adicional de imagen"
                          onClick={() => onRemoveImageSlot(img.id)}
                        >
                          Quitar ranura
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="image-block-row">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="URL de la imagen o diagrama..."
                      value={img.url}
                      onChange={(e) =>
                        onUpdateImageSlot(img.id, (slot) => ({ ...slot, url: e.target.value }))
                      }
                    />
                    <label
                      className="btn btn-sm"
                      style={{ cursor: 'pointer' }}
                      data-tooltip="Sube o reemplaza la imagen desde tu computadora"
                    >
                      {img.url ? 'Cambiar archivo' : 'Subir archivo'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onUploadImageFile(img.id, file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>

                  <div className="image-block-row">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Texto alternativo (SEO / accesibilidad)"
                      value={img.alt}
                      onChange={(e) =>
                        onUpdateImageSlot(img.id, (slot) => ({ ...slot, alt: e.target.value }))
                      }
                    />
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Pie de foto opcional"
                      value={img.caption}
                      onChange={(e) =>
                        onUpdateImageSlot(img.id, (slot) => ({
                          ...slot,
                          caption: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="image-layout-controls">
                    <label
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Anclaje:
                      <select
                        className="field-select"
                        value={img.anchor}
                        onChange={(e) =>
                          onUpdateImageSlot(img.id, (slot) => ({
                            ...slot,
                            anchor: e.target.value as ImageAnchor,
                          }))
                        }
                      >
                        <option value="center">En línea · Centrada</option>
                        <option value="inline-left">En línea · Izquierda</option>
                        <option value="inline-right">En línea · Derecha</option>
                        <option value="float-left">Cuadrado · Izquierda (texto rodea)</option>
                        <option value="float-right">Cuadrado · Derecha (texto rodea)</option>
                        <option value="full">Ancho completo (100%)</option>
                      </select>
                    </label>
                    <div className="resize-slider-wrap">
                      <span>Tamaño:</span>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        step={5}
                        value={img.anchor === 'full' ? 100 : img.width || 70}
                        onChange={(e) => {
                          const nextW = Number(e.target.value);
                          onUpdateImageSlot(img.id, (slot) => ({
                            ...slot,
                            width: nextW,
                            anchor: slot.anchor === 'full' ? 'center' : slot.anchor,
                          }));
                        }}
                      />
                      <strong className="width-label">
                        {img.anchor === 'full' ? 100 : img.width || 70}%
                      </strong>
                    </div>
                  </div>

                  {img.url && (
                    <div
                      ref={(el) => {
                        stageRefs.current[img.id] = el;
                      }}
                      className={`resizable-thumb-stage ${alignClass}`}
                    >
                      <div
                        className="resizable-img-wrap"
                        style={{ width: `${img.anchor === 'full' ? 100 : img.width || 70}%` }}
                      >
                        <img src={img.url} alt={img.alt} />
                        <div
                          className="resize-handle"
                          data-tooltip="Arrastra para redimensionar la imagen"
                          onMouseDown={(ev) => {
                            const stageW = (stageRefs.current[img.id]?.clientWidth || 500) - 20;
                            startCornerResize(ev, img.width || 70, stageW, (nextPct) => {
                              onUpdateImageSlot(img.id, (slot) => ({
                                ...slot,
                                width: nextPct,
                                anchor: slot.anchor === 'full' ? 'center' : slot.anchor,
                              }));
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="btn btn-sm"
            style={{ marginTop: '10px' }}
            data-tooltip="Agrega otra imagen dentro de este mismo bloque"
            onClick={onAddImageSlot}
          >
            + Añadir otra imagen en este bloque
          </button>
        </div>
      ) : block.type === 'quote' ? (
        <div className="block-body">
          <InlineFormatBar
            textareaRef={taRef}
            onTextChange={(nextText) => onUpdateBlock((b) => ({ ...b, text: nextText }))}
          />
          <textarea
            ref={taRef}
            className="block-textarea"
            placeholder="Escribe la cita destacada..."
            value={block.text || ''}
            onChange={(e) => {
              autoResizeEl(e.target);
              onUpdateBlock((b) => ({ ...b, text: e.target.value }));
            }}
          />
          <input
            type="text"
            className="field-input"
            placeholder="Autor o fuente (opcional)"
            style={{ width: '100%', marginTop: '8px' }}
            value={block.cite || ''}
            onChange={(e) => onUpdateBlock((b) => ({ ...b, cite: e.target.value }))}
          />
        </div>
      ) : block.type === 'divider' ? (
        <div className="block-body">
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
        </div>
      ) : (
        <div className="block-body">
          {(block.type === 'paragraph' || block.type === 'list') && (
            <InlineFormatBar
              textareaRef={taRef}
              onTextChange={(nextText) => onUpdateBlock((b) => ({ ...b, text: nextText }))}
            />
          )}
          <textarea
            ref={taRef}
            className={`block-textarea ${
              block.type === 'h2'
                ? 'heading-h2'
                : block.type === 'h3'
                  ? 'heading-h3'
                  : block.type === 'list'
                    ? 'list-area'
                    : ''
            }`}
            placeholder={
              block.type === 'h2'
                ? 'Título de sección principal (H2)...'
                : block.type === 'h3'
                  ? 'Subtítulo de sección (H3)...'
                  : block.type === 'list'
                    ? '- Elemento 1\n- Elemento 2'
                    : 'Escribe aquí... Usa los botones de formato arriba o sintaxis **negrita**, *cursiva*, `código`.'
            }
            value={block.text || ''}
            onChange={(e) => {
              autoResizeEl(e.target);
              onUpdateBlock((b) => ({ ...b, text: e.target.value }));
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                onAddBlockAfter();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export function EditorPane({
  doc,
  focusedBlockId,
  draggedBlockId,
  dropHint,
  onFocusHandled,
  onUpdateDoc,
  onSetCoverUrl,
  onUploadCoverFile,
  onClearCoverImage,
  onDeleteCoverSection,
  onRestoreCoverSection,
  onAddBlock,
  onUpdateBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onSetDraggedBlockId,
  onSetDropHint,
  onReorderByDrop,
  onAddImageSlot,
  onUpdateImageSlot,
  onRemoveImageSlot,
  onUploadImageFile,
  onNotify,
}: EditorPaneProps) {
  const [coverUrlQuick, setCoverUrlQuick] = useState('');
  const [coverUrlChange, setCoverUrlChange] = useState('');
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const excerptRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    autoResizeEl(titleRef.current);
    autoResizeEl(excerptRef.current);
  }, [doc.title, doc.excerpt]);

  return (
    <div className="pane-column editor-col">
      <div className="pane-banner editor-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="pane-badge design">✏️ Vista de Diseño / Edición</span>
          <span className="pane-subhint">Arrastra ⋮⋮ para reordenar secciones</span>
        </div>
        {!doc.coverEnabled && (
          <button
            type="button"
            className="btn btn-sm"
            data-tooltip="Vuelve a activar la sección de imagen de portada en el artículo"
            onClick={onRestoreCoverSection}
          >
            + Añadir portada
          </button>
        )}
      </div>

      <section className="pane pane-editor">
        <div className="editor-container">
          {doc.coverEnabled && (
            <div className={`cover-box ${doc.coverImage ? 'has-image' : ''}`}>
              <div className="cover-box-header">
                <span>🖼️ Portada del artículo</span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <label
                    className="btn btn-sm"
                    style={{ cursor: 'pointer' }}
                    data-tooltip="Sube una imagen desde tu dispositivo como portada"
                  >
                    Subir / Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadCoverFile(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {doc.coverImage && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-tooltip="Quita la imagen de portada actual dejando el espacio disponible"
                      onClick={onClearCoverImage}
                    >
                      Quitar imagen
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger-ghost"
                    data-tooltip="Elimina por completo la sección de portada del artículo"
                    onClick={onDeleteCoverSection}
                  >
                    Eliminar portada
                  </button>
                </div>
              </div>

              {!doc.coverImage ? (
                <div className="cover-empty">
                  <div className="cover-empty-info">
                    <span>Sin imagen asignada (recomendado 1600×900)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Pega URL y presiona Enter..."
                      style={{ width: '210px' }}
                      value={coverUrlQuick}
                      onChange={(e) => setCoverUrlQuick(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && coverUrlQuick.trim()) {
                          onSetCoverUrl(coverUrlQuick.trim());
                          setCoverUrlQuick('');
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="cover-preview-wrap">
                  <img src={doc.coverImage} alt="Portada" />
                  <div className="cover-controls-bar">
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Cambiar por otra URL de imagen..."
                      style={{ flex: 1 }}
                      value={coverUrlChange}
                      onChange={(e) => setCoverUrlChange(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm"
                      data-tooltip="Aplica la URL escrita como nueva portada"
                      onClick={() => {
                        if (!coverUrlChange.trim()) return;
                        onSetCoverUrl(coverUrlChange.trim(), 'Portada actualizada');
                        setCoverUrlChange('');
                      }}
                    >
                      Aplicar URL
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="doc-header-card">
            <textarea
              ref={titleRef}
              className="title-input"
              rows={1}
              placeholder="Título del artículo técnico..."
              value={doc.title}
              onChange={(e) => {
                autoResizeEl(e.target);
                onUpdateDoc((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
            <textarea
              ref={excerptRef}
              className="excerpt-input"
              rows={2}
              placeholder="Escribe un resumen claro o bajada para lectores y buscadores..."
              value={doc.excerpt}
              onChange={(e) => {
                autoResizeEl(e.target);
                onUpdateDoc((prev) => ({ ...prev, excerpt: e.target.value }));
              }}
            />
          </div>

          <div className="editor-toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">Agregar sección:</span>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega un nuevo bloque de párrafo de texto"
                onClick={() => onAddBlock('paragraph')}
              >
                ¶ Párrafo
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega un encabezado principal H2 (aparece en el índice)"
                onClick={() => onAddBlock('h2')}
              >
                H2
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega un subencabezado H3 (aparece en el índice)"
                onClick={() => onAddBlock('h3')}
              >
                H3
              </button>
              <button
                type="button"
                className="tool-btn highlight"
                data-tooltip="Agrega un bloque de código con lenguaje, archivo y líneas resaltadas"
                onClick={() => onAddBlock('code')}
              >
                &lt;/&gt; Código
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega un cuadro destacado de Nota, Tip, Advertencia o Importante"
                onClick={() => onAddBlock('callout')}
              >
                💡 Nota
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega una lista con viñetas o numerada"
                onClick={() => onAddBlock('list')}
              >
                • Lista
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega una cita destacada con autor opcional"
                onClick={() => onAddBlock('quote')}
              >
                ❝ Cita
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega un bloque de una o más imágenes con anclaje y tamaño editable"
                onClick={() => onAddBlock('image')}
              >
                🖼 Imágenes
              </button>
              <button
                type="button"
                className="tool-btn"
                data-tooltip="Agrega una línea horizontal separadora"
                onClick={() => onAddBlock('divider')}
              >
                —
              </button>
            </div>
          </div>

          <div className="blocks-list">
            {doc.blocks.map((block, index) => (
              <EditorBlockCard
                key={block.id}
                block={block}
                index={index}
                isFocused={focusedBlockId === block.id}
                isDragging={draggedBlockId === block.id}
                dropPosition={dropHint?.blockId === block.id ? dropHint.position : null}
                onFocusHandled={onFocusHandled}
                onAddBlockAfter={() => onAddBlock('paragraph', index + 1)}
                onUpdateBlock={(updater) => onUpdateBlock(block.id, updater)}
                onMoveBlock={(dir) => onMoveBlock(index, dir)}
                onDuplicateBlock={() => onDuplicateBlock(index)}
                onDeleteBlock={() => onDeleteBlock(index)}
                onDragStart={(e) => {
                  onSetDraggedBlockId(block.id);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', block.id);
                }}
                onDragEnd={() => {
                  onSetDraggedBlockId(null);
                  onSetDropHint(null);
                }}
                onDragOver={(e) => {
                  if (!draggedBlockId || draggedBlockId === block.id) return;
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = e.clientY - rect.top < rect.height / 2 ? 'above' : 'below';
                  onSetDropHint({ blockId: block.id, position: pos });
                }}
                onDragLeave={() => {
                  if (dropHint?.blockId === block.id) onSetDropHint(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggedBlockId || draggedBlockId === block.id) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = e.clientY - rect.top >= rect.height / 2 ? 'below' : 'above';
                  onSetDropHint(null);
                  onReorderByDrop(draggedBlockId, block.id, pos);
                }}
                onAddImageSlot={() => onAddImageSlot(block.id)}
                onUpdateImageSlot={(imageId, updater) =>
                  onUpdateImageSlot(block.id, imageId, updater)
                }
                onRemoveImageSlot={(imageId) => onRemoveImageSlot(block.id, imageId)}
                onUploadImageFile={(imageId, file) => onUploadImageFile(block.id, imageId, file)}
                onNotify={onNotify}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
