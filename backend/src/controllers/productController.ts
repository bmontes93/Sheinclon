import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const filter = {
      category: req.query.category as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      keyword: req.query.keyword as string,
    };

    const sort = {
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await productService.getProducts(filter, sort, { page, pageSize });

    res.json({
      ...result,
      filters: {
        ...filter,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);

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
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdProduct = await productService.createProduct((req as any).user?._id as string);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    if (updatedProduct) {
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
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await productService.deleteProduct(req.params.id);

    if (success) {
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
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener categorías
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await productService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
