const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/authenticate');
const { registerValidation, loginValidation } = require('../middleware/validate');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

module.exports = router;
