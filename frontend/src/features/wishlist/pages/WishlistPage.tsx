import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/context/CartContext';
import WishlistButton from '@/features/wishlist/components/WishlistButton';
import { Product } from '@/features/products/types';

const WishlistPage: React.FC = () => {
  const { isAuthenticated, getWishlist } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWishlist();

      if (result.success) {
        setWishlistItems(result.data);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Error al cargar la lista de deseos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center py-20">
          <div className="text-gray-400 mb-6">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lista de Deseos</h1>
          <p className="text-xl text-gray-600 mb-8">
            Inicia sesión para ver tus productos favoritos
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWishlist}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Lista de Deseos</h1>
        <p className="text-gray-600">
          {wishlistItems.length > 0
            ? `${wishlistItems.length} producto${wishlistItems.length !== 1 ? 's' : ''} en tu lista`
            : 'Aún no has agregado productos a tu lista de deseos'
          }
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-300 mb-6">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tu lista de deseos está vacía</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Agrega productos a tu lista de deseos haciendo clic en el corazón en cualquier producto.
            Te notificaremos cuando haya ofertas especiales.
          </p>
          <Link
            to="/"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : product.imageUrl} // Fallback for image
                  alt={product.name}
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {(product.rating || 0) > 0 && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600 ml-1">
                          {(product.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
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
                    handleAddToCart(product);
                  }}
                  className="bg-black text-white px-6 py-2 rounded-full transform hover:scale-105 transition-transform duration-300"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      {wishlistItems.length > 0 && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Sabías que?</h3>
          <ul className="text-gray-600 space-y-1">
            <li>• Te notificaremos cuando tus productos favoritos estén en oferta</li>
            <li>• Los productos en tu lista de deseos no se agotan mientras esperas</li>
            <li>• Puedes compartir tu lista con amigos</li>
            <li>• Recibe recomendaciones basadas en tus intereses</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;