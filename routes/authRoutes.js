const express = require('express');
const { 
    registerUser, 
    loginUser, 
    getMe 
} = require('../controllers/authController');

const router = express.Router();

// Register Route: POST /api/v1/auth/register
router.post('/register', registerUser);

// Login Route: POST /api/v1/auth/login
router.post('/login', loginUser);

// Get Profile Route: GET /api/v1/auth/me (Protected route stub)
// router.get('/me', protect, getMe);

module.exports = router;