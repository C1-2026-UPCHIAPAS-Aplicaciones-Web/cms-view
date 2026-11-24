import { coreStorageService } from '@core/service/core-storage.service';
import { INITIAL_MANAGED_SITES } from '@dashboard/service/dashboard-data.service';
import {
  BUILTIN_CODE_FONTS,
  BUILTIN_PROSE_FONTS,
  editorDocumentService,
} from '@editor/service/editor-document.service';
import { sharedUtilsService } from '@shared/service/shared-utils.service';
import type {
  AestheticTemplate,
  ArticleTypeAestheticLayer,
  ArticleTypeDefinition,
  ArticleTypeKey,
  BlogAestheticLayer,
  BlogAestheticPreset,
  BlogProfile,
  BlogScenarioAssignment,
  CanvasBlockAestheticLayer,
  CanvasBlockDefinition,
  CanvasBlockType,
  CreateTemplateInput,
  HierarchyLayer,
  ResolvedArticleAesthetic,
  ResolvedBlockAesthetic,
  ScenarioDefinition,
  SpacingDensity,
} from '@templates/model/templates.model';

export const TEMPLATES_STORAGE_KEY = 'inkstack_templates_mvvm_v1';
export const ASSIGNMENTS_STORAGE_KEY = 'inkstack_template_assignments_v1';

const BLOG_TAGLINES: Record<string, string> = {
  devpulse: 'Ingeniería backend, APIs y arquitectura escalable',
  cloudnotes: 'Infraestructura cloud, Kubernetes y observabilidad',
  frontendlab: 'Interfaces modernas, CSS avanzado y diseño de sistemas',
  dbcraft: 'Motores SQL, indexación y optimización de consultas',
};

export const BLOG_PROFILES: BlogProfile[] = INITIAL_MANAGED_SITES.map((site) => ({
  id: site.id,
  name: site.name,
  domain: site.domain,
  color: site.color,
  tagline: BLOG_TAGLINES[site.id] || 'Publicación técnica especializada',
}));

export const SCENARIO_DEFINITIONS: ScenarioDefinition[] = [
  {
    key: 'technical-tutorial',
    label: 'Tutorial Técnico',
    description: 'Paso a paso práctico con bloques de código, comandos y tips accionables.',
    defaultArticleType: 'tutorial',
    badge: 'Hands-on',
  },
  {
    key: 'architecture-deep-dive',
    label: 'Deep Dive de Arquitectura',
    description: 'Análisis profundo de decisiones técnicas, diagramas y trade-offs.',
    defaultArticleType: 'deep-dive',
    badge: 'Arquitectura',
  },
  {
    key: 'product-launch',
    label: 'Lanzamiento / Release',
    description: 'Anuncio de nueva versión, novedades destacadas y notas de migración.',
    defaultArticleType: 'release-notes',
    badge: 'Release',
  },
  {
    key: 'incident-postmortem',
    label: 'Postmortem / Caso Real',
    description: 'Cronología de incidente, causa raíz y lecciones aprendidas.',
    defaultArticleType: 'case-study',
    badge: 'Postmortem',
  },
  {
    key: 'benchmark-comparison',
    label: 'Comparativa & Benchmarks',
    description: 'Evaluación técnica comparativa con métricas, citas y conclusiones.',
    defaultArticleType: 'deep-dive',
    badge: 'Benchmark',
  },
  {
    key: 'weekly-digest',
    label: 'Editorial / Digest Semanal',
    description: 'Lectura curada de opinión, tendencias y enlaces destacados.',
    defaultArticleType: 'opinion',
    badge: 'Editorial',
  },
];

