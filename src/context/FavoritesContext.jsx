import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { storageUtils } from '../utils/helpers';
import api from '../utils/api';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({
    products: [],
    videos: [],
    images: [],
    podcasts: [],
    news: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();

  // Tipos de contenido favoritable
  const favoriteTypes = {
    products: { name: 'Productos', icon: 'fas fa-utensils' },
    videos: { name: 'Videos', icon: 'fas fa-video' },
    images: { name: 'Imágenes', icon: 'fas fa-images' },
    podcasts: { name: 'Podcasts', icon: 'fas fa-podcast' },
    news: { name: 'Noticias', icon: 'fas fa-newspaper' }
  };

  // Cargar favoritos al inicializar
  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  // Guardar favoritos cuando cambien (solo para invitados)
  useEffect(() => {
    if (!isAuthenticated) {
      storageUtils.set('favorites', favorites);
    }
  }, [favorites, isAuthenticated]);

  /**
   * Cargar favoritos desde localStorage o API
   */
  const loadFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isAuthenticated) {
        // Cargar desde API para usuarios autenticados
        const response = await api.favorites.getList();
        if (response && response.data) {
          // Organizar por tipo
          const organizedFavorites = {
            products: [],
            videos: [],
            images: [],
            podcasts: [],
            news: []
          };

          response.data.forEach(favorite => {
            if (organizedFavorites[favorite.type]) {
              organizedFavorites[favorite.type].push(favorite.item);
            }
          });

          setFavorites(organizedFavorites);
        }
      } else {
        // Cargar desde localStorage para invitados
        const savedFavorites = storageUtils.get('favorites', {
          products: [],
          videos: [],
          images: [],
          podcasts: [],
          news: []
        });
        setFavorites(savedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError(error.message);
      
      // Fallback a localStorage
      const savedFavorites = storageUtils.get('favorites', {
        products: [],
        videos: [],
        images: [],
        podcasts: [],
        news: []
      });
      setFavorites(savedFavorites);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Validar tipo de favorito
   */
  const validateType = (type) => {
    if (!favoriteTypes[type]) {
      throw new Error(`Tipo de favorito inválido: ${type}. Tipos permitidos: ${Object.keys(favoriteTypes).join(', ')}`);
    }
  };

  /**
   * Agregar item a favoritos
   */
  const addFavorite = useCallback(async (item, type) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validaciones
      if (!item || !item.id) {
        throw new Error('Item inválido para agregar a favoritos');
      }
      validateType(type);

      // Verificar si ya existe
      if (isFavorite(item.id, type)) {
        addNotification({
          type: 'info',
          title: 'Ya está en favoritos',
          message: `${item.name || item.title} ya está en tus favoritos`
        });
        return { success: true, existed: true };
      }

      // Agregar a estado local
      setFavorites(prev => ({
        ...prev,
        [type]: [...prev[type].filter(fav => fav.id !== item.id), {
          ...item,
          addedAt: new Date().toISOString()
        }]
      }));

      // API call para usuarios autenticados
      if (isAuthenticated) {
        await api.favorites.add({
          itemId: item.id,
          itemType: type,
          itemData: item
        });
      }

      addNotification({
        type: 'success',
        title: 'Agregado a favoritos',
        message: `${item.name || item.title} añadido a tus favoritos`,
        duration: 2000
      });

      return { success: true, existed: false };
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
  }, [isAuthenticated, addNotification]);

  /**
   * Remover item de favoritos
   */
  const removeFavorite = useCallback(async (itemId, type) => {
    try {
      setIsLoading(true);
      setError(null);

      validateType(type);

      const item = favorites[type].find(fav => fav.id === itemId);
      
      // Remover del estado local
      setFavorites(prev => ({
        ...prev,
        [type]: prev[type].filter(fav => fav.id !== itemId)
      }));

      // API call para usuarios autenticados
      if (isAuthenticated) {
        await api.favorites.remove(itemId, type);
      }

      if (item) {
        addNotification({
          type: 'info',
          title: 'Removido de favoritos',
          message: `${item.name || item.title} eliminado de tus favoritos`,
          duration: 2000
        });
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
  }, [favorites, isAuthenticated, addNotification]);

  /**
   * Toggle favorito (agregar o remover)
   */
  const toggleFavorite = useCallback(async ({ itemId, itemType, isFavorite: currentlyFavorite, itemData = null }) => {
    try {
      setIsLoading(true);
      
      if (currentlyFavorite) {
        return await removeFavorite(itemId, itemType);
      } else {
        if (!itemData) {
          throw new Error('Se requiere itemData para agregar a favoritos');
        }
        return await addFavorite(itemData, itemType);
      }
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [addFavorite, removeFavorite]);

  /**
   * Verificar si un item está en favoritos
   */
  const isFavorite = useCallback((itemId, type) => {
    try {
      validateType(type);
      return favorites[type].some(fav => fav.id === itemId);
    } catch {
      return false;
    }
  }, [favorites]);

  /**
   * Obtener favoritos por tipo
   */
  const getFavorites = useCallback((type) => {
    try {
      validateType(type);
      return favorites[type] || [];
    } catch {
      return [];
    }
  }, [favorites]);

  /**
   * Obtener todos los favoritos
   */
  const getAllFavorites = useCallback(() => {
    return Object.entries(favorites).flatMap(([type, items]) => 
      items.map(item => ({ ...item, type }))
    );
  }, [favorites]);

  /**
   * Obtener conteo de favoritos
   */
  const getFavoritesCount = useCallback((type = null) => {
    if (type) {
      try {
        validateType(type);
        return favorites[type]?.length || 0;
      } catch {
        return 0;
      }
    }
    return Object.values(favorites).reduce((total, typeArray) => total + typeArray.length, 0);
  }, [favorites]);

  /**
   * Limpiar favoritos
   */
  const clearFavorites = useCallback(async (type = null) => {
    try {
      setIsLoading(true);
      setError(null);

      if (type) {
        validateType(type);
        
        setFavorites(prev => ({
          ...prev,
          [type]: []
        }));

        if (isAuthenticated) {
          await api.favorites.clearType(type);
        }

        addNotification({
          type: 'info',
          title: 'Favoritos limpiados',
          message: `Todos los favoritos de ${favoriteTypes[type].name.toLowerCase()} han sido eliminados`,
          duration: 2000
        });
      } else {
        setFavorites({
          products: [],
          videos: [],
          images: [],
          podcasts: [],
          news: []
        });

        if (isAuthenticated) {
          await api.favorites.clearAll();
        } else {
          storageUtils.remove('favorites');
        }

        addNotification({
          type: 'info',
          title: 'Todos los favoritos limpiados',
          message: 'Todos tus favoritos han sido eliminados',
          duration: 2000
        });
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Error al limpiar favoritos',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, addNotification]);

  /**
   * Buscar en favoritos
   */
  const searchFavorites = useCallback((query, type = null) => {
    if (!query.trim()) return [];

    const searchIn = type ? [type] : Object.keys(favoriteTypes);
    const results = [];
    const queryLower = query.toLowerCase();

    searchIn.forEach(favType => {
      try {
        validateType(favType);
        
        const typeResults = favorites[favType].filter(item => {
          const searchText = (item.name || item.title || '').toLowerCase();
          const searchDescription = (item.description || '').toLowerCase();
          const searchTags = (item.tags || []).join(' ').toLowerCase();
          
          return searchText.includes(queryLower) || 
                 searchDescription.includes(queryLower) ||
                 searchTags.includes(queryLower);
        });
        
        results.push(...typeResults.map(item => ({
          ...item,
          type: favType,
          typeInfo: favoriteTypes[favType]
        })));
      } catch {
        // Ignore invalid types
      }
    });

    // Ordenar por relevancia (primero por nombre, luego por fecha)
    results.sort((a, b) => {
      const aName = (a.name || a.title || '').toLowerCase();
      const bName = (b.name || b.title || '').toLowerCase();
      
      const aMatch = aName.indexOf(queryLower);
      const bMatch = bName.indexOf(queryLower);
      
      if (aMatch !== bMatch) {
        return aMatch === -1 ? 1 : bMatch === -1 ? -1 : aMatch - bMatch;
      }
      
      return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
    });

    return results;
  }, [favorites]);

  /**
   * Obtener favoritos recientes
   */
  const getRecentFavorites = useCallback((limit = 10, type = null) => {
    let allFavorites = getAllFavorites();
    
    if (type) {
      allFavorites = allFavorites.filter(item => item.type === type);
    }
    
    return allFavorites
      .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
      .slice(0, limit);
  }, [getAllFavorites]);

  /**
   * Obtener estadísticas de favoritos
   */
  const getFavoritesStats = useCallback(() => {
    const stats = {
      total: 0,
      byType: {}
    };

    Object.entries(favorites).forEach(([type, items]) => {
      const count = items.length;
      stats.total += count;
      stats.byType[type] = {
        count,
        name: favoriteTypes[type]?.name || type,
        icon: favoriteTypes[type]?.icon || 'fas fa-heart',
        percentage: 0
      };
    });

    // Calcular porcentajes
    Object.keys(stats.byType).forEach(type => {
      stats.byType[type].percentage = stats.total > 0 
        ? Math.round((stats.byType[type].count / stats.total) * 100)
        : 0;
    });

    return stats;
  }, [favorites]);

  /**
   * Exportar favoritos
   */
  const exportFavorites = useCallback((format = 'json') => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: user?.email || 'guest',
      favorites: favorites,
      stats: getFavoritesStats()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pizza4u-favoritos-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    return data;
  }, [favorites, user, getFavoritesStats]);

  /**
   * Importar favoritos
   */
  const importFavorites = useCallback(async (data, merge = true) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!data || !data.favorites) {
        throw new Error('Datos de importación inválidos');
      }

      const newFavorites = merge 
        ? {
            products: [...favorites.products, ...data.favorites.products],
            videos: [...favorites.videos, ...data.favorites.videos],
            images: [...favorites.images, ...data.favorites.images],
            podcasts: [...favorites.podcasts, ...data.favorites.podcasts],
            news: [...favorites.news, ...data.favorites.news]
          }
        : data.favorites;

      // Eliminar duplicados
      Object.keys(newFavorites).forEach(type => {
        const seen = new Set();
        newFavorites[type] = newFavorites[type].filter(item => {
          if (seen.has(item.id)) {
            return false;
          }
          seen.add(item.id);
          return true;
        });
      });

      setFavorites(newFavorites);

      addNotification({
        type: 'success',
        title: 'Favoritos importados',
        message: `Se importaron ${Object.values(newFavorites).flat().length} favoritos`
      });

      return { success: true };
    } catch (error) {
      setError(error.message);
      addNotification({
        type: 'error',
        title: 'Error al importar',
        message: error.message
      });
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [favorites, addNotification]);

  // Limpiar error
  const clearError = useCallback(() => setError(null), []);

  // Valor del contexto
  const value = {
    // Estado
    favorites,
    isLoading,
    error,
    
    // Métodos principales
    addFavorite,
    removeFavorite,
    toggleFavorite,
    loadFavorites,
    
    // Métodos de consulta
    isFavorite,
    getFavorites,
    getAllFavorites,
    getFavoritesCount,
    
    // Búsqueda y filtros
    searchFavorites,
    getRecentFavorites,
    
    // Gestión masiva
    clearFavorites,
    exportFavorites,
    importFavorites,
    
    // Estadísticas
    getFavoritesStats,
    
    // Utilidades
    clearError,
    favoriteTypes,
    
    // Propiedades de conveniencia
    isEmpty: getAllFavorites().length === 0,
    totalCount: getFavoritesCount()
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;