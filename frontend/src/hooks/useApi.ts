import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '../utils/config';

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface RequestOptions {
  useCache?: boolean;
  cacheKey?: string;
  skipLoading?: boolean;
  skipError?: boolean;
}

// Caché simple en memoria
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar clave de caché
  const getCacheKey = (method: string, url: string, params: any) => {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  };

  // Función para verificar si el caché es válido
  const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  // Función para hacer peticiones con caché
  const request = useCallback(async (method: string, url: string, data: any = null, options: RequestOptions = {}) => {
    const {
      useCache = true,
      cacheKey,
      skipLoading = false,
      skipError = false
    } = options;

    const endpoint = config.ENDPOINTS[url as keyof typeof config.ENDPOINTS] || url;
    const fullUrl = `${config.API_BASE_URL}${endpoint}`;
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

      const requestConfig: any = {
        method,
        url: fullUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Agregar token de autenticación si existe
      const token = localStorage.getItem('token');
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }

      // Agregar data para POST, PUT, PATCH
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestConfig.data = data;
      }

      // Agregar query params para GET
      if (data && method === 'GET') {
        requestConfig.params = data;
      }

      const response = await axios(requestConfig);

      // Guardar en caché para GET requests
      if (method === 'GET' && useCache) {
        cache.set(requestCacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error en la petición';
      if (!skipError) setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      if (!skipLoading) setLoading(false);
    }
  }, []);

  // Métodos específicos para cada tipo de petición
  const get = useCallback((url: string, params?: any, options?: RequestOptions) => request('GET', url, params, options), [request]);
  const post = useCallback((url: string, data?: any, options?: RequestOptions) => request('POST', url, data, options), [request]);
  const put = useCallback((url: string, data?: any, options?: RequestOptions) => request('PUT', url, data, options), [request]);
  const patch = useCallback((url: string, data?: any, options?: RequestOptions) => request('PATCH', url, data, options), [request]);
  const del = useCallback((url: string, options?: RequestOptions) => request('DELETE', url, null, options), [request]);

  // Función para limpiar caché
  const clearCache = useCallback((key: string | null = null) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }, []);

  // Función para prefetch (precargar datos)
  const prefetch = useCallback(async (url: string, params?: any) => {
    try {
      await request('GET', url, params, { skipLoading: true, skipError: true });
    } catch (error: any) {
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