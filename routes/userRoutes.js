const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser, refreshToken, getUsersWithTaskCount } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/', protect, admin, getUsersWithTaskCount);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;