const { validationResult } = require('express-validator');
const Task = require('../models/Task');

exports.getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { owner: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    const sortDir = order === 'asc' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }

    const task = await Task.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, errors: errs.array() });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, message: 'deleted' });
  } catch (err) {
    next(err);
  }
};

// just updates the status field, used for the checkbox toggle on the frontend
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};