export const ARTICLE_TYPE_DEFINITIONS: ArticleTypeDefinition[] = [
  {
    key: 'tutorial',
    label: 'Tutorial Técnico',
    description: 'Enfocado en legibilidad de snippets, índice lateral y notas guía.',
  },
  {
    key: 'deep-dive',
    label: 'Deep Dive',
    description: 'Columna amplia para diagramas, citas largas y análisis extenso.',
  },
  {
    key: 'release-notes',
    label: 'Release Notes',
    description: 'Ritmo compacto con badges de versión, listas claras y anuncios.',
  },
  {
    key: 'case-study',
    label: 'Caso de Estudio',
    description: 'Narrativa estructurada con callouts de impacto y métricas.',
  },
  {
    key: 'opinion',
    label: 'Editorial / Opinión',
    description: 'Tipografía serif expresiva, citas destacadas y lectura pausada.',
  },
  {
    key: 'cheatsheet',
    label: 'Guía Rápida',
    description: 'Alta densidad informativa orientada a consulta veloz.',
  },
];

export const CANVAS_BLOCK_DEFINITIONS: CanvasBlockDefinition[] = [
  {
    type: 'paragraph',
    label: 'Párrafo',
    codeBadge: 'P',
    description: 'Texto narrativo principal y énfasis de entrada.',
  },
  {
    type: 'h2',
    label: 'Encabezado H2',
    codeBadge: 'H2',
    description: 'Secciones principales y divisores temáticos.',
  },
  {
    type: 'h3',
    label: 'Subtítulo H3',
    codeBadge: 'H3',
    description: 'Subsecciones técnicas dentro de cada capítulo.',
  },
  {
    type: 'code',
    label: 'Bloque de Código',
    codeBadge: '</>',
    description: 'Ventana de código con chrome, tema y numeración.',
  },
  {
    type: 'callout',
    label: 'Callout / Aviso',
    codeBadge: 'Note',
    description: 'Notas informativas, tips, advertencias y alertas.',
  },
  {
    type: 'quote',
    label: 'Cita Editorial',
    codeBadge: 'Cite',
    description: 'Citas destacadas con atribución de autor o fuente.',
  },
  {
    type: 'list',
    label: 'Lista',
    codeBadge: 'List',
    description: 'Listas de verificación, pasos o viñetas técnicas.',
  },
  {
    type: 'image',
    label: 'Imagen / Diagrama',
    codeBadge: 'Img',
    description: 'Marco visual, bordes y alineación de pie de foto.',
  },
  {
    type: 'divider',
    label: 'Separador',
    codeBadge: 'HR',
    description: 'Ritmo visual y transición entre bloques del lienzo.',
  },
];

export const BLOG_AESTHETIC_PRESETS: Record<
  BlogAestheticPreset,
  { label: string; description: string; layer: BlogAestheticLayer }
> = {
  'editorial-minimal': {
    label: 'Editorial Minimal',
    description: 'Lienzo limpio, contraste sereno y jerarquía tipográfica clásica.',
    layer: {
      preset: 'editorial-minimal',
      accentColor: '#2563eb',
      surfaceBg: '#ffffff',
      surfaceSubtle: '#f4f6fa',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      borderColor: '#dfe3ea',
      headingFont: BUILTIN_PROSE_FONTS[1].value,
      bodyFont: BUILTIN_PROSE_FONTS[0].value,
      codeFont: BUILTIN_CODE_FONTS[0].value,
      baseFontSize: 16,
      lineHeight: 1.75,
      contentMaxWidth: 760,
      borderRadius: 12,
      density: 'comfortable',
      headerStyle: 'editorial-centered',
    },
  },
  'tech-terminal': {
    label: 'Tech Terminal',
    description: 'Estética precisa para ingeniería, código protagónico y bordes definidos.',
    layer: {
      preset: 'tech-terminal',
      accentColor: '#7c3aed',
      surfaceBg: '#fbfcfe',
      surfaceSubtle: '#eef2f9',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      borderColor: '#cbd5e1',
      headingFont: BUILTIN_PROSE_FONTS[2].value,
      bodyFont: BUILTIN_PROSE_FONTS[3].value,
      codeFont: BUILTIN_CODE_FONTS[1].value,
      baseFontSize: 15,
      lineHeight: 1.68,
      contentMaxWidth: 820,
      borderRadius: 8,
      density: 'compact',
      headerStyle: 'banner',
    },
  },
  'modern-magazine': {
    label: 'Revista Moderna',
    description: 'Contraste cálido con títulos serif editoriales y espacios generosos.',
    layer: {
      preset: 'modern-magazine',
      accentColor: '#059669',
      surfaceBg: '#fffdf9',
      surfaceSubtle: '#f3f5f1',
      textPrimary: '#1c1917',
      textSecondary: '#57534e',
      borderColor: '#e7e5e4',
      headingFont: BUILTIN_PROSE_FONTS[4].value,
      bodyFont: BUILTIN_PROSE_FONTS[0].value,
      codeFont: BUILTIN_CODE_FONTS[0].value,
      baseFontSize: 17,
      lineHeight: 1.82,
      contentMaxWidth: 740,
      borderRadius: 16,
      density: 'spacious',
      headerStyle: 'split-cover',
    },
  },
  'clean-docs': {
    label: 'Documentación Clara',
    description: 'Estructura escaneable orientada a referencia rápida y guías técnicas.',
    layer: {
      preset: 'clean-docs',
      accentColor: '#ea580c',
      surfaceBg: '#ffffff',
      surfaceSubtle: '#f8fafc',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      borderColor: '#e2e8f0',
      headingFont: BUILTIN_PROSE_FONTS[0].value,
      bodyFont: BUILTIN_PROSE_FONTS[0].value,
      codeFont: BUILTIN_CODE_FONTS[3].value,
      baseFontSize: 15,
      lineHeight: 1.65,
      contentMaxWidth: 860,
      borderRadius: 10,
      density: 'compact',
      headerStyle: 'minimal',
    },
  },
};

