const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  verifyStock,
  reserveStock,
  releaseStock,
} = require('../controllers/cartController');

const { protect } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addToCart);

router.route('/items/:productId')
  .put(updateCartItem)
  .delete(removeFromCart);

// Rutas especiales para gestión de stock
router.post('/verify-stock', verifyStock);
router.post('/reserve-stock', reserveStock);
router.post('/release-stock', releaseStock);

module.exports = router;