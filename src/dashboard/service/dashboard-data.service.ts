import type {
  AddSiteFormInput,
  GlobalQuadrantSummary,
  HistogramBarItem,
  HistogramMode,
  ManagedSite,
  PeriodConfig,
  PeriodKey,
  PieSliceItem,
  PieStyle,
  RankingRow,
  SiteComputedStats,
} from '@dashboard/model/dashboard.model';
import { sharedUtilsService } from '@shared/service/shared-utils.service';

export const DASHBOARD_PERIODS: Record<PeriodKey, PeriodConfig> = {
  '1d': {
    key: '1d',
    shortLabel: '1 día',
    label: 'Último día (24h)',
    tooltip: 'Muestra estadísticas de las últimas 24 horas',
    factor: 0.16,
    uniqueRatio: 0.84,
    retOffset: -0.2,
  },
  '1w': {
    key: '1w',
    shortLabel: '1 semana',
    label: 'Última semana (7 días)',
    tooltip: 'Muestra estadísticas de los últimos 7 días',
    factor: 1.0,
    uniqueRatio: 0.76,
    retOffset: 0,
  },
  '2w': {
    key: '2w',
    shortLabel: '2 semanas',
    label: 'Últimas 2 semanas (14 días)',
    tooltip: 'Muestra estadísticas de las últimas 2 semanas (14 días)',
    factor: 1.94,
    uniqueRatio: 0.72,
    retOffset: 0.15,
  },
  '1m': {
    key: '1m',
    shortLabel: '1 mes',
    label: 'Último mes (30 días)',
    tooltip: 'Muestra estadísticas del último mes (30 días)',
    factor: 4.15,
    uniqueRatio: 0.68,
    retOffset: 0.3,
  },
  '3m': {
    key: '3m',
    shortLabel: '3 meses',
    label: 'Últimos 3 meses (90 días)',
    tooltip: 'Muestra estadísticas del último trimestre (90 días)',
    factor: 11.8,
    uniqueRatio: 0.63,
    retOffset: 0.45,
  },
  '1y': {
    key: '1y',
    shortLabel: '1 año',
    label: 'Último año (365 días)',
    tooltip: 'Muestra estadísticas acumuladas de 1 año',
    factor: 46.2,
    uniqueRatio: 0.58,
    retOffset: 0.6,
  },
};

export const INITIAL_MANAGED_SITES: ManagedSite[] = [
  {
    id: 'devpulse',
    name: 'DevPulse Tech',
    domain: 'devpulse.io',
    color: '#2563eb',
    weeklyVisits: 18450,
    delta: '+16.4%',
    retentionMin: 5.8,
    retentionDelta: '+0.6 min',
    articles: [
      { id: 'a1', title: 'Caching HTTP en APIs modernas: ETag y Cache-Control', category: 'Backend & APIs', weeklyViews: 5420, retentionMin: 6.4, trend: '+22%' },
      { id: 'a2', title: 'Patrones de Rate Limiting distribuido con Redis y TypeScript', category: 'Backend & APIs', weeklyViews: 4180, retentionMin: 7.1, trend: '+18%' },
      { id: 'a3', title: 'Cómo depurar fugas de memoria en Node.js con Heap Snapshots', category: 'Performance', weeklyViews: 3290, retentionMin: 5.9, trend: '+9%' },
      { id: 'a4', title: 'Migrando de REST a tRPC en monorepos TypeScript', category: 'Arquitectura', weeklyViews: 2810, retentionMin: 4.8, trend: '+12%' },
      { id: 'a5', title: 'Guía práctica de WebSockets resilientes con reconexión exponencial', category: 'Backend & APIs', weeklyViews: 2750, retentionMin: 5.2, trend: '-3%' },
    ],
  },
  {
    id: 'cloudnotes',
    name: 'CloudNotes',
    domain: 'cloudnotes.dev',
    color: '#7c3aed',
    weeklyVisits: 12900,
    delta: '+11.2%',
    retentionMin: 6.5,
    retentionDelta: '+0.8 min',
    articles: [
      { id: 'c1', title: 'Kubernetes Probes: Liveness vs Readiness en producción', category: 'DevOps & Cloud', weeklyViews: 4320, retentionMin: 7.4, trend: '+27%' },
      { id: 'c2', title: 'Optimiza imágenes Docker multi-stage para Node y Go (-78% peso)', category: 'DevOps & Cloud', weeklyViews: 3610, retentionMin: 6.8, trend: '+15%' },
      { id: 'c3', title: 'Terraform State Locking con S3 y DynamoDB paso a paso', category: 'Infraestructura', weeklyViews: 2540, retentionMin: 6.1, trend: '+6%' },
      { id: 'c4', title: 'Observabilidad con OpenTelemetry sin disparar costos de trazas', category: 'DevOps & Cloud', weeklyViews: 2430, retentionMin: 5.7, trend: '+14%' },
    ],
  },
  {
    id: 'frontendlab',
    name: 'FrontendLab',
    domain: 'frontendlab.es',
    color: '#059669',
    weeklyVisits: 9640,
    delta: '+8.7%',
    retentionMin: 4.1,
    retentionDelta: '+0.3 min',
    articles: [
      { id: 'f1', title: 'CSS Container Queries vs Media Queries con ejemplos interactivos', category: 'Frontend & UI', weeklyViews: 3580, retentionMin: 4.6, trend: '+19%' },
      { id: 'f2', title: 'Señales y reactividad granular: entendiendo el modelo mental', category: 'Frontend & UI', weeklyViews: 2640, retentionMin: 4.3, trend: '+11%' },
      { id: 'f3', title: 'Accesibilidad en modales y menús con teclado y ARIA', category: 'UI / UX', weeklyViews: 1920, retentionMin: 3.9, trend: '+4%' },
      { id: 'f4', title: 'View Transitions API en aplicaciones multipágina', category: 'Frontend & UI', weeklyViews: 1500, retentionMin: 3.4, trend: '-5%' },
    ],
  },
  {
    id: 'dbcraft',
    name: 'DBCraft',
    domain: 'dbcraft.io',
    color: '#ea580c',
    weeklyVisits: 7310,
    delta: '+19.1%',
    retentionMin: 7.3,
    retentionDelta: '+1.1 min',
    articles: [
      { id: 'd1', title: 'Índices GIN y JSONB en PostgreSQL: cuándo usarlos y cuándo evitarlos', category: 'Bases de Datos', weeklyViews: 3120, retentionMin: 8.2, trend: '+31%' },
      { id: 'd2', title: 'EXPLAIN ANALYZE explicado desde cero con consultas lentas reales', category: 'Bases de Datos', weeklyViews: 2290, retentionMin: 7.5, trend: '+21%' },
      { id: 'd3', title: 'Estrategias de particionamiento por rango de fechas en SQL', category: 'Bases de Datos', weeklyViews: 1900, retentionMin: 6.1, trend: '+8%' },
    ],
  },
];

