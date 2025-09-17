import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import SEO from '../../components/SEO';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getCartSummary
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  const cartSummary = getCartSummary();

  // Códigos promocionales mock
  const promoCodes = {
    'FIRST10': { discount: 10, type: 'percentage', description: '10% de descuento en tu primer pedido' },
    'PIZZA20': { discount: 20, type: 'percentage', description: '20% de descuento en pizzas' },
    'FREE_DELIVERY': { discount: 5, type: 'fixed', description: 'Delivery gratuito' }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    
    if (!promoCode.trim()) {
      setPromoError('Ingresa un código promocional');
      return;
    }

    const promo = promoCodes[promoCode.toUpperCase()];
    if (!promo) {
      setPromoError('Código promocional inválido');
      return;
    }

    setAppliedPromo({ code: promoCode.toUpperCase(), ...promo });
    setPromoCode('');
    setShowPromoInput(false);
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
      return (cartSummary.subtotal * appliedPromo.discount) / 100;
    } else {
      return appliedPromo.discount;
    }
  };

  const getFinalTotal = () => {
    const discount = calculateDiscount();
    return Math.max(0, cartSummary.total - discount);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  if (items.length === 0) {
    return (
      <>
        <SEO 
          title="Carrito - Pizza4U"
          description="Tu carrito de compras en Pizza4U"
        />
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Tu Carrito
              </h1>
              
              <Card className="p-12 text-center max-w-md mx-auto">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 w-20 h-20 mx-auto mb-6">
                  <i className="fas fa-shopping-cart text-3xl text-gray-400" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tu carrito está vacío
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  ¡Agrega algunos productos deliciosos para comenzar!
                </p>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleContinueShopping}
                  icon="fas fa-utensils"
                >
                  Ver Menú
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Carrito - Pizza4U"
        description="Revisa tu carrito y procede al checkout en Pizza4U"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tu Carrito
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Revisa tu pedido antes de proceder al checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Productos ({items.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    icon="fas fa-trash"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Vaciar carrito
                  </Button>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${JSON.stringify(item.customizations)}-${index}`}>
                      <CartItem
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                        compact={false}
                        showImage={true}
                      />
                      {index < items.length - 1 && (
                        <hr className="border-gray-200 dark:border-gray-700 mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Continue Shopping */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  icon="fas fa-arrow-left"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Código Promocional
                </h3>

                {appliedPromo ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-400">
                          {appliedPromo.code}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {appliedPromo.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromo}
                        icon="fas fa-times"
                        className="text-green-600 hover:text-green-700"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {!showPromoInput ? (
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => setShowPromoInput(true)}
                        icon="fas fa-tag"
                      >
                        Aplicar Código Promocional
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Ingresa tu código"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                          />
                          <Button
                            variant="primary"
                            onClick={handleApplyPromo}
                            icon="fas fa-check"
                          />
                        </div>
                        
                        {promoError && (
                          <p className="text-red-600 dark:text-red-400 text-sm">
                            {promoError}
                          </p>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowPromoInput(false);
                            setPromoCode('');
                            setPromoError('');
                          }}
                          className="w-full"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card>

              {/* Order Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen del Pedido
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal ({cartSummary.itemCount} items)
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(cartSummary.subtotal)}
                    </span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">
                        Descuento ({appliedPromo.code})
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        -{formatCurrency(calculateDiscount())}
                      </span>
                    </div>
                  )}

                  {cartSummary.delivery > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(cartSummary.delivery)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Impuestos</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(cartSummary.tax)}
                    </span>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      {formatCurrency(getFinalTotal())}
                    </span>
                  </div>

                  {cartSummary.delivery === 0 && cartSummary.subtotal >= 50 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mt-4">
                      <p className="text-green-800 dark:text-green-400 text-sm flex items-center">
                        <i className="fas fa-shipping-fast mr-2" />
                        ¡Felicidades! Tienes envío gratuito
                      </p>
                    </div>
                  )}

                  {cartSummary.subtotal < 50 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mt-4">
                      <p className="text-blue-800 dark:text-blue-400 text-sm">
                        Agrega {formatCurrency(50 - cartSummary.subtotal)} más para envío gratuito
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  icon="fas fa-credit-card"
                  className="mt-6"
                >
                  Proceder al Checkout
                </Button>
              </Card>

              {/* Security Info */}
              <Card className="p-6">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <i className="fas fa-lock text-green-500 text-xl" />
                    <i className="fas fa-shield-alt text-green-500 text-xl" />
                    <i className="fas fa-credit-card text-green-500 text-xl" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Compra Segura
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tu información está protegida con cifrado SSL de 256 bits
                  </p>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  ¿Necesitas ayuda?
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <i className="fas fa-phone mr-2 w-4" />
                    <span>+591 2 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <i className="fas fa-envelope mr-2 w-4" />
                    <span>info@pizza4u.com</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <i className="fas fa-clock mr-2 w-4" />
                    <span>Lun-Dom: 11:00-23:00</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;