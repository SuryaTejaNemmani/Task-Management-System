const Task = require('../models/Task');

// GET /api/analytics/summary
exports.getSummary = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [statusCounts, priorityCounts] = await Promise.all([
      Task.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { owner: ownerId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const statusMap = { todo: 0, 'in-progress': 0, done: 0 };
    statusCounts.forEach((s) => (statusMap[s._id] = s.count));

    const priorityMap = { low: 0, medium: 0, high: 0 };
    priorityCounts.forEach((p) => (priorityMap[p._id] = p.count));

    const total = statusMap.todo + statusMap['in-progress'] + statusMap.done;
    const completionRate = total > 0 ? Math.round((statusMap.done / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        todo: statusMap.todo,
        inProgress: statusMap['in-progress'],
        done: statusMap.done,
        completionRate,
        priority: priorityMap,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/trend — tasks created per day (last 7 days)
exports.getTrend = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const trend = await Task.aggregate([
      { $match: { owner: ownerId, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = trend.find((t) => t._id === dateStr);
      result.push({ date: dateStr, count: found ? found.count : 0 });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
