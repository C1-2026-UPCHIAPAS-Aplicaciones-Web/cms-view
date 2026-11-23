export type PeriodKey = '1d' | '1w' | '2w' | '1m' | '3m' | '1y';

export type HistogramMode = 'blogs' | 'articles';

export type PieStyle = 'pie' | 'donut';

export interface PeriodConfig {
  key: PeriodKey;
  shortLabel: string;
  label: string;
  tooltip: string;
  factor: number;
  uniqueRatio: number;
  retOffset: number;
}

export interface ManagedArticle {
  id: string;
  title: string;
  category: string;
  weeklyViews: number;
  retentionMin: number;
  trend: string;
}

export interface ManagedSite {
  id: string;
  name: string;
  domain: string;
  color: string;
  weeklyVisits: number;
  delta: string;
  retentionMin: number;
  retentionDelta: string;
  articles: ManagedArticle[];
}

export interface SiteComputedStats extends ManagedSite {
  visits: number;
  unique: number;
  retention: number;
  sharePct: number;
}

export interface GlobalQuadrantSummary {
  sitesCount: number;
  articlesCount: number;
  totalVisits: number;
  totalUnique: number;
  weightedRetention: number;
}

export interface HistogramBarItem {
  id: string;
  pickSiteId: string | null;
  label: string;
  fullTitle: string;
  sub: string;
  value: number;
  color: string;
  dimmed: boolean;
}

export interface PieSliceItem {
  id: string;
  name: string;
  color: string;
  visits: number;
  pct: number;
  pathD: string;
  isSelected: boolean;
  dimmed: boolean;
  tooltip: string;
}

export interface RankingRow {
  id: string;
  title: string;
  category: string;
  siteId: string;
  siteName: string;
  siteColor: string;
  views: number;
  barPct: number;
  retention: number;
  trend: string;
}

export interface AddSiteFormInput {
  name: string;
  domain: string;
  weeklyVisits: number;
  retentionMin: number;
}
