import React, { useState } from 'react';
import Button from './Button';

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  compact = false,
  showImage = true 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (isUpdating || newQuantity < 0) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, item.customizations, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onRemove(item.id, item.customizations);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  const getCustomizationText = () => {
    if (!item.customizations || Object.keys(item.customizations).length === 0) {
      return null;
    }

    const customizations = [];
    Object.entries(item.customizations).forEach(([key, value]) => {
      if (value && value !== 'none') {
        customizations.push(`${key}: ${value}`);
      }
    });

    return customizations.length > 0 ? customizations.join(', ') : null;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 py-2">
        {showImage && (
          <div className="flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="h-12 w-12 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-food.jpg';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {item.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.quantity} × {formatPrice(item.price)}
          </p>
        </div>
        
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {formatPrice(item.price * item.quantity)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 space-y-4">
      <div className="flex space-x-4">
        {showImage && (
          <div className="flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-food.jpg';
              }}
            />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {item.name}
              </h3>
              {getCustomizationText() && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getCustomizationText()}
                </p>
              )}
            </div>
            
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
              title="Eliminar producto"
            >
              <i className="fas fa-trash text-sm" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad:</span>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 p-0 text-sm"
                >
                  <i className="fas fa-minus" />
                </Button>
                
                <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 p-0 text-sm"
                >
                  <i className="fas fa-plus" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatPrice(item.price)} c/u
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-primary-500" />
        </div>
      )}
    </div>
  );
};

export default CartItem;