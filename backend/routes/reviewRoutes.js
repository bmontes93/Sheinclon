const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getMyReviews,
  canReviewProduct,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

// Rutas para reseñas de productos específicos
router.route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route('/:reviewId')
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);

// Verificar si puede reseñar
router.get('/can-review', protect, canReviewProduct);

// Rutas generales de reseñas
router.get('/my-reviews', protect, getMyReviews);

module.exports = router;