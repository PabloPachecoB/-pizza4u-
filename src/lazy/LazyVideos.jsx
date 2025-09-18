import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import FavoriteButton from '../components/FavoriteButton';

const LazyVideos = ({ videos = [], onVideoClick, className = '' }) => {
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [loadedThumbnails, setLoadedThumbnails] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const VIDEOS_PER_PAGE = 6;

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreVideos();
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Cargar videos iniciales
  useEffect(() => {
    if (videos.length > 0) {
      const initialVideos = videos.slice(0, VIDEOS_PER_PAGE);
      setVisibleVideos(initialVideos);
      setPage(1);
    }
  }, [videos]);

  const loadMoreVideos = useCallback(() => {
    if (isLoading || visibleVideos.length >= videos.length) return;

    setIsLoading(true);
    
    // Simular delay de carga
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * VIDEOS_PER_PAGE;
      const endIndex = startIndex + VIDEOS_PER_PAGE;
      const newVideos = videos.slice(startIndex, endIndex);
      
      setVisibleVideos(prev => [...prev, ...newVideos]);
      setPage(nextPage);
      setIsLoading(false);
    }, 500);
  }, [videos, visibleVideos.length, page, isLoading]);

  const handleImageLoad = useCallback((videoId) => {
    setLoadedThumbnails(prev => new Set([...prev, videoId]));
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.src = '/placeholder-video.jpg';
  }, []);

  const handleFavoriteToggle = async (video, e) => {
    e.stopPropagation();
    await toggleFavorite({
      itemId: video.id,
      itemType: 'videos',
      isFavorite: !isFavorite(video.id, 'videos'),
      itemData: video
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const LazyThumbnail = ({ video, isVisible }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
      if (isVisible && !imageSrc) {
        // Simular lazy loading de imagen
        const img = new Image();
        img.onload = () => {
          setImageSrc(video.thumbnail);
          setImageLoaded(true);
          handleImageLoad(video.id);
        };
        img.onerror = () => {
          setImageSrc('/placeholder-video.jpg');
          setImageLoaded(true);
        };
        img.src = video.thumbnail;
      }
    }, [isVisible, imageSrc, video.id, video.thumbnail]);

    return (
      <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        {!imageLoaded ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <>
            <img
              src={imageSrc}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white bg-opacity-90 rounded-full p-3">
                <i className="fas fa-play text-gray-700 text-lg ml-1" />
              </div>
            </div>

            {/* Duration */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                {video.category}
              </span>
            </div>

            {/* Favorite Button */}
            <div className="absolute top-2 right-2">
              <FavoriteButton
                itemId={video.id}
                itemType="videos"
                isFavorite={isFavorite(video.id, 'videos')}
                onToggle={(e) => handleFavoriteToggle(video, e)}
                variant="button"
                className="bg-white bg-opacity-90 hover:bg-opacity-100"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const VideoCard = ({ video, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <Card 
        ref={cardRef}
        hover 
        className="overflow-hidden cursor-pointer group"
        onClick={() => onVideoClick?.(video)}
      >
        <LazyThumbnail video={video} isVisible={isVisible} />

        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {video.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="flex items-center">
              <i className="fas fa-eye mr-1" />
              {formatViews(video.views)}
            </span>
            <span className="flex items-center">
              <i className="fas fa-heart mr-1" />
              {video.likes}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(video.uploadDate)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  if (videos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <i className="fas fa-video text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay videos disponibles
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Los videos aparecerán aquí cuando estén disponibles
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleVideos.map((video, index) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            index={index}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {visibleVideos.length < videos.length && (
        <div 
          ref={loadMoreRef}
          className="flex justify-center py-8"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-gray-600 dark:text-gray-400">
                Cargando más videos...
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={loadMoreVideos}
              icon="fas fa-plus"
            >
              Cargar más videos
            </Button>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
        <p>
          Mostrando {visibleVideos.length} de {videos.length} videos
        </p>
      </div>
    </div>
  );
};

// HOC para manejar el lazy loading del componente completo
export const withLazyLoading = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [hasLoaded]);

    return (
      <div ref={containerRef}>
        {isVisible ? (
          <WrappedComponent ref={ref} {...props} />
        ) : (
          <div className="w-full h-64 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Cargando videos..." />
          </div>
        )}
      </div>
    );
  });
};

// Hook personalizado para lazy loading de videos
export const useLazyVideos = (videos, options = {}) => {
  const {
    videosPerPage = 6,
    threshold = 0.1,
    rootMargin = '100px'
  } = options;

  const [visibleVideos, setVisibleVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (videos.length > 0) {
      const initialVideos = videos.slice(0, videosPerPage);
      setVisibleVideos(initialVideos);
      setHasMore(videos.length > videosPerPage);
    }
  }, [videos, videosPerPage]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const currentLength = visibleVideos.length;
      const nextVideos = videos.slice(currentLength, currentLength + videosPerPage);
      
      setVisibleVideos(prev => [...prev, ...nextVideos]);
      setHasMore(currentLength + nextVideos.length < videos.length);
      setIsLoading(false);
    }, 500);
  }, [videos, visibleVideos.length, videosPerPage, isLoading, hasMore]);

  const reset = useCallback(() => {
    const initialVideos = videos.slice(0, videosPerPage);
    setVisibleVideos(initialVideos);
    setHasMore(videos.length > videosPerPage);
    setIsLoading(false);
  }, [videos, videosPerPage]);

  return {
    visibleVideos,
    isLoading,
    hasMore,
    loadMore,
    reset
  };
};

export default LazyVideos;