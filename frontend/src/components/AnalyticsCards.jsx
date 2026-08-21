export default function AnalyticsCards({ data }) {
  const { total = 0, done = 0, inProgress = 0, todo = 0, completionRate = 0 } = data || {};

  const cards = [
    { label: 'Total Tasks', value: total, cls: 'stat-total' },
    { label: 'Completed', value: done, cls: 'stat-done' },
    { label: 'Pending', value: todo + inProgress, cls: 'stat-pending' },
    { label: 'Completion Rate', value: `${completionRate}%`, cls: 'stat-rate' },
  ];

  return (
    <div className="grid-4">
      {cards.map((c) => (
        <div key={c.label} className={`stat-card ${c.cls}`}>
          <div className="stat-card-value">{c.value}</div>
          <div className="stat-card-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