const DENSITY_DEFAULTS: Record<SpacingDensity, { paddingY: number; paddingX: number; marginY: number }> = {
  compact: { paddingY: 10, paddingX: 14, marginY: 12 },
  comfortable: { paddingY: 14, paddingX: 18, marginY: 18 },
  spacious: { paddingY: 20, paddingX: 24, marginY: 24 },
};

export function createInitialTemplates(): AestheticTemplate[] {
  const now = new Date().toISOString().slice(0, 10);

  return [
    {
      id: 'tpl_devpulse_blueprint',
      name: 'DevPulse Blueprint Editorial',
      description:
        'Sistema base de DevPulse Tech con énfasis en legibilidad de APIs, tutoriales guiados y bloques de código oscuros.',
      targetBlogId: 'devpulse',
      scenarios: ['technical-tutorial', 'architecture-deep-dive'],
      archived: false,
      updatedAt: now,
      blogLayer: sharedUtilsService.clone(BLOG_AESTHETIC_PRESETS['editorial-minimal'].layer),
      articleTypeLayers: {
        tutorial: {
          leadBadgeLabel: 'Tutorial Paso a Paso',
          showToc: true,
          showReadingMeta: true,
          density: 'comfortable',
          recommendedBlocks: ['h2', 'paragraph', 'code', 'callout', 'list'],
        },
        'deep-dive': {
          accentColor: '#1d4ed8',
          contentMaxWidth: 840,
          headingFont: BUILTIN_PROSE_FONTS[2].value,
          headerStyle: 'banner',
          leadBadgeLabel: 'Deep Dive Técnico',
          showToc: true,
          recommendedBlocks: ['h2', 'paragraph', 'quote', 'image', 'code'],
        },
        'release-notes': {
          accentColor: '#059669',
          density: 'compact',
          headerStyle: 'minimal',
          leadBadgeLabel: 'Release Notes',
          showToc: false,
          recommendedBlocks: ['h2', 'callout', 'list', 'code'],
        },
      },
      blockLayers: {
        code: {
          codeTheme: 'dark-slate',
          codeChrome: 'macos-dots',
          showLineNumbers: true,
          borderRadius: 12,
          shadowStyle: 'elevated',
        },
        callout: {
          calloutSurface: 'left-bar',
          showCalloutIcon: true,
          borderRadius: 10,
        },
        h2: {
          headingDecoration: 'bottom-rule',
          marginY: 24,
        },
        quote: {
          quoteStyle: 'left-border',
          quoteItalic: true,
        },
      },
    },
    {
      id: 'tpl_cloudnotes_ops',
      name: 'CloudNotes Ops & Postmortem',
      description:
        'Estética de consola de ingeniería para infraestructura cloud, despliegues y análisis de incidentes.',
      targetBlogId: 'cloudnotes',
      scenarios: ['incident-postmortem', 'architecture-deep-dive', 'product-launch'],
      archived: false,
      updatedAt: now,
      blogLayer: sharedUtilsService.clone(BLOG_AESTHETIC_PRESETS['tech-terminal'].layer),
      articleTypeLayers: {
        'case-study': {
          accentColor: '#dc2626',
          surfaceTint: '#fffafa',
          leadBadgeLabel: 'Postmortem & Causa Raíz',
          showToc: true,
          headerStyle: 'banner',
          recommendedBlocks: ['callout', 'h2', 'list', 'code', 'quote'],
        },
        'deep-dive': {
          accentColor: '#6d28d9',
          contentMaxWidth: 880,
          leadBadgeLabel: 'Arquitectura Cloud',
          recommendedBlocks: ['h2', 'image', 'code', 'callout'],
        },
        'release-notes': {
          accentColor: '#0891b2',
          leadBadgeLabel: 'Platform Release',
          density: 'compact',
        },
      },
      blockLayers: {
        code: {
          codeTheme: 'midnight',
          codeChrome: 'minimal-bar',
          showLineNumbers: true,
          borderRadius: 8,
        },
        callout: {
          calloutSurface: 'outlined',
          showCalloutIcon: true,
          borderRadius: 8,
        },
        h2: {
          headingDecoration: 'left-accent',
        },
        list: {
          listMarker: 'check-badge',
        },
      },
    },
    {
      id: 'tpl_frontendlab_atelier',
      name: 'FrontendLab Atelier UI',
      description:
        'Plantilla editorial expresiva pensada para diseño de interfaces, CSS moderno y artículos visuales.',
      targetBlogId: 'frontendlab',
      scenarios: ['weekly-digest', 'product-launch', 'technical-tutorial'],
      archived: false,
      updatedAt: now,
      blogLayer: sharedUtilsService.clone(BLOG_AESTHETIC_PRESETS['modern-magazine'].layer),
      articleTypeLayers: {
        opinion: {
          headingFont: BUILTIN_PROSE_FONTS[4].value,
          bodyFont: BUILTIN_PROSE_FONTS[5].value,
          fontSizeDelta: 1,
          lineHeight: 1.88,
          headerStyle: 'editorial-centered',
          leadBadgeLabel: 'Ensayo UI / UX',
          showToc: false,
          recommendedBlocks: ['paragraph', 'quote', 'image', 'divider'],
        },
        tutorial: {
          accentColor: '#047857',
          headingFont: BUILTIN_PROSE_FONTS[1].value,
          bodyFont: BUILTIN_PROSE_FONTS[0].value,
          leadBadgeLabel: 'Taller Interactivo',
          showToc: true,
        },
      },
      blockLayers: {
        paragraph: {
          paragraphStyle: 'dropcap',
        },
        quote: {
          quoteStyle: 'editorial-mark',
          quoteItalic: true,
          fontFamily: BUILTIN_PROSE_FONTS[4].value,
        },
        image: {
          imageFrame: 'elevated',
          imageCaptionAlign: 'center',
          borderRadius: 16,
        },
        divider: {
          dividerPattern: 'dots',
        },
      },
    },
    {
      id: 'tpl_dbcraft_reference',
      name: 'DBCraft Query & Benchmark',
      description:
        'Plantilla de referencia rápida para benchmarks SQL, planes de ejecución y guías de indexación.',
      targetBlogId: 'dbcraft',
      scenarios: ['benchmark-comparison', 'technical-tutorial'],
      archived: false,
      updatedAt: now,
      blogLayer: sharedUtilsService.clone(BLOG_AESTHETIC_PRESETS['clean-docs'].layer),
      articleTypeLayers: {
        cheatsheet: {
          density: 'compact',
          contentMaxWidth: 900,
          leadBadgeLabel: 'Cheat Sheet SQL',
          showToc: true,
          recommendedBlocks: ['h2', 'code', 'list', 'callout'],
        },
        'deep-dive': {
          accentColor: '#c2410c',
          leadBadgeLabel: 'Benchmark Lab',
          recommendedBlocks: ['h2', 'code', 'image', 'callout', 'quote'],
        },
      },
      blockLayers: {
        code: {
          codeTheme: 'emerald-cli',
          codeChrome: 'macos-dots',
          showLineNumbers: true,
        },
        h2: {
          headingDecoration: 'numbered-pill',
        },
        callout: {
          calloutSurface: 'soft-tint',
          showCalloutIcon: true,
        },
      },
    },
  ];
}

