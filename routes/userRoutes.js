// const express = require('express');
// const { registerUser, loginUser, getUser, updateUser, deleteUser, refreshToken, getUsersWithTaskCount } = require('../controllers/userController');
// const { protect, admin } = require('../middlewares/authMiddleware');

// const router = express.Router();


// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/refresh-token', refreshToken);
// router.get('/', protect, admin, getUsersWithTaskCount);
// router.get('/:id', protect, getUser);
// router.put('/:id', protect, updateUser);
// router.delete('/:id', protect, admin, deleteUser);

// module.exports = router;

const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser, refreshToken, getUsersWithTaskCount } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a name, email, and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Login a user with their email and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh user access token
 *     description: Generate a new access token using a valid refresh token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: No refresh token provided
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with task count (Admin only)
 *     description: Retrieve all users along with the count of their tasks
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users with task counts
 *       403:
 *         description: Access denied. Admin only
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, admin, getUsersWithTaskCount);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by user ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Update the user details, including name, email, and password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', protect, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
