import type { RankingRow } from '@dashboard/model/dashboard.model';
import { sharedUtilsService } from '@shared/service/shared-utils.service';

interface RankingTableCardProps {
  rows: RankingRow[];
  selectedSiteName: string | null;
  periodLabel: string;
  searchQuery: string;
  rankingLimit: number;
  onSearchChange: (q: string) => void;
  onLimitChange: (limit: number) => void;
}

export function RankingTableCard({
  rows,
  selectedSiteName,
  periodLabel,
  searchQuery,
  rankingLimit,
  onSearchChange,
  onLimitChange,
}: RankingTableCardProps) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            {selectedSiteName
              ? `Ranking Top de artículos — ${selectedSiteName}`
              : 'Ranking Top de artículos más visualizados (todos los sitios)'}
          </h2>
          <p className="card-subtitle">
            Periodo: {periodLabel} · {rows.length} entradas mostradas
          </p>
        </div>
        <div className="ranking-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar artículo o categoría..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select
            className="control-select"
            style={{ height: '31px', fontSize: '12px' }}
            value={rankingLimit}
            data-tooltip="Cantidad máxima de entradas a mostrar en el ranking"
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Todos</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="ranking-table">
          <thead>
            <tr>
              <th style={{ width: '54px' }}>#</th>
              <th>Artículo / Entrada</th>
              <th>Blog</th>
              <th>Visualizaciones</th>
              <th>Retención / usuario</th>
              <th>Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '26px' }}
                >
                  No hay artículos que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const rank = idx + 1;
                const rankClass = rank <= 3 ? `rank-${rank}` : '';
                const isUp = !row.trend.startsWith('-');
                return (
                  <tr key={row.id}>
                    <td>
                      <span className={`rank-num ${rankClass}`}>{rank}</span>
                    </td>
                    <td>
                      <div className="article-title-cell">{row.title}</div>
                      <div className="article-meta-cell">
                        <span className="cat-pill">{row.category}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                          fontSize: '12.5px',
                        }}
                      >
                        <span className="color-dot" style={{ background: row.siteColor }} />
                        {row.siteName}
                      </span>
                    </td>
                    <td className="views-bar-cell">
                      <div className="views-num-row">
                        <span>{sharedUtilsService.formatNumber(row.views)}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                          {row.barPct}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${row.barPct}%`, background: row.siteColor }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="retention-pill">⏱ {row.retention} min</span>
                    </td>
                    <td>
                      <span className={`trend-badge ${isUp ? 'up' : 'down'}`}>{row.trend}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
