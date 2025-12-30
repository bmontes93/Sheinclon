import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, CartItem } from '@/features/cart/context/CartContext';
import CouponInput from '@/features/cart/components/CouponInput';

const CartPage: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary
  } = useCart();

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null); // Type this properly later

  const { subtotal, shipping, tax, total, freeShipping } = getCartSummary();

  // Calcular total con descuento
  const discount = appliedCoupon ? parseFloat(appliedCoupon.discount) : 0;
  const finalTotal = Math.max(0, parseFloat(total) - discount);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    updateQuantity(item._id, newQuantity, item.selectedSize, item.selectedColor);
  };

  const handleRemoveItem = (item: CartItem) => {
    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  const handleCouponApplied = (couponData: any) => {
    setAppliedCoupon(couponData);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center py-20">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-xl text-gray-500 mb-8">¡Agrega algunos productos para comenzar!</p>
          <Link
            to="/"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu Carrito de Compras</h1>
        <p className="text-gray-600">{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en tu carrito</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {cartItems.map((item, index) => (
              <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="p-6 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  {/* Imagen del producto */}
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Información del producto */}
                  <div className="ml-6 flex-grow">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Variantes seleccionadas */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex gap-4 mt-1">
                        {item.selectedSize && (
                          <span className="text-sm text-gray-600">
                            Talla: <span className="font-medium">{item.selectedSize}</span>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-sm text-gray-600">
                            Color: <span className="font-medium">{item.selectedColor}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Precio */}
                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      {/* TODO: Add originalPrice explicitly to CartItem type if needed */}
                      {(item as any).originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${(item as any).originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controles de cantidad y eliminación */}
                  <div className="ml-6 flex items-center gap-4">
                    {/* Selector de cantidad */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[4rem]">
                      <span className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Botón de eliminar */}
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      title="Eliminar producto"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 transition-colors font-medium"
            >
              Vaciar Carrito
            </button>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              ← Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} productos)</span>
                <span className="font-medium">${subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento ({appliedCoupon.coupon.code})</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className={`font-medium ${freeShipping ? 'text-green-600' : ''}`}>
                  {freeShipping ? 'Gratis' : `$${shipping}`}
                </span>
              </div>

              {freeShipping && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  🎉 ¡Envío gratis en compras mayores a $50!
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos</span>
                <span className="font-medium">${tax}</span>
              </div>
            </div>

            {/* Componente de cupones */}
            <div className="mb-6">
              <CouponInput
                subtotal={parseFloat(subtotal)}
                items={cartItems.map(item => ({
                  productId: item._id,
                  category: item.category || '', // Fallback for optional property
                  quantity: item.quantity,
                  price: item.price
                }))}
                onCouponApplied={handleCouponApplied}
                appliedCoupon={appliedCoupon}
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              {appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-500 line-through">
                    <span>Total original</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-green-600">
                    <span>Total con descuento</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    💰 Has ahorrado ${discount.toFixed(2)} con el cupón {appliedCoupon.coupon.code}
                  </div>
                </div>
              ) : (
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              )}
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold">
              Proceder al Pago
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Pago seguro con encriptación SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;