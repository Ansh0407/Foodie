// authRoutes.js
const express = require('express');
const { register, login, isAuthenticated, logout, getUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuthenticated);
router.post('/logout', logout);
router.get('/user', getUser); 

module.exports = router;
