import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import config from '@/utils/config';

interface CouponInputProps {
  subtotal: number;
  items: any[]; // Define a stricter type if possible, e.g., CartItem[]
  onCouponApplied: (couponData: any) => void;
  appliedCoupon: any | null;
}

const CouponInput: React.FC<CouponInputProps> = ({ subtotal, items, onCouponApplied, appliedCoupon }) => {
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      setError('Por favor ingresa un código de cupón');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes iniciar sesión para aplicar cupones');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.COUPONS}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          items,
          subtotal: subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al aplicar el cupón');
      }

      setSuccess(`¡Cupón aplicado! Descuento: $${data.data.discount.toFixed(2)}`);
      onCouponApplied(data.data);
      setCouponCode('');
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponApplied(null);
    setSuccess('');
    setError('');
    setCouponCode('');
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Inicia sesión para aplicar códigos de descuento
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Código de descuento
      </h3>

      {appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-800">
                {appliedCoupon.coupon.code}
              </p>
              <p className="text-xs text-green-600">
                {appliedCoupon.coupon.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-800">
                -${appliedCoupon.discount.toFixed(2)}
              </p>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs text-green-600 hover:text-green-800 underline"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Ingresa tu código"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !couponCode.trim()}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Aplicando...' : 'Aplicar'}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}
        </form>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>¿No tienes un código? <a href="#" className="underline hover:text-gray-700">Ver ofertas disponibles</a></p>
      </div>
    </div>
  );
};

export default CouponInput;