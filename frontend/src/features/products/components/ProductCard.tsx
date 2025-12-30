import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/context/CartContext';
import WishlistButton from '@/features/wishlist/components/WishlistButton';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Product } from '@/features/products/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState(product.imageUrl);

  React.useEffect(() => {
    if (isHovered && product.images && product.images.length > 1) {
      setActiveImage(product.images[1] || product.images[0]);
    } else {
      setActiveImage(product.images && product.images.length > 0 ? product.images[0] : product.imageUrl);
    }
  }, [isHovered, product.images, product.imageUrl]);

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
        <OptimizedImage
          src={activeImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Badge de Nuevo/Oferta (Ejemplo estático, dinámico con datos reales) */}
        {product.price < 30 && (
          <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider z-10">
            Oferta
          </div>
        )}

        {/* Overlay gradiente en hover */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      {/* Acciones flotantes */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-20">
        <div className="bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200">
          <WishlistButton productId={product._id} size="small" showText={false} className="!p-2" />
        </div>
      </div>

      {/* Botón Añadir al Carrito (Deslizar desde abajo) */}
      <div className="absolute bottom-20 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full bg-white text-black font-semibold py-3 rounded shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Añadir al Carrito
        </button>
      </div>

      {/* Información del producto */}
      <div className="p-4 bg-white relative z-30">
        <div className="mb-1 text-xs text-gray-500 uppercase tracking-wide truncate">
          {product.category || 'Moda'}
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-base font-medium text-gray-900 mb-1 truncate group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-gray-900">${product.price}</p>
          {/* Rating estrellas simplificado */}
          <div className="flex text-yellow-400 text-xs">
            {'★'.repeat(Math.round(product.rating || 5))}
            <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating || 5))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;