const Product = require('../models/productModel');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Construir filtros
    let filter = { isActive: true }; // Solo productos activos

    // Filtro por categoría
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filtro por rango de precios
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Filtro por rating mínimo
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) };
    }

    // Búsqueda por texto
    let searchQuery = {};
    if (req.query.keyword) {
      searchQuery = {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { category: { $regex: req.query.keyword, $options: 'i' } },
          { tags: { $in: [new RegExp(req.query.keyword, 'i')] } }
        ]
      };
    }

    // Combinar filtros
    const finalFilter = { ...filter, ...searchQuery };

    // Construir opciones de ordenamiento
    let sortOptions = {};
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'price':
        sortOptions = { price: sortOrder };
        break;
      case 'rating':
        sortOptions = { rating: sortOrder };
        break;
      case 'name':
        sortOptions = { name: sortOrder };
        break;
      case 'createdAt':
      default:
        sortOptions = { createdAt: sortOrder };
        break;
    }

    // Ejecutar consulta
    const count = await Product.countDocuments(finalFilter);
    const products = await Product.find(finalFilter)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('reviews.user', 'name');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      filters: {
        category: req.query.category,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        keyword: req.query.keyword,
        rating: req.query.rating,
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Crear un producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: 'Producto de muestra',
      price: 0,
      user: req.user._id,
      imageUrl: '/images/sample.jpg',
      category: 'Muestra',
      stock: 0,
      numReviews: 0,
      description: 'Descripción de muestra',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      imageUrl,
      category,
      stock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener productos destacados
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener categorías
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories,
};