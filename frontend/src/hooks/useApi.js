import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../utils/config';

// Caché simple en memoria
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar clave de caché
  const getCacheKey = (method, url, params) => {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  };

  // Función para verificar si el caché es válido
  const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  // Función para hacer peticiones con caché
  const request = useCallback(async (method, url, data = null, options = {}) => {
    const {
      useCache = true,
      cacheKey,
      skipLoading = false,
      skipError = false
    } = options;

    const fullUrl = `${config.API_BASE_URL}${config.ENDPOINTS[url] || url}`;
    const requestCacheKey = cacheKey || getCacheKey(method, fullUrl, data);

    // Verificar caché para GET requests
    if (method === 'GET' && useCache) {
      const cached = cache.get(requestCacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }

    try {
      if (!skipLoading) setLoading(true);
      if (!skipError) setError(null);

      const config = {
        method,
        url: fullUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Agregar token de autenticación si existe
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Agregar data para POST, PUT, PATCH
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.data = data;
      }

      // Agregar query params para GET
      if (data && method === 'GET') {
        config.params = data;
      }

      const response = await axios(config);

      // Guardar en caché para GET requests
      if (method === 'GET' && useCache) {
        cache.set(requestCacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error en la petición';
      if (!skipError) setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  }, []);

  // Métodos específicos para cada tipo de petición
  const get = useCallback((url, params, options) => request('GET', url, params, options), [request]);
  const post = useCallback((url, data, options) => request('POST', url, data, options), [request]);
  const put = useCallback((url, data, options) => request('PUT', url, data, options), [request]);
  const patch = useCallback((url, data, options) => request('PATCH', url, data, options), [request]);
  const del = useCallback((url, options) => request('DELETE', url, null, options), [request]);

  // Función para limpiar caché
  const clearCache = useCallback((key = null) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }, []);

  // Función para prefetch (precargar datos)
  const prefetch = useCallback(async (url, params) => {
    try {
      await request('GET', url, params, { skipLoading: true, skipError: true });
    } catch (error) {
      // Silenciar errores de prefetch
      console.log('Prefetch failed:', error.message);
    }
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    del,
    clearCache,
    prefetch,
    request,
  };
};

export default useApi;