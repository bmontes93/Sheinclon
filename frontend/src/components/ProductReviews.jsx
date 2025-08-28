import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import config from '../utils/config';

const ProductReviews = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkCanReview();
    }
  }, [productId, isAuthenticated]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.PRODUCTS}/${productId}/reviews`);
      setReviews(response.data.data.reviews);
      setRating(response.data.data.rating);
      setNumReviews(response.data.data.numReviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error al cargar las reseñas');
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}${config.ENDPOINTS.PRODUCTS}/${productId}/reviews/can-review`);
      setCanReview(response.data.data.canReview);
    } catch (error) {
      console.error('Error checking review permission:', error);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axios.post(`${config.API_BASE_URL}${config.ENDPOINTS.PRODUCTS}/${productId}/reviews`, reviewData);
      setShowReviewForm(false);
      fetchReviews();
      checkCanReview();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw new Error(error.response?.data?.error || 'Error al enviar la reseña');
    }
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
            disabled={!interactive}
          >
            <svg
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const ReviewForm = ({ onSubmit, onCancel }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!comment.trim()) return;

      try {
        setSubmitting(true);
        await onSubmit({ rating, comment: comment.trim() });
      } catch (error) {
        alert(error.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Escribe una reseña</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <StarRating rating={rating} interactive onRatingChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu opinión sobre este producto..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 resize-none"
            rows={4}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar reseña'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  const ReviewItem = ({ review }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return (
      <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {review.user?.avatar ? (
              <img
                src={review.user.avatar}
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {review.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">{review.name}</h4>
              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>

        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

        {/* Acciones de reseña (solo para el autor) */}
        {user && review.user && user._id === review.user._id && (
          <div className="mt-3 flex gap-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Editar
            </button>
            <button className="text-sm text-red-600 hover:text-red-800 transition-colors">
              Eliminar
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Reseñas y Calificaciones
          </h2>

          {isAuthenticated && canReview && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
            </button>
          )}
        </div>

        {/* Rating promedio */}
        {numReviews > 0 && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{rating.toFixed(1)}</div>
              <StarRating rating={Math.round(rating)} />
              <div className="text-sm text-gray-600 mt-1">
                {numReviews} reseña{numReviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Distribución de ratings (simplificada) */}
            <div className="flex-1 ml-6">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = numReviews > 0 ? (count / numReviews) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-3">{star}</span>
                    <StarRating rating={1} />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Formulario de reseña */}
        {showReviewForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        {/* Lista de reseñas */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay reseñas aún
              </h3>
              <p className="text-gray-600">
                {isAuthenticated
                  ? 'Sé el primero en compartir tu opinión sobre este producto.'
                  : 'Inicia sesión para escribir la primera reseña.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;