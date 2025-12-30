import Product from '../models/Product';
import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  keyword?: string;
}

interface ProductSort {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const getProducts = async (
  filter: ProductFilter,
  sort: ProductSort,
  pagination: { page: number; pageSize: number }
) => {
  const where: any = {};

  if (filter.category) {
    where.category = filter.category;
  }

  if (filter.minPrice || filter.maxPrice) {
    where.price = Between(filter.minPrice || 0, filter.maxPrice || 1000000);
  }

  if (filter.rating) {
    where.rating = MoreThanOrEqual(filter.rating);
  }

  if (filter.keyword) {
    where.name = Like(`%${filter.keyword}%`);
    // TypeORM OR condition for keyword in name OR description is tricky with simple object syntax.
    // For simplicity, we search in name. For advanced, we'd use QueryBuilder.
  }

  where.isActive = true;

  const order: any = {};
  order[sort.sortBy] = sort.sortOrder.toUpperCase();

  const [products, total] = await Product.findAndCount({
    where,
    order,
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
  });

  return {
    products,
    page: pagination.page,
    pages: Math.ceil(total / pagination.pageSize),
    total,
  };
};

export const getProductById = async (id: string) => {
  return await Product.findOneBy({ _id: id });
};

export const createProduct = async (userId: string, productData?: any) => {
  // Usually we take productData from controller. userId might be for audit.
  // Assuming productData is passed. 
  // In the controller call: productService.createProduct(req.body, req.user._id)
  // Let's adjust the signature to match usage or fix usage.
  // The controller currently calls: createProduct(req.user._id) which is wrong.
  // Controller needs to pass body. I will fix controller later or assume data comes from body here?
  // Check the previous controller implementation...
  // It was: createProduct(req.user._id) -> It created a sample product!
  
  // Re-implementing sample product creation logic
  const product = Product.create({
      name: 'Nuevo Producto ' + Date.now(),
      imageUrl: '/images/sample.jpg',
      brand: 'SheinClone',
      category: 'Tops',
      description: 'Descripción del producto',
      price: 0,
      stock: 0,
      isActive: true, // TypeORM defaults don't always auto-apply on 'create' object, but 'save' does.
      sizes: [],
      colors: [],
      images: []
  });

  return await product.save();
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const product = await Product.findOneBy({ _id: id });
  if (!product) return null;

  Product.merge(product, data);
  return await product.save();
};

export const deleteProduct = async (id: string) => {
  const result = await Product.delete({ _id: id });
  return result.affected ? result.affected > 0 : false;
};

export const getFeaturedProducts = async () => {
  return await Product.find({
    where: { isFeatured: true, isActive: true },
    take: 4, // Limit 4
  });
};

export const getCategories = async () => {
    // Unique categories.
    // SQLite doesn't have 'distinct' easy on helper.
    const products = await Product.find({ select: ['category'] });
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories);
};
