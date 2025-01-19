// const express = require('express');
// const { addTask, getTasks, getTask, updateTask, deleteTask, completedTask } = require('../controllers/taskController');
// const { protect } = require('../middlewares/authMiddleware');

// const router = express.Router();

// router.post('/', protect, addTask);
// router.get('/', protect, getTasks);
// router.get('/:id', protect, getTask);
// router.put('/toggle-status/:id', protect, completedTask);
// router.put('/:id', protect, updateTask);
// router.delete('/:id', protect, deleteTask);

// module.exports = router;
const express = require('express');
const { addTask, getTasks, getTask, updateTask, deleteTask, completedTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Add a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', protect, addTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get('/:id', protect, getTask);

/**
 * @swagger
 * /tasks/toggle-status/{id}:
 *   put:
 *     summary: Update task completion status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Task not found
 */
router.put('/toggle-status/:id', protect, completedTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put('/:id', protect, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', protect, deleteTask);

module.exports = router;
