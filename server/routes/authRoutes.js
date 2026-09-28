const router = require('express').Router();
const { register, login, getMe, updateMe } = require('../controllers/authController');
const protect = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.route('/me').get(protect, getMe).patch(protect, updateMe);

module.exports = router;
