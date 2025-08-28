import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import WishlistButton from './WishlistButton';
import OptimizedImage from './OptimizedImage';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <OptimizedImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover"
        />
        <div className="p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
        </div>
      </Link>

      {/* Botón de wishlist */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton productId={product._id} size="small" showText={false} />
      </div>

      {/* Overlay con botón de carrito */}
      <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="bg-black text-white px-6 py-2 rounded-full transform hover:scale-105 transition-transform duration-300"
        >
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;