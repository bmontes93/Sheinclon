const Product = require('../models/productModel');

// @desc    Obtener carrito del usuario
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    // En una implementación real, el carrito se guardaría en la base de datos
    // Por ahora, devolveremos un carrito vacío o simulado
    res.json({
      success: true,
      data: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Agregar producto al carrito
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Producto no disponible',
      });
    }

    // Verificar stock disponible
    const availableStock = product.getAvailableStock(size, color);

    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuficiente. Solo ${availableStock} unidades disponibles.`,
      });
    }

    // Aquí iría la lógica para agregar al carrito del usuario
    // Por ahora, solo verificamos el stock

    res.json({
      success: true,
      data: {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: availableStock,
        },
        quantity,
        size,
        color,
      },
      message: 'Producto agregado al carrito exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar cantidad en carrito
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, size, color } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    // Verificar stock disponible
    const availableStock = product.getAvailableStock(size, color);

    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuficiente. Solo ${availableStock} unidades disponibles.`,
      });
    }

    res.json({
      success: true,
      data: {
        productId,
        quantity,
        size,
        color,
        availableStock,
      },
      message: 'Carrito actualizado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar producto del carrito
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { size, color } = req.body;
    const productId = req.params.productId;

    // Aquí iría la lógica para eliminar del carrito del usuario

    res.json({
      success: true,
      data: {
        productId,
        size,
        color,
      },
      message: 'Producto eliminado del carrito',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Limpiar carrito
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    // Aquí iría la lógica para limpiar el carrito del usuario

    res.json({
      success: true,
      message: 'Carrito limpiado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verificar stock antes de proceder al pago
// @route   POST /api/cart/verify-stock
// @access  Private
const verifyStock = async (req, res, next) => {
  try {
    const { items } = req.body;

    const stockIssues = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        stockIssues.push({
          productId: item.productId,
          issue: 'Producto no encontrado',
        });
        continue;
      }

      if (!product.isActive) {
        stockIssues.push({
          productId: item.productId,
          productName: product.name,
          issue: 'Producto no disponible',
        });
        continue;
      }

      const availableStock = product.getAvailableStock(item.size, item.color);

      if (availableStock < item.quantity) {
        stockIssues.push({
          productId: item.productId,
          productName: product.name,
          requested: item.quantity,
          available: availableStock,
          issue: 'Stock insuficiente',
        });
      }
    }

    if (stockIssues.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Algunos productos tienen problemas de stock',
        data: stockIssues,
      });
    }

    res.json({
      success: true,
      message: 'Stock verificado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reservar stock para checkout
// @route   POST /api/cart/reserve-stock
// @access  Private
const reserveStock = async (req, res, next) => {
  try {
    const { items } = req.body;

    // Verificar stock primero
    const verifyResponse = await verifyStock(req, res, next);
    if (verifyResponse.status !== 200) {
      return;
    }

    // Reservar stock (reducir temporalmente)
    const reservations = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      await product.reduceStock(item.quantity, item.size, item.color);

      reservations.push({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    res.json({
      success: true,
      data: {
        reservations,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      },
      message: 'Stock reservado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Liberar stock reservado
// @route   POST /api/cart/release-stock
// @access  Private
const releaseStock = async (req, res, next) => {
  try {
    const { reservations } = req.body;

    // Liberar stock (aumentar)
    for (const reservation of reservations) {
      const product = await Product.findById(reservation.productId);
      await product.increaseStock(reservation.quantity, reservation.size, reservation.color);
    }

    res.json({
      success: true,
      message: 'Stock liberado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  verifyStock,
  reserveStock,
  releaseStock,
};