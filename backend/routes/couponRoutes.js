const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getAvailableCoupons,
  getCouponStats,
} = require('../controllers/couponController');

const { protect, admin } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/validate', protect, validateCoupon);
router.get('/available', protect, getAvailableCoupons);

// Rutas de administrador
router.get('/stats', protect, admin, getCouponStats);
router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/:id')
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

module.exports = router;