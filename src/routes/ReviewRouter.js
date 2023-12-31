const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');

router.post('/create-review', reviewController.createReview )
router.get('/get-reviews-product/:productId', reviewController.getReviewsByProduct);
module.exports = router