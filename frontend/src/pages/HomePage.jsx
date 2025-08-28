import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import ProductFilters from '../components/ProductFilters';
import config from '../utils/config';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    fetchProducts(currentPage, currentFilters);
  }, [currentPage, currentFilters]);

  const fetchProducts = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Construir query string con filtros
      const queryParams = new URLSearchParams({
        pageNumber: page,
        pageSize: config.ITEMS_PER_PAGE,
        ...filters
      });

      // Agregar filtros de búsqueda
      if (filters.search) queryParams.append('keyword', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      // Agregar ordenamiento
      if (filters.sortBy) {
        queryParams.append('sortBy', filters.sortBy);
        queryParams.append('sortOrder', filters.sortOrder || 'desc');
      }

      const { data } = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.PRODUCTS}?${queryParams}`);
      setProducts(data.products || data);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Error al cargar los productos. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Resetear a primera página cuando cambian los filtros
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(currentPage)}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Nuestros Productos</h1>
        <p className="text-gray-600">Descubre las últimas tendencias en moda</p>
      </div>

      {/* Filtros */}
      <ProductFilters onFiltersChange={handleFiltersChange} currentFilters={currentFilters} />

      {/* Información de resultados */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-gray-600">
          {loading ? (
            <span>Cargando productos...</span>
          ) : (
            <span>
              Mostrando {products.length} de {totalProducts} productos
              {currentFilters.search && ` para "${currentFilters.search}"`}
              {currentFilters.category && ` en ${currentFilters.category}`}
            </span>
          )}
        </div>

        {totalProducts > 0 && (
          <div className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </div>
        )}
      </div>

      {loading && products.length === 0 && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(currentPage, currentFilters)}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {products.length > 0 && <ProductList products={products} />}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>

            {/* Mostrar páginas con lógica inteligente */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={loading}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:bg-gray-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {!loading && !error && products.length === 0 && totalProducts === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h2>
          <p className="text-gray-600 mb-4">
            {Object.keys(currentFilters).some(key => currentFilters[key]) ?
              'Intenta ajustar tus filtros de búsqueda.' :
              'No hay productos disponibles en este momento.'
            }
          </p>
          {Object.keys(currentFilters).some(key => currentFilters[key]) && (
            <button
              onClick={() => handleFiltersChange({})}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
