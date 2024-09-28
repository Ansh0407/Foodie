const express = require('express');
const { register, login, isAuthenticated, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuthenticated);
router.post('/logout', logout);

module.exports = router;
