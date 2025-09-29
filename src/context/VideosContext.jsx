// src/context/VideosContext.jsx - Versión simplificada
import React, { createContext, useContext, useState } from 'react';

const VideosContext = createContext();

export const useVideos = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideosProvider');
  }
  return context;
};

// Datos mock para videos
const mockVideos = [
  {
    id: 1,
    title: 'Cómo hacemos nuestra Pizza Margarita',
    description: 'Proceso artesanal de nuestra pizza más popular',
    category: 'recetas',
    duration: '5:32',
    thumbnail: '/video-thumb-1.jpg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'published'
  },
  {
    id: 2,
    title: 'Promoción Especial del Mes',
    description: '2x1 en pizzas familiares todos los martes',
    category: 'promociones',
    duration: '1:30',
    thumbnail: '/video-thumb-2.jpg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'published'
  }
];

export const VideosProvider = ({ children }) => {
  const [videos, setVideos] = useState(mockVideos);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(['recetas', 'promociones', 'detras-escena', 'general']);

  const getVideosByCategory = (category) => {
    return videos.filter(video => 
      video.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const searchVideos = (query) => {
    const searchTerm = query.toLowerCase();
    return videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm) ||
      video.description?.toLowerCase().includes(searchTerm) ||
      video.category?.toLowerCase().includes(searchTerm)
    );
  };

  const getLatestVideos = (limit = 6) => {
    return videos.slice(0, limit);
  };

  const value = {
    videos,
    loading,
    categories,
    getVideosByCategory,
    searchVideos,
    getLatestVideos,
    // Funciones simplificadas para admin
    addVideo: () => ({ success: true }),
    updateVideo: () => ({ success: true }),
    deleteVideo: () => ({ success: true })
  };

  return (
    <VideosContext.Provider value={value}>
      {children}
    </VideosContext.Provider>
  );
};