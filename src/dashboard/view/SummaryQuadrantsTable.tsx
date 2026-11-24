import type {
  GlobalQuadrantSummary,
  SiteComputedStats,
} from '@dashboard/model/dashboard.model';
import { sharedUtilsService } from '@shared/service/shared-utils.service';
import { IconChartBar, IconClock, IconEye, IconUser } from '@shared/view/SvgIcons';

interface SummaryQuadrantsTableProps {
  globalSummary: GlobalQuadrantSummary;
  periodLabel: string;
  allSiteStats: SiteComputedStats[];
  focusSite: SiteComputedStats | null;
  selectedSiteId: string;
  onPickSite: (siteId: string) => void;
}

export function SummaryQuadrantsTable({
  globalSummary,
  periodLabel,
  allSiteStats,
  focusSite,
  selectedSiteId,
  onPickSite,
}: SummaryQuadrantsTableProps) {
  const isFiltered = selectedSiteId !== 'all';

  return (
    <section>
      <table className="summary-table" aria-label="Resumen de métricas en 2 bloques por cuadrantes">
        <tbody>
          <tr>
            {/* Block 1: All Managed Sites Grouped in Quadrants */}
            <td className="summary-block-cell">
              <div className="summary-block">
                <div className="summary-block-head">
                  <div>
                    <h2 className="summary-block-title">Resumen Global</h2>
                    <p className="summary-block-sub">
                      Todos los sitios administrados agrupados en el periodo
                    </p>
                  </div>
                  <span className="scope-badge accent">
                    {globalSummary.sitesCount} sitios agrupados
                  </span>
                </div>

                <div className="site-pills-bar">
                  <button
                    type="button"
                    className={`site-chip-btn ${selectedSiteId === 'all' ? 'active' : ''}`}
                    data-tooltip="Muestra todos los sitios agrupados sin filtro individual"
                    onClick={() => onPickSite('all')}
                  >
                    <span>Todos</span>
                    <span className="site-chip-visits">
                      {sharedUtilsService.formatNumber(globalSummary.totalVisits)}
                    </span>
                  </button>
                  <span className="summary-info-pill">
                    {globalSummary.articlesCount} entradas activas
                  </span>
                  <span className="summary-info-pill">{periodLabel}</span>
                </div>

                <div className="quadrants-grid">
                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Número de visitas</span>
                      <IconEye size={15} />
                    </div>
                    <div className="quadrant-value">
                      {sharedUtilsService.formatNumber(globalSummary.totalVisits)}
                    </div>
                    <div className="quadrant-footer">
                      <span className="trend-badge up">+13.8%</span>
                      <span>total acumulado</span>
                    </div>
                  </div>

                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Visitantes únicos</span>
                      <IconUser size={15} />
                    </div>
                    <div className="quadrant-value">
                      {sharedUtilsService.formatNumber(globalSummary.totalUnique)}
                    </div>
                    <div className="quadrant-footer">
                      <span className="trend-badge up">+11.4%</span>
                      <span>lectores distintos</span>
                    </div>
                  </div>

                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Retención promedio</span>
                      <IconClock size={15} />
                    </div>
                    <div className="quadrant-value">
                      {globalSummary.weightedRetention.toFixed(1)} min
                    </div>
                    <div className="quadrant-footer">
                      <span className="trend-badge up">+0.7 min</span>
                      <span>ponderada / usuario</span>
                    </div>
                  </div>

                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Proporción</span>
                      <IconChartBar size={15} />
                    </div>
                    <div className="quadrant-value">100%</div>
                    <div className="quadrant-footer">
                      <span>repartidas entre {globalSummary.sitesCount} blogs</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>

            {/* Block 2: Individual Site Detail Quadrants + Site Switcher Chips */}
            <td className="summary-block-cell">
              <div className="summary-block">
                <div className="summary-block-head">
                  <div>
                    <h2 className="summary-block-title">
                      <span
                        className="color-dot"
                        style={{ background: focusSite?.color || '#2563eb' }}
                      />
                      <span>
                        {focusSite
                          ? isFiltered
                            ? focusSite.name
                            : `Destacado: ${focusSite.name}`
                          : 'Detalle por sitio'}
                      </span>
                    </h2>
                    <p className="summary-block-sub">
                      {isFiltered
                        ? 'Sitio filtrado · Clic en el chip para ver todos'
                        : 'Sitio líder · Clic en un sitio para filtrar'}
                    </p>
                  </div>
                  <span className="scope-badge">{focusSite?.domain || '—'}</span>
                </div>

                <div className="site-pills-bar">
                  {allSiteStats.map((site) => {
                    const isActive = selectedSiteId === site.id;
                    const isFocused = selectedSiteId === 'all' && focusSite?.id === site.id;
                    const tip = isActive
                      ? 'Clic para quitar filtro y ver todos los sitios'
                      : `Clic para filtrar el dashboard por ${site.name} (${site.sharePct.toFixed(1)}% del total)`;

                    return (
                      <button
                        key={site.id}
                        type="button"
                        className={`site-chip-btn ${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
                        data-tooltip={tip}
                        onClick={() => onPickSite(site.id)}
                      >
                        <span className="color-dot" style={{ background: site.color }} />
                        <span>{site.name}</span>
                        <span className="site-chip-visits">
                          {sharedUtilsService.formatNumber(site.visits)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="quadrants-grid">
                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Número de visitas</span>
                      <IconEye size={15} />
                    </div>
                    <div className="quadrant-value">
                      {focusSite ? sharedUtilsService.formatNumber(focusSite.visits) : '0'}
                    </div>
                    <div className="quadrant-footer">
                      <span className="trend-badge up">{focusSite?.delta || '+0%'}</span>
                      <span>vs. periodo anterior</span>
                    </div>
                  </div>

                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Visitantes únicos</span>
                      <IconUser size={15} />
                    </div>
                    <div className="quadrant-value">
                      {focusSite ? sharedUtilsService.formatNumber(focusSite.unique) : '0'}
                    </div>
                    <div className="quadrant-footer">
                      <span className="trend-badge up">+10.6%</span>
                      <span>lectores del sitio</span>
                    </div>
                  </div>

                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Retención promedio</span>
                      <IconClock size={15} />
                    </div>
                    <div className="quadrant-value">
                      {focusSite ? `${focusSite.retention.toFixed(1)} min` : '0 min'}
                    </div>
                    <div className="quadrant-footer">
                      <span className="trend-badge up">
                        {focusSite?.retentionDelta || '+0 min'}
                      </span>
                      <span>por usuario</span>
                    </div>
                  </div>

                  <div className="quadrant-cell">
                    <div className="quadrant-label">
                      <span>Proporción de visitas</span>
                      <IconChartBar size={15} />
                    </div>
                    <div className="quadrant-value">
                      {focusSite ? `${focusSite.sharePct.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="quadrant-footer">
                      <span>
                        de {sharedUtilsService.formatNumber(globalSummary.totalVisits)} visitas globales
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
