const express = require('express');
const { register, login, deleteUser, getAllUsers } = require('../Controller/authController');
const router = express.Router();
const AuthMiddleware = require('../Middleware/AuthMiddleware');

router.post('/register', register);
router.get('/users', getAllUsers);
router.post('/login', login);
router.delete('/delete', AuthMiddleware, deleteUser); 

module.exports = router;