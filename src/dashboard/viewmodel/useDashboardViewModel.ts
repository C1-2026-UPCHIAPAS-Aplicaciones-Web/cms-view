import { useCallback, useMemo, useState } from 'react';
import type {
  AddSiteFormInput,
  HistogramMode,
  ManagedSite,
  PeriodKey,
  PieStyle,
} from '@dashboard/model/dashboard.model';
import {
  DASHBOARD_PERIODS,
  INITIAL_MANAGED_SITES,
  dashboardDataService,
} from '@dashboard/service/dashboard-data.service';
import { sharedUtilsService } from '@shared/service/shared-utils.service';

export function useDashboardViewModel(onNotify: (text: string) => void) {
  const [sites, setSites] = useState<ManagedSite[]>(INITIAL_MANAGED_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('1w');
  const [histMode, setHistMode] = useState<HistogramMode>('blogs');
  const [pieStyle, setPieStyle] = useState<PieStyle>('pie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rankingLimit, setRankingLimit] = useState<number>(10);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState<boolean>(false);

  const periodInfo = DASHBOARD_PERIODS[selectedPeriod];

  const allSiteStats = useMemo(
    () => dashboardDataService.computeSiteStats(sites, selectedPeriod),
    [sites, selectedPeriod],
  );

  const globalSummary = useMemo(
    () => dashboardDataService.computeGlobalSummary(allSiteStats),
    [allSiteStats],
  );

  const activeSites = useMemo(
    () =>
      selectedSiteId === 'all'
        ? allSiteStats
        : allSiteStats.filter((s) => s.id === selectedSiteId),
    [allSiteStats, selectedSiteId],
  );

  const focusSite = useMemo(
    () =>
      selectedSiteId === 'all'
        ? allSiteStats[0] || null
        : activeSites[0] || allSiteStats[0] || null,
    [allSiteStats, activeSites, selectedSiteId],
  );

  const activeScopeLabel = useMemo(() => {
    const siteName =
      selectedSiteId === 'all' ? 'Todos los sitios' : activeSites[0]?.name || 'Todos los sitios';
    return `${siteName} · ${periodInfo.label}`;
  }, [selectedSiteId, activeSites, periodInfo.label]);

  const histogramBars = useMemo(
    () =>
      dashboardDataService.buildHistogramBars(
        allSiteStats,
        selectedSiteId,
        selectedPeriod,
        histMode,
      ),
    [allSiteStats, selectedSiteId, selectedPeriod, histMode],
  );

  const pieSlices = useMemo(
    () =>
      dashboardDataService.buildPieSlices(
        allSiteStats,
        globalSummary.totalVisits,
        selectedSiteId,
        pieStyle,
      ),
    [allSiteStats, globalSummary.totalVisits, selectedSiteId, pieStyle],
  );

  const rankingRows = useMemo(
    () =>
      dashboardDataService.buildRankingRows(
        activeSites,
        selectedPeriod,
        searchQuery,
        rankingLimit,
      ),
    [activeSites, selectedPeriod, searchQuery, rankingLimit],
  );

  const togglePickSite = useCallback((siteId: string) => {
    setSelectedSiteId((prev) => (siteId === 'all' || prev === siteId ? 'all' : siteId));
  }, []);

  const addManagedSite = useCallback(
    (input: AddSiteFormInput) => {
      if (!input.name.trim()) return;
      const newSite = dashboardDataService.createNewSite(input, sites.length);
      setSites((prev) => [...prev, newSite]);
      setSelectedSiteId(newSite.id);
      setIsAddSiteOpen(false);
      onNotify(`Sitio "${newSite.name}" agregado`);
    },
    [sites.length, onNotify],
  );

  const exportCsv = useCallback(() => {
    const csv = dashboardDataService.buildCsvReport(activeSites, selectedPeriod);
    sharedUtilsService.downloadFile(
      csv,
      `dashboard-${selectedSiteId}-${selectedPeriod}.csv`,
      'text/csv;charset=utf-8',
    );
    onNotify('Reporte CSV exportado');
  }, [activeSites, selectedPeriod, selectedSiteId, onNotify]);

  return {
    sites,
    selectedSiteId,
    setSelectedSiteId,
    togglePickSite,
    selectedPeriod,
    setSelectedPeriod,
    periodInfo,
    histMode,
    setHistMode,
    pieStyle,
    setPieStyle,
    searchQuery,
    setSearchQuery,
    rankingLimit,
    setRankingLimit,
    isAddSiteOpen,
    setIsAddSiteOpen,
    allSiteStats,
    globalSummary,
    activeSites,
    focusSite,
    activeScopeLabel,
    histogramBars,
    pieSlices,
    rankingRows,
    addManagedSite,
    exportCsv,
  };
}
