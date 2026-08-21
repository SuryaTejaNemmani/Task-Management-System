const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/authenticate');
const { taskValidation, taskStatusValidation, taskQueryValidation } = require('../middleware/validate');

router.use(authenticate);

router.get('/', taskQueryValidation, getTasks);
router.post('/', taskValidation, createTask);
router.get('/:id', getTask);
router.put('/:id', taskValidation, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', taskStatusValidation, updateTaskStatus);

module.exports = router;
