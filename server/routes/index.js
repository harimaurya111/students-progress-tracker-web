const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/tasks', require('./taskRoutes'));
router.use('/stats', require('./statsRoutes'));

module.exports = router;
