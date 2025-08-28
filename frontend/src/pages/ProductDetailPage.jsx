import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import ProductReviews from '../components/ProductReviews';
import ProductVariants from '../components/ProductVariants';
import ProductImageGallery from '../components/ProductImageGallery';
import config from '../utils/config';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.PRODUCTS}/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Error al cargar el producto. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        ...product,
        selectedSize,
        selectedColor,
        quantity: quantity
      };
      addToCart(productToAdd);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
          <Link
            to="/"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">Inicio</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/" className="text-gray-600 hover:text-gray-900">{product.category}</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
        {/* Galería de imágenes del producto */}
        <div className="relative">
          <ProductImageGallery
            images={product.images}
            mainImage={product.imageUrl}
            alt={product.name}
          />
          {product.isOnSale && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
              -{product.discountPercentage}%
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>

          {/* Precio */}
          <div className="mb-4">
            {product.isOnSale ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-red-600">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                  -{product.discountPercentage}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            )}
          </div>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.numReviews} reseñas)
              </span>
            </div>
          )}

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Información adicional */}
          <div className="space-y-2 mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">Categoría:</span> {product.category}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Marca:</span> {product.brand}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Stock:</span>
              <span className={`ml-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
              </span>
            </p>
          </div>

          {/* Variantes del producto */}
          <ProductVariants
            product={product}
            onVariantChange={(variants) => {
              setSelectedSize(variants.size);
              setSelectedColor(variants.color);
            }}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />

          {/* Selector de cantidad */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Botón de añadir al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : addedToCart
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {product.stock === 0
              ? 'Agotado'
              : addedToCart
              ? '✓ Añadido al carrito'
              : 'Añadir al Carrito'
            }
          </button>
        </div>
      </div>

      {/* Sección de reseñas */}
      <ProductReviews productId={id} />
    </div>
  );
};

export default ProductDetailPage;