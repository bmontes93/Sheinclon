import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import axios from 'axios';
import config from '@/utils/config';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  wishlist?: string[];
  [key: string]: any;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  toggleWishlist: (productId: string) => Promise<{ success: boolean; isInWishlist?: boolean; error?: string }>;
  getWishlist: () => Promise<{ success: boolean; data?: any; error?: string }>;
  isInWishlist: (productId: string) => boolean;
  isAdmin: () => boolean;
}

// Crear contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Configurar axios con token por defecto
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setAuthToken(token);
        try {
          const response = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/profile`);
          setUser(response.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/login`, {
        email,
        password,
      });

      const { user: userData, token } = response.data.data as AuthResponse;

      setAuthToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrarse
  const register = async (userData: any) => {
    try {
      setLoading(true);

      const response = await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/register`, userData);

      const { user: newUser, token } = response.data.data as AuthResponse;

      setAuthToken(token);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al registrarse';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData: any) => {
    try {
      setLoading(true);

      const response = await axios.put(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/profile`, profileData);

      setUser(response.data.data.user);

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar perfil';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);

      await axios.put(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/change-password`, {
        currentPassword,
        newPassword,
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al cambiar contraseña';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para gestionar wishlist
  const toggleWishlist = async (productId: string) => {
    try {
      const response = await axios.put(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/wishlist/${productId}`);

      // Actualizar usuario con nueva wishlist
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          wishlist: response.data.data.wishlist
        };
      });

      return {
        success: true,
        isInWishlist: response.data.data.isInWishlist
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar wishlist';
      return { success: false, error: errorMessage };
    }
  };

  // Función para obtener wishlist
  const getWishlist = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH}/wishlist`);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al obtener wishlist';
      return { success: false, error: errorMessage };
    }
  };

  // Verificar si un producto está en wishlist
  const isInWishlist = (productId: string) => {
    return user?.wishlist?.includes(productId) || false;
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    toggleWishlist,
    getWishlist,
    isInWishlist,
    isAdmin,
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};