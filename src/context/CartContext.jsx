import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { storageUtils, numberUtils } from '../utils/helpers';
import api from '../utils/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [discount, setDiscount] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();

  // Configuración del carrito
  const cartConfig = {
    taxRate: 0.10, // 10% de impuesto
    deliveryThreshold: 50, // Bs. 50 para envío gratis
    deliveryFee: 5, // Bs. 5 costo de envío
    maxQuantityPerItem: 10,
    autoCloseDelay: 3000 // ms para cerrar notificaciones
  };

  // Cargar carrito al inicializar
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // Guardar carrito cuando cambie
  useEffect(() => {
    if (items.length > 0 || storageUtils.get('cart')) {
      saveCart();
    }
  }, [items]);

  /**
   * Generar clave única para item con customizaciones
   */
  const generateItemKey = (productId, customizations = {}) => {
    const customKey = JSON.stringify(customizations);
    return `${productId}-${btoa(customKey).replace(/[^a-zA-Z0-9]/g, '')}`;
  };

  /**
   * Cargar carrito desde storage o API
   */
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Cargar desde API para usuarios autenticados
        const response = await api.cart.get();
        if (response && response.items) {
          setItems(response.items);
          if (response.discount) {
            setDiscount(response.discount);
          }
        }
      } else {
        // Cargar desde localStorage para invitados
        const localCart = storageUtils.get('cart', []);
        const localDiscount = storageUtils.get('cartDiscount', null);
        setItems(localCart);
        setDiscount(localDiscount);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setError(error.message);
      
      // Fallback a localStorage
      const localCart = storageUtils.get('cart', []);
      setItems(localCart);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Guardar carrito en storage o API
   */
  const saveCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // Guardar en API para usuarios autenticados
        await api.cart.update({
          items,
          discount
        });
      } else {
        // Guardar en localStorage para invitados
        storageUtils.set('cart', items);
        if (discount) {
          storageUtils.set('cartDiscount', discount);
        } else {
          storageUtils.remove('cartDiscount');
        }
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      // Siempre guardar en localStorage como respaldo
      storageUtils.set('cart', items);
    }
  }, [items, discount, isAuthenticated]);

  /**
   * Agregar producto al carrito
   */
  const addItem = useCallback(async (product, quantity = 1, customizations = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validaciones
      if (!product || !product.id) {
        throw new Error('Producto inválido');
      }

      if (quantity <= 0 || quantity > cartConfig.maxQuantityPerItem) {
        throw new Error(`Cantidad debe estar entre 1 y ${cartConfig.maxQuantityPerItem}`);
      }

      const itemKey = generateItemKey(product.id, customizations);
      const existingItemIndex = items.findIndex(item => item.itemKey === itemKey);

      let newItems;
      let finalQuantity = quantity;

      if (existingItemIndex >= 0) {
        // Actualizar cantidad del item existente
        const existingItem = items[existingItemIndex];
        finalQuantity = Math.min(
          existingItem.quantity + quantity,
          cartConfig.maxQuantityPerItem
        );

        newItems = items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: finalQuantity, updatedAt: new Date().toISOString() }
            : item
        );
      } else {
        // Agregar nuevo item
        const newItem = {
          id: product.id,
          itemKey,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          quantity: finalQuantity,
          customizations,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        newItems = [...items, newItem];
      }

      setItems(newItems);
      setLastAddedItem({ ...product, quantity: finalQuantity });

      // Notificación
      addNotification({
        type: 'success',
        title: existingItemIndex >= 0 ? 'Cantidad actualizada' : 'Producto agregado',
        message: `${product.name} ${existingItemIndex >= 0 ? 'actualizado en' : 'agregado al'} carrito`,
        duration: cartConfig.autoCloseDelay
      });

      // API call para usuarios autenticados
      if (isAuthenticated) {
        await api.cart.addItem({
          productId: product.id,
          quantity,
          customizations
        });
      }

      return { success: true, quantity: finalQuantity };
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [items, isAuthenticated, addNotification]);

  /**
   * Actualizar cantidad de un item
   */
  const updateQuantity = useCallback(async (itemKey, newQuantity) => {
    try {
      setIsLoading(true);
      setError(null);

      if (newQuantity <= 0) {
        return await removeItem(itemKey);
      }

      if (newQuantity > cartConfig.maxQuantityPerItem) {
        throw new Error(`Cantidad máxima permitida: ${cartConfig.maxQuantityPerItem}`);
      }

      const newItems = items.map(item =>
        item.itemKey === itemKey
          ? { 
              ...item, 
              quantity: newQuantity, 
              updatedAt: new Date().toISOString() 
            }
          : item
      );

      setItems(newItems);

      // API call para usuarios autenticados
      if (isAuthenticated) {
        await api.cart.updateItem(itemKey, { quantity: newQuantity });
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Error al actualizar',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [items, isAuthenticated, addNotification]);

  /**
   * Eliminar item del carrito
   */
  const removeItem = useCallback(async (itemKey) => {
    try {
      setIsLoading(true);
      setError(null);

      const itemToRemove = items.find(item => item.itemKey === itemKey);
      const newItems = items.filter(item => item.itemKey !== itemKey);
      
      setItems(newItems);

      if (itemToRemove) {
        addNotification({
          type: 'info',
          title: 'Producto eliminado',
          message: `${itemToRemove.name} eliminado del carrito`,
          duration: cartConfig.autoCloseDelay
        });
      }

      // API call para usuarios autenticados
      if (isAuthenticated) {
        await api.cart.removeItem(itemKey);
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Error al eliminar',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [items, isAuthenticated, addNotification]);

  /**
   * Limpiar carrito completo
   */
  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      setItems([]);
      setDiscount(null);
      setLastAddedItem(null);

      // API call para usuarios autenticados
      if (isAuthenticated) {
        await api.cart.clear();
      } else {
        storageUtils.remove('cart');
        storageUtils.remove('cartDiscount');
      }

      addNotification({
        type: 'info',
        title: 'Carrito vaciado',
        message: 'Todos los productos fueron eliminados',
        duration: cartConfig.autoCloseDelay
      });

      return { success: true };
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Error al vaciar carrito',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, addNotification]);

  /**
   * Aplicar código de descuento
   */
  const applyDiscount = useCallback(async (code) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.cart.applyDiscount({ code });
      
      if (response.success) {
        setDiscount(response.discount);
        addNotification({
          type: 'success',
          title: 'Descuento aplicado',
          message: `${response.discount.description}`
        });
        return { success: true, discount: response.discount };
      } else {
        throw new Error(response.message || 'Código de descuento inválido');
      }
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Código inválido',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  /**
   * Remover descuento
   */
  const removeDiscount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      setDiscount(null);

      if (isAuthenticated) {
        await api.cart.removeDiscount();
      } else {
        storageUtils.remove('cartDiscount');
      }

      addNotification({
        type: 'info',
        title: 'Descuento removido',
        message: 'El código de descuento ha sido eliminado'
      });

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, addNotification]);

  // Calcular resumen del carrito
  const cartSummary = useMemo(() => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    // Calcular impuestos
    const tax = subtotal * cartConfig.taxRate;
    
    // Calcular envío
    const deliveryFee = subtotal >= cartConfig.deliveryThreshold ? 0 : cartConfig.deliveryFee;
    
    // Calcular descuento
    let discountAmount = 0;
    if (discount) {
      if (discount.type === 'percentage') {
        discountAmount = (subtotal * discount.value) / 100;
      } else if (discount.type === 'fixed') {
        discountAmount = discount.value;
      }
      // Limitar descuento al subtotal
      discountAmount = Math.min(discountAmount, subtotal);
    }
    
    const total = Math.max(0, subtotal + tax + deliveryFee - discountAmount);

    return {
      subtotal,
      tax,
      delivery: deliveryFee,
      discount: discountAmount,
      total,
      itemCount,
      hasItems: items.length > 0,
      qualifiesForFreeDelivery: subtotal >= cartConfig.deliveryThreshold,
      savings: discountAmount,
      discountCode: discount?.code || null
    };
  }, [items, discount]);

  // Métodos de control del sidebar
  const toggleCart = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Métodos de utilidad
  const getItem = useCallback((itemKey) => {
    return items.find(item => item.itemKey === itemKey) || null;
  }, [items]);

  const isInCart = useCallback((productId, customizations = {}) => {
    const itemKey = generateItemKey(productId, customizations);
    return items.some(item => item.itemKey === itemKey);
  }, [items]);

  const getProductQuantity = useCallback((productId, customizations = {}) => {
    const itemKey = generateItemKey(productId, customizations);
    const item = items.find(item => item.itemKey === itemKey);
    return item ? item.quantity : 0;
  }, [items]);

  const getCartCount = useCallback(() => cartSummary.itemCount, [cartSummary.itemCount]);

  const getCartSummary = useCallback(() => cartSummary, [cartSummary]);

  // Formatear precio
  const formatPrice = useCallback((price) => {
    return numberUtils.formatCurrency(price, 'BOB');
  }, []);

  // Preparar datos para checkout
  const prepareCheckout = useCallback(() => {
    return {
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
        subtotal: item.price * item.quantity
      })),
      summary: cartSummary,
      customer: user || null,
      discount
    };
  }, [items, cartSummary, user, discount]);

  // Estimación de tiempo de entrega
  const estimateDelivery = useCallback(() => {
    const baseTime = 30; // minutos base
    const itemCount = cartSummary.itemCount;
    const additionalTime = Math.floor(itemCount / 5) * 5; // +5 min cada 5 items
    
    const minTime = baseTime + additionalTime;
    const maxTime = minTime + 15;
    
    return {
      minTime,
      maxTime,
      formatted: `${minTime}-${maxTime} minutos`
    };
  }, [cartSummary.itemCount]);

  // Limpiar error
  const clearError = useCallback(() => setError(null), []);

  // Valor del contexto
  const value = {
    // Estado
    items,
    isLoading,
    error,
    isOpen,
    lastAddedItem,
    discount,
    
    // Resumen calculado
    cartSummary,
    
    // Métodos principales
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyDiscount,
    removeDiscount,
    loadCart,
    
    // Control del sidebar
    toggleCart,
    openCart,
    closeCart,
    
    // Utilidades
    getItem,
    isInCart,
    getProductQuantity,
    getCartCount,
    getCartSummary,
    clearError,
    prepareCheckout,
    estimateDelivery,
    formatPrice,
    
    // Propiedades de conveniencia
    isEmpty: items.length === 0,
    itemCount: cartSummary.itemCount,
    total: cartSummary.total,
    subtotal: cartSummary.subtotal,
    
    // Configuración
    config: cartConfig
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;