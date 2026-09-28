const router = require('express').Router();
const { getDays, getSummary } = require('../controllers/statsController');
const protect = require('../middleware/auth');

router.use(protect);
router.get('/days', getDays);
router.get('/summary', getSummary);

module.exports = router;
