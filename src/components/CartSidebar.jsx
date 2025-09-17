import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import Button from './Button';

const CartSidebar = () => {
  const navigate = useNavigate();
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getCartSummary
  } = useCart();

  const cartSummary = getCartSummary();

  // Bloquear scroll cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && isOpen) {
        closeCart();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeCart]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <i className="fas fa-shopping-cart mr-2" />
            Carrito ({cartSummary.itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
          >
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            // Empty cart
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4">
                <i className="fas fa-shopping-cart text-4xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Agrega algunos productos deliciosos a tu carrito
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  closeCart();
                  navigate('/menu');
                }}
                icon="fas fa-utensils"
              >
                Ver Menú
              </Button>
            </div>
          ) : (
            // Cart items
            <div className="p-4 space-y-4">
              {items.map((item, index) => (
                <CartItem
                  key={`${item.id}-${JSON.stringify(item.customizations)}-${index}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  compact={true}
                  showImage={true}
                />
              ))}

              {/* Clear cart button */}
              {items.length > 0 && (
                <div className="pt-4 border-t dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    icon="fas fa-trash"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Vaciar carrito
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with summary and actions */}
        {items.length > 0 && (
          <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(cartSummary.subtotal)}
                </span>
              </div>
              
              {cartSummary.delivery > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPrice(cartSummary.delivery)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(cartSummary.tax)}
                </span>
              </div>
              
              <div className="border-t dark:border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {formatPrice(cartSummary.total)}
                  </span>
                </div>
              </div>

              {cartSummary.delivery === 0 && cartSummary.subtotal < 50 && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  🎉 ¡Envío gratis! (Pedidos mayores a Bs. 50)
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleCheckout}
                icon="fas fa-credit-card"
              >
                Proceder al Pago
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={handleViewCart}
                icon="fas fa-eye"
              >
                Ver Carrito Completo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;