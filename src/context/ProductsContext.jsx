// src/context/ProductsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useNotifications } from './NotificationContext';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['pizzas', 'bebidas', 'postres', 'entradas']);
  
  const { addNotification } = useNotifications();

  // Cargar productos iniciales
  useEffect(() => {
    fetchProducts();
    
    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('products-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'products' 
        }, 
        (payload) => {
          console.log('Product change detected:', payload);
          handleRealtimeChange(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al cargar productos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        if (newRecord.available) {
          setProducts(prev => [newRecord, ...prev]);
          addNotification({
            type: 'success',
            title: 'Nuevo producto',
            message: `${newRecord.name} ha sido añadido al menú`
          });
        }
        break;
        
      case 'UPDATE':
        setProducts(prev => 
          prev.map(product => 
            product.id === newRecord.id ? newRecord : product
          ).filter(product => product.available) // Filtrar no disponibles
        );
        
        if (newRecord.available && !oldRecord.available) {
          addNotification({
            type: 'info',
            title: 'Producto actualizado',
            message: `${newRecord.name} está disponible nuevamente`
          });
        }
        break;
        
      case 'DELETE':
        setProducts(prev => 
          prev.filter(product => product.id !== oldRecord.id)
        );
        addNotification({
          type: 'warning',
          title: 'Producto eliminado',
          message: `${oldRecord.name} ya no está disponible`
        });
        break;
    }
  };

  // Funciones para admin
  const createProduct = async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Producto creado',
        message: `${productData.name} ha sido creado exitosamente`
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error creating product:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear producto'
      });
      return { success: false, error };
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Producto actualizado',
        message: 'Los cambios se han guardado'
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating product:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar producto'
      });
      return { success: false, error };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Producto eliminado',
        message: 'El producto ha sido eliminado'
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar producto'
      });
      return { success: false, error };
    }
  };

  const toggleProductAvailability = async (id, available) => {
    return updateProduct(id, { available });
  };

  // Funciones de utilidad
  const getProductsByCategory = (category) => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (query) => {
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  };

  const value = {
    products,
    loading,
    categories,
    
    // CRUD operations (for admin)
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    
    // Utility functions
    getProductsByCategory,
    searchProducts,
    fetchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};