export default function FilterBar({ filters, onChange, onClear }) {
  return (
    <div className="filter-bar">
      <input
        id="filter-search"
        type="search"
        className="input"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => onChange('search', e.target.value)}
      />

      <select
        id="filter-status"
        className="input"
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        id="filter-priority"
        className="input"
        value={filters.priority}
        onChange={(e) => onChange('priority', e.target.value)}
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        id="filter-sortby"
        className="input"
        value={filters.sortBy}
        onChange={(e) => onChange('sortBy', e.target.value)}
      >
        <option value="createdAt">Newest first</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>

      <select
        id="filter-order"
        className="input"
        value={filters.order}
        onChange={(e) => onChange('order', e.target.value)}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>

      <button className="btn btn-ghost btn-sm" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
