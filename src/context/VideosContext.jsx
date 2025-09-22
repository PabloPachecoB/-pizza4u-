// src/context/VideosContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { useNotifications } from './NotificationContext';

const VideosContext = createContext();

export const useVideos = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideosProvider');
  }
  return context;
};

export const VideosProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['recetas', 'promociones', 'detras-escena', 'general']);
  
  const { addNotification } = useNotifications();

  // Cargar videos iniciales
  useEffect(() => {
    fetchVideos();
    
    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('videos-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'videos' 
        }, 
        (payload) => {
          console.log('Video change detected:', payload);
          handleRealtimeChange(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al cargar videos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        if (newRecord.published) {
          setVideos(prev => [newRecord, ...prev]);
          addNotification({
            type: 'success',
            title: 'Nuevo video',
            message: `${newRecord.title} ha sido publicado`
          });
        }
        break;
        
      case 'UPDATE':
        setVideos(prev => 
          prev.map(video => 
            video.id === newRecord.id ? newRecord : video
          ).filter(video => video.published) // Filtrar no publicados
        );
        
        if (newRecord.published && !oldRecord.published) {
          addNotification({
            type: 'info',
            title: 'Video publicado',
            message: `${newRecord.title} ahora está disponible`
          });
        }
        break;
        
      case 'DELETE':
        setVideos(prev => 
          prev.filter(video => video.id !== oldRecord.id)
        );
        addNotification({
          type: 'warning',
          title: 'Video eliminado',
          message: `${oldRecord.title} ha sido eliminado`
        });
        break;
    }
  };

  // Funciones para admin
  const createVideo = async (videoData) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          ...videoData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Video creado',
        message: `${videoData.title} ha sido creado exitosamente`
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error creating video:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear video'
      });
      return { success: false, error };
    }
  };

  const updateVideo = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('videos')
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
        title: 'Video actualizado',
        message: 'Los cambios se han guardado'
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating video:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar video'
      });
      return { success: false, error };
    }
  };

  const deleteVideo = async (id) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Video eliminado',
        message: 'El video ha sido eliminado'
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting video:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar video'
      });
      return { success: false, error };
    }
  };

  const toggleVideoPublication = async (id, published) => {
    return updateVideo(id, { published });
  };

  // Funciones de utilidad
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
    
    // CRUD operations (for admin)
    createVideo,
    updateVideo,
    deleteVideo,
    toggleVideoPublication,
    
    // Utility functions
    getVideosByCategory,
    searchVideos,
    getLatestVideos,
    fetchVideos
  };

  return (
    <VideosContext.Provider value={value}>
      {children}
    </VideosContext.Provider>
  );
};