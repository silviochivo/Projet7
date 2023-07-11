const express = require('express');
const router = express.Router();

const userController = require('../controllers/User');
const validEmail = require('../middleware/email-validator');
const validPassword = require('../middleware/password-validator');

router.post('/signup', validEmail ,validPassword ,userController.signup);
router.post('/login', userController.login );

module.exports = router;