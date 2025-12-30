const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories,
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

// Incluir rutas de reseñas
const reviewRoutes = require('./reviewRoutes');

// Rutas públicas
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/featured').get(getFeaturedProducts);
router.route('/categories').get(getCategories);

// Rutas de reseñas para productos específicos
router.use('/:id/reviews', reviewRoutes);

// Rutas protegidas (requieren autenticación)
// router.route('/').post(protect, admin, createProduct);
// router.route('/:id').put(protect, admin, updateProduct);
// router.route('/:id').delete(protect, admin, deleteProduct);

module.exports = router;