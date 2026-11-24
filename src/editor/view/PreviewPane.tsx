import { useState, type ReactNode } from 'react';
import type {
  DocumentStats,
  EditorBlock,
  EditorViewMode,
  ImageSlot,
  PostDocument,
} from '@editor/model/editor.model';
import { editorDocumentService } from '@editor/service/editor-document.service';
import { sharedUtilsService } from '@shared/service/shared-utils.service';
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCheckCircle,
  IconEye,
  IconInfo,
} from '@shared/view/SvgIcons';

interface PreviewPaneProps {
  doc: PostDocument;
  stats: DocumentStats;
  headings: EditorBlock[];
  viewMode: EditorViewMode;
  vpPreset: string;
  vpWidth: string;
  vpHeight: string;
  onVpPresetChange: (preset: string) => void;
  onVpWidthChange: (w: string) => void;
  onVpHeightChange: (h: string) => void;
  onVpReset: () => void;
  onUpdateDoc: (updater: (prev: PostDocument) => PostDocument) => void;
  onUpdateBlock: (blockId: string, updater: (block: EditorBlock) => EditorBlock) => void;
  onUpdateImageSlot: (
    blockId: string,
    imageId: string,
    updater: (slot: ImageSlot) => ImageSlot,
  ) => void;
  onNotify: (msg: string) => void;
}

