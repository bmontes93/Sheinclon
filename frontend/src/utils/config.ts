
interface Config {
  API_BASE_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  STRIPE_PUBLISHABLE_KEY: string;
  GOOGLE_ANALYTICS_ID: string;
  NODE_ENV: string;
  ITEMS_PER_PAGE: number;
  MAX_FILE_SIZE: number;
  SUPPORTED_IMAGE_TYPES: string[];
  ENDPOINTS: {
    PRODUCTS: string;
    AUTH: string;
    USERS: string;
    ORDERS: string;
    REVIEWS: string;
    WISHLIST: string;
    COUPONS: string;
  };
}

const config: Config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'SHEIN Clone',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',

  // Configuraciones adicionales
  ITEMS_PER_PAGE: 12,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Endpoints de API
  ENDPOINTS: {
    PRODUCTS: '/api/products',
    AUTH: '/api/auth',
    USERS: '/api/users',
    ORDERS: '/api/orders',
    REVIEWS: '/api/reviews',
    WISHLIST: '/api/wishlist',
    COUPONS: '/api/coupons'
  }
};

export default config;
