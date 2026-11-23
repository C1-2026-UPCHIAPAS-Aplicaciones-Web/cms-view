import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  BlockType,
  CustomFontItem,
  EditorBlock,
  EditorViewMode,
  ExportMode,
  FontTarget,
  ImageSlot,
  PostDocument,
  PostStatus,
  SidebarTab,
  TypographySettings,
} from '@editor/model/editor.model';
import {
  BUILTIN_CODE_FONTS,
  BUILTIN_PROSE_FONTS,
  createSamplePost,
  editorDocumentService,
} from '@editor/service/editor-document.service';
import { sharedUtilsService } from '@shared/service/shared-utils.service';

export function useEditorViewModel(onNotify: (text: string) => void) {
  const [doc, setDoc] = useState<PostDocument>(() => editorDocumentService.loadDocument());
  const [viewMode, setViewMode] = useState<EditorViewMode>('split');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('publish');
  const [saveLabel, setSaveLabel] = useState<string>('● Guardado localmente');

  const [vpPreset, setVpPreset] = useState<string>('760xauto');
  const [vpWidth, setVpWidth] = useState<string>('760px');
  const [vpHeight, setVpHeight] = useState<string>('auto');

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exportMode, setExportMode] = useState<ExportMode>('md');

  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropHint, setDropHint] = useState<{
    blockId: string;
    position: 'above' | 'below';
  } | null>(null);

  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [activePreviewEditKey, setActivePreviewEditKey] = useState<string | null>(null);

  const saveTimerRef = useRef<number | null>(null);
  const isFirstMount = useRef<boolean>(true);

  const persistNow = useCallback((nextDoc: PostDocument) => {
    const ok = editorDocumentService.saveDocument(nextDoc);
    if (ok) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSaveLabel(`● Guardado ${now}`);
    } else {
      setSaveLabel('● Sin espacio local');
    }
  }, []);

  useEffect(() => {
    editorDocumentService.applyTypographyToDom(doc.typography);
  }, [doc.typography]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setSaveLabel('○ Guardando...');
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => {
      persistNow(doc);
    }, 280);

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [doc, persistNow]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        persistNow(doc);
        onNotify('Borrador guardado');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [doc, persistNow, onNotify]);

  const stats = useMemo(() => editorDocumentService.computeStats(doc), [doc]);

  const headings = useMemo(
    () => doc.blocks.filter((b) => (b.type === 'h2' || b.type === 'h3') && (b.text || '').trim()),
    [doc.blocks],
  );

  const allProseFonts = useMemo(() => {
    const custom = (doc.typography.customFonts || [])
      .filter((f) => f.target === 'prose')
      .map((f) => ({ label: `${f.name} (Importada)`, value: `'${f.name}', sans-serif` }));
    return [...BUILTIN_PROSE_FONTS, ...custom];
  }, [doc.typography.customFonts]);

  const allCodeFonts = useMemo(() => {
    const custom = (doc.typography.customFonts || [])
      .filter((f) => f.target === 'code')
      .map((f) => ({ label: `${f.name} (Importada)`, value: `'${f.name}', monospace` }));
    return [...BUILTIN_CODE_FONTS, ...custom];
  }, [doc.typography.customFonts]);

  const exportContent = useMemo(
    () =>
      exportMode === 'md'
        ? editorDocumentService.toMarkdown(doc)
        : JSON.stringify(doc, null, 2),
    [doc, exportMode],
  );

  const updateDoc = useCallback((updater: (prev: PostDocument) => PostDocument) => {
    setDoc(updater);
  }, []);

  const cycleStatus = useCallback(() => {
    const order: PostStatus[] = ['draft', 'review', 'published'];
    setDoc((prev) => {
      const next = order[(order.indexOf(prev.status) + 1) % order.length];
      return { ...prev, status: next };
    });
  }, []);

  const publishPost = useCallback(() => {
    setDoc((prev) => ({
      ...prev,
      status: 'published',
      slug: prev.slug || sharedUtilsService.slugify(prev.title),
    }));
    onNotify('Artículo marcado como Publicado');
  }, [onNotify]);

  const createNewBlankPost = useCallback(() => {
    setDoc((prev) => ({
      title: '',
      excerpt: '',
      coverEnabled: true,
      coverImage: '',
      status: 'draft',
      slug: '',
      category: 'Backend & APIs',
      tags: [],
      author: prev.author || 'Editor',
      date: new Date().toISOString().slice(0, 10),
      seoTitle: '',
      seoDesc: '',
      showToc: true,
      typography: sharedUtilsService.clone(prev.typography),
      blocks: [
        editorDocumentService.createBlock('paragraph'),
        editorDocumentService.createBlock('code'),
      ],
    }));
    onNotify('Nuevo borrador creado');
  }, [onNotify]);

  const resetSamplePost = useCallback(() => {
    setDoc(createSamplePost());
    onNotify('Artículo de ejemplo restaurado');
  }, [onNotify]);

  // Cover actions
  const setCoverImageUrl = useCallback(
    (url: string, notifyMsg?: string) => {
      setDoc((prev) => ({ ...prev, coverImage: url }));
      if (notifyMsg) onNotify(notifyMsg);
    },
    [onNotify],
  );

  const uploadCoverFile = useCallback(
    async (file: File) => {
      const dataUrl = await sharedUtilsService.readFileAsDataUrl(file);
      setDoc((prev) => ({ ...prev, coverImage: dataUrl }));
      onNotify('Imagen de portada cargada');
    },
    [onNotify],
  );

  const clearCoverImage = useCallback(() => {
    setDoc((prev) => ({ ...prev, coverImage: '' }));
    onNotify('Imagen de portada quitada');
  }, [onNotify]);

  const deleteCoverSection = useCallback(() => {
    setDoc((prev) => ({ ...prev, coverEnabled: false, coverImage: '' }));
    onNotify('Sección de portada eliminada');
  }, [onNotify]);

  const restoreCoverSection = useCallback(() => {
    setDoc((prev) => ({ ...prev, coverEnabled: true }));
  }, []);

  // Block actions
  const addBlock = useCallback((type: BlockType, index?: number) => {
    const nextBlock = editorDocumentService.createBlock(type);
    setDoc((prev) => {
      const blocks = [...prev.blocks];
      const targetIndex = typeof index === 'number' ? index : blocks.length;
      blocks.splice(targetIndex, 0, nextBlock);
      return { ...prev, blocks };
    });
    setFocusedBlockId(nextBlock.id);
    return nextBlock.id;
  }, []);

  const updateBlock = useCallback(
    (blockId: string, updater: (block: EditorBlock) => EditorBlock) => {
      setDoc((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => (b.id === blockId ? updater(b) : b)),
      }));
    },
    [],
  );

  const moveBlock = useCallback((index: number, direction: -1 | 1) => {
    setDoc((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.blocks.length) return prev;
      const blocks = [...prev.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...prev, blocks };
    });
  }, []);

  const duplicateBlock = useCallback((index: number) => {
    setDoc((prev) => {
      const copy = sharedUtilsService.clone(prev.blocks[index]);
      copy.id = sharedUtilsService.uid('b');
      const blocks = [...prev.blocks];
      blocks.splice(index + 1, 0, copy);
      return { ...prev, blocks };
    });
  }, []);

  const deleteBlock = useCallback(
    (index: number) => {
      setDoc((prev) => {
        if (prev.blocks.length <= 1) {
          onNotify('El artículo debe tener al menos un bloque');
          return prev;
        }
        const blocks = prev.blocks.filter((_, idx) => idx !== index);
        return { ...prev, blocks };
      });
    },
    [onNotify],
  );

  const reorderBlockByDrop = useCallback(
    (sourceId: string, targetId: string, position: 'above' | 'below') => {
      if (!sourceId || sourceId === targetId) return;
      setDoc((prev) => {
        const blocks = [...prev.blocks];
        const fromIdx = blocks.findIndex((b) => b.id === sourceId);
        if (fromIdx === -1) return prev;
        const [moved] = blocks.splice(fromIdx, 1);
        let toIdx = blocks.findIndex((b) => b.id === targetId);
        if (toIdx === -1) return prev;
        if (position === 'below') toIdx += 1;
        blocks.splice(toIdx, 0, moved);
        return { ...prev, blocks };
      });
      onNotify('Sección reordenada');
    },
    [onNotify],
  );

  // Image slot actions inside image blocks
  const addImageSlot = useCallback((blockId: string) => {
    const slot = editorDocumentService.createImageSlot();
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, images: [...(b.images || []), slot] } : b,
      ),
    }));
  }, []);

  const updateImageSlot = useCallback(
    (blockId: string, imageId: string, updater: (slot: ImageSlot) => ImageSlot) => {
      setDoc((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) =>
          b.id === blockId
            ? {
                ...b,
                images: (b.images || []).map((img) =>
                  img.id === imageId ? updater(img) : img,
                ),
              }
            : b,
        ),
      }));
    },
    [],
  );

  const removeImageSlot = useCallback((blockId: string, imageId: string) => {
    setDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== blockId) return b;
        const remaining = (b.images || []).filter((img) => img.id !== imageId);
        return {
          ...b,
          images: remaining.length ? remaining : [editorDocumentService.createImageSlot()],
        };
      }),
    }));
  }, []);

  // Tags actions
  const addTag = useCallback((rawTag: string) => {
    const tag = rawTag.trim().toLowerCase().replace(/,/g, '');
    if (!tag) return;
    setDoc((prev) => {
      if (prev.tags.includes(tag)) return prev;
      return { ...prev, tags: [...prev.tags, tag] };
    });
  }, []);

  const removeTag = useCallback((tagIndex: number) => {
    setDoc((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, idx) => idx !== tagIndex),
    }));
  }, []);

  // Typography & Fonts
  const updateTypography = useCallback(
    (patch: Partial<TypographySettings>) => {
      setDoc((prev) => ({
        ...prev,
        typography: { ...prev.typography, ...patch },
      }));
    },
    [],
  );

  const importGoogleFont = useCallback(
    (rawInput: string, target: FontTarget) => {
      const raw = rawInput.trim();
      if (!raw) return;
      let url = raw;
      let name = raw;
      if (raw.startsWith('http')) {
        const match = raw.match(/family=([^:&]+)/);
        name = match ? decodeURIComponent(match[1]).replace(/\+/g, ' ') : 'CustomFont';
      } else {
        const encoded = encodeURIComponent(raw).replace(/%20/g, '+');
        url = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`;
      }

      const fontItem: CustomFontItem = {
        id: sharedUtilsService.uid('f'),
        name,
        target,
        sourceType: 'google',
        value: url,
      };

      setDoc((prev) => ({
        ...prev,
        typography: {
          ...prev.typography,
          customFonts: [...prev.typography.customFonts, fontItem],
          ...(target === 'code'
            ? { codeFont: `'${name}', monospace` }
            : {
                bodyFont: `'${name}', sans-serif`,
                headingFont: `'${name}', sans-serif`,
              }),
        },
      }));
      onNotify(`Fuente "${name}" importada`);
    },
    [onNotify],
  );

  const importLocalFontFile = useCallback(
    async (file: File, customName: string, target: FontTarget) => {
      const name = (customName.trim() || file.name.replace(/\.[^.]+$/, '')).replace(/['"]/g, '');
      const dataUrl = await sharedUtilsService.readFileAsDataUrl(file);
      const fontItem: CustomFontItem = {
        id: sharedUtilsService.uid('f'),
        name,
        target,
        sourceType: 'file',
        value: dataUrl,
      };

      setDoc((prev) => ({
        ...prev,
        typography: {
          ...prev.typography,
          customFonts: [...prev.typography.customFonts, fontItem],
          ...(target === 'code'
            ? { codeFont: `'${name}', monospace` }
            : {
                bodyFont: `'${name}', sans-serif`,
                headingFont: `'${name}', sans-serif`,
              }),
        },
      }));
      onNotify(`Fuente local "${name}" instalada`);
    },
    [onNotify],
  );

  const removeCustomFont = useCallback(
    (fontId: string) => {
      setDoc((prev) => ({
        ...prev,
        typography: {
          ...prev.typography,
          customFonts: prev.typography.customFonts.filter((f) => f.id !== fontId),
        },
      }));
      onNotify('Fuente eliminada');
    },
    [onNotify],
  );

  // Viewport controls
  const applyVpPreset = useCallback((preset: string) => {
    setVpPreset(preset);
    if (preset === 'custom') return;
    const [w, h] = preset.split('x');
    setVpWidth(w.includes('%') || w.includes('px') ? w : `${w}px`);
    setVpHeight(h === 'auto' ? 'auto' : `${h}px`);
  }, []);

  const resetVpPreset = useCallback(() => {
    setVpPreset('760xauto');
    setVpWidth('760px');
    setVpHeight('auto');
  }, []);

  // Export actions
  const copyExport = useCallback(async () => {
    const ok = await sharedUtilsService.copyText(exportContent);
    if (ok) onNotify('Contenido exportado copiado');
  }, [exportContent, onNotify]);

  const downloadExport = useCallback(() => {
    const ext = exportMode === 'md' ? 'md' : 'json';
    const slug = doc.slug || sharedUtilsService.slugify(doc.title);
    sharedUtilsService.downloadFile(exportContent, `${slug}.${ext}`);
  }, [doc.slug, doc.title, exportContent, exportMode]);

  return {
    doc,
    updateDoc,
    viewMode,
    setViewMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarTab,
    setSidebarTab,
    saveLabel,
    stats,
    headings,
    allProseFonts,
    allCodeFonts,
    vpPreset,
    vpWidth,
    vpHeight,
    setVpPreset,
    setVpWidth,
    setVpHeight,
    applyVpPreset,
    resetVpPreset,
    exportModalOpen,
    setExportModalOpen,
    exportMode,
    setExportMode,
    exportContent,
    copyExport,
    downloadExport,
    draggedBlockId,
    setDraggedBlockId,
    dropHint,
    setDropHint,
    focusedBlockId,
    setFocusedBlockId,
    activePreviewEditKey,
    setActivePreviewEditKey,
    cycleStatus,
    publishPost,
    createNewBlankPost,
    resetSamplePost,
    setCoverImageUrl,
    uploadCoverFile,
    clearCoverImage,
    deleteCoverSection,
    restoreCoverSection,
    addBlock,
    updateBlock,
    moveBlock,
    duplicateBlock,
    deleteBlock,
    reorderBlockByDrop,
    addImageSlot,
    updateImageSlot,
    removeImageSlot,
    addTag,
    removeTag,
    updateTypography,
    importGoogleFont,
    importLocalFontFile,
    removeCustomFont,
  };
}
