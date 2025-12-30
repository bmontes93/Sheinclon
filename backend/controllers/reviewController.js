const Product = require('../models/productModel');

// @desc    Obtener reseñas de un producto
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .select('reviews rating numReviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      data: {
        reviews: product.reviews,
        rating: product.rating,
        numReviews: product.numReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear una reseña
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Por favor ingresa una calificación y comentario',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    // Verificar si el usuario ya ha reseñado este producto
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: 'Ya has reseñado este producto',
      });
    }

    // Crear nueva reseña
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // Calcular nuevo rating promedio
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar una reseña
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
const updateProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Por favor ingresa una calificación y comentario',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    // Encontrar la reseña del usuario
    const review = product.reviews.find(
      (review) => review._id.toString() === req.params.reviewId &&
                  review.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Reseña no encontrada o no tienes permisos para editarla',
      });
    }

    // Actualizar reseña
    review.rating = Number(rating);
    review.comment = comment;

    // Recalcular rating promedio
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message: 'Reseña actualizada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar una reseña
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    // Encontrar y eliminar la reseña
    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === req.params.reviewId &&
                  (review.user.toString() === req.user._id.toString() || req.user.role === 'admin')
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Reseña no encontrada o no tienes permisos para eliminarla',
      });
    }

    product.reviews.splice(reviewIndex, 1);

    // Recalcular rating promedio
    if (product.reviews.length > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      product.numReviews = product.reviews.length;
    } else {
      product.rating = 0;
      product.numReviews = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Reseña eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener reseñas del usuario actual
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res, next) => {
  try {
    const products = await Product.find({
      'reviews.user': req.user._id,
    }).select('name imageUrl reviews');

    const myReviews = products.map((product) => {
      const userReview = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
      return {
        product: {
          _id: product._id,
          name: product.name,
          imageUrl: product.imageUrl,
        },
        review: userReview,
      };
    });

    res.json({
      success: true,
      data: myReviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verificar si el usuario puede reseñar un producto
// @route   GET /api/products/:id/can-review
// @access  Private
const canReviewProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    const alreadyReviewed = product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    );

    res.json({
      success: true,
      data: {
        canReview: !alreadyReviewed,
        hasReviewed: alreadyReviewed,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getMyReviews,
  canReviewProduct,
};