const EXTRA_SITE_PALETTE = ['#0891b2', '#db2777', '#65a30d', '#4f46e5', '#ca8a04'];

export const dashboardDataService = {
  computeSiteStats(sites: ManagedSite[], periodKey: PeriodKey): SiteComputedStats[] {
    const period = DASHBOARD_PERIODS[periodKey];
    const prelim = sites.map((site) => {
      const visits = Math.round(site.weeklyVisits * period.factor);
      const unique = Math.round(visits * period.uniqueRatio);
      const retention = Math.max(0.8, Number((site.retentionMin + period.retOffset).toFixed(1)));
      return { ...site, visits, unique, retention };
    });

    const totalAllVisits = prelim.reduce((sum, s) => sum + s.visits, 0);
    return prelim.map((s) => ({
      ...s,
      sharePct: totalAllVisits > 0 ? (s.visits / totalAllVisits) * 100 : 0,
    }));
  },

  computeGlobalSummary(allSiteStats: SiteComputedStats[]): GlobalQuadrantSummary {
    const totalVisits = allSiteStats.reduce((sum, s) => sum + s.visits, 0);
    const totalUnique = allSiteStats.reduce((sum, s) => sum + s.unique, 0);
    const articlesCount = allSiteStats.reduce((sum, s) => sum + s.articles.length, 0);
    const weightedRetention =
      totalVisits > 0
        ? allSiteStats.reduce((sum, s) => sum + s.retention * s.visits, 0) / totalVisits
        : 0;

    return {
      sitesCount: allSiteStats.length,
      articlesCount,
      totalVisits,
      totalUnique,
      weightedRetention,
    };
  },

  buildHistogramBars(
    allSiteStats: SiteComputedStats[],
    selectedSiteId: string,
    periodKey: PeriodKey,
    mode: HistogramMode,
  ): HistogramBarItem[] {
    const period = DASHBOARD_PERIODS[periodKey];
    if (mode === 'blogs') {
      return allSiteStats.map((s) => ({
        id: s.id,
        pickSiteId: s.id,
        label: s.name,
        fullTitle: s.name,
        sub: s.domain,
        value: s.retention,
        color: s.color,
        dimmed: selectedSiteId !== 'all' && selectedSiteId !== s.id,
      }));
    }

    const scopeSites =
      selectedSiteId === 'all'
        ? allSiteStats
        : allSiteStats.filter((s) => s.id === selectedSiteId);

    return scopeSites
      .flatMap((s) =>
        s.articles.map((a) => ({
          id: a.id,
          pickSiteId: null,
          label: a.title.length > 22 ? `${a.title.slice(0, 20)}…` : a.title,
          fullTitle: a.title,
          sub: s.name,
          value: Math.max(0.8, Number((a.retentionMin + period.retOffset).toFixed(1))),
          color: s.color,
          dimmed: false,
        })),
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  },

  buildPieSlices(
    allSiteStats: SiteComputedStats[],
    totalAllVisits: number,
    selectedSiteId: string,
    pieStyle: PieStyle,
  ): PieSliceItem[] {
    const cx = 107.5;
    const cy = 107.5;
    const R = 95;
    const rInner = pieStyle === 'donut' ? 54 : 0;
    let startAngle = -Math.PI / 2;

    return allSiteStats.map((s) => {
      const pct = totalAllVisits > 0 ? s.visits / totalAllVisits : 0;
      const angle = pct * Math.PI * 2;
      const endAngle = startAngle + angle;

      const x1 = cx + R * Math.cos(startAngle);
      const y1 = cy + R * Math.sin(startAngle);
      const x2 = cx + R * Math.cos(endAngle);
      const y2 = cy + R * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;

      let pathD = '';
      if (rInner === 0) {
        pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      } else {
        const ix1 = cx + rInner * Math.cos(endAngle);
        const iy1 = cy + rInner * Math.sin(endAngle);
        const ix2 = cx + rInner * Math.cos(startAngle);
        const iy2 = cy + rInner * Math.sin(startAngle);
        pathD = `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${rInner} ${rInner} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
      }

      startAngle = endAngle;
      const isSelected = selectedSiteId === s.id;
      const dimmed = selectedSiteId !== 'all' && !isSelected;

      return {
        id: s.id,
        name: s.name,
        color: s.color,
        visits: s.visits,
        pct: pct * 100,
        pathD,
        isSelected,
        dimmed,
        tooltip: `${s.name}: ${sharedUtilsService.formatNumber(s.visits)} visitas (${(pct * 100).toFixed(1)}% del total)`,
      };
    });
  },

  buildRankingRows(
    activeSites: SiteComputedStats[],
    periodKey: PeriodKey,
    searchQuery: string,
    limit: number,
  ): RankingRow[] {
    const period = DASHBOARD_PERIODS[periodKey];
    const query = searchQuery.trim().toLowerCase();

    let rows = activeSites.flatMap((site) =>
      site.articles.map((article) => ({
        id: article.id,
        title: article.title,
        category: article.category,
        siteId: site.id,
        siteName: site.name,
        siteColor: site.color,
        views: Math.round(article.weeklyViews * period.factor),
        barPct: 0,
        retention: Math.max(0.8, Number((article.retentionMin + period.retOffset).toFixed(1))),
        trend: article.trend,
      })),
    );

    if (query) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.siteName.toLowerCase().includes(query),
      );
    }

    rows.sort((a, b) => b.views - a.views);
    const sliced = rows.slice(0, limit);
    const maxViews = sliced[0]?.views || 1;
    return sliced.map((r) => ({
      ...r,
      barPct: Math.round((r.views / maxViews) * 100),
    }));
  },

  createNewSite(input: AddSiteFormInput, existingCount: number): ManagedSite {
    const newId = `site_${Date.now()}`;
    const name = input.name.trim();
    const domain = input.domain.trim() || 'mi-sitio.dev';
    const weeklyVisits = Math.max(100, Number(input.weeklyVisits) || 3500);
    const retentionMin = Math.max(0.5, Number(input.retentionMin) || 4.5);
    const color = EXTRA_SITE_PALETTE[existingCount % EXTRA_SITE_PALETTE.length];

    return {
      id: newId,
      name,
      domain,
      color,
      weeklyVisits,
      delta: '+12.0%',
      retentionMin,
      retentionDelta: '+0.4 min',
      articles: [
        {
          id: `${newId}_1`,
          title: `Guía inicial de arquitectura en ${name}`,
          category: 'Arquitectura',
          weeklyViews: Math.round(weeklyVisits * 0.45),
          retentionMin: Number((retentionMin + 0.5).toFixed(1)),
          trend: '+15%',
        },
        {
          id: `${newId}_2`,
          title: `Patrones prácticos de rendimiento para ${domain}`,
          category: 'Performance',
          weeklyViews: Math.round(weeklyVisits * 0.32),
          retentionMin,
          trend: '+9%',
        },
        {
          id: `${newId}_3`,
          title: 'Buenas prácticas y snippets esenciales',
          category: 'Guías Prácticas',
          weeklyViews: Math.round(weeklyVisits * 0.23),
          retentionMin: Math.max(1, Number((retentionMin - 0.6).toFixed(1))),
          trend: '+4%',
        },
      ],
    };
  },

  buildCsvReport(
    activeSites: SiteComputedStats[],
    periodKey: PeriodKey,
  ): string {
    const period = DASHBOARD_PERIODS[periodKey];
    const header = [
      'Posicion',
      'Articulo',
      'Categoria',
      'Sitio',
      'Periodo',
      'Visualizaciones',
      'Retencion_Min_Usuario',
      'Tendencia',
    ];
    const rows = this.buildRankingRows(activeSites, periodKey, '', 999);
    const lines = [
      header.join(','),
      ...rows.map((r, idx) =>
        [
          idx + 1,
          `"${r.title.replace(/"/g, '""')}"`,
          r.category,
          r.siteName,
          period.label,
          r.views,
          r.retention,
          r.trend,
        ].join(','),
      ),
    ];
    return lines.join('\n');
  },
};
