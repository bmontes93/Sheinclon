import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import config from '../utils/config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Función para obtener el carrito del localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('shein_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Función para guardar el carrito en localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('shein_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState(getCartFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
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
          return [...prevItems, { ...product, quantity }];
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
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

  const updateQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
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
