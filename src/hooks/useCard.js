import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import api from '../utils/api';
import { storageUtils, numberUtils } from '../utils/helpers';

/**
 * Custom hook for shopping cart management
 * @returns {Object} Cart state and methods
 */
export const useCart = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  
  const { isAuthenticated, user } = useAuth();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // Save cart to storage when items change
  useEffect(() => {
    if (items.length > 0 || storageUtils.get('cart')) {
      saveCart();
    }
  }, [items]);

  /**
   * Load cart from storage or API
   */
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Load from API for authenticated users
        const response = await api.cart.get();
        if (response && response.items) {
          setItems(response.items);
        }
      } else {
        // Load from localStorage for guests
        const localCart = storageUtils.get('cart', []);
        setItems(localCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setError(error.message);
      
      // Fallback to localStorage
      const localCart = storageUtils.get('cart', []);
      setItems(localCart);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Save cart to storage or API
   */
  const saveCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // Save to API for authenticated users
        await api.cart.update(items);
      } else {
        // Save to localStorage for guests
        storageUtils.set('cart', items);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      // Always save to localStorage as backup
      storageUtils.set('cart', items);
    }
  }, [items, isAuthenticated]);

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @param {Object} customizations - Product customizations
   */
  const addItem = useCallback(async (product, quantity = 1, customizations = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const itemKey = `${product.id}-${JSON.stringify(customizations)}`;
      const existingItemIndex = items.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          customizations,
          addedAt: new Date().toISOString(),
          itemKey
        };
        newItems = [...items, newItem];
      }

      setItems(newItems);
      setLastAddedItem(product);

      // API call for authenticated users
      if (isAuthenticated) {
        await api.cart.addItem({
          productId: product.id,
          quantity,
          customizations
        });
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [items, isAuthenticated]);

  /**
   * Remove item from cart
   * @param {string} itemKey - Unique item key
   */
  const removeItem = useCallback(async (itemKey) => {
    try {
      setIsLoading(true);
      setError(null);

      const newItems = items.filter(item => item.itemKey !== itemKey);
      setItems(newItems);

      // API call for authenticated users
      if (isAuthenticated) {
        await api.cart.removeItem(itemKey);
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [items, isAuthenticated]);

  /**
   * Update item quantity
   * @param {string} itemKey - Unique item key
   * @param {number} quantity - New quantity
   */
  const updateQuantity = useCallback(async (itemKey, quantity) => {
    try {
      setIsLoading(true);
      setError(null);

      if (quantity <= 0) {
        return await removeItem(itemKey);
      }

      const newItems = items.map(item =>
        item.itemKey === itemKey
          ? { ...item, quantity }
          : item
      );

      setItems(newItems);

      // API call for authenticated users
      if (isAuthenticated) {
        await api.cart.updateItem(itemKey, { quantity });
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [items, isAuthenticated, removeItem]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      setItems([]);

      // API call for authenticated users
      if (isAuthenticated) {
        await api.cart.clear();
      } else {
        storageUtils.remove('cart');
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Apply discount code
   * @param {string} code - Discount code
   */
  const applyDiscount = useCallback(async (code) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.cart.applyDiscount({ code });
      
      if (response.success) {
        // Reload cart with discount applied
        await loadCart();
        return { success: true, discount: response.discount };
      } else {
        throw new Error(response.message || 'Invalid discount code');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [loadCart]);

  /**
   * Remove discount
   */
  const removeDiscount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.cart.removeDiscount();
      
      if (response.success) {
        await loadCart();
        return { success: true };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [loadCart]);

  // Computed values
  const cartSummary = useMemo(() => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    
    // Tax calculation (10%)
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    
    // Delivery fee (free over $50)
    const deliveryThreshold = 50;
    const deliveryFee = subtotal >= deliveryThreshold ? 0 : 5;
    
    // Discount (if any)
    const discount = 0; // This would come from API
    
    const total = subtotal + tax + deliveryFee - discount;

    return {
      subtotal,
      tax,
      deliveryFee,
      discount,
      total,
      itemCount,
      hasItems: items.length > 0,
      qualifiesForFreeDelivery: subtotal >= deliveryThreshold
    };
  }, [items]);

  /**
   * Get item by key
   * @param {string} itemKey - Item key
   * @returns {Object|null} Cart item
   */
  const getItem = useCallback((itemKey) => {
    return items.find(item => item.itemKey === itemKey) || null;
  }, [items]);

  /**
   * Check if product is in cart
   * @param {string} productId - Product ID
   * @param {Object} customizations - Product customizations
   * @returns {boolean} Is in cart
   */
  const isInCart = useCallback((productId, customizations = {}) => {
    return items.some(item => 
      item.id === productId && 
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
  }, [items]);

  /**
   * Get product quantity in cart
   * @param {string} productId - Product ID
   * @param {Object} customizations - Product customizations
   * @returns {number} Quantity
   */
  const getProductQuantity = useCallback((productId, customizations = {}) => {
    const item = items.find(item => 
      item.id === productId && 
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
    return item ? item.quantity : 0;
  }, [items]);

  /**
   * Toggle cart sidebar
   */
  const toggleCart = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  /**
   * Open cart sidebar
   */
  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close cart sidebar
   */
  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Prepare cart for checkout
   * @returns {Object} Checkout data
   */
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
      customer: user || null
    };
  }, [items, cartSummary, user]);

  /**
   * Estimate delivery time
   * @returns {Object} Delivery estimation
   */
  const estimateDelivery = useCallback(() => {
    const baseTime = 30; // Base delivery time in minutes
    const itemCount = cartSummary.itemCount;
    const additionalTime = Math.floor(itemCount / 5) * 5; // +5 min per 5 items
    
    const minTime = baseTime + additionalTime;
    const maxTime = minTime + 15;
    
    return {
      minTime,
      maxTime,
      formatted: `${minTime}-${maxTime} minutos`
    };
  }, [cartSummary.itemCount]);

  return {
    // State
    items,
    isLoading,
    error,
    isOpen,
    lastAddedItem,
    
    // Computed
    cartSummary,
    
    // Methods
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    loadCart,
    
    // Utility methods
    getItem,
    isInCart,
    getProductQuantity,
    toggleCart,
    openCart,
    closeCart,
    clearError,
    prepareCheckout,
    estimateDelivery,
    
    // Convenience getters
    isEmpty: items.length === 0,
    itemCount: cartSummary.itemCount,
    total: cartSummary.total,
    subtotal: cartSummary.subtotal,
    
    // Format helpers
    formatPrice: (price) => numberUtils.formatCurrency(price),
    formatTotal: () => numberUtils.formatCurrency(cartSummary.total)
  };
};

export default useCart;