const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Por favor ingresa el código del cupón'],
    unique: true,
    uppercase: true,
    trim: true,
    minLength: [3, 'El código debe tener al menos 3 caracteres'],
    maxLength: [20, 'El código no puede exceder 20 caracteres'],
  },
  name: {
    type: String,
    required: [true, 'Por favor ingresa el nombre del cupón'],
    trim: true,
    maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping'],
    required: [true, 'Por favor selecciona el tipo de descuento'],
  },
  value: {
    type: Number,
    required: function() {
      return this.type !== 'free_shipping';
    },
    min: [0, 'El valor debe ser mayor a 0'],
    validate: {
      validator: function(value) {
        if (this.type === 'percentage') {
          return value <= 100;
        }
        return true;
      },
      message: 'El porcentaje no puede exceder 100%'
    }
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'El monto mínimo debe ser mayor o igual a 0'],
  },
  maxDiscount: {
    type: Number,
    default: null, // Solo para descuentos porcentuales
    min: [0, 'El descuento máximo debe ser mayor a 0'],
  },
  usageLimit: {
    type: Number,
    default: null, // null = ilimitado
    min: [1, 'El límite de uso debe ser mayor a 0'],
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'El contador de uso no puede ser negativo'],
  },
  userLimit: {
    type: Number,
    default: 1, // Cuántas veces puede usarlo un mismo usuario
    min: [1, 'El límite por usuario debe ser mayor a 0'],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null, // null = sin expiración
    validate: {
      validator: function(value) {
        return !value || value > this.startDate;
      },
      message: 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicableCategories: [{
    type: String,
    trim: true,
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  firstTimeCustomersOnly: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Índices para mejorar rendimiento
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1, endDate: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

// Método para verificar si el cupón es válido
couponSchema.methods.isValid = function(userId = null, purchaseAmount = 0) {
  const now = new Date();

  // Verificar si está activo
  if (!this.isActive) return false;

  // Verificar fechas
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;

  // Verificar monto mínimo de compra
  if (this.minPurchase && purchaseAmount < this.minPurchase) return false;

  // Verificar límite de uso global
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;

  return true;
};

// Método para calcular el descuento
couponSchema.methods.calculateDiscount = function(subtotal, items = []) {
  let discount = 0;

  switch (this.type) {
    case 'percentage':
      discount = (subtotal * this.value) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;

    case 'fixed':
      discount = Math.min(this.value, subtotal);
      break;

    case 'free_shipping':
      // El descuento se calcula en el checkout
      discount = 0;
      break;

    default:
      discount = 0;
  }

  return Math.round(discount * 100) / 100; // Redondear a 2 decimales
};

// Método para verificar si aplica a productos específicos
couponSchema.methods.appliesToProducts = function(items) {
  if (!this.applicableProducts.length && !this.applicableCategories.length) {
    return true; // Aplica a todos los productos
  }

  return items.some(item => {
    // Verificar productos excluidos
    if (this.excludedProducts.some(excludedId => excludedId.toString() === item.productId.toString())) {
      return false;
    }

    // Verificar productos específicos
    if (this.applicableProducts.length > 0) {
      return this.applicableProducts.some(productId => productId.toString() === item.productId.toString());
    }

    // Verificar categorías
    if (this.applicableCategories.length > 0) {
      return this.applicableCategories.includes(item.category);
    }

    return false;
  });
};

// Método para incrementar contador de uso
couponSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Método estático para buscar cupón por código
couponSchema.statics.findByCode = function(code) {
  return this.findOne({
    code: code.toUpperCase(),
    isActive: true
  });
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;