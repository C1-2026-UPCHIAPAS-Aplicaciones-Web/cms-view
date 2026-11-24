import '@dashboard/view/dashboard.css';
import type { PeriodConfig } from '@dashboard/model/dashboard.model';
import { DASHBOARD_PERIODS } from '@dashboard/service/dashboard-data.service';
import { useDashboardViewModel } from '@dashboard/viewmodel/useDashboardViewModel';
import { SummaryQuadrantsTable } from '@dashboard/view/SummaryQuadrantsTable';
import { RetentionHistogramCard } from '@dashboard/view/RetentionHistogramCard';
import { TrafficPieCard } from '@dashboard/view/TrafficPieCard';
import { RankingTableCard } from '@dashboard/view/RankingTableCard';
import { AddSiteModal } from '@dashboard/view/AddSiteModal';
import { IconChartBar, IconPlus, IconThemeContrast } from '@shared/view/SvgIcons';

interface DashboardViewProps {
  onToggleTheme: () => void;
  onNotify: (text: string) => void;
}

const PERIOD_LIST: PeriodConfig[] = Object.values(DASHBOARD_PERIODS);

export function DashboardView({
  onToggleTheme,
  onNotify,
}: DashboardViewProps) {
  const vm = useDashboardViewModel(onNotify);

  const selectedSiteName =
    vm.selectedSiteId === 'all' ? null : vm.activeSites[0]?.name || null;

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand">
            <div className="brand-icon">
              <IconChartBar size={15} />
            </div>
            <span>InkStack Analytics</span>
          </div>

          <div className="site-selector-wrap">
            <span className="site-selector-label">Sitio administrado:</span>
            <select
              className="control-select"
              value={vm.selectedSiteId}
              data-tooltip="Filtra las visitas, el ranking y las métricas por cualquier sitio que administras"
              onChange={(e) => vm.setSelectedSiteId(e.target.value)}
            >
              <option value="all">Todos los sitios ({vm.sites.length})</option>
              {vm.sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.domain})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm"
              data-tooltip="Registra un nuevo sitio/blog administrado en el panel"
              onClick={() => vm.setIsAddSiteOpen(true)}
            >
              <IconPlus size={13} />
              <span>Sitio</span>
            </button>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="btn btn-icon"
            data-tooltip="Alterna entre tema claro y oscuro"
            onClick={onToggleTheme}
          >
            <IconThemeContrast size={15} />
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-tooltip="Descarga un reporte CSV con el ranking actual y sus métricas"
            onClick={vm.exportCsv}
          >
            Exportar CSV
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="filter-bar">
          <div className="period-group">
            <span className="filter-title">Periodo de tiempo:</span>
            <div className="period-pills">
              {PERIOD_LIST.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`period-pill ${vm.selectedPeriod === p.key ? 'active' : ''}`}
                  data-tooltip={p.tooltip}
                  onClick={() => vm.setSelectedPeriod(p.key)}
                >
                  {p.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="period-meta">
            <span>
              Mostrando datos estáticos de: <strong>{vm.activeScopeLabel}</strong>
            </span>
          </div>
        </section>

        <SummaryQuadrantsTable
          globalSummary={vm.globalSummary}
          periodLabel={vm.periodInfo.label}
          allSiteStats={vm.allSiteStats}
          focusSite={vm.focusSite}
          selectedSiteId={vm.selectedSiteId}
          onPickSite={vm.togglePickSite}
        />

        <section className="charts-grid">
          <RetentionHistogramCard
            items={vm.histogramBars}
            mode={vm.histMode}
            onModeChange={vm.setHistMode}
            onPickSite={vm.togglePickSite}
          />
          <TrafficPieCard
            slices={vm.pieSlices}
            totalVisits={vm.globalSummary.totalVisits}
            pieStyle={vm.pieStyle}
            onStyleChange={vm.setPieStyle}
            onPickSite={vm.togglePickSite}
          />
        </section>

        <RankingTableCard
          rows={vm.rankingRows}
          selectedSiteName={selectedSiteName}
          periodLabel={vm.periodInfo.label}
          searchQuery={vm.searchQuery}
          rankingLimit={vm.rankingLimit}
          onSearchChange={vm.setSearchQuery}
          onLimitChange={vm.setRankingLimit}
        />
      </main>

      <AddSiteModal
        isOpen={vm.isAddSiteOpen}
        onClose={() => vm.setIsAddSiteOpen(false)}
        onSave={vm.addManagedSite}
      />
    </>
  );
}
