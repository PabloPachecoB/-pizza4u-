import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { validationUtils } from '../../utils/helpers';
import SEO from '../../components/SEO';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import CartItem from '../../components/CartItem';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartSummary, clearCart, formatPrice } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();

  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Datos del cliente
  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    addressDetails: '',
    city: 'La Paz',
    notes: ''
  });

  // Opciones de entrega
  const [deliveryOption, setDeliveryOption] = useState('delivery'); // 'delivery', 'pickup'
  const [deliveryTime, setDeliveryTime] = useState('asap'); // 'asap', 'scheduled'
  const [scheduledTime, setScheduledTime] = useState('');

  // Opciones de pago
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'card', 'qr', 'transfer'
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});
  const [processingPayment, setProcessingPayment] = useState(false);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (!cartSummary.hasItems) {
      navigate('/menu');
      addNotification({
        type: 'info',
        title: 'Carrito vacío',
        message: 'Agrega productos a tu carrito para continuar'
      });
    }
  }, [cartSummary.hasItems, navigate, addNotification]);

  // Autocompletar datos si el usuario está logueado
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [isAuthenticated, user]);

  const steps = [
    { number: 1, title: 'Información', icon: 'fas fa-user', completed: currentStep > 1 },
    { number: 2, title: 'Pago', icon: 'fas fa-credit-card', completed: currentStep > 2 },
    { number: 3, title: 'Confirmación', icon: 'fas fa-check', completed: orderPlaced }
  ];

  const paymentMethods = [
    { 
      id: 'cash', 
      name: 'Efectivo', 
      icon: 'fas fa-money-bill-wave', 
      description: 'Pago al recibir el pedido',
      available: true 
    },
    { 
      id: 'card', 
      name: 'Tarjeta', 
      icon: 'fas fa-credit-card', 
      description: 'Visa, Mastercard, American Express',
      available: true 
    },
    { 
      id: 'qr', 
      name: 'QR (Tigo Money)', 
      icon: 'fas fa-qrcode', 
      description: 'Pago con código QR',
      available: true 
    },
    { 
      id: 'transfer', 
      name: 'Transferencia', 
      icon: 'fas fa-university', 
      description: 'Transferencia bancaria',
      available: false // Deshabilitado por ahora
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('payment.')) {
      const fieldName = name.replace('payment.', '');
      setPaymentData(prev => ({
        ...prev,
        [fieldName]: type === 'checkbox' ? checked : value
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    // Validación de datos del cliente
    if (!customerData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!customerData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validationUtils.isValidEmail(customerData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validationUtils.isValidPhone(customerData.phone)) {
      newErrors.phone = 'Teléfono no válido';
    }

    // Validación para delivery
    if (deliveryOption === 'delivery') {
      if (!customerData.address.trim()) {
        newErrors.address = 'La dirección es requerida';
      }
    }

    // Validación para entrega programada
    if (deliveryTime === 'scheduled') {
      if (!scheduledTime) {
        newErrors.scheduledTime = 'Selecciona una hora';
      } else {
        const selectedDate = new Date(`${new Date().toDateString()} ${scheduledTime}`);
        const now = new Date();
        if (selectedDate < now) {
          newErrors.scheduledTime = 'La hora debe ser futura';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!paymentData.cardNumber.replace(/\s/g, '')) {
        newErrors['payment.cardNumber'] = 'Número de tarjeta requerido';
      } else if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors['payment.cardNumber'] = 'Número de tarjeta inválido';
      }

      if (!paymentData.cardName.trim()) {
        newErrors['payment.cardName'] = 'Nombre del titular requerido';
      }

      if (!paymentData.cardExpiry) {
        newErrors['payment.cardExpiry'] = 'Fecha de vencimiento requerida';
      }

      if (!paymentData.cardCVV) {
        newErrors['payment.cardCVV'] = 'CVV requerido';
      } else if (paymentData.cardCVV.length < 3) {
        newErrors['payment.cardCVV'] = 'CVV inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const calculateDeliveryTime = () => {
    if (deliveryTime === 'scheduled') {
      return scheduledTime;
    }

    const now = new Date();
    const deliveryMinutes = deliveryOption === 'delivery' ? 35 : 20;
    const estimatedTime = new Date(now.getTime() + deliveryMinutes * 60000);
    
    return estimatedTime.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const processOrder = async () => {
    try {
      setLoading(true);
      setProcessingPayment(true);

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Crear orden
      const orderData = {
        id: Math.floor(Math.random() * 1000000),
        items: items,
        customer: customerData,
        delivery: {
          type: deliveryOption,
          time: deliveryTime,
          scheduledTime: deliveryTime === 'scheduled' ? scheduledTime : null,
          estimatedTime: calculateDeliveryTime()
        },
        payment: {
          method: paymentMethod,
          status: 'pending'
        },
        summary: cartSummary,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Simular guardado de orden
      localStorage.setItem(`order-${orderData.id}`, JSON.stringify(orderData));
      
      setOrderId(orderData.id);
      setOrderPlaced(true);
      setCurrentStep(3);

      // Limpiar carrito
      await clearCart();

      addNotification({
        type: 'success',
        title: '¡Pedido confirmado!',
        message: `Tu pedido #${orderData.id} ha sido confirmado`,
        duration: 5000
      });

    } catch (error) {
      console.error('Error processing order:', error);
      addNotification({
        type: 'error',
        title: 'Error al procesar pedido',
        message: 'Intenta nuevamente o contacta soporte'
      });
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  if (!cartSummary.hasItems && !orderPlaced) {
    return null;
  }

  return (
    <>
      <SEO 
        title="Checkout - Pizza4U"
        description="Completa tu pedido y disfruta de nuestras deliciosas pizzas"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Estás a solo unos pasos de disfrutar tu comida
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="flex items-center space-x-8">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : step.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <i className="fas fa-check" />
                      ) : (
                        <i className={step.icon} />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number 
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        Paso {step.number}
                      </p>
                      <p className={`text-xs ${
                        currentStep >= step.number
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-4 ${
                        step.completed 
                          ? 'bg-green-500' 
                          : currentStep > step.number
                          ? 'bg-primary-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Delivery Options */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Tipo de Entrega
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setDeliveryOption('delivery')}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          deliveryOption === 'delivery'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <i className="fas fa-truck text-xl mb-2 text-primary-500" />
                        <h4 className="font-medium text-gray-900 dark:text-white">Delivery</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Entrega a domicilio (30-45 min)
                        </p>
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {cartSummary.delivery > 0 ? formatPrice(cartSummary.delivery) : 'Gratis'}
                        </p>
                      </button>

                      <button
                        onClick={() => setDeliveryOption('pickup')}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          deliveryOption === 'pickup'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <i className="fas fa-store text-xl mb-2 text-primary-500" />
                        <h4 className="font-medium text-gray-900 dark:text-white">Recoger</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Recoger en tienda (15-20 min)
                        </p>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          Sin costo
                        </p>
                      </button>
                    </div>
                  </Card>

                  {/* Customer Data */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Información de Contacto
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={customerData.name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Tu nombre completo"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="+591 7XXXXXXX"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="tu@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Delivery Address */}
                  {deliveryOption === 'delivery' && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dirección de Entrega
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Dirección *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={customerData.address}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Calle, número, zona"
                          />
                          {errors.address && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Detalles adicionales
                          </label>
                          <input
                            type="text"
                            name="addressDetails"
                            value={customerData.addressDetails}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Edificio, piso, referencia..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notas especiales
                          </label>
                          <textarea
                            name="notes"
                            value={customerData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            placeholder="Instrucciones especiales para la entrega..."
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Delivery Time */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Tiempo de Entrega
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setDeliveryTime('asap')}
                          className={`p-3 border rounded-lg text-left transition-all ${
                            deliveryTime === 'asap'
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white">Lo antes posible</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {deliveryOption === 'delivery' ? '30-45 min' : '15-20 min'}
                          </p>
                        </button>

                        <button
                          onClick={() => setDeliveryTime('scheduled')}
                          className={`p-3 border rounded-lg text-left transition-all ${
                            deliveryTime === 'scheduled'
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white">Programar</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Elige una hora específica
                          </p>
                        </button>
                      </div>

                      {deliveryTime === 'scheduled' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hora de entrega *
                          </label>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            min={new Date().toTimeString().slice(0, 5)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              errors.scheduledTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.scheduledTime && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.scheduledTime}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Método de Pago
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          disabled={!method.available}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 border rounded-lg text-left transition-all ${
                            !method.available
                              ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                              : paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <i className={`${method.icon} text-xl mb-2 ${method.available ? 'text-primary-500' : 'text-gray-400'}`} />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {method.name}
                            {!method.available && ' (No disponible)'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {method.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Información de la Tarjeta
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Número de tarjeta *
                          </label>
                          <input
                            type="text"
                            name="payment.cardNumber"
                            value={paymentData.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              handleInputChange({
                                target: { 
                                  name: 'payment.cardNumber', 
                                  value: formatted.slice(0, 19) 
                                }
                              });
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              errors['payment.cardNumber'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors['payment.cardNumber'] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors['payment.cardNumber']}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre del titular *
                          </label>
                          <input
                            type="text"
                            name="payment.cardName"
                            value={paymentData.cardName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              errors['payment.cardName'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Nombre como aparece en la tarjeta"
                          />
                          {errors['payment.cardName'] && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              {errors['payment.cardName']}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Vencimiento *
                            </label>
                            <input
                              type="text"
                              name="payment.cardExpiry"
                              value={paymentData.cardExpiry}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                handleInputChange({
                                  target: { 
                                    name: 'payment.cardExpiry', 
                                    value: formatted.slice(0, 5) 
                                  }
                                });
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                errors['payment.cardExpiry'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                              placeholder="MM/AA"
                            />
                            {errors['payment.cardExpiry'] && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors['payment.cardExpiry']}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="payment.cardCVV"
                              value={paymentData.cardCVV}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                handleInputChange({
                                  target: { 
                                    name: 'payment.cardCVV', 
                                    value 
                                  }
                                });
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                errors['payment.cardCVV'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                              }`}
                              placeholder="123"
                            />
                            {errors['payment.cardCVV'] && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors['payment.cardCVV']}
                              </p>
                            )}
                          </div>
                        </div>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="payment.saveCard"
                            checked={paymentData.saveCard}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Guardar tarjeta para futuros pedidos
                          </span>
                        </label>
                      </div>
                    </Card>
                  )}

                  {/* QR Payment */}
                  {paymentMethod === 'qr' && (
                    <Card className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Pago con Código QR
                      </h3>
                      <div className="bg-white p-6 rounded-lg inline-block mb-4">
                        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <i className="fas fa-qrcode text-6xl text-gray-400" />
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Escanea el código QR con tu app de Tigo Money para completar el pago
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-2">
                        Total a pagar: {formatPrice(cartSummary.total)}
                      </p>
                    </Card>
                  )}

                  {/* Cash Payment Info */}
                  {paymentMethod === 'cash' && (
                    <Card className="p-6">
                      <div className="text-center">
                        <i className="fas fa-money-bill-wave text-4xl text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Pago en Efectivo
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Pagarás en efectivo al recibir tu pedido
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            Total a pagar: {formatPrice(cartSummary.total)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Ten el monto exacto o cambio disponible
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 3: Order Confirmation */}
              {currentStep === 3 && (
                <div className="text-center">
                  {processingPayment ? (
                    <Card className="p-12">
                      <LoadingSpinner size="xl" text="Procesando tu pedido..." />
                      <p className="text-gray-600 dark:text-gray-400 mt-4">
                        Por favor no cierres esta ventana
                      </p>
                    </Card>
                  ) : orderPlaced ? (
                    <Card className="p-12">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                          <i className="fas fa-check text-3xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          ¡Pedido Confirmado!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Tu pedido #{orderId} ha sido recibido y está siendo preparado
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span>Tiempo estimado:</span>
                              <span className="font-medium">{calculateDeliveryTime()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tipo de entrega:</span>
                              <span className="font-medium">
                                {deliveryOption === 'delivery' ? 'Delivery' : 'Recoger en tienda'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Método de pago:</span>
                              <span className="font-medium">
                                {paymentMethods.find(m => m.id === paymentMethod)?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/orders')}
                            icon="fas fa-receipt"
                          >
                            Ver Mis Pedidos
                          </Button>
                          <br />
                          <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            icon="fas fa-home"
                          >
                            Volver al Inicio
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : null}
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && !processingPayment && (
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={currentStep === 1 ? () => navigate('/cart') : handlePrevStep}
                    icon="fas fa-arrow-left"
                  >
                    {currentStep === 1 ? 'Volver al Carrito' : 'Anterior'}
                  </Button>
                  
                  <Button
                    variant="primary"
                    loading={loading}
                    onClick={currentStep === 2 ? processOrder : handleNextStep}
                    icon={currentStep === 2 ? "fas fa-credit-card" : "fas fa-arrow-right"}
                    iconPosition="right"
                  >
                    {loading ? 'Procesando...' : 
                     currentStep === 2 ? 'Confirmar Pedido' : 'Continuar'}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen del Pedido
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item, index) => (
                    <CartItem
                      key={`${item.id}-${JSON.stringify(item.customizations)}-${index}`}
                      item={item}
                      onUpdateQuantity={() => {}} // Disabled in checkout
                      onRemove={() => {}} // Disabled in checkout  
                      compact={true}
                      showImage={false}
                    />
                  ))}
                </div>

                {/* Summary totals */}
                <div className="border-t dark:border-gray-700 pt-4 space-y-3">
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
                  
                  <div className="border-t dark:border-gray-600 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        {formatPrice(cartSummary.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <i className="fas fa-clock mr-2" />
                    Tiempo estimado: {deliveryOption === 'delivery' ? '30-45 min' : '15-20 min'}
                  </div>
                  {deliveryOption === 'delivery' && cartSummary.delivery === 0 && (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <i className="fas fa-shipping-fast mr-2" />
                      ¡Envío gratuito incluido!
                    </div>
                  )}
                </div>
              </Card>

              {/* Help */}
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

export default Checkout;