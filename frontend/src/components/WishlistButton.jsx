import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const WishlistButton = ({ productId, size = 'default', showText = true }) => {
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const [isInList, setIsInList] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsInList(isInWishlist(productId));
    }
  }, [isAuthenticated, productId, isInWishlist]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Prevenir navegación si está en un Link
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos a tu lista de deseos');
      return;
    }

    try {
      setLoading(true);
      const result = await toggleWishlist(productId);

      if (result.success) {
        setIsInList(result.isInWishlist);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error al actualizar la lista de deseos');
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = {
    small: 'p-2 rounded-full hover:bg-gray-100 transition-colors',
    default: 'p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors',
    large: 'p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200'
  };

  const iconClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${buttonClasses[size]} ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      } group relative`}
      title={isInList ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-600">
          <div className={`${iconClasses[size]} rounded-full`}></div>
        </div>
      ) : (
        <svg
          className={`${iconClasses[size]} ${
            isInList
              ? 'text-red-500 fill-current'
              : 'text-gray-400 group-hover:text-red-400'
          } transition-colors`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}

      {showText && (
        <span className={`ml-2 text-sm ${
          isInList ? 'text-red-500' : 'text-gray-600 group-hover:text-red-400'
        } transition-colors`}>
          {isInList ? 'En lista de deseos' : 'Agregar a deseos'}
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {isInList ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};

export default WishlistButton;