// Pure SVG donut chart — no library needed
export default function DonutChart({ data }) {
  const { todo = 0, inProgress = 0, done = 0 } = data || {};
  const total = todo + inProgress + done;

  const segments = [
    { label: 'Done', value: done, color: 'hsl(142, 71%, 45%)' },
    { label: 'In Progress', value: inProgress, color: 'hsl(210, 100%, 56%)' },
    { label: 'Todo', value: todo, color: 'hsl(220, 14%, 55%)' },
  ];

  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 50;
  const strokeWidth = 22;

  // Build arcs
  const circumference = 2 * Math.PI * r;
  let cumulativePct = 0;
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dashArray = `${pct * circumference} ${circumference}`;
    const rotate = cumulativePct * 360 - 90;
    cumulativePct += pct;
    return { ...seg, dashArray, rotate, pct };
  });

  return (
    <div className="donut-wrap">
      <svg
        className="donut-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Task distribution donut chart"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--bg-secondary)"
          strokeWidth={strokeWidth}
        />

        {total === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
        ) : (
          arcs.map((arc) =>
            arc.value > 0 ? (
              <circle
                key={arc.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={arc.dashArray}
                transform={`rotate(${arc.rotate} ${cx} ${cy})`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
              />
            ) : null
          )
        )}

        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--text-primary)">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
          TASKS
        </text>
      </svg>

      {/* Legend */}
      <div className="donut-legend">
        {segments.map((seg) => (
          <div className="donut-legend-item" key={seg.label}>
            <div className="donut-legend-dot" style={{ background: seg.color }} />
            <span className="donut-legend-label">{seg.label}</span>
            <span className="donut-legend-val">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
