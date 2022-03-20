const express = require('express');
const authController = require('../controllers/auth-controller');
const validationMiddleware = require('../middlewares/validation-middleware');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', validationMiddleware.loginValidator, authController.postLogin);

router.get('/logout', authController.getLogout);

router.get('/register', authController.getRegister);

router.post('/register', validationMiddleware.registerValidator, authController.postRegister);

router.post('/new-password', validationMiddleware.newPasswordValidator, authController.postNewPassword);

router.get('/new-password/:resetToken', authController.getNewPassword);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', validationMiddleware.resetPasswordValidator, authController.postResetPassword);

module.exports = router;