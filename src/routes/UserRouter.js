const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../Middleware/authMiddleware');

router.post('/sign-up', userController.createUser )
router.post('/sign-in', userController.loginUser )
router.post('/log-out', userController.logoutUser )
router.put('/update-user/:id', userController.updateUser )
router.put('/update-user-password/:id', userController.updateUserPassword)
router.delete('/delete-user/:id',  userController.deleteUser )
router.get('/get-all-user',  userController.getAllUser )
router.get('/get-details-user/:id',  authUserMiddleware,userController.getDetailsUser )
router.post('/refresh-token',userController.refreshToken) //apiiii cung cấp lại access_token mới khi access_token cũ hết hạn mà người dùng ko cần đăng nhập lại
module.exports = router