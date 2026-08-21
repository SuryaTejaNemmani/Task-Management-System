const express = require('express');
const router = express.Router();
const { getSummary, getTrend } = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/authenticate');

router.use(authenticate);

router.get('/summary', getSummary);
router.get('/trend', getTrend);

module.exports = router;
