const express = require('express');
const { addTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, addTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
