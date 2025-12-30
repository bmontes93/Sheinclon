const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingresa el nombre del producto'],
    trim: true,
    maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'Por favor ingresa la descripción del producto'],
    maxLength: [1000, 'La descripción no puede exceder 1000 caracteres'],
  },
  price: {
    type: Number,
    required: [true, 'Por favor ingresa el precio del producto'],
    min: [0, 'El precio debe ser mayor a 0'],
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  category: {
    type: String,
    required: [true, 'Por favor ingresa la categoría del producto'],
    enum: {
      values: ['Vestidos', 'Blusas', 'Pantalones', 'Chaquetas', 'Faldas', 'Tops', 'Sudaderas', 'Ropa de Baño', 'Accesorios'],
      message: 'Por favor selecciona una categoría válida',
    },
  },
  imageUrl: {
    type: String,
    required: [true, 'Por favor ingresa la URL de la imagen'],
  },
  images: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: [true, 'Por favor ingresa el stock del producto'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0,
  },
  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: String, // SKU específico por talla
  }],
  colors: [{
    name: String,
    hexCode: String,
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
  }],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
  weight: {
    type: Number,
    min: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  brand: {
    type: String,
    default: 'SHEIN',
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices para mejorar el rendimiento de las búsquedas
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Virtual para calcular si el producto está en oferta
productSchema.virtual('isOnSale').get(function() {
  return this.originalPrice && this.originalPrice > this.price;
});

// Virtual para calcular el porcentaje de descuento
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Método para reducir stock
productSchema.methods.reduceStock = function(quantity, size = null, color = null) {
  if (size && this.sizes && this.sizes.length > 0) {
    // Gestionar stock por talla
    const sizeVariant = this.sizes.find(s => s.size === size);
    if (!sizeVariant) {
      throw new Error(`Talla ${size} no disponible`);
    }
    if (sizeVariant.stock < quantity) {
      throw new Error(`Stock insuficiente para talla ${size}`);
    }
    sizeVariant.stock -= quantity;
  } else if (color && this.colors && this.colors.length > 0) {
    // Gestionar stock por color
    const colorVariant = this.colors.find(c => c.name === color);
    if (!colorVariant) {
      throw new Error(`Color ${color} no disponible`);
    }
    if (colorVariant.stock < quantity) {
      throw new Error(`Stock insuficiente para color ${color}`);
    }
    colorVariant.stock -= quantity;
  } else {
    // Gestionar stock general
    if (this.stock < quantity) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
  }

  return this.save();
};

// Método para aumentar stock
productSchema.methods.increaseStock = function(quantity, size = null, color = null) {
  if (size && this.sizes && this.sizes.length > 0) {
    const sizeVariant = this.sizes.find(s => s.size === size);
    if (sizeVariant) {
      sizeVariant.stock += quantity;
    }
  } else if (color && this.colors && this.colors.length > 0) {
    const colorVariant = this.colors.find(c => c.name === color);
    if (colorVariant) {
      colorVariant.stock += quantity;
    }
  } else {
    this.stock += quantity;
  }

  return this.save();
};

// Método para verificar disponibilidad de stock
productSchema.methods.checkStock = function(quantity, size = null, color = null) {
  if (size && this.sizes && this.sizes.length > 0) {
    const sizeVariant = this.sizes.find(s => s.size === size);
    return sizeVariant ? sizeVariant.stock >= quantity : false;
  } else if (color && this.colors && this.colors.length > 0) {
    const colorVariant = this.colors.find(c => c.name === color);
    return colorVariant ? colorVariant.stock >= quantity : false;
  } else {
    return this.stock >= quantity;
  }
};

// Método para obtener stock disponible
productSchema.methods.getAvailableStock = function(size = null, color = null) {
  if (size && this.sizes && this.sizes.length > 0) {
    const sizeVariant = this.sizes.find(s => s.size === size);
    return sizeVariant ? sizeVariant.stock : 0;
  } else if (color && this.colors && this.colors.length > 0) {
    const colorVariant = this.colors.find(c => c.name === color);
    return colorVariant ? colorVariant.stock : 0;
  } else {
    return this.stock;
  }
};

// Método estático para buscar productos
productSchema.statics.searchProducts = function(searchTerm, filters = {}) {
  const query = {};

  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }

  if (filters.rating) {
    query.rating = { $gte: filters.rating };
  }

  return this.find(query);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
