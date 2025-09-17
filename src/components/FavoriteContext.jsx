import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

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
  const { addNotification } = useNotifications();

  // Cargar favoritos desde localStorage al inicializar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item, type) => {
    setFavorites(prev => ({
      ...prev,
      [type]: [...prev[type].filter(fav => fav.id !== item.id), item]
    }));

    addNotification({
      type: 'success',
      title: 'Agregado a favoritos',
      message: `${item.name || item.title} añadido a tus favoritos`,
      duration: 2000
    });
  };

  const removeFavorite = (itemId, type) => {
    const item = favorites[type].find(fav => fav.id === itemId);
    
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].filter(fav => fav.id !== itemId)
    }));

    if (item) {
      addNotification({
        type: 'info',
        title: 'Removido de favoritos',
        message: `${item.name || item.title} eliminado de tus favoritos`,
        duration: 2000
      });
    }
  };

  const toggleFavorite = ({ itemId, itemType, isFavorite, itemData = null }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (isFavorite) {
          if (itemData) {
            addFavorite(itemData, itemType);
          }
        } else {
          removeFavorite(itemId, itemType);
        }
        resolve();
      }, 100); // Simular async operation
    });
  };

  const isFavorite = (itemId, type) => {
    return favorites[type].some(fav => fav.id === itemId);
  };

  const getFavorites = (type) => {
    return favorites[type] || [];
  };

  const getAllFavorites = () => {
    return Object.values(favorites).flat();
  };

  const getFavoritesCount = (type = null) => {
    if (type) {
      return favorites[type]?.length || 0;
    }
    return Object.values(favorites).reduce((total, typeArray) => total + typeArray.length, 0);
  };

  const clearFavorites = (type = null) => {
    if (type) {
      setFavorites(prev => ({
        ...prev,
        [type]: []
      }));
      addNotification({
        type: 'info',
        title: 'Favoritos limpiados',
        message: `Todos los favoritos de ${type} han sido eliminados`,
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
      addNotification({
        type: 'info',
        title: 'Todos los favoritos limpiados',
        message: 'Todos tus favoritos han sido eliminados',
        duration: 2000
      });
    }
  };

  const searchFavorites = (query, type = null) => {
    const searchIn = type ? [type] : Object.keys(favorites);
    const results = [];

    searchIn.forEach(favType => {
      const typeResults = favorites[favType].filter(item => {
        const searchText = (item.name || item.title || '').toLowerCase();
        const searchDescription = (item.description || '').toLowerCase();
        const queryLower = query.toLowerCase();
        
        return searchText.includes(queryLower) || searchDescription.includes(queryLower);
      });
      
      results.push(...typeResults.map(item => ({
        ...item,
        type: favType
      })));
    });

    return results;
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavorites,
    getAllFavorites,
    getFavoritesCount,
    clearFavorites,
    searchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};