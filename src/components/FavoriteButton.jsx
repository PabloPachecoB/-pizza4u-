import React, { useState } from 'react';

const FavoriteButton = ({
  itemId,
  itemType = 'product', // 'product', 'video', 'image', 'podcast', etc.
  isFavorite = false,
  onToggle,
  size = 'md',
  variant = 'icon', // 'icon', 'button', 'text'
  showLabel = false,
  className = '',
  disabled = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const sizes = {
    sm: {
      icon: 'text-sm',
      button: 'p-1.5',
      text: 'text-sm px-2 py-1'
    },
    md: {
      icon: 'text-base',
      button: 'p-2',
      text: 'text-base px-3 py-2'
    },
    lg: {
      icon: 'text-lg',
      button: 'p-3',
      text: 'text-lg px-4 py-3'
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);

    try {
      if (onToggle) {
        await onToggle({
          itemId,
          itemType,
          isFavorite: newFavoriteState
        });
      }
    } catch (error) {
      // Revertir estado si falla
      setLocalFavorite(!newFavoriteState);
      console.error('Error toggling favorite:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 focus:outline-none';
    
    switch (variant) {
      case 'button':
        return `${baseClasses} ${sizes[size].button} rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
          localFavorite 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`;
      
      case 'text':
        return `${baseClasses} ${sizes[size].text} rounded-lg font-medium ${
          localFavorite
            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
        }`;
      
      default: // icon
        return `${baseClasses} ${sizes[size].icon} ${
          localFavorite 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }`;
    }
  };

  const getIcon = () => {
    if (localFavorite) {
      return 'fas fa-heart';
    }
    return 'far fa-heart';
  };

  const getLabel = () => {
    if (localFavorite) {
      return 'Quitar de favoritos';
    }
    return 'Agregar a favoritos';
  };

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`flex items-center space-x-2 ${getVariantClasses()} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={getLabel()}
      >
        <i 
          className={`${getIcon()} ${
            isAnimating ? 'animate-bounce' : ''
          }`} 
        />
        {showLabel && <span>{getLabel()}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${getVariantClasses()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={getLabel()}
    >
      <i 
        className={`${getIcon()} ${
          isAnimating ? 'animate-bounce' : ''
        }`} 
      />
      {showLabel && variant === 'button' && (
        <span className="ml-2 text-sm">{localFavorite ? 'Favorito' : 'Favorito'}</span>
      )}
    </button>
  );
};

export default FavoriteButton;