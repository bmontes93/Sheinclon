const Coupon = require('../models/couponModel');

// @desc    Obtener todos los cupones (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Coupon.countDocuments();
    const coupons = await Coupon.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      coupons,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener cupón por ID (Admin)
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('createdBy', 'name email');

    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404);
      throw new Error('Cupón no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Crear un cupón
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const coupon = await Coupon.create(couponData);
    const populatedCoupon = await Coupon.findById(coupon._id).populate('createdBy', 'name email');

    res.status(201).json(populatedCoupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar cupón
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Cupón no encontrado');
    }

    // Actualizar campos
    const fieldsToUpdate = [
      'name', 'description', 'type', 'value', 'minPurchase', 'maxDiscount',
      'usageLimit', 'userLimit', 'startDate', 'endDate', 'isActive',
      'applicableCategories', 'applicableProducts', 'excludedProducts',
      'firstTimeCustomersOnly'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });

    const updatedCoupon = await coupon.save();
    const populatedCoupon = await Coupon.findById(updatedCoupon._id).populate('createdBy', 'name email');

    res.json(populatedCoupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar cupón
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Cupón no encontrado');
    }

    await coupon.remove();
    res.json({ message: 'Cupón eliminado' });
  } catch (error) {
    next(error);
  }
};

// @desc    Validar y aplicar cupón
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
  try {
    const { code, items, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Por favor ingresa un código de cupón',
      });
    }

    const coupon = await Coupon.findByCode(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Cupón no encontrado o inválido',
      });
    }

    // Verificar si el cupón es válido
    if (!coupon.isValid(req.user._id, subtotal)) {
      let errorMessage = 'Cupón no válido';

      if (!coupon.isActive) errorMessage = 'Este cupón ya no está disponible';
      else if (coupon.startDate && new Date() < coupon.startDate) errorMessage = 'Este cupón aún no está disponible';
      else if (coupon.endDate && new Date() > coupon.endDate) errorMessage = 'Este cupón ha expirado';
      else if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        errorMessage = `Este cupón requiere una compra mínima de $${coupon.minPurchase}`;
      }
      else if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        errorMessage = 'Este cupón ha alcanzado su límite de uso';
      }

      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }

    // Verificar si aplica a los productos del carrito
    if (!coupon.appliesToProducts(items)) {
      return res.status(400).json({
        success: false,
        error: 'Este cupón no aplica a los productos en tu carrito',
      });
    }

    // Calcular descuento
    const discount = coupon.calculateDiscount(subtotal, items);

    res.json({
      success: true,
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value,
        },
        discount,
        finalTotal: Math.max(0, subtotal - discount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener cupones disponibles para el usuario
// @route   GET /api/coupons/available
// @access  Private
const getAvailableCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: new Date() } }
      ]
    }).select('code name description type value minPurchase endDate');

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de cupones (Admin)
// @route   GET /api/coupons/stats
// @access  Private/Admin
const getCouponStats = async (req, res, next) => {
  try {
    const stats = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          activeCoupons: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          expiredCoupons: {
            $sum: {
              $cond: [
                { $and: ['$endDate', { $lt: ['$endDate', new Date()] }] },
                1,
                0
              ]
            }
          },
          totalUsage: { $sum: '$usageCount' },
          averageDiscount: { $avg: '$value' }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalCoupons: 0,
        activeCoupons: 0,
        expiredCoupons: 0,
        totalUsage: 0,
        averageDiscount: 0
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getAvailableCoupons,
  getCouponStats,
};