const { body, query } = require('express-validator');

exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().withMessage('Invalid date'),
];

exports.taskStatusValidation = [
  body('status').isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status value'),
];

exports.taskQueryValidation = [
  query('status').optional().isIn(['todo', 'in-progress', 'done']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('sortBy').optional().isIn(['dueDate', 'priority', 'createdAt', 'title']),
  query('order').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];