export function createInitialAssignments(): BlogScenarioAssignment[] {
  const now = new Date().toISOString().slice(0, 10);
  return [
    {
      id: 'asg_1',
      blogId: 'devpulse',
      scenarioKey: 'technical-tutorial',
      templateId: 'tpl_devpulse_blueprint',
      articleType: 'tutorial',
      updatedAt: now,
    },
    {
      id: 'asg_2',
      blogId: 'devpulse',
      scenarioKey: 'architecture-deep-dive',
      templateId: 'tpl_devpulse_blueprint',
      articleType: 'deep-dive',
      updatedAt: now,
    },
    {
      id: 'asg_3',
      blogId: 'cloudnotes',
      scenarioKey: 'incident-postmortem',
      templateId: 'tpl_cloudnotes_ops',
      articleType: 'case-study',
      updatedAt: now,
    },
    {
      id: 'asg_4',
      blogId: 'frontendlab',
      scenarioKey: 'weekly-digest',
      templateId: 'tpl_frontendlab_atelier',
      articleType: 'opinion',
      updatedAt: now,
    },
    {
      id: 'asg_5',
      blogId: 'dbcraft',
      scenarioKey: 'benchmark-comparison',
      templateId: 'tpl_dbcraft_reference',
      articleType: 'deep-dive',
      updatedAt: now,
    },
  ];
}

