import type { HistogramBarItem, HistogramMode } from '@dashboard/model/dashboard.model';

interface RetentionHistogramCardProps {
  items: HistogramBarItem[];
  mode: HistogramMode;
  onModeChange: (mode: HistogramMode) => void;
  onPickSite: (siteId: string) => void;
}

export function RetentionHistogramCard({
  items,
  mode,
  onModeChange,
  onPickSite,
}: RetentionHistogramCardProps) {
  const W = 680;
  const H = 285;
  const padL = 44;
  const padR = 20;
  const padT = 26;
  const padB = 56;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxVal = Math.max(10, Math.ceil(Math.max(...items.map((i) => i.value), 6) + 1));
  const avgVal = items.length ? items.reduce((s, i) => s + i.value, 0) / items.length : 0;
  const avgY = padT + plotH - (avgVal / maxVal) * plotH;

  const yTicks = [0, 1, 2, 3, 4, 5];
  const slotW = plotW / Math.max(items.length, 1);
  const barW = Math.min(62, slotW * 0.56);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Histograma de retención (minutos por usuario)</h2>
          <p className="card-subtitle">
            {mode === 'blogs'
              ? 'Tiempo promedio en minutos por usuario que logra retener cada blog'
              : 'Minutos de retención promedio por artículo dentro del filtro actual'}
          </p>
        </div>
        <div className="segmented-sm">
          <button
            type="button"
            className={mode === 'blogs' ? 'active' : ''}
            data-tooltip="Muestra una barra de retención por cada blog administrado"
            onClick={() => onModeChange('blogs')}
          >
            Por blog
          </button>
          <button
            type="button"
            className={mode === 'articles' ? 'active' : ''}
            data-tooltip="Muestra barras de retención para los artículos del filtro actual"
            onClick={() => onModeChange('articles')}
          >
            Por artículo
          </button>
        </div>
      </div>

      <div className="chart-stage">
        <svg className="histogram-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {yTicks.map((t) => {
            const val = (maxVal / 5) * t;
            const y = padT + plotH - (val / maxVal) * plotH;
            return (
              <g key={t}>
                <line
                  x1={padL}
                  y1={y}
                  x2={W - padR}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray={t === 0 ? undefined : '4 4'}
                />
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {val.toFixed(0)}m
                </text>
              </g>
            );
          })}

          {items.map((item, idx) => {
            const cx = padL + slotW * idx + slotW / 2;
            const x = cx - barW / 2;
            const barH = Math.max(4, (item.value / maxVal) * plotH);
            const y = padT + plotH - barH;
            const tip = `${item.fullTitle || item.label} (${item.sub}) — Retención promedio: ${item.value} min por usuario`;

            return (
              <g
                key={item.id}
                className="hist-bar"
                data-tooltip={tip}
                style={{ opacity: item.dimmed ? 0.32 : 1 }}
                onClick={() => item.pickSiteId && onPickSite(item.pickSiteId)}
              >
                <rect x={x} y={y} width={barW} height={barH} rx={6} fill={item.color} />
                <text
                  x={cx}
                  y={y - 7}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight="700"
                  fill="var(--text-primary)"
                  fontFamily="var(--font-mono)"
                >
                  {item.value}m
                </text>
                <text
                  x={cx}
                  y={padT + plotH + 17}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--text-primary)"
                >
                  {item.label}
                </text>
                <text
                  x={cx}
                  y={padT + plotH + 32}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--text-muted)"
                >
                  {item.sub}
                </text>
              </g>
            );
          })}

          <line
            x1={padL}
            y1={avgY}
            x2={W - padR}
            y2={avgY}
            stroke="var(--warning)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <rect
            x={W - padR - 116}
            y={avgY - 19}
            width={114}
            height={17}
            rx={4}
            fill="var(--warning-soft)"
          />
          <text
            x={W - padR - 59}
            y={avgY - 7}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill="var(--warning)"
          >
            Promedio: {avgVal.toFixed(1)} min
          </text>
        </svg>
      </div>
    </div>
  );
}
