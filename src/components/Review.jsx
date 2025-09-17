import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from './Button';

// Componente para mostrar estrellas
const StarRating = ({ rating, size = 'md', interactive = false, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoveredRating || rating) >= star;
        return (
          <button
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-all duration-150 ${
              filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            <i className="fas fa-star" />
          </button>
        );
      })}
    </div>
  );
};

// Componente para escribir una nueva reseña
const ReviewForm = ({ onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Tu nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        verified: false
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Escribir una reseña
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Calificación *
          </label>
          <StarRating
            rating={formData.rating}
            size="lg"
            interactive
            onRate={handleRatingChange}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.rating}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título de la reseña *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.title
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="Ej: ¡Excelente experiencia!"
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Comentario *
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={4}
            className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
              errors.comment
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="Comparte tu experiencia..."
            disabled={loading}
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.comment}
            </p>
          )}
        </div>

        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.name
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Tu nombre"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.email
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="tu@email.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Componente para mostrar una reseña individual
const ReviewItem = ({ review, showActions = false, onEdit, onDelete }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return 'Fecha no válida';
    }
  };

  const truncateComment = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
            {review.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {review.name}
              </h4>
              {review.verified && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                  <i className="fas fa-check-circle mr-1" />
                  Verificado
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)}
                icon="fas fa-edit"
              />
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(review.id)}
                icon="fas fa-trash"
                className="text-red-600 hover:text-red-700"
              />
            )}
          </div>
        )}
      </div>

      {/* Rating and Title */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-2">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({review.rating}/5)
          </span>
        </div>
        {review.title && (
          <h5 className="font-medium text-gray-900 dark:text-white">
            {review.title}
          </h5>
        )}
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {showFullComment ? review.comment : truncateComment(review.comment)}
          </p>
          {review.comment.length > 200 && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="text-primary-600 dark:text-primary-400 text-sm mt-2 hover:underline"
            >
              {showFullComment ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
      )}

      {/* Helpful actions */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <button className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <i className="fas fa-thumbs-up mr-1" />
          Útil ({review.helpful || 0})
        </button>
        <button className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <i className="fas fa-reply mr-1" />
          Responder
        </button>
      </div>
    </div>
  );
};

// Componente principal de Reviews
const Review = ({
  reviews = [],
  allowNewReviews = true,
  showActions = false,
  onNewReview,
  onEditReview,
  onDeleteReview,
  className = ''
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewReview = async (reviewData) => {
    setLoading(true);
    try {
      if (onNewReview) {
        await onNewReview(reviewData);
      }
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Summary */}
      {reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reseñas ({reviews.length})
            </h3>
            {allowNewReviews && !showReviewForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowReviewForm(true)}
                icon="fas fa-plus"
              >
                Escribir Reseña
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <StarRating rating={Math.round(averageRating)} size="lg" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Basado en {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Review Form */}
      {showReviewForm && (
        <ReviewForm
          onSubmit={handleNewReview}
          onCancel={() => setShowReviewForm(false)}
          loading={loading}
        />
      )}

      {/* Empty State */}
      {reviews.length === 0 && !showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-8 text-center">
          <i className="fas fa-star text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay reseñas aún
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Sé el primero en compartir tu experiencia
          </p>
          {allowNewReviews && (
            <Button
              variant="primary"
              onClick={() => setShowReviewForm(true)}
              icon="fas fa-plus"
            >
              Escribir la primera reseña
            </Button>
          )}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              showActions={showActions}
              onEdit={onEditReview}
              onDelete={onDeleteReview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
export { StarRating, ReviewForm, ReviewItem };