function resolveWithArticleLayer<T>(
  blogValue: T,
  articleValue: T | undefined,
): { value: T; source: HierarchyLayer; hasOverride: boolean } {
  if (articleValue !== undefined) {
    return { value: articleValue, source: 'article-type', hasOverride: true };
  }
  return { value: blogValue, source: 'blog', hasOverride: false };
}

export const templatesService = {
  loadTemplates(): AestheticTemplate[] {
    const saved = coreStorageService.getItem<AestheticTemplate[]>(TEMPLATES_STORAGE_KEY);
    if (Array.isArray(saved)) {
      return saved.map((tpl) => ({
        ...tpl,
        archived: Boolean(tpl.archived),
      }));
    }
    return createInitialTemplates();
  },

  saveTemplates(templates: AestheticTemplate[]): boolean {
    return coreStorageService.setItem(TEMPLATES_STORAGE_KEY, templates);
  },

  loadAssignments(): BlogScenarioAssignment[] {
    const saved = coreStorageService.getItem<BlogScenarioAssignment[]>(ASSIGNMENTS_STORAGE_KEY);
    if (Array.isArray(saved)) {
      return saved;
    }
    return createInitialAssignments();
  },

  saveAssignments(assignments: BlogScenarioAssignment[]): boolean {
    return coreStorageService.setItem(ASSIGNMENTS_STORAGE_KEY, assignments);
  },

  createTemplate(input: CreateTemplateInput, existingTemplates: AestheticTemplate[]): AestheticTemplate {
    const baseTemplate = input.baseTemplateId
      ? existingTemplates.find((t) => t.id === input.baseTemplateId)
      : undefined;

    const presetLayer = sharedUtilsService.clone(BLOG_AESTHETIC_PRESETS[input.preset].layer);
    const now = new Date().toISOString().slice(0, 10);

    return {
      id: sharedUtilsService.uid('tpl'),
      name: input.name.trim() || 'Nueva Plantilla Editorial',
      description:
        input.description.trim() || 'Plantilla jerárquica configurada para blogs y escenarios.',
      targetBlogId: input.targetBlogId,
      scenarios: input.scenarios.length ? input.scenarios : ['technical-tutorial'],
      archived: false,
      updatedAt: now,
      blogLayer: baseTemplate ? sharedUtilsService.clone(baseTemplate.blogLayer) : presetLayer,
      articleTypeLayers: baseTemplate
        ? sharedUtilsService.clone(baseTemplate.articleTypeLayers)
        : {},
      blockLayers: baseTemplate ? sharedUtilsService.clone(baseTemplate.blockLayers) : {},
    };
  },

  /**
   * Resuelve la cascada Capa 1 (Blog) -> Capa 2 (Tipo de Artículo).
   */
  resolveArticleAesthetic(
    template: AestheticTemplate,
    articleType: ArticleTypeKey,
  ): ResolvedArticleAesthetic {
    const blog = template.blogLayer;
    const art: ArticleTypeAestheticLayer = template.articleTypeLayers[articleType] || {};

    const fontSizeDelta = art.fontSizeDelta ?? 0;
    const resolvedFontSize = Math.max(13, Math.min(22, blog.baseFontSize + fontSizeDelta));

    const overrideKeys: (keyof ArticleTypeAestheticLayer)[] = [
      'accentColor',
      'surfaceTint',
      'headingFont',
      'bodyFont',
      'fontSizeDelta',
      'lineHeight',
      'contentMaxWidth',
      'borderRadius',
      'density',
      'headerStyle',
      'showToc',
      'showReadingMeta',
      'leadBadgeLabel',
    ];
    const articleOverrideCount = overrideKeys.filter((k) => art[k] !== undefined).length;

    const articleDef = ARTICLE_TYPE_DEFINITIONS.find((d) => d.key === articleType);

    return {
      accentColor: resolveWithArticleLayer(blog.accentColor, art.accentColor),
      surfaceBg: resolveWithArticleLayer(blog.surfaceBg, art.surfaceTint),
      surfaceSubtle: { value: blog.surfaceSubtle, source: 'blog', hasOverride: false },
      textPrimary: { value: blog.textPrimary, source: 'blog', hasOverride: false },
      textSecondary: { value: blog.textSecondary, source: 'blog', hasOverride: false },
      borderColor: { value: blog.borderColor, source: 'blog', hasOverride: false },
      headingFont: resolveWithArticleLayer(blog.headingFont, art.headingFont),
      bodyFont: resolveWithArticleLayer(blog.bodyFont, art.bodyFont),
      codeFont: { value: blog.codeFont, source: 'blog', hasOverride: false },
      fontSize: {
        value: resolvedFontSize,
        source: art.fontSizeDelta !== undefined && art.fontSizeDelta !== 0 ? 'article-type' : 'blog',
        hasOverride: art.fontSizeDelta !== undefined && art.fontSizeDelta !== 0,
      },
      lineHeight: resolveWithArticleLayer(blog.lineHeight, art.lineHeight),
      contentMaxWidth: resolveWithArticleLayer(blog.contentMaxWidth, art.contentMaxWidth),
      borderRadius: resolveWithArticleLayer(blog.borderRadius, art.borderRadius),
      density: resolveWithArticleLayer(blog.density, art.density),
      headerStyle: resolveWithArticleLayer(blog.headerStyle, art.headerStyle),
      showToc: art.showToc ?? true,
      showReadingMeta: art.showReadingMeta ?? true,
      leadBadgeLabel: art.leadBadgeLabel || articleDef?.label || 'Artículo',
      recommendedBlocks: art.recommendedBlocks || ['h2', 'paragraph', 'code', 'callout'],
      articleOverrideCount,
    };
  },

  /**
   * Resuelve la cascada completa Capa 1 (Blog) -> Capa 2 (Tipo de Artículo) -> Capa 3 (Canvas Block).
   */
  resolveBlockAesthetic(
    template: AestheticTemplate,
    articleType: ArticleTypeKey,
    blockType: CanvasBlockType,
  ): ResolvedBlockAesthetic {
    const articleResolved = this.resolveArticleAesthetic(template, articleType);
    const blk: CanvasBlockAestheticLayer = template.blockLayers[blockType] || {};
    const densitySpacing = DENSITY_DEFAULTS[articleResolved.density.value];

    const pickToken = <T>(
      articleToken: { value: T; source: HierarchyLayer },
      blockValue: T | undefined,
    ) => {
      if (blockValue !== undefined) {
        return { value: blockValue, source: 'block' as const, hasOverride: true };
      }
      return {
        value: articleToken.value,
        source: articleToken.source,
        hasOverride: false,
      };
    };

    const defaultBlockFont =
      blockType === 'code'
        ? articleResolved.codeFont
        : blockType === 'h2' || blockType === 'h3'
          ? articleResolved.headingFont
          : articleResolved.bodyFont;

    const defaultBlockBg =
      blockType === 'callout' || blockType === 'quote'
        ? articleResolved.surfaceSubtle
        : articleResolved.surfaceBg;

    const blockOverrideKeys = Object.keys(blk).filter(
      (k) => blk[k as keyof CanvasBlockAestheticLayer] !== undefined,
    );

    const fontDelta = blk.fontSizeDelta ?? 0;
    const baseBlockSize =
      blockType === 'h2'
        ? Math.round(articleResolved.fontSize.value * 1.45)
        : blockType === 'h3'
          ? Math.round(articleResolved.fontSize.value * 1.2)
          : blockType === 'code'
            ? Math.max(12, articleResolved.fontSize.value - 2)
            : articleResolved.fontSize.value;

    return {
      blockType,
      accentColor: pickToken(articleResolved.accentColor, blk.accentColor),
      backgroundColor: pickToken(defaultBlockBg, blk.backgroundColor),
      textColor: pickToken(articleResolved.textPrimary, blk.textColor),
      borderColor: pickToken(articleResolved.borderColor, blk.borderColor),
      borderRadius: pickToken(articleResolved.borderRadius, blk.borderRadius),
      paddingY:
        blk.paddingY !== undefined
          ? { value: blk.paddingY, source: 'block', hasOverride: true }
          : {
              value: densitySpacing.paddingY,
              source: articleResolved.density.source,
              hasOverride: false,
            },
      paddingX:
        blk.paddingX !== undefined
          ? { value: blk.paddingX, source: 'block', hasOverride: true }
          : {
              value: densitySpacing.paddingX,
              source: articleResolved.density.source,
              hasOverride: false,
            },
      marginY:
        blk.marginY !== undefined
          ? { value: blk.marginY, source: 'block', hasOverride: true }
          : {
              value: densitySpacing.marginY,
              source: articleResolved.density.source,
              hasOverride: false,
            },
      fontFamily: pickToken(defaultBlockFont, blk.fontFamily),
      fontSize: {
        value: Math.max(11, Math.min(36, baseBlockSize + fontDelta)),
        source:
          blk.fontSizeDelta !== undefined && blk.fontSizeDelta !== 0
            ? 'block'
            : articleResolved.fontSize.source,
        hasOverride: blk.fontSizeDelta !== undefined && blk.fontSizeDelta !== 0,
      },
      shadowStyle:
        blk.shadowStyle !== undefined
          ? { value: blk.shadowStyle, source: 'block', hasOverride: true }
          : { value: 'none', source: 'blog', hasOverride: false },
      paragraphStyle: blk.paragraphStyle || 'standard',
      headingDecoration: blk.headingDecoration || 'clean',
      codeTheme: blk.codeTheme || 'dark-slate',
      codeChrome: blk.codeChrome || 'macos-dots',
      showLineNumbers: blk.showLineNumbers ?? true,
      calloutSurface: blk.calloutSurface || 'left-bar',
      showCalloutIcon: blk.showCalloutIcon ?? true,
      quoteStyle: blk.quoteStyle || 'left-border',
      quoteItalic: blk.quoteItalic ?? true,
      listMarker: blk.listMarker || 'disc',
      imageFrame: blk.imageFrame || 'bordered',
      imageCaptionAlign: blk.imageCaptionAlign || 'center',
      dividerPattern: blk.dividerPattern || 'solid',
      blockOverrideCount: blockOverrideKeys.length,
    };
  },

  buildCssTokens(template: AestheticTemplate, articleType: ArticleTypeKey): string {
    const resolved = this.resolveArticleAesthetic(template, articleType);
    const codeBlock = this.resolveBlockAesthetic(template, articleType, 'code');
    const calloutBlock = this.resolveBlockAesthetic(template, articleType, 'callout');
    const quoteBlock = this.resolveBlockAesthetic(template, articleType, 'quote');
    const h2Block = this.resolveBlockAesthetic(template, articleType, 'h2');

    return [
      `/* Plantilla: ${template.name} (${template.id}) */`,
      `/* Cascada: Blog (${template.blogLayer.preset}) -> Artículo (${articleType}) -> Canvas Blocks */`,
      ':root {',
      `  /* Capa 1 & 2: Blog -> Tipo de Artículo (${articleType}) */`,
      `  --tpl-accent: ${resolved.accentColor.value}; /* origen: ${resolved.accentColor.source} */`,
      `  --tpl-surface-bg: ${resolved.surfaceBg.value}; /* origen: ${resolved.surfaceBg.source} */`,
      `  --tpl-surface-subtle: ${resolved.surfaceSubtle.value};`,
      `  --tpl-text-primary: ${resolved.textPrimary.value};`,
      `  --tpl-text-secondary: ${resolved.textSecondary.value};`,
      `  --tpl-border: ${resolved.borderColor.value};`,
      `  --tpl-heading-font: ${resolved.headingFont.value}; /* origen: ${resolved.headingFont.source} */`,
      `  --tpl-body-font: ${resolved.bodyFont.value}; /* origen: ${resolved.bodyFont.source} */`,
      `  --tpl-code-font: ${resolved.codeFont.value};`,
      `  --tpl-font-size: ${resolved.fontSize.value}px;`,
      `  --tpl-line-height: ${resolved.lineHeight.value};`,
      `  --tpl-max-width: ${resolved.contentMaxWidth.value}px;`,
      `  --tpl-radius: ${resolved.borderRadius.value}px;`,
      '',
      '  /* Capa 3: Canvas Blocks */',
      `  --block-h2-decoration: ${h2Block.headingDecoration};`,
      `  --block-h2-margin-y: ${h2Block.marginY.value}px;`,
      `  --block-code-theme: ${codeBlock.codeTheme};`,
      `  --block-code-radius: ${codeBlock.borderRadius.value}px;`,
      `  --block-callout-surface: ${calloutBlock.calloutSurface};`,
      `  --block-callout-accent: ${calloutBlock.accentColor.value};`,
      `  --block-quote-style: ${quoteBlock.quoteStyle};`,
      `  --block-quote-accent: ${quoteBlock.accentColor.value};`,
      '}',
    ].join('\n');
  },

  applyTemplateToEditorDocument(
    template: AestheticTemplate,
    articleType: ArticleTypeKey,
  ): boolean {
    const resolved = this.resolveArticleAesthetic(template, articleType);
    const currentDoc = editorDocumentService.loadDocument();
    const nextDoc = {
      ...currentDoc,
      showToc: resolved.showToc,
      typography: {
        ...currentDoc.typography,
        headingFont: resolved.headingFont.value,
        bodyFont: resolved.bodyFont.value,
        codeFont: resolved.codeFont.value,
        fontSize: resolved.fontSize.value,
        lineHeight: resolved.lineHeight.value,
      },
    };
    editorDocumentService.applyTypographyToDom(nextDoc.typography);
    return editorDocumentService.saveDocument(nextDoc);
  },
};