function startPreviewImageResize(
  startEvent: React.MouseEvent,
  startWidthPct: number,
  containerPxWidth: number,
  onWidthChange: (nextPct: number) => void,
) {
  startEvent.preventDefault();
  const startX = startEvent.clientX;
  const startPx = (startWidthPct / 100) * Math.max(containerPxWidth, 160);

  const onMove = (ev: MouseEvent) => {
    const dx = ev.clientX - startX;
    const nextPct = Math.round(
      Math.max(20, Math.min(100, ((startPx + dx) / Math.max(containerPxWidth, 160)) * 100)),
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

function normalizeCssDimension(val: string, fallback: string): string {
  const trimmed = val.trim() || fallback;
  return /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

export function PreviewPane({
  doc,
  stats,
  headings,
  viewMode,
  vpPreset,
  vpWidth,
  vpHeight,
  onVpPresetChange,
  onVpWidthChange,
  onVpHeightChange,
  onVpReset,
  onUpdateDoc,
  onUpdateBlock,
  onUpdateImageSlot,
  onNotify,
}: PreviewPaneProps) {
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const [activeEditKey, setActiveEditKey] = useState<string | null>(null);

  const initials = (doc.author || 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const frameStyle =
    viewMode === 'preview'
      ? {
          width: normalizeCssDimension(vpWidth, '760px'),
          height: normalizeCssDimension(vpHeight, 'auto'),
        }
      : undefined;

  const calloutIcons: Record<string, ReactNode> = {
    info: <IconInfo size={15} />,
    tip: <IconCheckCircle size={15} />,
    warning: <IconAlertTriangle size={15} />,
    danger: <IconAlertOctagon size={15} />,
  };

  const handleCopyCode = async (blockId: string, code: string) => {
    const ok = await sharedUtilsService.copyText(code);
    if (ok) {
      setCopiedBlockId(blockId);
      onNotify('Código copiado al portapapeles');
      window.setTimeout(() => {
        setCopiedBlockId((prev) => (prev === blockId ? null : prev));
      }, 1500);
    }
  };

  return (
    <div className="pane-column preview-col">
      <div className="pane-banner preview-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="pane-badge live">
            <IconEye size={13} />
            Vista Previa
          </span>
          <span className="pane-subhint">Haz clic en los textos para editarlos directamente</span>
        </div>

        <div className="viewport-controls">
          <div className="vp-group">
            <span>Preset:</span>
            <select
              className="vp-select"
              value={vpPreset}
              onChange={(e) => onVpPresetChange(e.target.value)}
            >
              <option value="760xauto">Artículo (760px)</option>
              <option value="100%xauto">Completo (100%)</option>
              <option value="768x1024">Tablet (768×1024)</option>
              <option value="390x844">Móvil (390×844)</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div className="vp-group">
            <span>Ancho:</span>
            <input
              type="text"
              className="vp-input"
              value={vpWidth}
              onChange={(e) => {
                onVpPresetChange('custom');
                onVpWidthChange(e.target.value);
              }}
            />
          </div>
          <div className="vp-group">
            <span>Alto:</span>
            <input
              type="text"
              className="vp-input"
              value={vpHeight}
              onChange={(e) => {
                onVpPresetChange('custom');
                onVpHeightChange(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            className="btn btn-sm"
            data-tooltip="Restablece el tamaño de la vista previa al ancho estándar de artículo"
            onClick={onVpReset}
          >
            Restablecer
          </button>
        </div>
      </div>

      <section className="pane pane-preview">
        <div className="preview-viewport-frame" style={frameStyle}>
          <article>
            <header className="article-preview-header">
              {doc.coverEnabled && doc.coverImage && (
                <img className="preview-cover" src={doc.coverImage} alt="Portada" />
              )}

              <div className="preview-meta-top">
                <span className="preview-category">{doc.category}</span>
                <span>·</span>
                <span>{doc.date || ''}</span>
                <span>·</span>
                <span>{stats.readTime} min de lectura</span>
              </div>

              <h1
                className="preview-title"
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setActiveEditKey('title')}
                onBlur={(e) => {
                  setActiveEditKey(null);
                  const next = e.currentTarget.innerText.replace(/\n+/g, ' ');
                  onUpdateDoc((prev) => ({ ...prev, title: next }));
                }}
              >
                {doc.title || 'Artículo sin título'}
              </h1>

              <p
                className="preview-excerpt"
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setActiveEditKey('excerpt')}
                onBlur={(e) => {
                  setActiveEditKey(null);
                  const next = e.currentTarget.innerText.replace(/\n+/g, ' ');
                  onUpdateDoc((prev) => ({ ...prev, excerpt: next }));
                }}
              >
                {doc.excerpt || 'Haz clic aquí para escribir un resumen...'}
              </p>

              <div className="preview-author-row">
                <div className="author-badge">
                  <div className="author-avatar">{initials}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {doc.author || 'Autor'}
                  </div>
                </div>
                <div className="preview-tags">
                  {(doc.tags || []).map((t) => (
                    <span key={t} className="preview-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {doc.showToc && headings.length > 0 && (
              <nav className="preview-toc">
                <div className="preview-toc-title">Contenido del artículo</div>
                <ul>
                  {headings.map((h) => (
                    <li key={h.id} className={h.type === 'h3' ? 'toc-h3' : ''}>
                      <a href={`#sec-${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="article-body">
              {doc.blocks.map((block) => {
                if (block.type === 'paragraph') {
                  const html = (block.text || '').trim()
                    ? editorDocumentService
                        .formatInlineMarkdown(block.text || '')
                        .replace(/\n/g, '<br>')
                    : '<span style="opacity:0.45;">Párrafo vacío (clic para escribir)...</span>';
                  return (
                    <p
                      key={`${block.id}-${activeEditKey === block.id ? 'ed' : 'vw'}`}
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() => setActiveEditKey(block.id)}
                      onBlur={(e) => {
                        setActiveEditKey(null);
                        const cleaned = editorDocumentService.cleanInlineDom(e.currentTarget);
                        onUpdateBlock(block.id, (b) => ({ ...b, text: cleaned }));
                      }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }

                if (block.type === 'h2') {
                  return (
                    <h2
                      key={block.id}
                      id={`sec-${block.id}`}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const text = editorDocumentService.cleanInlineDom(e.currentTarget);
                        onUpdateBlock(block.id, (b) => ({ ...b, text }));
                      }}
                    >
                      {block.text || 'Encabezado H2'}
                    </h2>
                  );
                }

                if (block.type === 'h3') {
                  return (
                    <h3
                      key={block.id}
                      id={`sec-${block.id}`}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const text = editorDocumentService.cleanInlineDom(e.currentTarget);
                        onUpdateBlock(block.id, (b) => ({ ...b, text }));
                      }}
                    >
                      {block.text || 'Subtítulo H3'}
                    </h3>
                  );
                }

                if (block.type === 'list') {
                  const lines = (block.text || '')
                    .split('\n')
                    .map((l) => l.trim())
                    .filter(Boolean);
                  const isOrdered = lines.length > 0 && /^\d+\./.test(lines[0]);
                  const ListTag = isOrdered ? 'ol' : 'ul';

                  return (
                    <ListTag
                      key={block.id}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const items = Array.from(e.currentTarget.querySelectorAll('li')).map(
                          (li, idx) => {
                            const prefix = isOrdered ? `${idx + 1}. ` : '- ';
                            return prefix + editorDocumentService.cleanInlineDom(li);
                          },
                        );
                        onUpdateBlock(block.id, (b) => ({ ...b, text: items.join('\n') }));
                      }}
                    >
                      {lines.length > 0 ? (
                        lines.map((line, i) => (
                          <li
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: editorDocumentService.formatInlineMarkdown(
                                line.replace(/^([-*]|\d+\.)\s*/, ''),
                              ),
                            }}
                          />
                        ))
                      ) : (
                        <li>Elemento</li>
                      )}
                    </ListTag>
                  );
                }

                if (block.type === 'quote') {
                  return (
                    <blockquote key={block.id}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const text = editorDocumentService.cleanInlineDom(e.currentTarget);
                          onUpdateBlock(block.id, (b) => ({ ...b, text }));
                        }}
                        dangerouslySetInnerHTML={{
                          __html: editorDocumentService.formatInlineMarkdown(
                            block.text || 'Cita...',
                          ),
                        }}
                      />
                      {block.cite && (
                        <cite
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const cite = e.currentTarget.innerText.replace(/^—\s*/, '').trim();
                            onUpdateBlock(block.id, (b) => ({ ...b, cite }));
                          }}
                        >
                          — {block.cite}
                        </cite>
                      )}
                    </blockquote>
                  );
                }

                if (block.type === 'callout') {
                  const variant = block.variant || 'info';
                  return (
                    <div key={block.id} className={`preview-callout ${variant}`}>
                      <div className="preview-callout-title">
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          {calloutIcons[variant] || calloutIcons.info}
                        </span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const title = e.currentTarget.innerText.trim();
                            onUpdateBlock(block.id, (b) => ({ ...b, title }));
                          }}
                        >
                          {block.title || 'Nota'}
                        </span>
                      </div>
                      <div
                        className="preview-callout-body"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const text = editorDocumentService.cleanInlineDom(e.currentTarget);
                          onUpdateBlock(block.id, (b) => ({ ...b, text }));
                        }}
                        dangerouslySetInnerHTML={{
                          __html: editorDocumentService
                            .formatInlineMarkdown(block.text || '')
                            .replace(/\n/g, '<br>'),
                        }}
                      />
                    </div>
                  );
                }

                if (block.type === 'image') {
                  const imgs = (block.images || []).filter((i) => i.url);
                  if (!imgs.length) return null;
                  const floatImgs = imgs.filter(
                    (i) => i.anchor === 'float-left' || i.anchor === 'float-right',
                  );
                  const inlineImgs = imgs.filter(
                    (i) => i.anchor !== 'float-left' && i.anchor !== 'float-right',
                  );

                  return (
                    <div key={block.id}>
                      {floatImgs.map((img) => (
                        <figure
                          key={img.id}
                          className={`preview-figure anchor-${img.anchor}`}
                          style={{ width: `${img.width || 50}%` }}
                        >
                          <img src={img.url} alt={img.alt} />
                          <div
                            className="preview-resize-grip"
                            data-tooltip="Arrastra para redimensionar esta imagen"
                            onMouseDown={(ev) => {
                              const parentW =
                                ev.currentTarget.closest('figure')?.parentElement?.clientWidth ||
                                680;
                              startPreviewImageResize(ev, img.width || 50, parentW, (nextPct) => {
                                onUpdateImageSlot(block.id, img.id, (slot) => ({
                                  ...slot,
                                  width: nextPct,
                                }));
                              });
                            }}
                          />
                          {img.caption && <figcaption>{img.caption}</figcaption>}
                        </figure>
                      ))}

                      {inlineImgs.length > 0 && (
                        <div className="preview-image-group">
                          {inlineImgs.map((img) => {
                            const w = img.anchor === 'full' ? 100 : img.width || 70;
                            return (
                              <figure
                                key={img.id}
                                className={`preview-figure anchor-${img.anchor || 'center'}`}
                                style={{ width: `${w}%` }}
                              >
                                <img src={img.url} alt={img.alt} />
                                <div
                                  className="preview-resize-grip"
                                  data-tooltip="Arrastra para redimensionar esta imagen"
                                  onMouseDown={(ev) => {
                                    const parentW =
                                      ev.currentTarget.closest('.preview-image-group')
                                        ?.clientWidth || 680;
                                    startPreviewImageResize(ev, w, parentW, (nextPct) => {
                                      onUpdateImageSlot(block.id, img.id, (slot) => ({
                                        ...slot,
                                        width: nextPct,
                                        anchor: slot.anchor === 'full' ? 'center' : slot.anchor,
                                      }));
                                    });
                                  }}
                                />
                                {img.caption && <figcaption>{img.caption}</figcaption>}
                              </figure>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                if (block.type === 'divider') {
                  return <hr key={block.id} />;
                }

                if (block.type === 'code') {
                  const lines = (block.code || '').split('\n');
                  const hlSet = editorDocumentService.parseHighlightLines(block.highlightLines);
                  const showNums = block.showLineNumbers !== false;

                  return (
                    <div key={block.id} className="preview-code-wrap">
                      <div className="preview-code-header">
                        <div className="preview-code-file">
                          <div className="preview-code-dots">
                            <span />
                            <span />
                            <span />
                          </div>
                          <span>{block.filename || block.language || 'código'}</span>
                        </div>
                        <div className="preview-code-actions">
                          <span className="lang-badge">{block.language || 'text'}</span>
                          <button
                            type="button"
                            className="copy-code-btn"
                            data-tooltip="Copia este bloque de código al portapapeles"
                            onClick={() => handleCopyCode(block.id, block.code || '')}
                          >
                            {copiedBlockId === block.id ? '¡Copiado!' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                      <div className="preview-code-scroll">
                        {lines.map((line, i) => {
                          const lineNum = i + 1;
                          return (
                            <div
                              key={lineNum}
                              className={`code-line ${hlSet.has(lineNum) ? 'highlighted' : ''}`}
                            >
                              {showNums && <span className="line-num">{lineNum}</span>}
                              <span
                                className="line-content"
                                dangerouslySetInnerHTML={{
                                  __html: editorDocumentService.highlightCode(
                                    line || ' ',
                                    block.language,
                                  ),
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      {block.caption && <div className="preview-code-caption">{block.caption}</div>}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
