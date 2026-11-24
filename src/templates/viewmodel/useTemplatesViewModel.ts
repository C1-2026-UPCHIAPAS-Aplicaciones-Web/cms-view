import { useCallback, useEffect, useMemo, useState } from 'react';
import { sharedUtilsService } from '@shared/service/shared-utils.service';
import type {
  AestheticTemplate,
  ArticleTypeAestheticLayer,
  ArticleTypeKey,
  BlogAestheticLayer,
  BlogAestheticPreset,
  BlogScenarioAssignment,
  CanvasBlockAestheticLayer,
  CanvasBlockType,
  CreateTemplateInput,
  HierarchyLayer,
  ResolvedBlockAesthetic,
  ScenarioKey,
  TemplateExportFormat,
  TemplatePreviewTab,
  TemplateScreenMode,
  TemplateStatusFilter,
} from '@templates/model/templates.model';
import {
  BLOG_AESTHETIC_PRESETS,
  BLOG_PROFILES,
  CANVAS_BLOCK_DEFINITIONS,
  SCENARIO_DEFINITIONS,
  createInitialAssignments,
  createInitialTemplates,
  templatesService,
} from '@templates/service/templates.service';

export function useTemplatesViewModel(onNotify: (text: string) => void) {
  const [templates, setTemplates] = useState<AestheticTemplate[]>(() =>
    templatesService.loadTemplates(),
  );
  const [assignments, setAssignments] = useState<BlogScenarioAssignment[]>(() =>
    templatesService.loadAssignments(),
  );

  const [screenMode, setScreenMode] = useState<TemplateScreenMode>('admin');
  const [statusFilter, setStatusFilter] = useState<TemplateStatusFilter>('active');
  const [styleSidebarCollapsed, setStyleSidebarCollapsed] = useState<boolean>(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    () => templatesService.loadTemplates()[0]?.id || '',
  );
  const [selectedBlogId, setSelectedBlogId] = useState<string>(BLOG_PROFILES[0]?.id || 'devpulse');
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<ScenarioKey>('technical-tutorial');
  const [activeLayer, setActiveLayer] = useState<HierarchyLayer>('blog');
  const [selectedArticleType, setSelectedArticleType] = useState<ArticleTypeKey>('tutorial');
  const [selectedBlockType, setSelectedBlockType] = useState<CanvasBlockType>('code');

  const [blogFilterId, setBlogFilterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTab, setPreviewTab] = useState<TemplatePreviewTab>('live');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<TemplateExportFormat>('css');

  useEffect(() => {
    templatesService.saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    templatesService.saveAssignments(assignments);
  }, [assignments]);

  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || templates[0] || null,
    [templates, selectedTemplateId],
  );

  const activeCount = useMemo(
    () => templates.filter((t) => !t.archived).length,
    [templates],
  );

  const archivedCount = useMemo(
    () => templates.filter((t) => t.archived).length,
    [templates],
  );

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return templates.filter((tpl) => {
      if (statusFilter === 'active' && tpl.archived) return false;
      if (statusFilter === 'archived' && !tpl.archived) return false;
      const matchesBlog =
        blogFilterId === 'all' || tpl.targetBlogId === 'all' || tpl.targetBlogId === blogFilterId;
      if (!matchesBlog) return false;
      if (!q) return true;
      return (
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.scenarios.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [templates, statusFilter, blogFilterId, searchQuery]);

  const activeBlogProfile = useMemo(
    () => BLOG_PROFILES.find((b) => b.id === selectedBlogId) || BLOG_PROFILES[0],
    [selectedBlogId],
  );

  const activeScenarioDef = useMemo(
    () =>
      SCENARIO_DEFINITIONS.find((s) => s.key === selectedScenarioKey) || SCENARIO_DEFINITIONS[0],
    [selectedScenarioKey],
  );

  const currentAssignment = useMemo(
    () =>
      assignments.find(
        (a) => a.blogId === selectedBlogId && a.scenarioKey === selectedScenarioKey,
      ) || null,
    [assignments, selectedBlogId, selectedScenarioKey],
  );

  const resolvedArticleAesthetic = useMemo(
    () =>
      activeTemplate
        ? templatesService.resolveArticleAesthetic(activeTemplate, selectedArticleType)
        : null,
    [activeTemplate, selectedArticleType],
  );

  const resolvedBlocksMap = useMemo(() => {
    if (!activeTemplate) return null;
    const map = {} as Record<CanvasBlockType, ResolvedBlockAesthetic>;
    CANVAS_BLOCK_DEFINITIONS.forEach((def) => {
      map[def.type] = templatesService.resolveBlockAesthetic(
        activeTemplate,
        selectedArticleType,
        def.type,
      );
    });
    return map;
  }, [activeTemplate, selectedArticleType]);

  const activeResolvedBlock = resolvedBlocksMap ? resolvedBlocksMap[selectedBlockType] : null;

  const totalBlockOverrides = useMemo(
    () =>
      resolvedBlocksMap
        ? Object.values(resolvedBlocksMap).reduce((sum, blk) => sum + blk.blockOverrideCount, 0)
        : 0,
    [resolvedBlocksMap],
  );

  const exportContent = useMemo(() => {
    if (!activeTemplate) return '';
    if (exportFormat === 'css') {
      return templatesService.buildCssTokens(activeTemplate, selectedArticleType);
    }
    return JSON.stringify(
      {
        template: activeTemplate,
        resolvedHierarchy: {
          blogId: selectedBlogId,
          scenario: selectedScenarioKey,
          articleType: selectedArticleType,
          articleAesthetic: resolvedArticleAesthetic,
          canvasBlocks: resolvedBlocksMap,
        },
      },
      null,
      2,
    );
  }, [
    exportFormat,
    activeTemplate,
    selectedArticleType,
    selectedBlogId,
    selectedScenarioKey,
    resolvedArticleAesthetic,
    resolvedBlocksMap,
  ]);

  const mutateActiveTemplate = useCallback(
    (updater: (prev: AestheticTemplate) => AestheticTemplate) => {
      if (!activeTemplate) return;
      const targetId = activeTemplate.id;
      const today = new Date().toISOString().slice(0, 10);
      setTemplates((prev) =>
        prev.map((tpl) => (tpl.id === targetId ? { ...updater(tpl), updatedAt: today } : tpl)),
      );
    },
    [activeTemplate],
  );

  const syncContextForTemplate = useCallback((tpl: AestheticTemplate) => {
    if (tpl.targetBlogId !== 'all') {
      setSelectedBlogId(tpl.targetBlogId);
    }
    if (tpl.scenarios.length > 0) {
      const nextScenario = tpl.scenarios[0];
      setSelectedScenarioKey(nextScenario);
      const scenarioDef = SCENARIO_DEFINITIONS.find((s) => s.key === nextScenario);
      if (scenarioDef) setSelectedArticleType(scenarioDef.defaultArticleType);
    }
  }, []);

  const selectTemplate = useCallback(
    (templateId: string) => {
      setSelectedTemplateId(templateId);
      const found = templates.find((t) => t.id === templateId);
      if (found) syncContextForTemplate(found);
    },
    [templates, syncContextForTemplate],
  );

  const openTemplateToWork = useCallback(
    (templateId: string) => {
      const found = templates.find((t) => t.id === templateId);
      if (!found) return;
      setSelectedTemplateId(templateId);
      syncContextForTemplate(found);
      setScreenMode('editor');
    },
    [templates, syncContextForTemplate],
  );

  const backToAdmin = useCallback(() => {
    setScreenMode('admin');
  }, []);

  const toggleStyleSidebarCollapsed = useCallback(() => {
    setStyleSidebarCollapsed((prev) => !prev);
  }, []);

  const selectArticleTypeFromSidebar = useCallback((articleType: ArticleTypeKey) => {
    setSelectedArticleType(articleType);
    setActiveLayer('article-type');
  }, []);

  const selectBlockTypeFromSidebar = useCallback((blockType: CanvasBlockType) => {
    setSelectedBlockType(blockType);
    setActiveLayer('block');
  }, []);

  const selectBlogAndScenario = useCallback(
    (blogId: string, scenarioKey: ScenarioKey) => {
      setSelectedBlogId(blogId);
      setSelectedScenarioKey(scenarioKey);
      const assignment = assignments.find(
        (a) => a.blogId === blogId && a.scenarioKey === scenarioKey,
      );
      if (assignment) {
        setSelectedTemplateId(assignment.templateId);
        setSelectedArticleType(assignment.articleType);
      } else {
        const scenarioDef = SCENARIO_DEFINITIONS.find((s) => s.key === scenarioKey);
        if (scenarioDef) setSelectedArticleType(scenarioDef.defaultArticleType);
      }
    },
    [assignments],
  );

  const updateTemplateMeta = useCallback(
    (patch: Partial<Pick<AestheticTemplate, 'name' | 'description' | 'targetBlogId' | 'scenarios'>>) => {
      mutateActiveTemplate((tpl) => ({ ...tpl, ...patch }));
    },
    [mutateActiveTemplate],
  );

  const toggleTemplateScenario = useCallback(
    (scenarioKey: ScenarioKey) => {
      mutateActiveTemplate((tpl) => {
        const exists = tpl.scenarios.includes(scenarioKey);
        const nextScenarios = exists
          ? tpl.scenarios.length > 1
            ? tpl.scenarios.filter((s) => s !== scenarioKey)
            : tpl.scenarios
          : [...tpl.scenarios, scenarioKey];
        return { ...tpl, scenarios: nextScenarios };
      });
    },
    [mutateActiveTemplate],
  );

  const applyBlogPreset = useCallback(
    (preset: BlogAestheticPreset) => {
      const nextLayer = sharedUtilsService.clone(BLOG_AESTHETIC_PRESETS[preset].layer);
      mutateActiveTemplate((tpl) => ({
        ...tpl,
        blogLayer: nextLayer,
      }));
      onNotify(`Estética base "${BLOG_AESTHETIC_PRESETS[preset].label}" aplicada`);
    },
    [mutateActiveTemplate, onNotify],
  );

  const updateBlogLayer = useCallback(
    (patch: Partial<BlogAestheticLayer>) => {
      mutateActiveTemplate((tpl) => ({
        ...tpl,
        blogLayer: { ...tpl.blogLayer, ...patch },
      }));
    },
    [mutateActiveTemplate],
  );

  const updateArticleTypeLayer = useCallback(
    (articleType: ArticleTypeKey, patch: Partial<ArticleTypeAestheticLayer>) => {
      mutateActiveTemplate((tpl) => ({
        ...tpl,
        articleTypeLayers: {
          ...tpl.articleTypeLayers,
          [articleType]: {
            ...(tpl.articleTypeLayers[articleType] || {}),
            ...patch,
          },
        },
      }));
    },
    [mutateActiveTemplate],
  );

  const resetArticleTypeField = useCallback(
    (articleType: ArticleTypeKey, field: keyof ArticleTypeAestheticLayer) => {
      mutateActiveTemplate((tpl) => {
        const current = { ...(tpl.articleTypeLayers[articleType] || {}) };
        delete current[field];
        return {
          ...tpl,
          articleTypeLayers: {
            ...tpl.articleTypeLayers,
            [articleType]: current,
          },
        };
      });
    },
    [mutateActiveTemplate],
  );

  const resetAllArticleTypeOverrides = useCallback(
    (articleType: ArticleTypeKey) => {
      mutateActiveTemplate((tpl) => {
        const nextLayers = { ...tpl.articleTypeLayers };
        delete nextLayers[articleType];
        return { ...tpl, articleTypeLayers: nextLayers };
      });
      onNotify('Capa de tipo de artículo restaurada a herencia del blog');
    },
    [mutateActiveTemplate, onNotify],
  );

  const updateBlockLayer = useCallback(
    (blockType: CanvasBlockType, patch: Partial<CanvasBlockAestheticLayer>) => {
      mutateActiveTemplate((tpl) => ({
        ...tpl,
        blockLayers: {
          ...tpl.blockLayers,
          [blockType]: {
            ...(tpl.blockLayers[blockType] || {}),
            ...patch,
          },
        },
      }));
    },
    [mutateActiveTemplate],
  );

  const resetBlockField = useCallback(
    (blockType: CanvasBlockType, field: keyof CanvasBlockAestheticLayer) => {
      mutateActiveTemplate((tpl) => {
        const current = { ...(tpl.blockLayers[blockType] || {}) };
        delete current[field];
        return {
          ...tpl,
          blockLayers: {
            ...tpl.blockLayers,
            [blockType]: current,
          },
        };
      });
    },
    [mutateActiveTemplate],
  );

  const resetAllBlockOverrides = useCallback(
    (blockType: CanvasBlockType) => {
      mutateActiveTemplate((tpl) => {
        const nextBlocks = { ...tpl.blockLayers };
        delete nextBlocks[blockType];
        return { ...tpl, blockLayers: nextBlocks };
      });
      onNotify('Bloque restaurado a herencia de capas superiores');
    },
    [mutateActiveTemplate, onNotify],
  );

  const assignActiveTemplateToScenario = useCallback(() => {
    if (!activeTemplate) return;
    const today = new Date().toISOString().slice(0, 10);
    setAssignments((prev) => {
      const idx = prev.findIndex(
        (a) => a.blogId === selectedBlogId && a.scenarioKey === selectedScenarioKey,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          templateId: activeTemplate.id,
          articleType: selectedArticleType,
          updatedAt: today,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: sharedUtilsService.uid('asg'),
          blogId: selectedBlogId,
          scenarioKey: selectedScenarioKey,
          templateId: activeTemplate.id,
          articleType: selectedArticleType,
          updatedAt: today,
        },
      ];
    });
    onNotify(
      `Plantilla "${activeTemplate.name}" asignada a ${activeBlogProfile.name} (${activeScenarioDef.label})`,
    );
  }, [
    selectedBlogId,
    selectedScenarioKey,
    activeTemplate,
    selectedArticleType,
    activeBlogProfile.name,
    activeScenarioDef.label,
    onNotify,
  ]);

  const createTemplate = useCallback(
    (input: CreateTemplateInput) => {
      const created = templatesService.createTemplate(input, templates);
      setTemplates((prev) => [created, ...prev]);
      setSelectedTemplateId(created.id);
      setStatusFilter('active');
      if (created.targetBlogId !== 'all') {
        setSelectedBlogId(created.targetBlogId);
      }
      if (created.scenarios.length) {
        setSelectedScenarioKey(created.scenarios[0]);
      }
      setIsCreateModalOpen(false);
      onNotify(`Plantilla "${created.name}" creada`);
    },
    [templates, onNotify],
  );

  const duplicateTemplate = useCallback(
    (targetId?: string) => {
      const source = targetId
        ? templates.find((t) => t.id === targetId)
        : activeTemplate;
      if (!source) return;
      const copy: AestheticTemplate = {
        ...sharedUtilsService.clone(source),
        id: sharedUtilsService.uid('tpl'),
        name: `${source.name} (Copia)`,
        archived: false,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      setTemplates((prev) => [copy, ...prev]);
      setSelectedTemplateId(copy.id);
      setStatusFilter('active');
      onNotify(`Plantilla duplicada como "${copy.name}"`);
    },
    [templates, activeTemplate, onNotify],
  );

  const archiveTemplate = useCallback(
    (id: string) => {
      const target = templates.find((t) => t.id === id);
      if (!target) return;
      const today = new Date().toISOString().slice(0, 10);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, archived: true, updatedAt: today } : t)),
      );
      if (screenMode === 'editor' && selectedTemplateId === id) {
        setScreenMode('admin');
      }
      onNotify(`Plantilla "${target.name}" archivada`);
    },
    [templates, screenMode, selectedTemplateId, onNotify],
  );

  const restoreTemplate = useCallback(
    (id: string) => {
      const target = templates.find((t) => t.id === id);
      if (!target) return;
      const today = new Date().toISOString().slice(0, 10);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, archived: false, updatedAt: today } : t)),
      );
      onNotify(`Plantilla "${target.name}" restaurada a activas`);
    },
    [templates, onNotify],
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      const target = templates.find((t) => t.id === id);
      const next = templates.filter((t) => t.id !== id);
      setTemplates(next);
      setAssignments((prev) => prev.filter((a) => a.templateId !== id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(next[0]?.id || '');
        if (screenMode === 'editor') {
          setScreenMode('admin');
        }
      }
      onNotify(
        target
          ? `Plantilla "${target.name}" eliminada por completo`
          : 'Plantilla eliminada por completo',
      );
    },
    [templates, selectedTemplateId, screenMode, onNotify],
  );

  const resetDefaultTemplates = useCallback(() => {
    const defaults = createInitialTemplates();
    const defaultAssignments = createInitialAssignments();
    setTemplates(defaults);
    setAssignments(defaultAssignments);
    setSelectedTemplateId(defaults[0].id);
    setStatusFilter('active');
    onNotify('Catálogo de plantillas restaurado');
  }, [onNotify]);

  const applyToEditor = useCallback(() => {
    if (!activeTemplate) return;
    const ok = templatesService.applyTemplateToEditorDocument(
      activeTemplate,
      selectedArticleType,
    );
    if (ok) {
      onNotify(
        `Estética "${activeTemplate.name}" aplicada a la tipografía del Editor CMS`,
      );
    } else {
      onNotify('No se pudo guardar la configuración en almacenamiento local');
    }
  }, [activeTemplate, selectedArticleType, onNotify]);

  const copyExport = useCallback(async () => {
    const ok = await sharedUtilsService.copyText(exportContent);
    if (ok) onNotify('Código de plantilla copiado al portapapeles');
  }, [exportContent, onNotify]);

  const downloadExport = useCallback(() => {
    if (!activeTemplate) return;
    const slug = sharedUtilsService.slugify(activeTemplate.name);
    const ext = exportFormat === 'css' ? 'css' : 'json';
    sharedUtilsService.downloadFile(exportContent, `${slug}-${selectedArticleType}.${ext}`);
    onNotify('Archivo de plantilla descargado');
  }, [activeTemplate, exportFormat, exportContent, selectedArticleType, onNotify]);

  const inspectBlockFromPreview = useCallback((blockType: CanvasBlockType) => {
    setActiveLayer('block');
    setSelectedBlockType(blockType);
  }, []);

  return {
    templates,
    filteredTemplates,
    assignments,
    screenMode,
    setScreenMode,
    statusFilter,
    setStatusFilter,
    styleSidebarCollapsed,
    toggleStyleSidebarCollapsed,
    activeCount,
    archivedCount,
    activeTemplate,
    selectedTemplateId,
    selectedBlogId,
    selectedScenarioKey,
    activeBlogProfile,
    activeScenarioDef,
    currentAssignment,
    activeLayer,
    setActiveLayer,
    selectedArticleType,
    setSelectedArticleType,
    selectedBlockType,
    setSelectedBlockType,
    blogFilterId,
    setBlogFilterId,
    searchQuery,
    setSearchQuery,
    previewTab,
    setPreviewTab,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    exportFormat,
    setExportFormat,
    exportContent,
    resolvedArticleAesthetic,
    resolvedBlocksMap,
    activeResolvedBlock,
    totalBlockOverrides,
    selectTemplate,
    openTemplateToWork,
    backToAdmin,
    selectArticleTypeFromSidebar,
    selectBlockTypeFromSidebar,
    selectBlogAndScenario,
    updateTemplateMeta,
    toggleTemplateScenario,
    applyBlogPreset,
    updateBlogLayer,
    updateArticleTypeLayer,
    resetArticleTypeField,
    resetAllArticleTypeOverrides,
    updateBlockLayer,
    resetBlockField,
    resetAllBlockOverrides,
    assignActiveTemplateToScenario,
    createTemplate,
    duplicateTemplate,
    archiveTemplate,
    restoreTemplate,
    deleteTemplate,
    resetDefaultTemplates,
    applyToEditor,
    copyExport,
    downloadExport,
    inspectBlockFromPreview,
  };
}
