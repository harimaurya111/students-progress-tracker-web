const router = require('express').Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/auth');

router.use(protect);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').patch(updateTask).delete(deleteTask);

module.exports = router;
