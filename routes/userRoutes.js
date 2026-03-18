const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getCurrentUser);

module.exports = router;