const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const { authMiddleware,authUserMiddleware } = require('../Middleware/authMiddleware');

router.post('/create-order/:id', orderController.createOrder)
router.get('/get-all-order/:id', orderController.getAllOrderDetails)
router.get('/get-details-order/:id', orderController.getDetailsOrder)
router.delete('/cancel-order/:id', orderController.cancelOrderDetails)
router.put('/update-order/:id', orderController.updateOrderDetails)
router.get('/get-all-order', orderController.getAllOrder)

module.exports = router