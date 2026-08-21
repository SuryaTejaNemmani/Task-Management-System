// Pure SVG/HTML bar chart for 7-day trend
export default function TrendChart({ data = [] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const dayLabels = data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  });

  return (
    <div>
      <div className="bar-chart">
        {data.map((d, i) => {
          const heightPct = (d.count / maxCount) * 100;
          return (
            <div className="bar-col" key={d.date}>
              {d.count > 0 && <div className="bar-count">{d.count}</div>}
              <div
                className="bar"
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                title={`${d.date}: ${d.count} task${d.count !== 1 ? 's' : ''}`}
              />
            </div>
          );
        })}
      </div>
      <div className="bar-chart" style={{ height: 'auto', marginTop: 6 }}>
        {dayLabels.map((label, i) => (
          <div className="bar-col" key={i} style={{ height: 'auto', justifyContent: 'center' }}>
            <span className="bar-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
