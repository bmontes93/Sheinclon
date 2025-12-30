import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import config from '@/utils/config';
import { Product } from '@/features/products/types';

export interface CartItem extends Product {
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface CartSummary {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  freeShipping: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getCartSummary: () => CartSummary;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Función para obtener el carrito del localStorage
const getCartFromStorage = (): CartItem[] => {
  try {
    const cart = localStorage.getItem('shein_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Función para guardar el carrito en localStorage
const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem('shein_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      setIsLoading(true);

      // Verificar stock antes de agregar (si hay autenticación)
      if (isAuthenticated && user) {
        const response = await fetch(`${config.API_BASE_URL}/api/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            productId: product._id,
            quantity,
            size: product.selectedSize,
            color: product.selectedColor,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al agregar al carrito');
        }
      }

      // Agregar al carrito local
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((item) => {
          // Si el producto tiene variantes seleccionadas, comparar también esas
          if (product.selectedSize || product.selectedColor) {
            return item._id === product._id &&
                   item.selectedSize === product.selectedSize &&
                   item.selectedColor === product.selectedColor;
          }
          return item._id === product._id;
        });

        if (existingItemIndex !== -1) {
          // El producto ya existe, actualizar cantidad
          const updatedItems = [...prevItems];
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

          // Verificar límite de stock
          if (product.stock && newQuantity > product.stock) {
            throw new Error(`Solo hay ${product.stock} unidades disponibles`);
          }

          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity
          };
          return updatedItems;
        } else {
          // Nuevo producto, verificar stock
          if (product.stock && quantity > product.stock) {
            throw new Error(`Solo hay ${product.stock} unidades disponibles`);
          }

          // Añadirlo
          // Need to coerce Product to CartItem by adding quantity if missing, but quantity is passed
          const newItem: CartItem = { ...product, quantity }; 
          return [...prevItems, newItem];
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId: string, selectedSize: string = '', selectedColor: string = '') => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        if (selectedSize || selectedColor) {
          return !(item._id === productId &&
                   item.selectedSize === selectedSize &&
                   item.selectedColor === selectedColor);
        }
        return item._id !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize: string = '', selectedColor: string = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (selectedSize || selectedColor) {
          if (item._id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor) {
            return { ...item, quantity };
          }
        } else if (item._id === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSummary = () => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99; // Envío gratis en compras > $50
    const tax = subtotal * 0.08; // 8% de impuesto
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      freeShipping: subtotal > 50
    };
  };

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
