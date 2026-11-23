import type { PieSliceItem, PieStyle } from '@dashboard/model/dashboard.model';
import { sharedUtilsService } from '@shared/service/shared-utils.service';

interface TrafficPieCardProps {
  slices: PieSliceItem[];
  totalVisits: number;
  pieStyle: PieStyle;
  onStyleChange: (style: PieStyle) => void;
  onPickSite: (siteId: string) => void;
}

export function TrafficPieCard({
  slices,
  totalVisits,
  pieStyle,
  onStyleChange,
  onPickSite,
}: TrafficPieCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Proporción de visitas por blog</h2>
          <p className="card-subtitle">
            Distribución de tráfico respecto a todos los sitios administrados
          </p>
        </div>
        <div className="segmented-sm">
          <button
            type="button"
            className={pieStyle === 'pie' ? 'active' : ''}
            data-tooltip="Muestra gráfica de pastel completa"
            onClick={() => onStyleChange('pie')}
          >
            Pastel
          </button>
          <button
            type="button"
            className={pieStyle === 'donut' ? 'active' : ''}
            data-tooltip="Muestra gráfica de dona con total en el centro"
            onClick={() => onStyleChange('donut')}
          >
            Dona
          </button>
        </div>
      </div>

      <div className="pie-layout">
        <div className="pie-svg-wrap">
          <svg className="pie-svg" viewBox="0 0 215 215">
            {slices.map((slice) => (
              <path
                key={slice.id}
                d={slice.pathD}
                fill={slice.color}
                stroke="var(--bg-surface)"
                strokeWidth="2"
                className={`pie-slice ${slice.isSelected ? 'selected' : ''}`}
                style={{ opacity: slice.dimmed ? 0.42 : 1 }}
                data-tooltip={slice.tooltip}
                onClick={() => onPickSite(slice.id)}
              />
            ))}
            {pieStyle === 'donut' && (
              <>
                <text
                  x="107.5"
                  y="103.5"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="var(--text-primary)"
                >
                  {sharedUtilsService.formatNumber(totalVisits)}
                </text>
                <text
                  x="107.5"
                  y="121.5"
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-muted)"
                >
                  visitas totales
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="pie-legend">
          {slices.map((slice) => (
            <div
              key={slice.id}
              className={`legend-row ${slice.isSelected ? 'active' : ''}`}
              data-tooltip={`Clic para filtrar por ${slice.name}`}
              onClick={() => onPickSite(slice.id)}
            >
              <div className="legend-left">
                <span className="color-dot" style={{ background: slice.color }} />
                <span className="legend-name">{slice.name}</span>
              </div>
              <div className="legend-right">
                <span>{sharedUtilsService.formatNumber(slice.visits)}</span>
                <strong style={{ color: 'var(--accent)' }}>{slice.pct.toFixed(1)}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
