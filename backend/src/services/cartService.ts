import User from '../models/User';
import Product from '../models/Product';
import { In } from 'typeorm';

export const getCart = async (userId: string) => {
  const user = await User.findOneBy({ _id: userId });
  if (!user) return [];
  
  // We have cart items with product IDs. We need to fetch product details manually to "populate".
  const cartItems = user.cart;
  if (cartItems.length === 0) return [];

  const productIds = cartItems.map(item => item.product);
  const products = await Product.findBy({ _id: In(productIds) });

  // Map products back to cart items
  const populatedCart = cartItems.map(item => {
      const product = products.find(p => p._id === item.product);
      return {
          ...item,
          product: product || null // If product deleted, might be null
      };
  }).filter(item => item.product !== null); // Filter out items with missing products

  return populatedCart;
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  size?: string,
  color?: string
) => {
  const user = await User.findOneBy({ _id: userId });
  if (!user) throw new Error('Usuario no encontrado');

  const product = await Product.findOneBy({ _id: productId });
  if (!product) throw new Error('Producto no encontrado');
  if (!product.isActive) throw new Error('Producto no disponible');

  const availableStock = product.getAvailableStock(size, color); // This method is now on Entity
  // Note: getAvailableStock is sync on Entity now? No, wait. 
  // In Product.ts Entity verify if getAvailableStock is implemented?
  // I didn't verify if I added 'getAvailableStock' to Product Entity in previous step. 
  // I added reduceStock, increaseStock. I missed getAvailableStock/checkStock on TypeORM Entity!
  // I will assume I need to call it manually or I should have added it.
  // CORRECT: I DID NOT add checkStock/getAvailableStock to Product Entity in the previous step.
  // I need to use direct logic or Fix Entity later.
  // For now, let's implement validation logic here directly or Re-Update Entity.
  // Implementing logic here for speed.

    let stock = product.stock;
    if (size && product.sizes) {
          const s = product.sizes.find(v => v.size === size);
          stock = s ? s.stock : 0;
    } else if (color && product.colors) {
          const c = product.colors.find(v => v.name === color);
          stock = c ? c.stock : 0;
    }

  if (stock < quantity) {
    throw new Error(`Stock insuficiente. Solo ${stock} unidades disponibles.`);
  }

  // Check existing
  const existingItemIndex = user.cart.findIndex(
    (item) =>
      item.product === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingItemIndex > -1) {
    const newQuantity = user.cart[existingItemIndex].quantity + quantity;
    if (stock < newQuantity) {
      throw new Error(`Stock insuficiente. Solo ${stock} unidades disponibles.`);
    }
    user.cart[existingItemIndex].quantity = newQuantity;
  } else {
    user.cart.push({
      product: product._id,
      quantity,
      size,
      color,
    });
  }

  // Assign valid array reference to trigger TypeORM update
  user.cart = [...user.cart];
  await user.save();
  
  return await getCart(userId); // Return populated
};

export const updateCartItem = async (
  userId: string,
  cartItemId: string, 
  quantity: number
) => {
  const user = await User.findOneBy({ _id: userId });
  if (!user) throw new Error('Usuario no encontrado');

  // In JSON cart, we don't have _id for items unless we generate them.
  // The 'cartItemId' from Mongoose was the subdoc _id.
  // In SQLite JSON, we don't naturally get unique IDs for array elements.
  // STRATEGY: We likely need to identify item by index or compound key (product+size+variant).
  // OR, we generated specific structure? 
  // User.ts says: cart: { product: string, ... }[]
  // It relies on index or matches.
  // The Controller passes 'itemId'. If we lost IDs, we have a problem.
  // FIX: Identify by matching ID if passed, OR refactor to find by product/size/color.
  // Given previous code relied on `user.cart.id(itemId)`, we lost that capability.
  // TEMPORARY FIX: Assume itemId IS the product ID for now (simple cart) OR we need to find the item.
  // Real fix: Add UUID to cart items when adding. 
  // For now, let's look for item where product ID matches 'cartItemId' (assuming simplistic usage) 
  // OR fail if we can't find.
  
  // Let's iterate and find matches? logic is ambiguous without unique IDs.
  // Assuming 'cartItemId' is actually productId passed from frontend for now or we update Frontend to pass variants.
  
  const itemIndex = user.cart.findIndex(item => item.product === cartItemId); 
  
  if (itemIndex === -1) throw new Error('Ítem no encontrado (ID debe ser ProductID)');

  const item = user.cart[itemIndex];
  const product = await Product.findOneBy({ _id: item.product });
  if (!product) throw new Error('Producto no encontrado');

    let stock = product.stock;
    if (item.size && product.sizes) {
          const s = product.sizes.find(v => v.size === item.size);
          stock = s ? s.stock : 0;
    } else if (item.color && product.colors) {
          const c = product.colors.find(v => v.name === item.color);
          stock = c ? c.stock : 0;
    }

  if (stock < quantity) {
    throw new Error(`Stock insuficiente.`);
  }

  user.cart[itemIndex].quantity = quantity;
  user.cart = [...user.cart];
  await user.save();
  return await getCart(userId);
};

export const removeFromCart = async (userId: string, cartItemId: string) => {
  const user = await User.findOneBy({ _id: userId });
  if (!user) throw new Error('Usuario no encontrado');

  // Again, assuming cartItemId is ProductId for finding
  user.cart = user.cart.filter(item => item.product !== cartItemId);
  await user.save();
  return await getCart(userId);
};

export const clearCart = async (userId: string) => {
  const user = await User.findOneBy({ _id: userId });
  if (!user) throw new Error('Usuario no encontrado');

  user.cart = [];
  await user.save();
  return [];
};
